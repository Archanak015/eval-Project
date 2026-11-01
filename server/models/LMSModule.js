const mongoose = require('mongoose');

const LMSModuleSchema = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true }, // e.g. "Module 1: Advanced Graph Algorithms & B-Trees"
    description: { type: String },
    moduleOrder: { type: Number, default: 1 },
    materials: [{
        title: { type: String, required: true },
        type: { type: String, enum: ['video', 'pdf', 'notes', 'link'], default: 'notes' },
        url: { type: String, required: true },
        durationMinutes: { type: Number, default: 0 }
    }],
    assignments: [{
        title: { type: String, required: true },
        description: { type: String },
        dueDate: { type: Date, required: true },
        maxMarks: { type: Number, default: 20 },
        submissions: [{
            student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
            studentUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            fileUrl: { type: String },
            content: { type: String },
            submittedAt: { type: Date, default: Date.now },
            grade: { type: Number },
            feedback: { type: String }
        }]
    }],
    quizzes: [{
        title: { type: String, required: true },
        questions: [{
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctOptionIndex: { type: Number, required: true },
            marks: { type: Number, default: 1 }
        }],
        timeLimitMinutes: { type: Number, default: 15 },
        totalMarks: { type: Number, default: 10 }
    }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

LMSModuleSchema.index({ subject: 1, moduleOrder: 1 });

module.exports = mongoose.model('LMSModule', LMSModuleSchema);
