const mongoose = require('mongoose');

const feeTransactionSchema = new mongoose.Schema({
    receiptNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true
    },
    studentUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    feeStructure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeeStructure'
    },
    semester: {
        type: Number,
        required: true
    },
    academicYear: {
        type: String,
        default: '2026-27'
    },
    amountPaid: {
        type: Number,
        required: true,
        min: 0
    },
    totalPayable: {
        type: Number,
        required: true
    },
    concessionScholarship: {
        type: Number,
        default: 0
    },
    finePenalty: {
        type: Number,
        default: 0
    },
    balanceDue: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['Online (UPI / Gateway)', 'Net Banking', 'Credit/Debit Card', 'Demand Draft', 'Cash Deposit'],
        default: 'Online (UPI / Gateway)'
    },
    paymentGatewayReference: {
        type: String,
        default: function() {
            return `TXN_${Date.now()}`;
        }
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Paid', 'Partial', 'Pending', 'Failed', 'Refunded'],
        default: 'Paid',
        index: true
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

feeTransactionSchema.index({ student: 1, semester: 1 });

module.exports = mongoose.model('FeeTransaction', feeTransactionSchema);
