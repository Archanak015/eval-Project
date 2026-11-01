const express = require('express');
const router = express.Router();
const { markAttendance, getEligibleStudents, getStudentAttendance, getAttendanceBySubject, getStudentByEnrollment } = require('../controllers/attendanceController');
const { protect, faculty } = require('../middleware/authMiddleware');
const { facultyScope } = require('../middleware/facultyAuthorization');

// Faculty Routes with Authorization Scoping
router.get('/students/:subjectId', protect, faculty, facultyScope, getEligibleStudents);
router.get('/student/:enrollmentNo', protect, faculty, facultyScope, getStudentByEnrollment);
router.post('/mark', protect, faculty, facultyScope, markAttendance);
router.get('/history/:subjectId', protect, faculty, facultyScope, getAttendanceBySubject);

// Student Routes
router.get('/my-attendance', protect, getStudentAttendance);

module.exports = router;
