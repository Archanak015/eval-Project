const mongoose = require('mongoose');

const WorkflowSchema = new mongoose.Schema({
    workflowType: {
        type: String,
        enum: ['Leave Application', 'Admission Seat Approval', 'Fee Concession', 'Document Verification', 'Equipment Purchase'],
        required: true
    },
    title: { type: String, required: true },
    description: { type: String },
    applicant: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        role: { type: String, required: true }
    },
    currentStage: {
        stageIndex: { type: Number, default: 1 },
        stageName: { type: String, default: 'Department Review' },
        assignedRole: { type: String, default: 'admin' }
    },
    status: {
        type: String,
        enum: ['Pending Review', 'Approved', 'Rejected', 'Requested Information'],
        default: 'Pending Review'
    },
    auditTrail: [{
        action: { type: String, required: true }, // e.g. "Approved with Comments"
        actionBy: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        comments: { type: String }
    }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

WorkflowSchema.index({ workflowType: 1, status: 1 });

module.exports = mongoose.model('Workflow', WorkflowSchema);
