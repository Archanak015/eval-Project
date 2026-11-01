const express = require('express');
const router = express.Router();
const { createSlot, getFacultyTimetable, deleteSlot } = require('../controllers/timetableController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.use(protect, faculty);

router.get('/', getFacultyTimetable);
router.post('/', createSlot);
router.delete('/:id', deleteSlot);

module.exports = router;
