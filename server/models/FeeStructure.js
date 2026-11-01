const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Fee structure title is required'],
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        index: true
    },
    academicYear: {
        type: String,
        default: '2026-27',
        required: true,
        index: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    components: {
        tuitionFee: { type: Number, required: true, default: 45000 },
        examinationFee: { type: Number, default: 2500 },
        libraryFee: { type: Number, default: 1500 },
        laboratoryFee: { type: Number, default: 3500 },
        hostelFee: { type: Number, default: 0 },
        transportFee: { type: Number, default: 0 },
        cautionDeposit: { type: Number, default: 5000 }
    },
    totalAmount: {
        type: Number,
        required: true,
        default: function() {
            const c = this.components || {};
            return (c.tuitionFee || 0) + (c.examinationFee || 0) + (c.libraryFee || 0) + 
                   (c.laboratoryFee || 0) + (c.hostelFee || 0) + (c.transportFee || 0) + (c.cautionDeposit || 0);
        }
    },
    dueDate: {
        type: Date,
        required: true
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

feeStructureSchema.index({ course: 1, semester: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
