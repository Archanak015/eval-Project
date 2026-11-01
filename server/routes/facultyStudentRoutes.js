const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const Course = require('../models/Course');
const { protect, faculty } = require('../middleware/authMiddleware');
const { facultyScope } = require('../middleware/facultyAuthorization');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// @route   GET /api/faculty/students
// @desc    Faculty Student Search with Strict Access Control, Multi-filter & Attendance % calculation
// @access  Private (Faculty & Admin)
router.get('/students', protect, faculty, facultyScope, asyncHandler(async (req, res) => {
    const { 
        search, 
        enrollmentNo, 
        department, 
        semester, 
        course, 
        subject,
        section,
        status, 
        page = 1, 
        limit = 15,
        sort = '-createdAt'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // --- Strict Faculty Access Control ---
    // Enforce facultyScope query builder: only students from assigned subjects, departments, semesters, sections
    const baseFilter = req.facultyScope ? req.facultyScope.buildStudentQuery({}) : {};
    const filterConditions = { ...baseFilter };

    if (department) {
        filterConditions.department = new RegExp(`^${department.trim()}$`, 'i');
    }

    if (semester) {
        filterConditions.semester = Number(semester);
    }

    if (section) {
        filterConditions.section = new RegExp(`^${section.trim()}$`, 'i');
    }

    if (course) {
        if (course.match(/^[0-9a-fA-F]{24}$/)) {
            filterConditions.course = course;
        } else {
            const courseDoc = await Course.findOne({
                $or: [{ name: new RegExp(course, 'i') }, { code: new RegExp(course, 'i') }]
            });
            if (courseDoc) filterConditions.course = courseDoc._id;
        }
    }

    if (subject && subject.match(/^[0-9a-fA-F]{24}$/)) {
        filterConditions.enrolledSubjects = subject;
    }

    if (status) {
        filterConditions.status = status;
    }

    if (enrollmentNo) {
        filterConditions.enrollmentNo = new RegExp(enrollmentNo.trim(), 'i');
    }

    // Flexible multi-field search restricted strictly to authorized students
    if (search && search.trim().length > 0) {
        const searchRegex = new RegExp(search.trim(), 'i');

        const matchedUsers = await User.find({
            $or: [{ name: searchRegex }, { email: searchRegex }]
        }).select('_id');
        const matchedUserIds = matchedUsers.map(u => u._id);

        filterConditions.$and = filterConditions.$and || [];
        filterConditions.$and.push({
            $or: [
                { user: { $in: matchedUserIds } },
                { enrollmentNo: searchRegex },
                { department: searchRegex },
                { section: searchRegex },
                { courseCode: searchRegex }
            ]
        });
    }

    // Sorting logic
    let sortCriteria = { createdAt: -1 };
    if (sort === 'name') sortCriteria = { 'user.name': 1 };
    else if (sort === 'enrollmentNo') sortCriteria = { enrollmentNo: 1 };
    else if (sort === 'department') sortCriteria = { department: 1 };
    else if (sort === 'semester') sortCriteria = { semester: 1 };

    const [students, total] = await Promise.all([
        Student.find(filterConditions)
            .populate('user', 'name email profileImage')
            .populate('course', 'name code duration')
            .populate('enrolledSubjects', 'name code')
            .sort(sortCriteria)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Student.countDocuments(filterConditions)
    ]);

    // Compute live attendance percentage for each student in the directory
    const studentIds = students.map(s => s._id);
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

    const attendanceMap = {};
    attendanceAgg.forEach(att => {
        const rate = att.totalSessions > 0 ? Math.round((att.presentSessions / att.totalSessions) * 100) : 100;
        attendanceMap[att._id.toString()] = rate;
    });

    const enrichedStudents = students.map(s => ({
        ...s,
        attendancePercentage: attendanceMap[s._id.toString()] ?? 100
    }));

    return ApiResponse.success(res, enrichedStudents, 'Faculty students retrieved', 200, {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
    });
}));

module.exports = router;
