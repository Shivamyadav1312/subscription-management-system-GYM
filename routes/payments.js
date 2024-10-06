const express = require('express');
const router = express.Router();
const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');
const Member = require('../models/Member');
const sendEmail = require('../utils/sendEmail');

// Create an order for a subscription
router.post('/create-order', async (req, res) => {
    const { memberId, membershipType, paymentAmount } = req.body;

    try {
        const options = {
            amount: paymentAmount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_order_${memberId}`,
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({
            orderId: order.id,
            order,
        });
    } catch (err) {
        console.error('Error creating Razorpay order:', err);
        res.status(500).json({ message: 'Payment initiation failed', error: err.message });
    }
});

// Verify payment and update subscription status
router.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, memberId, membershipType, endDate, paymentAmount } = req.body;

    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            const member = await Member.findById(memberId);
            if (!member) return res.status(404).json({ message: 'Member not found' });

            // Update subscription details after successful payment
            member.membershipType = membershipType;
            member.startDate = new Date();
            member.endDate = new Date(endDate);
            member.active = true;

            await member.save();

            // Send email confirmation
            const subject = `Subscription Confirmation: ${membershipType} Plan`;
            const text = `Dear ${member.name},\nYour payment of ₹${paymentAmount} for the ${membershipType} plan has been received. Your subscription is valid from ${member.startDate.toDateString()} to ${member.endDate.toDateString()}.\n\nBest regards,\nGym Management`;

            await sendEmail(member.email, subject, text);

            res.status(200).json({ message: 'Payment verified and subscription updated', member });
        } else {
            res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (err) {
        console.error('Error verifying payment:', err);
        res.status(500).json({ message: 'Payment verification failed', error: err.message });
    }
});

module.exports = router;
