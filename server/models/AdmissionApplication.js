const mongoose = require('mongoose');

const AdmissionApplicationSchema = new mongoose.Schema({
    applicationNumber: { type: String, required: true, unique: true }, // e.g. "ADM-2026-9041"
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    desiredCourse: { type: String, required: true }, // e.g. "B.E Computer Science & Engineering"
    previousScorePercentage: { type: Number, required: true }, // 12th / Diploma score
    entranceRank: { type: Number, default: 0 }, // KCET / JEE rank
    meritScore: { type: Number, required: true }, // Calculated merit
    documentsUploaded: [{
        docType: { type: String }, // "10th Marksheet", "12th Marksheet", "Identity Proof"
        verified: { type: Boolean, default: true }
    }],
    allocatedSeatCategory: { type: String, default: 'General Merit' },
    status: {
        type: String,
        enum: ['Application Submitted', 'Under Document Verification', 'Merit Shortlisted', 'Seat Allocated', 'Fee Paid / Admitted', 'Rejected'],
        default: 'Merit Shortlisted'
    },
    counsellingDate: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

AdmissionApplicationSchema.index({ desiredCourse: 1, meritScore: -1 });

module.exports = mongoose.model('AdmissionApplication', AdmissionApplicationSchema);
