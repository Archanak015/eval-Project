const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true
    },
    action: { 
        type: String, 
        required: true,
        enum: ['LOGIN', 'LOGOUT', 'ATTENDANCE_MARKED', 'MARKS_UPLOADED', 'EXAM_CREATED', 'COURSE_CREATED', 'NOTIFICATION_SENT', 'PROFILE_UPDATED']
    },
    module: { 
        type: String, 
        required: true,
        enum: ['AUTH', 'ATTENDANCE', 'EXAMINATION', 'ACADEMICS', 'COMMUNICATION', 'PROFILE']
    },
    details: { 
        type: String, 
        required: true 
    },
    ipAddress: { 
        type: String, 
        default: '127.0.0.1' 
    }
}, { timestamps: true });

// Index for chronological activity streams
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
