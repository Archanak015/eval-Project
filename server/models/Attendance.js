const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    subject: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject', 
        required: [true, 'Subject reference is required'],
        index: true 
    },
    date: { 
        type: Date, 
        required: [true, 'Lecture date is required'] 
    },
    faculty: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Faculty reference is required'],
        index: true 
    },
    facultyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        index: true
    },
    section: {
        type: String,
        default: 'A',
        uppercase: true,
        trim: true,
        index: true
    },
    semester: {
        type: Number,
        index: true
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear'
    },
    records: [
        {
            student: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Student', 
                required: [true, 'Student reference is required'] 
            },
            status: { 
                type: String, 
                enum: ['Present', 'Absent', 'Late', 'Excused'], 
                default: 'Present' 
            },
            remarks: { 
                type: String, 
                trim: true 
            }
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Submitted', 'Verified', 'Locked'],
        default: 'Submitted',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

// Prevent duplicate attendance for the same subject, section, and date
attendanceSchema.index({ subject: 1, date: 1, section: 1 }, { unique: true });
attendanceSchema.index({ 'records.student': 1, subject: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
