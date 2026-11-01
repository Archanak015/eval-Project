const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Section name is required (e.g. A, B, C)'],
        trim: true,
        uppercase: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
        index: true
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        index: true
    },
    semesterNumber: {
        type: Number,
        required: [true, 'Semester number is required'],
        min: 1,
        max: 12
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        index: true
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear',
        index: true
    },
    maxCapacity: {
        type: Number,
        default: 60,
        min: 1
    },
    roomNumber: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'Archived'],
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

// Prevent duplicate sections for the same course, semester, department, and academic cycle
sectionSchema.index({ name: 1, course: 1, semesterNumber: 1, department: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Section', sectionSchema);
