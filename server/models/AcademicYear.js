const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
    year: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    }, // e.g. "2026-27", "2027-28"
    startDate: { 
        type: Date 
    },
    endDate: { 
        type: Date 
    },
    isCurrent: { 
        type: Boolean, 
        default: false 
    },
    status: { 
        type: String, 
        enum: ['Active', 'Upcoming', 'Archived'], 
        default: 'Active' 
    }
}, { timestamps: true });

academicYearSchema.index({ year: 1, isCurrent: 1 });

module.exports = mongoose.model('AcademicYear', academicYearSchema);
