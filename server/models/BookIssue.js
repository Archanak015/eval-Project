const mongoose = require('mongoose');

const bookIssueSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Book reference is required'],
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Borrower user reference is required'],
        index: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
    },
    issueDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days default
    },
    returnDate: {
        type: Date
    },
    fineAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    fineStatus: {
        type: String,
        enum: ['None', 'Unpaid', 'Paid', 'Waived'],
        default: 'None'
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Issued', 'Returned', 'Overdue', 'Renewed', 'Lost'],
        default: 'Issued',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

bookIssueSchema.index({ user: 1, status: 1 });
bookIssueSchema.index({ dueDate: 1, status: 1 });

module.exports = mongoose.model('BookIssue', bookIssueSchema);
