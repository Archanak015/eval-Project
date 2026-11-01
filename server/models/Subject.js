const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true }, // e.g. "CS301"
    course: { type: String, required: true, trim: true }, // e.g., "B.E" or Course Code
    courseRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    department: { type: String, required: true, trim: true }, // e.g., "Computer Science"
    departmentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    semester: { type: Number, required: true, min: 1, max: 12 }, // e.g., 5
    credits: { type: Number, required: true, default: 4 },
    maxMarks: { type: Number, default: 100 },
    internalMarks: { type: Number, default: 40 }, // CIE / ISA
    externalMarks: { type: Number, default: 60 }, // SEE / ESA
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned faculty (User ID)
    assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    status: { type: String, enum: ['Active', 'Archived'], default: 'Active' }
}, { timestamps: true });

subjectSchema.index({ code: 1, department: 1, semester: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
