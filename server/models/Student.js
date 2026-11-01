const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'User reference is required'],
        index: true 
    },
    enrollmentNo: { 
        type: String, 
        required: [true, 'Enrollment number is required'], 
        unique: true, 
        trim: true,
        index: true 
    },
    usn: {
        type: String,
        trim: true,
        uppercase: true,
        index: true
    },
    rollNo: {
        type: String,
        trim: true
    },
    department: { 
        type: String, 
        required: [true, 'Department is required'],
        trim: true, 
        index: true 
    },
    departmentRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        index: true
    },
    semester: { 
        type: Number, 
        required: [true, 'Semester is required'], 
        min: 1, 
        max: 12,
        index: true 
    },
    semesterRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        index: true
    },
    section: {
        type: String,
        default: 'A',
        trim: true,
        uppercase: true,
        index: true
    },
    sectionRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
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
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course',
        index: true
    },
    courses: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    }],
    enrolledSubjects: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject',
        index: true
    }],
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
    academicYearRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear',
        index: true
    },
    contactNumber: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'Suspended', 'Alumni', 'Withdrawn'],
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

// Compound indexes for fast directory lookup, section aggregation, and attendance validation
studentSchema.index({ department: 1, semester: 1, section: 1 });
studentSchema.index({ course: 1, semester: 1 });
studentSchema.index({ enrollmentNo: 1, department: 1 });
studentSchema.index({ usn: 1, isActive: 1 });

module.exports = mongoose.model('Student', studentSchema);
