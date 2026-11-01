const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
        index: true
    },
    semesterNumber: {
        type: Number,
        required: [true, 'Semester number is required'],
        min: [1, 'Semester number must be at least 1'],
        max: [12, 'Semester number cannot exceed 12']
    },
    title: {
        type: String,
        trim: true,
        default: function() {
            return `Semester ${this.semesterNumber}`;
        }
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear',
        index: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'Upcoming', 'Completed', 'Archived'],
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

// Unique compound constraint: no duplicate semester number per course & academic year
semesterSchema.index({ course: 1, semesterNumber: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Semester', semesterSchema);
