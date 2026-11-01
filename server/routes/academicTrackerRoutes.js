const express = require('express');
const router = express.Router();
const { logActivity, getSubjectActivities, getRecentActivities } = require('../controllers/academicTrackerController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.use(protect, faculty);

router.post('/', logActivity);
router.get('/recent', getRecentActivities);
router.get('/:subjectId', getSubjectActivities);

module.exports = router;
