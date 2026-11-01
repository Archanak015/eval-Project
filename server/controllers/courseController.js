const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiFeatures = require('../utils/apiFeatures');

// --- Courses ---
exports.createCourse = asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    
    // Log activity
    if (req.user) {
        await Activity.create({
            user: req.user._id,
            action: 'COURSE_CREATED',
            module: 'ACADEMICS',
            details: `Course created: ${course.name} (${course.code})`
        }).catch(err => console.error(err.message));
    }

    return ApiResponse.success(res, course, 'Course created successfully', 201);
});

exports.getAllCourses = asyncHandler(async (req, res) => {
    const features = new ApiFeatures(Course.find(), req.query)
        .search(['name', 'code'])
        .sort('name');

    const total = await Course.countDocuments(features.query.getFilter());
    
    // Optional pagination if page param provided
    if (req.query.page) {
        features.paginate(10);
    }

    const courses = await features.query.lean();
    return ApiResponse.success(res, courses, 'Courses fetched', 200, {
        total,
        page: features.page || 1,
        limit: features.limit || total
    });
});

// --- Subjects ---
exports.createSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.create(req.body);
    return ApiResponse.success(res, subject, 'Subject created successfully', 201);
});

exports.getAllSubjects = asyncHandler(async (req, res) => {
    const features = new ApiFeatures(Subject.find(), req.query)
        .search(['name', 'code', 'department'])
        .filter(['department', 'semester', 'course'])
        .sort('code');

    const total = await Subject.countDocuments(features.query.getFilter());

    if (req.query.page) {
        features.paginate(15);
    }

    const subjects = await features.query.populate('faculty', 'name email').lean();
    return ApiResponse.success(res, subjects, 'Subjects fetched', 200, {
        total,
        page: features.page || 1,
        limit: features.limit || total
    });
});

exports.getSubjectInsights = asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId);
    if (!subject) {
        return ApiResponse.error(res, 'Subject not found', 404);
    }

    const students = await Student.find({
        department: subject.department,
        semester: subject.semester
    }).populate('user', 'name email');

    const totalStudents = students.length;

    // Attendance stats
    const attendanceRecords = await Attendance.find({ subject: subjectId });
    let totalClasses = attendanceRecords.length;
    let attendancePercentage = 0;

    if (totalClasses > 0 && totalStudents > 0) {
        let totalPresents = 0;
        attendanceRecords.forEach(att => {
            att.records.forEach(rec => {
                if (rec.status === 'Present') totalPresents++;
            });
        });
        attendancePercentage = Math.round((totalPresents / (totalClasses * totalStudents)) * 100);
    }

    // Exam stats
    const exams = await Exam.find({ subject: subjectId });
    let totalExams = exams.length;
    let averageMarks = 0;

    if (totalExams > 0) {
        const examIds = exams.map(e => e._id);
        const results = await Result.find({ exam: { $in: examIds } });
        if (results.length > 0) {
            const sumMarks = results.reduce((acc, curr) => acc + curr.marksObtained, 0);
            averageMarks = Math.round(sumMarks / results.length);
        }
    }

    return ApiResponse.success(res, {
        subject,
        stats: {
            totalStudents,
            totalClasses,
            attendancePercentage,
            totalExams,
            averageMarks
        }
    }, 'Subject insights retrieved');
});
