const mongoose = require('mongoose');

const documentVaultSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Document title is required'],
        trim: true
    },
    documentType: {
        type: String,
        enum: [
            'Aadhaar',
            'Passport',
            'Marks Card',
            'Transfer Certificate',
            'Income Certificate',
            'Qualification Degree',
            'Experience Certificate',
            'Institutional Circular',
            'Academic Policy',
            'General Document'
        ],
        required: true,
        index: true
    },
    ownerUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    ownerRole: {
        type: String,
        enum: ['student', 'faculty', 'admin'],
        required: true,
        index: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileFormat: {
        type: String,
        default: 'PDF',
        uppercase: true
    },
    fileSizeBytes: {
        type: Number,
        default: 1048576 // 1MB
    },
    visibility: {
        type: String,
        enum: ['Private', 'Departmental', 'Public Institutional'],
        default: 'Private'
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Submitted', 'Approved', 'Rejected', 'Archived'],
        default: 'Submitted',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

documentVaultSchema.index({ ownerUser: 1, documentType: 1 });

module.exports = mongoose.model('DocumentVault', documentVaultSchema);
