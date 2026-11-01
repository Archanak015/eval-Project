const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    faculty: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Faculty user reference is required'],
        index: true 
    },
    facultyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        index: true
    },
    subject: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject', 
        required: [true, 'Subject reference is required'],
        index: true 
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        index: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        index: true
    },
    semester: {
        type: Number,
        index: true
    },
    section: {
        type: String,
        default: 'A',
        uppercase: true,
        trim: true,
        index: true
    },
    day: { 
        type: String, 
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
        required: [true, 'Day of week is required'],
        index: true 
    },
    startTime: { 
        type: String, 
        required: [true, 'Start time is required (HH:mm)'],
        trim: true 
    }, // HH:mm
    endTime: { 
        type: String, 
        required: [true, 'End time is required (HH:mm)'],
        trim: true 
    },   // HH:mm
    room: { 
        type: String,
        trim: true,
        default: 'Lecture Hall 101' 
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'Suspended', 'Archived'],
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

// Prevent room and faculty schedule clashes
timetableSchema.index({ day: 1, startTime: 1, room: 1 }, { unique: true });
timetableSchema.index({ faculty: 1, day: 1, startTime: 1 });
timetableSchema.index({ department: 1, semester: 1, section: 1, day: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);
