const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Notice title is required'],
        trim: true 
    },
    message: { 
        type: String, 
        required: [true, 'Notice message content is required'],
        trim: true 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Sender reference is required'],
        index: true 
    },
    category: {
        type: String,
        enum: ['Academic', 'Examination', 'Administrative', 'Holiday', 'Event', 'Emergency', 'General'],
        default: 'Academic',
        index: true
    },
    targetRole: { 
        type: String, 
        enum: ['all', 'student', 'faculty', 'admin'], 
        default: 'all',
        index: true 
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        index: true
    },
    readBy: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    expiryDate: {
        type: Date
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Published', 'Draft', 'Archived'],
        default: 'Published',
        index: true
    },
    isActive: { 
        type: Boolean, 
        default: true,
        index: true 
    }
}, { timestamps: true });

notificationSchema.index({ targetRole: 1, createdAt: -1 });
notificationSchema.index({ department: 1, targetRole: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
