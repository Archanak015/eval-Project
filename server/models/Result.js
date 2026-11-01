const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    exam: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Exam', 
        required: [true, 'Exam reference is required'],
        index: true 
    },
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: [true, 'Student reference is required'],
        index: true 
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        index: true
    },
    marksObtained: { 
        type: Number, 
        required: [true, 'Marks obtained is required'],
        min: 0
    },
    maxMarks: {
        type: Number,
        default: 100
    },
    grade: {
        type: String,
        trim: true,
        uppercase: true
    },
    isPassed: {
        type: Boolean,
        default: true,
        index: true
    },
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
        enum: ['Draft', 'Published', 'Withheld', 'Revised'],
        default: 'Published',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

// Ensure unique result record per student per exam assessment
resultSchema.index({ exam: 1, student: 1 }, { unique: true });
resultSchema.index({ student: 1, subject: 1 });

module.exports = mongoose.model('Result', resultSchema);
