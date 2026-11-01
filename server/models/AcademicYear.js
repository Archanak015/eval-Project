const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
    year: { 
        type: String, 
        required: [true, 'Academic year is required (e.g. 2026-27)'], 
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
        default: false,
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: { 
        type: String, 
        enum: ['Active', 'Upcoming', 'Archived'], 
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

academicYearSchema.index({ year: 1, isCurrent: 1 });

module.exports = mongoose.model('AcademicYear', academicYearSchema);
