const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Institution name is required'],
        unique: true,
        trim: true,
        index: true
    },
    code: {
        type: String,
        required: [true, 'Institution unique code is required'],
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    }, // e.g. "BLR-CAMPUS", "MAIN-UNIV"
    subdomain: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    }, // e.g. "bangalore.uniconnect.edu"
    type: {
        type: String,
        enum: ['University', 'Affiliated College', 'Autonomous Institute', 'Polytechnic', 'Research Center'],
        default: 'Autonomous Institute'
    },
    logo: {
        type: String,
        default: 'https://cdn.uniconnect.edu/branding/institution_logo.png'
    },
    contactEmail: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: { type: String, default: 'India' },
        postalCode: String
    },
    website: {
        type: String,
        trim: true
    },
    timezone: {
        type: String,
        default: 'Asia/Kolkata'
    },
    currency: {
        type: String,
        default: 'INR'
    },
    academicCalendarYear: {
        type: String,
        default: '2026-27'
    },
    settings: {
        minAttendancePercentage: { type: Number, default: 75 },
        gradingScale: { type: String, default: '10-Point Scale' },
        allowStudentCourseRegistration: { type: Boolean, default: true },
        enableTwoFactorAuth: { type: Boolean, default: false }
    },
    primaryAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'Onboarding', 'Suspended', 'Archived'],
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

institutionSchema.index({ code: 1, status: 1 });
institutionSchema.index({ subdomain: 1, isActive: 1 });

module.exports = mongoose.model('Institution', institutionSchema);
