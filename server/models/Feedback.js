const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student user reference is required'],
        index: true
    },
    studentRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        index: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
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
        ],
        index: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required (1-5)'],
        min: 1,
        max: 5
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        index: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    facultyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        index: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        index: true
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear'
    },
    status: {
        type: String,
        enum: ['Submitted', 'Under Review', 'Action Taken', 'Resolved', 'Dismissed'],
        default: 'Submitted',
        index: true
    },
    adminResponse: {
        type: String,
        trim: true
    },
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    respondedAt: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

feedbackSchema.index({ category: 1, rating: -1 });
feedbackSchema.index({ faculty: 1, rating: -1 });
feedbackSchema.index({ subject: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
