const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, createSubject, getAllSubjects, getSubjectInsights } = require('../controllers/courseController');
const { protect, admin, faculty } = require('../middleware/authMiddleware');

router.route('/courses').get(protect, getAllCourses).post(protect, admin, createCourse);
router.route('/subjects').get(protect, getAllSubjects).post(protect, faculty, createSubject);
router.get('/subjects/insights/:subjectId', protect, faculty, getSubjectInsights);

module.exports = router;
