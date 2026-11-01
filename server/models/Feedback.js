const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Faculty',
            'Subject',
            'Infrastructure',
            'Administration',
            'Library',
            'Hostel',
            'Placement',
            'Laboratory',
            'General Suggestion'
        ]
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Submitted', 'Under Review', 'Resolved'],
        default: 'Submitted'
    },
    response: {
        type: String,
        trim: true
    },
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    respondedAt: {
        type: Date
    }
}, { timestamps: true });

feedbackSchema.index({ category: 1, status: 1 });
feedbackSchema.index({ faculty: 1, status: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
