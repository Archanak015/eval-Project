const Timetable = require('../models/Timetable');
const Subject = require('../models/Subject');
const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

exports.createSlot = asyncHandler(async (req, res) => {
    const { subject, day, startTime, endTime, room } = req.body;
    if (!subject || !day || !startTime || !endTime) {
        return ApiResponse.error(res, 'Subject, day, startTime, and endTime are required', 400);
    }

    const slot = await Timetable.create({
        subject,
        day,
        startTime,
        endTime,
        room: room || 'Room 101',
        faculty: req.user._id
    });

    if (req.user) {
        await Activity.create({
            user: req.user._id,
            action: 'COURSE_CREATED',
            module: 'ACADEMICS',
            details: `Added timetable lecture slot for ${day} (${startTime} - ${endTime})`
        }).catch(err => console.error(err.message));
    }

    return ApiResponse.success(res, slot, 'Timetable slot created', 201);
});

exports.getFacultyTimetable = asyncHandler(async (req, res) => {
    // If faculty, find their slots; if admin or student, show all populated slots
    const filter = (req.user && req.user.role === 'faculty') 
        ? { faculty: req.user._id } 
        : {};

    let timetable = await Timetable.find(filter)
        .populate('subject', 'name code department semester')
        .populate('faculty', 'name email')
        .sort('startTime')
        .lean();

    // Fallback if specific faculty has no slots yet, load available campus slots
    if (timetable.length === 0) {
        timetable = await Timetable.find()
            .populate('subject', 'name code department semester')
            .populate('faculty', 'name email')
            .sort('startTime')
            .lean();
    }

    // Calculate Workload (hours)
    const totalMinutes = timetable.reduce((acc, slot) => {
        if (!slot.startTime || !slot.endTime) return acc;
        const [startH, startM] = slot.startTime.split(':').map(Number);
        const [endH, endM] = slot.endTime.split(':').map(Number);
        const diff = (endH * 60 + endM) - (startH * 60 + startM);
        return acc + (diff > 0 ? diff : 60);
    }, 0);

    return ApiResponse.success(res, {
        timetable,
        workloadHours: (totalMinutes / 60).toFixed(1)
    }, 'Timetable retrieved');
});

exports.deleteSlot = asyncHandler(async (req, res) => {
    await Timetable.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, null, 'Slot deleted successfully');
});
