const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Subject name is required'], 
        trim: true 
    },
    code: { 
        type: String, 
        required: [true, 'Subject code is required'], 
        unique: true, 
        uppercase: true, 
        trim: true 
    }, // e.g. "CS301"
    course: { 
        type: String, 
        required: [true, 'Course name/code is required'], 
        trim: true 
    }, // e.g., "B.E"
    courseRef: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course',
        index: true
    },
    department: { 
        type: String, 
        required: [true, 'Department name is required'], 
        trim: true 
    }, // e.g., "Computer Science"
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
    credits: { 
        type: Number, 
        required: [true, 'Credits are required'], 
        default: 4,
        min: 1,
        max: 10
    },
    maxMarks: { 
        type: Number, 
        default: 100,
        min: 10
    },
    internalMarks: { 
        type: Number, 
        default: 40,
        min: 0
    }, // CIE / ISA
    externalMarks: { 
        type: Number, 
        default: 60,
        min: 0
    }, // SEE / ESA
    faculty: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        index: true 
    }, // Assigned faculty (User ID)
    assignedFaculty: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Faculty',
        index: true 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: { 
        type: String, 
        enum: ['Active', 'Archived'], 
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

subjectSchema.index({ code: 1, department: 1, semester: 1 });
subjectSchema.index({ departmentRef: 1, semester: 1, isActive: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
