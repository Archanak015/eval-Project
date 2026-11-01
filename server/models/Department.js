const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Department name is required'], 
        unique: true, 
        trim: true 
    },
    code: { 
        type: String, 
        required: [true, 'Department code is required'], 
        unique: true, 
        uppercase: true, 
        trim: true 
    }, // e.g. "CSE", "ISE", "ECE", "MECH", "AIML"
    description: { 
        type: String, 
        trim: true 
    },
    headOfDepartment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Faculty' 
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

departmentSchema.index({ code: 1, status: 1 });
departmentSchema.index({ name: 1, isActive: 1 });

module.exports = mongoose.model('Department', departmentSchema);
