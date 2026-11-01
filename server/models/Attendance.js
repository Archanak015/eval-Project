const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    date: { type: Date, required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    records: [
        {
            student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
            status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' }
        }
    ]
}, { timestamps: true });

// Composite index to prevent duplicate attendance for same subject on same date
attendanceSchema.index({ subject: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
