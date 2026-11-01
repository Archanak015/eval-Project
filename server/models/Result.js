const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    marksObtained: { type: Number, required: true },
    remarks: { type: String }
}, { timestamps: true });

// Ensure unique result per student per exam
resultSchema.index({ exam: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
