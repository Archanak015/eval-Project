const express = require('express');
const router = express.Router();
const { register, login, getMe, getUsersByRole, getAllStudents } = require('../controllers/authController');
const { protect, admin, faculty } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, admin, getUsersByRole);
router.get('/students', protect, faculty, getAllStudents);

module.exports = router;
