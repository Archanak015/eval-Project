const mongoose = require('mongoose');

const ResearchProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    type: { type: String, enum: ['Funded Grant', 'Journal Publication', 'Patent', 'Conference Paper'], default: 'Funded Grant' },
    principalInvestigator: { type: String, required: true },
    coInvestigators: [{ type: String }],
    department: { type: String, default: 'Computer Science' },
    fundingAgency: { type: String }, // e.g. "DST-SERB", "AICTE", "ISRO", "Industry"
    grantAmount: { type: Number, default: 0 },
    patentNumber: { type: String },
    doi: { type: String },
    citationsCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Submitted', 'Approved / In Progress', 'Completed', 'Published', 'Granted'], default: 'Approved / In Progress' },
    year: { type: Number, default: 2026 },
    documentUrl: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

ResearchProjectSchema.index({ type: 1, department: 1 });

module.exports = mongoose.model('ResearchProject', ResearchProjectSchema);
