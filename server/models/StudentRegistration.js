const mongoose = require('mongoose');

const studentRegistrationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student reference is required'],
        index: true
    },
    studentUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject reference is required'],
        index: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        index: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        index: true
    },
    semester: {
        type: Number,
        required: [true, 'Semester is required'],
        min: 1,
        max: 12,
        index: true
    },
    section: {
        type: String,
        default: 'A',
        uppercase: true,
        trim: true,
        index: true
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear',
        index: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    registrationType: {
        type: String,
        enum: ['Core', 'Elective', 'Open Elective', 'Audit', 'Backlog / Supplementary'],
        default: 'Core'
    },
    approvalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Dropped'],
        default: 'Approved',
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Withdrawn'],
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

// Prevent duplicate enrollment of the same student in the same subject for a given academic cycle
studentRegistrationSchema.index({ student: 1, subject: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('StudentRegistration', studentRegistrationSchema);
