const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const sendEmail = require('../utils/sendEmail');

// Subscribe and send payment details
router.post('/:id/subscribe', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        const { membershipType, endDate, paymentAmount } = req.body;

        member.membershipType = membershipType;
        member.startDate = new Date();
        member.endDate = new Date(endDate);
        member.active = true;

        await member.save();

        const subject = `Subscription Confirmation: ${membershipType} Plan`;
        const text = `Dear ${member.name},\nYour payment of $${paymentAmount} for the ${membershipType} plan has been received. Your subscription is valid from ${member.startDate.toDateString()} to ${member.endDate.toDateString()}.\n\nBest regards,\nGym Management`;

        await sendEmail(member.email, subject, text);

        res.status(200).json({ message: 'Subscription created and email sent', member });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Check subscription status
router.get('/:id/subscription-status', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        const currentDate = new Date();
        const subscriptionStatus = member.endDate > currentDate ? 'Active' : 'Expired';

        res.status(200).json({ subscriptionStatus, member });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
