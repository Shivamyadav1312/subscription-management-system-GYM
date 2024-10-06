const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    membershipType: {
        type: String,
        enum: ['basic', 'premium'],
        default: 'basic',
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    active: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Member', MemberSchema);
