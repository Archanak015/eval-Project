const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Course name is required'], 
        trim: true 
    }, // e.g., "Bachelor of Engineering"
    code: { 
        type: String, 
        required: [true, 'Course code is required'], 
        unique: true, 
        uppercase: true, 
        trim: true 
    }, // e.g., "B.E", "B.Tech", "M.Tech", "MCA", "MBA"
    description: { 
        type: String, 
        trim: true 
    },
    duration: { 
        type: String, 
        default: '4 Years', 
        trim: true 
    }, // e.g., "4 Years"
    department: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department',
        index: true
    },
    totalSemesters: { 
        type: Number, 
        default: 8, 
        min: 1, 
        max: 12 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: { 
        type: String, 
        enum: ['Active', 'Inactive', 'Archived'], 
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

courseSchema.index({ code: 1, status: 1 });
courseSchema.index({ department: 1, isActive: 1 });

module.exports = mongoose.model('Course', courseSchema);
