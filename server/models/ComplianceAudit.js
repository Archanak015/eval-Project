const mongoose = require('mongoose');

const complianceAuditSchema = new mongoose.Schema({
    accreditationBody: {
        type: String,
        enum: ['NAAC', 'NBA', 'NIRF', 'AICTE', 'UGC', 'ISO 9001'],
        required: true,
        index: true
    },
    criteriaCode: {
        type: String,
        required: true,
        trim: true
    }, // e.g. "Criterion 2.1 - Student Enrollment & Profile"
    criteriaTitle: {
        type: String,
        required: true,
        trim: true
    },
    academicYear: {
        type: String,
        default: '2026-27',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    metricScore: {
        type: Number,
        default: 3.75, // On 4.0 scale for NAAC / NBA
        min: 0,
        max: 4
    },
    complianceStatus: {
        type: String,
        enum: ['Compliant', 'Action Required', 'Under Audit Review', 'Exemplary'],
        default: 'Compliant',
        index: true
    },
    evidenceDocuments: [{
        title: { type: String, required: true },
        documentUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
    }],
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    remarks: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

complianceAuditSchema.index({ accreditationBody: 1, criteriaCode: 1, academicYear: 1 });

module.exports = mongoose.model('ComplianceAudit', complianceAuditSchema);
