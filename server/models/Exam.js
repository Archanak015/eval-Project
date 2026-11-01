const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Exam/Assessment name is required'],
        trim: true 
    },
    // Academic Assessment Category: ESA, ISA 1, ISA 2, Assignment, Summer ESA, Quiz, Lab Assessment
    examType: {
        type: String,
        enum: ['ESA', 'ISA 1', 'ISA 2', 'Summer ESA', 'Assignment', 'Quiz', 'Lab Assessment', 'Mid-Sem', 'Final'],
        default: 'ISA 1',
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
        index: true
    },
    section: {
        type: String,
        uppercase: true,
        trim: true
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear'
    },
    date: { 
        type: Date, 
        required: [true, 'Examination date is required'],
        default: Date.now 
    },
    totalMarks: { 
        type: Number, 
        required: [true, 'Total maximum marks are required'],
        default: 50,
        min: 1
    },
    passingMarks: {
        type: Number,
        default: function() {
            return Math.round(this.totalMarks * 0.4);
        }
    },
    weightage: {
        type: Number,
        default: 100 // percentage weight towards final grade
    },
    description: { 
        type: String,
        trim: true 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Scheduled',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

// Prevent duplicate assessment with same name, subject, examType, and academic cycle
examSchema.index({ subject: 1, examType: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Exam', examSchema);
