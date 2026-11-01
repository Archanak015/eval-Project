const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student reference is required'],
        index: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject reference is required'],
        index: true
    },
    examination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        index: true
    },
    examType: {
        type: String,
        enum: ['ESA', 'ISA 1', 'ISA 2', 'Summer ESA', 'Assignment', 'Quiz', 'Lab Assessment'],
        default: 'ISA 1',
        index: true
    },
    marksObtained: {
        type: Number,
        required: [true, 'Marks obtained is required'],
        min: 0
    },
    totalMarks: {
        type: Number,
        required: [true, 'Total marks are required'],
        default: 100
    },
    percentage: {
        type: Number,
        default: function() {
            return this.totalMarks > 0 ? Math.round((this.marksObtained / this.totalMarks) * 100) : 0;
        }
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    semester: {
        type: Number,
        index: true
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear'
    },
    remarks: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Draft', 'Submitted', 'Approved', 'Locked'],
        default: 'Submitted',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

// Prevent duplicate mark entry for the same student, subject, and evaluation component
marksSchema.index({ student: 1, subject: 1, examination: 1 }, { unique: true });
marksSchema.index({ student: 1, subject: 1, examType: 1 });

module.exports = mongoose.model('Marks', marksSchema);
