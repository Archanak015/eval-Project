const mongoose = require('mongoose');

const facultyAssignmentSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: [true, 'Faculty reference is required'],
        index: true
    },
    facultyUser: {
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
    roleInSubject: {
        type: String,
        enum: ['Primary Lecturer', 'Co-Lecturer', 'Lab Instructor', 'Teaching Assistant'],
        default: 'Primary Lecturer'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

// Prevent duplicate assignment of the same faculty to the same subject, section, semester, and academic year
facultyAssignmentSchema.index({ faculty: 1, subject: 1, section: 1, semester: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('FacultyAssignment', facultyAssignmentSchema);
