const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { auth, adminAuth } = require('../middleware/auth');

// CRUD operations for members
router.post('/', adminAuth, async (req, res) => {
    try {
        const member = new Member(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', adminAuth, async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.status(200).json(member);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', adminAuth, async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.status(200).json(member);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.status(200).json({ message: 'Member deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
