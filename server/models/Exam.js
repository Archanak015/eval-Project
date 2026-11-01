const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    // Academic Assessment Category: ESA, ISA 1, ISA 2, Assignment, Summer ESA, Quiz, Lab Assessment
    examType: {
        type: String,
        enum: ['ESA', 'ISA 1', 'ISA 2', 'Summer ESA', 'Assignment', 'Quiz', 'Lab Assessment', 'Mid-Sem', 'Final'],
        default: 'ISA 1'
    },
    subject: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject', 
        required: true,
        index: true 
    },
    date: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    totalMarks: { 
        type: Number, 
        required: true,
        default: 50 
    },
    weightage: {
        type: Number,
        default: 100 // percentage weight towards final grade
    },
    description: { 
        type: String,
        trim: true 
    }
}, { timestamps: true });

examSchema.index({ subject: 1, examType: 1 });

module.exports = mongoose.model('Exam', examSchema);
