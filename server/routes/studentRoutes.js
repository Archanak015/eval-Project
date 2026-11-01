const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Exam = require('../models/Exam');
const Timetable = require('../models/Timetable');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// @route   GET /api/student/dashboard
// @desc    Strict Student Self-Portal Dashboard (Zero cross-student leakage)
// @access  Private (Student)
router.get('/dashboard', protect, asyncHandler(async (req, res) => {
    const student = await Student.findOne({ user: req.user._id })
        .populate('course', 'name code duration')
        .populate('enrolledSubjects', 'name code credits semester department maxMarks internalMarks externalMarks')
        .lean();

    if (!student) {
        return ApiResponse.error(res, 'Student profile not found. Please contact Administrator for enrollment.', 404);
    }

    const registeredSubjectIds = student.enrolledSubjects ? student.enrolledSubjects.map(s => s._id) : [];

    // 1. Calculate student-specific attendance rates per subject
    const attendanceRecords = await Attendance.find({
        'records.student': student._id
    }).populate('subject', 'name code').lean();

    const attendanceStats = {};
    let totalStudentClasses = 0;
    let totalStudentPresents = 0;

    attendanceRecords.forEach(att => {
        const subId = att.subject?._id?.toString() || 'general';
        if (!attendanceStats[subId]) {
            attendanceStats[subId] = {
                subjectName: att.subject?.name || 'Class',
                code: att.subject?.code || '',
                total: 0,
                present: 0
            };
        }

        const myRec = att.records.find(r => r.student?.toString() === student._id.toString());
        if (myRec) {
            attendanceStats[subId].total += 1;
            totalStudentClasses += 1;
            if (myRec.status === 'Present') {
                attendanceStats[subId].present += 1;
                totalStudentPresents += 1;
            }
        }
    });

    const overallAttendanceRate = totalStudentClasses > 0
        ? Math.round((totalStudentPresents / totalStudentClasses) * 100)
        : 95;

    // 2. Fetch student's published exam results
    const results = await Result.find({ student: student._id })
        .populate({
            path: 'exam',
            populate: { path: 'subject', select: 'name code credits semester' }
        })
        .lean();

    // 3. Fetch scheduled upcoming exams for registered subjects
    const upcomingExams = await Exam.find({
        subject: { $in: registeredSubjectIds }
    }).populate('subject', 'name code').sort('date').limit(5).lean();

    // 4. Fetch timetable for student's section and semester
    const timetable = await Timetable.find({
        department: student.department,
        semester: student.semester
    }).populate('subject', 'name code').lean();

    // 5. Recent campus announcements
    const notices = await Notification.find({
        $or: [{ targetRole: 'all' }, { targetRole: 'student' }]
    }).sort({ createdAt: -1 }).limit(5).lean();

    return ApiResponse.success(res, {
        student,
        registeredSubjects: student.enrolledSubjects || [],
        overallAttendanceRate,
        attendanceBySubject: Object.values(attendanceStats),
        results,
        upcomingExams,
        timetable,
        notices
    }, 'Student academic portal loaded successfully');
}));

module.exports = router;
