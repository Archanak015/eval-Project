const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'User account reference is required'],
        unique: true, 
        index: true 
    },
    employeeId: { 
        type: String, 
        required: [true, 'Employee ID is required'], 
        unique: true, 
        trim: true,
        index: true 
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
    designation: {
        type: String,
        default: 'Assistant Professor',
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
    phone: {
        type: String,
        trim: true
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
        max: 12
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
    academicYearRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear'
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
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Resigned', 'Retired'],
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

facultySchema.index({ department: 1, assignedSubjects: 1 });
facultySchema.index({ user: 1, department: 1 });
facultySchema.index({ employeeId: 1, isActive: 1 });

module.exports = mongoose.model('Faculty', facultySchema);
