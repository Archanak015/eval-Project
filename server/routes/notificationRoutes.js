const express = require('express');
const router = express.Router();
const { createNotice, getNotices } = require('../controllers/notificationController');
const { protect, admin, faculty } = require('../middleware/authMiddleware');

router.post('/', protect, faculty, createNotice);
router.get('/', protect, getNotices);

module.exports = router;
