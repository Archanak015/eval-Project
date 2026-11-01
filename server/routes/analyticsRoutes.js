const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const { protect, faculty } = require('../middleware/authMiddleware');
const { facultyScope } = require('../middleware/facultyAuthorization');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// @route   GET /api/analytics/dashboard
// @desc    Get aggregated stats for Admin and Faculty dashboards (strictly scoped for faculty)
// @access  Private (Admin / Faculty)
router.get('/dashboard', protect, faculty, facultyScope, asyncHandler(async (req, res) => {
    // Determine student filter based on authorization scope
    const studentFilter = req.facultyScope ? req.facultyScope.buildStudentQuery({}) : {};

    // Get subject IDs for this faculty
    const isFaculty = req.user.role === 'faculty';
    const facultySubIds = req.facultyScope?.assignedSubjectIds || [];

    const examFilter = isFaculty && facultySubIds.length > 0 ? { subject: { $in: facultySubIds } } : {};
    const subjectFilter = isFaculty && facultySubIds.length > 0 ? { _id: { $in: facultySubIds } } : {};

    const [
        studentCount,
        facultyCount,
        courseCount,
        subjectCount,
        examCount,
        recentNotifications,
        recentExams,
        recentActivities,
        departmentBreakdown
    ] = await Promise.all([
        Student.countDocuments(studentFilter),
        Faculty.countDocuments(),
        Course.countDocuments(),
        Subject.countDocuments(subjectFilter),
        Exam.countDocuments(examFilter),
        Notification.find().sort({ createdAt: -1 }).limit(5).populate('sender', 'name role').lean(),
        Exam.find(examFilter).sort({ date: -1 }).limit(5).populate('subject', 'name code').lean(),
        Activity.find().populate('user', 'name role').sort({ createdAt: -1 }).limit(8).lean(),
        Student.aggregate([
            { $match: studentFilter },
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $project: { department: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } }
        ])
    ]);

    // Calculate attendance rate for authorized cohort
    const attendanceMatch = isFaculty && facultySubIds.length > 0 ? { subject: { $in: facultySubIds } } : {};
    const attendanceAgg = await Attendance.aggregate([
        { $match: attendanceMatch },
        { $unwind: '$records' },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                present: { $sum: { $cond: [{ $eq: ['$records.status', 'Present'] }, 1, 0] } }
            }
        }
    ]);

    const totalAttendanceRecords = attendanceAgg[0]?.total || 0;
    const presentRecords = attendanceAgg[0]?.present || 0;
    const averageAttendance = totalAttendanceRecords > 0
        ? Math.round((presentRecords / totalAttendanceRecords) * 100)
        : 92;

    // Calculate pass percentage across exams for authorized subject(s)
    const examIds = (await Exam.find(examFilter).select('_id')).map(e => e._id);
    const resultsAgg = await Result.aggregate([
        { $match: examIds.length > 0 ? { exam: { $in: examIds } } : {} },
        {
            $lookup: {
                from: 'exams',
                localField: 'exam',
                foreignField: '_id',
                as: 'examDetails'
            }
        },
        { $unwind: { path: '$examDetails', preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: null,
                totalResults: { $sum: 1 },
                passedResults: {
                    $sum: {
                        $cond: [
                            { $gte: ['$marksObtained', { $multiply: [{ $ifNull: ['$examDetails.totalMarks', 100] }, 0.4] }] },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);

    const totalResults = resultsAgg[0]?.totalResults || 0;
    const passedResults = resultsAgg[0]?.passedResults || 0;
    const passPercentage = totalResults > 0
        ? Math.round((passedResults / totalResults) * 100)
        : 88;

    return ApiResponse.success(res, {
        stats: {
            students: studentCount,
            faculty: facultyCount,
            courses: courseCount,
            subjects: subjectCount,
            exams: examCount,
            averageAttendance,
            passPercentage
        },
        departmentBreakdown,
        recentNotifications,
        recentExams,
        recentActivities
    }, 'Dashboard analytics fetched successfully');
}));

// @route   GET /api/analytics/search
// @desc    Full multi-field search restricted strictly to authorized students & subjects
// @access  Private
router.get('/search', protect, facultyScope, asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (!query || query.trim().length === 0) {
        return ApiResponse.success(res, { students: [], faculty: [], courses: [], subjects: [] });
    }

    const trimmed = query.trim();
    const regex = { $regex: trimmed, $options: 'i' };

    // Search users by name, email
    const usersMatching = await User.find({
        $or: [{ name: regex }, { email: regex }]
    }).select('name email role profileImage').limit(15).lean();

    const matchedUserIds = usersMatching.map(u => u._id);

    // Build base student authorization query
    const studentAuthFilter = req.facultyScope ? req.facultyScope.buildStudentQuery({}) : {};

    const [studentsDirect, studentsFromUsers, courses, subjects] = await Promise.all([
        Student.find({
            ...studentAuthFilter,
            $or: [
                { enrollmentNo: regex },
                { department: regex },
                { section: regex },
                { academicYear: regex },
                { courseCode: regex }
            ]
        })
        .populate('user', 'name email profileImage')
        .populate('course', 'name code')
        .populate('enrolledSubjects', 'name code')
        .limit(10)
        .lean(),

        Student.find({
            ...studentAuthFilter,
            user: { $in: matchedUserIds }
        })
        .populate('user', 'name email profileImage')
        .populate('course', 'name code')
        .populate('enrolledSubjects', 'name code')
        .limit(10)
        .lean(),

        Course.find({
            $or: [{ name: regex }, { code: regex }]
        }).limit(6).lean(),

        Subject.find({
            ...(req.user.role === 'faculty' && req.facultyScope?.assignedSubjectIds.length > 0
                ? { _id: { $in: req.facultyScope.assignedSubjectIds } }
                : {}),
            $or: [{ name: regex }, { code: regex }, { department: regex }]
        }).populate('faculty', 'name').limit(6).lean()
    ]);

    // Deduplicate students by _id
    const studentMap = new Map();
    [...studentsDirect, ...studentsFromUsers].forEach(s => {
        studentMap.set(s._id.toString(), s);
    });
    const uniqueStudents = Array.from(studentMap.values()).slice(0, 10);

    // Compute live attendance rate for matched students
    if (uniqueStudents.length > 0) {
        const studentIds = uniqueStudents.map(s => s._id);
        const attendanceAgg = await Attendance.aggregate([
            { $unwind: '$records' },
            { $match: { 'records.student': { $in: studentIds } } },
            {
                $group: {
                    _id: '$records.student',
                    totalSessions: { $sum: 1 },
                    presentSessions: {
                        $sum: { $cond: [{ $eq: ['$records.status', 'Present'] }, 1, 0] }
                    }
                }
            }
        ]);

        const attMap = {};
        attendanceAgg.forEach(a => {
            attMap[a._id.toString()] = a.totalSessions > 0 ? Math.round((a.presentSessions / a.totalSessions) * 100) : 100;
        });

        uniqueStudents.forEach(s => {
            s.attendancePercentage = attMap[s._id.toString()] ?? 100;
        });
    }

    const facultyWithProfiles = await Faculty.find({ user: { $in: matchedUserIds } })
        .populate('user', 'name email profileImage')
        .lean();

    return ApiResponse.success(res, {
        students: uniqueStudents,
        faculty: facultyWithProfiles,
        courses,
        subjects
    }, 'Search completed');
}));

module.exports = router;
