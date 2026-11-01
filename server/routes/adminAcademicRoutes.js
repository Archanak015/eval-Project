const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const Course = require('../models/Course');
const AcademicYear = require('../models/AcademicYear');
const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// ==========================================
// 1. DEPARTMENT MANAGEMENT
// ==========================================
router.route('/departments')
    .get(protect, asyncHandler(async (req, res) => {
        const departments = await Department.find().sort('name').lean();
        return ApiResponse.success(res, departments, 'Departments fetched');
    }))
    .post(protect, admin, asyncHandler(async (req, res) => {
        const { name, code, description } = req.body;
        if (!name || !code) return ApiResponse.error(res, 'Department name and code are required', 400);

        const existing = await Department.findOne({ $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }] });
        if (existing) return ApiResponse.error(res, 'Department name or code already exists', 400);

        const dept = await Department.create({
            name: name.trim(),
            code: code.trim().toUpperCase(),
            description
        });
        return ApiResponse.success(res, dept, 'Department created successfully', 201);
    }));

router.route('/departments/:id')
    .put(protect, admin, asyncHandler(async (req, res) => {
        const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!dept) return ApiResponse.error(res, 'Department not found', 404);
        return ApiResponse.success(res, dept, 'Department updated successfully');
    }))
    .delete(protect, admin, asyncHandler(async (req, res) => {
        const dept = await Department.findByIdAndDelete(req.params.id);
        if (!dept) return ApiResponse.error(res, 'Department not found', 404);
        return ApiResponse.success(res, null, 'Department deleted successfully');
    }));

// ==========================================
// 2. ACADEMIC YEARS
// ==========================================
router.route('/academic-years')
    .get(protect, asyncHandler(async (req, res) => {
        const years = await AcademicYear.find().sort('-year').lean();
        return ApiResponse.success(res, years, 'Academic years fetched');
    }))
    .post(protect, admin, asyncHandler(async (req, res) => {
        const { year, isCurrent, startDate, endDate } = req.body;
        if (!year) return ApiResponse.error(res, 'Academic year is required (e.g. 2026-27)', 400);

        if (isCurrent) {
            await AcademicYear.updateMany({}, { isCurrent: false });
        }

        const created = await AcademicYear.create({
            year: year.trim(),
            isCurrent: !!isCurrent,
            startDate,
            endDate
        });
        return ApiResponse.success(res, created, 'Academic year created', 201);
    }));

// ==========================================
// 3. FACULTY ASSIGNMENT SYSTEM (ADMIN ONLY)
// ==========================================
router.post('/assign-faculty', protect, admin, asyncHandler(async (req, res) => {
    const { facultyId, subjectIds, courseCode, department, semester, section, academicYear } = req.body;

    if (!facultyId || !subjectIds || !Array.isArray(subjectIds) || subjectIds.length === 0) {
        return ApiResponse.error(res, 'facultyId and subjectIds array are required', 400);
    }

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return ApiResponse.error(res, 'Faculty record not found', 404);

    // Update Faculty record assignments
    if (department) faculty.department = department;
    if (academicYear) faculty.academicYear = academicYear;
    
    // Add unique subjects
    subjectIds.forEach(sid => {
        if (!faculty.assignedSubjects.includes(sid)) {
            faculty.assignedSubjects.push(sid);
        }
    });

    if (courseCode && !faculty.courseCodes.includes(courseCode)) {
        faculty.courseCodes.push(courseCode);
    }
    if (semester && !faculty.semesters.includes(Number(semester))) {
        faculty.semesters.push(Number(semester));
    }
    if (section && !faculty.sections.includes(section)) {
        faculty.sections.push(section);
    }

    await faculty.save();

    // Link assigned faculty on Subject models
    await Subject.updateMany(
        { _id: { $in: subjectIds } },
        { faculty: faculty.user, assignedFaculty: faculty._id }
    );

    const updated = await Faculty.findById(facultyId)
        .populate('user', 'name email')
        .populate('assignedSubjects', 'name code credits semester department')
        .lean();

    return ApiResponse.success(res, updated, 'Faculty assigned to curriculum subjects successfully');
}));

// ==========================================
// 4. STUDENT SUBJECT REGISTRATION & APPROVAL
// ==========================================
router.post('/register-subjects', protect, admin, asyncHandler(async (req, res) => {
    const { studentId, subjectIds, semester, section, department, courseCode, academicYear } = req.body;

    if (!studentId || !subjectIds || !Array.isArray(subjectIds)) {
        return ApiResponse.error(res, 'studentId and subjectIds array are required', 400);
    }

    const student = await Student.findById(studentId);
    if (!student) return ApiResponse.error(res, 'Student profile not found', 404);

    student.enrolledSubjects = subjectIds;
    if (semester) student.semester = Number(semester);
    if (section) student.section = section;
    if (department) student.department = department;
    if (courseCode) student.courseCode = courseCode;
    if (academicYear) student.academicYear = academicYear;

    await student.save();

    const populatedStudent = await Student.findById(studentId)
        .populate('user', 'name email')
        .populate('enrolledSubjects', 'name code credits semester department')
        .lean();

    return ApiResponse.success(res, populatedStudent, 'Student subjects officially registered');
}));

// ==========================================
// 5. MASTER ACADEMIC METRICS (ADMIN DASHBOARD)
// ==========================================
router.get('/structure-overview', protect, admin, asyncHandler(async (req, res) => {
    const [departments, courses, subjects, faculties, students, academicYears] = await Promise.all([
        Department.find().sort('name').lean(),
        Course.find().sort('name').lean(),
        Subject.find().populate('faculty', 'name').sort('code').lean(),
        Faculty.find().populate('user', 'name email').populate('assignedSubjects', 'name code').lean(),
        Student.find().populate('user', 'name email').populate('enrolledSubjects', 'name code').limit(100).lean(),
        AcademicYear.find().sort('-year').lean()
    ]);

    return ApiResponse.success(res, {
        departments,
        courses,
        subjects,
        faculties,
        students,
        academicYears
    }, 'Academic master structure loaded');
}));

module.exports = router;
