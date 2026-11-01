const mongoose = require('mongoose');

const academicActivitySchema = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    progress: { type: Number, min: 0, max: 100 } // Syllabus %
}, { timestamps: true });

module.exports = mongoose.model('AcademicActivity', academicActivitySchema);
