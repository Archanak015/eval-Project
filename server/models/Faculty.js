const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true,
        index: true 
    },
    employeeId: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        index: true 
    },
    department: { 
        type: String, 
        required: true,
        trim: true,
        index: true 
    },
    designation: {
        type: String,
        default: 'Assistant Professor',
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    qualification: {
        type: String,
        default: 'M.Tech / Ph.D in Computer Science',
        trim: true
    },
    experience: {
        type: String,
        default: '5+ Years Teaching & Research',
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Resigned', 'Retired'],
        default: 'Active',
        index: true
    },
    assignedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    assignedSubjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        index: true
    }],
    courseCodes: [{
        type: String,
        trim: true
    }],
    semesters: [{
        type: Number,
        min: 1,
        max: 8
    }],
    sections: [{
        type: String,
        trim: true
    }],
    academicYear: {
        type: String,
        default: '2026-2027',
        trim: true
    },
    batch: {
        type: String,
        trim: true
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
    officeHours: {
        type: String,
        default: 'Mon-Fri 2:00 PM - 4:00 PM',
        trim: true
    }
}, { timestamps: true });

// Compound indexes for fast authorization verification
facultySchema.index({ department: 1, assignedSubjects: 1 });
facultySchema.index({ user: 1, department: 1 });

module.exports = mongoose.model('Faculty', facultySchema);
