const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    code: { 
        type: String, 
        required: true, 
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
    status: { 
        type: String, 
        enum: ['Active', 'Inactive'], 
        default: 'Active' 
    }
}, { timestamps: true });

departmentSchema.index({ code: 1, status: 1 });

module.exports = mongoose.model('Department', departmentSchema);
