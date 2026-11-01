const express = require('express');
const router = express.Router();
const {
    getDepartments,
    createDepartment,
    updateDepartment,
    getCourses,
    createCourse,
    getSubjects,
    createSubject,
    getFacultyAssignments,
    createFacultyAssignment,
    getStudentRegistrations,
    registerStudentSubject,
    getMarks,
    recordMarks
} = require('../controllers/academicController');
const { protect, admin, faculty, authorize } = require('../middleware/authMiddleware');

// Departments
router.route('/departments')
    .get(protect, getDepartments)
    .post(protect, admin, createDepartment);
router.route('/departments/:id')
    .put(protect, admin, updateDepartment);

// Courses
router.route('/courses')
    .get(protect, getCourses)
    .post(protect, admin, createCourse);

// Subjects
router.route('/subjects')
    .get(protect, getSubjects)
    .post(protect, faculty, createSubject);

// Faculty Assignments
router.route('/faculty-assignments')
    .get(protect, faculty, getFacultyAssignments)
    .post(protect, admin, createFacultyAssignment);

// Student Registrations
router.route('/student-registrations')
    .get(protect, getStudentRegistrations)
    .post(protect, admin, registerStudentSubject);

// Marks
router.route('/marks')
    .get(protect, getMarks)
    .post(protect, faculty, recordMarks);

module.exports = router;
