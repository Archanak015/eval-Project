const express = require('express');
const router = express.Router();
const { createExam, getExams, uploadMarks, getStudentResults, getExamResults } = require('../controllers/examController');
const { protect, admin, faculty } = require('../middleware/authMiddleware');
const { facultyScope } = require('../middleware/facultyAuthorization');

router.post('/exams', protect, faculty, facultyScope, createExam);
router.get('/exams', protect, getExams); // Public to auth users? Or filtered?

router.post('/marks', protect, faculty, facultyScope, uploadMarks);
router.get('/my-results', protect, getStudentResults);
router.get('/results/:examId', protect, faculty, facultyScope, getExamResults);

module.exports = router;
