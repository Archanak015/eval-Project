const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    enrollmentNo: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        index: true
    },
    usn: { type: String, trim: true, uppercase: true, index: true },
    rollNo: { type: String, trim: true },
    department: { 
        type: String, 
        required: true,
        trim: true,
        index: true 
    },
    semester: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 8,
        index: true 
    },
    section: {
        type: String,
        default: 'A',
        trim: true,
        index: true
    },
    batch: {
        type: String,
        trim: true,
        default: '2024-2028'
    },
    courseCode: {
        type: String,
        trim: true,
        default: 'B.E'
    },
    college: {
        type: String,
        default: 'Main Campus',
        trim: true
    },
    campus: {
        type: String,
        default: 'Central Campus',
        trim: true
    },
    academicYear: { 
        type: String, 
        default: '2026-2027',
        trim: true 
    },
    // Primary Enrolled Course
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course',
        index: true
    },
    // Multi-course support
    courses: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    }],
    // Associated enrolled subjects for the semester
    enrolledSubjects: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject' 
    }],
    contactNumber: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Suspended', 'Alumni'],
        default: 'Active',
        index: true
    }
}, { timestamps: true });

// Compound indexes for fast directory and attendance filtering
studentSchema.index({ department: 1, semester: 1 });
studentSchema.index({ course: 1, semester: 1 });
studentSchema.index({ enrollmentNo: 1, department: 1 });

module.exports = mongoose.model('Student', studentSchema);
