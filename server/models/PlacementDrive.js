const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        index: true
    },
    roleTitle: {
        type: String,
        required: [true, 'Job/Internship role title is required'],
        trim: true
    },
    jobType: {
        type: String,
        enum: ['Full Time', 'Internship', 'Internship + PPO'],
        default: 'Full Time'
    },
    packageCTC: {
        type: Number,
        required: [true, 'Package / CTC in LPA is required'],
        min: 0
    },
    eligibilityCriteria: {
        minCGPA: { type: Number, default: 6.5 },
        maxBacklogs: { type: Number, default: 0 },
        allowedDepartments: [{ type: String }],
        allowedCourses: [{ type: String }]
    },
    jobLocation: {
        type: String,
        default: 'Bangalore / Hybrid',
        trim: true
    },
    driveDate: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    deadlineDate: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    description: {
        type: String,
        trim: true
    },
    applicants: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        appliedAt: { type: Date, default: Date.now },
        resumeUrl: { type: String, default: 'https://cdn.uniconnect.edu/resumes/default.pdf' },
        status: {
            type: String,
            enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Offer Released', 'Rejected'],
            default: 'Applied'
        },
        offeredCTC: { type: Number }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'Closed', 'Completed'],
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

placementDriveSchema.index({ companyName: 1, driveDate: 1 });
placementDriveSchema.index({ status: 1, packageCTC: -1 });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
