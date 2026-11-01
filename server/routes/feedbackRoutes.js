const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Subject = require('../models/Subject');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const { protect, faculty, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// 1. Submit feedback (Students)
router.post('/', protect, asyncHandler(async (req, res) => {
    const { category, title, description, rating, isAnonymous, subjectId } = req.body;

    if (!category || !title || !description || !rating) {
        return ApiResponse.error(res, 'Category, title, description, and rating are required', 400);
    }

    let facultyId = null;
    if (subjectId) {
        const sub = await Subject.findById(subjectId);
        if (sub && sub.faculty) facultyId = sub.faculty;
    }

    const feedback = await Feedback.create({
        student: req.user._id,
        isAnonymous: Boolean(isAnonymous),
        category,
        title,
        description,
        rating: Math.min(5, Math.max(1, Number(rating))),
        subject: subjectId || null,
        faculty: facultyId
    });

    // Notify faculty/admin
    await Notification.create({
        title: `New Campus Feedback: ${category}`,
        message: `A new feedback "${title}" has been submitted with a rating of ${rating}/5.`,
        targetRole: 'faculty',
        sender: req.user._id
    }).catch(e => console.error(e.message));

    // Log Activity
    await Activity.create({
        user: req.user._id,
        action: 'COURSE_CREATED',
        module: 'ACADEMICS',
        details: `Student submitted feedback on ${category}`
    }).catch(e => console.error(e.message));

    return ApiResponse.success(res, feedback, 'Feedback submitted successfully', 201);
}));

// 2. Get feedback list (Filtered by role)
router.get('/', protect, asyncHandler(async (req, res) => {
    let filter = {};

    if (req.user.role === 'student') {
        // Students see their own feedback
        filter.student = req.user._id;
    } else if (req.user.role === 'faculty') {
        // Faculty see feedback assigned to them or their subjects
        filter.$or = [{ faculty: req.user._id }, { category: 'Subject' }];
    }
    // Admin sees all

    const feedbacks = await Feedback.find(filter)
        .populate('student', 'name email')
        .populate('subject', 'name code')
        .populate('respondedBy', 'name role')
        .sort('-createdAt')
        .lean();

    // Mask student identity if isAnonymous is true
    const sanitized = feedbacks.map(f => {
        if (f.isAnonymous && req.user.role !== 'admin') {
            return {
                ...f,
                student: { name: 'Anonymous Student', email: 'hidden@campus.edu' }
            };
        }
        return f;
    });

    return ApiResponse.success(res, sanitized, 'Feedback retrieved');
}));

// 3. Respond / Update Feedback status (Faculty / Admin)
router.patch('/:id/response', protect, faculty, asyncHandler(async (req, res) => {
    const { response, status } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        return ApiResponse.error(res, 'Feedback record not found', 404);
    }

    feedback.response = response;
    feedback.status = status || 'Resolved';
    feedback.respondedBy = req.user._id;
    feedback.respondedAt = new Date();
    await feedback.save();

    // Notify student about response
    await Notification.create({
        title: 'Feedback Response Received',
        message: `Your feedback "${feedback.title}" has been reviewed with response: "${response.slice(0, 80)}..."`,
        targetRole: 'student',
        sender: req.user._id
    }).catch(e => console.error(e.message));

    return ApiResponse.success(res, feedback, 'Feedback responded and updated successfully');
}));

// 4. Feedback Analytics (Dashboard integration)
router.get('/analytics', protect, asyncHandler(async (req, res) => {
    const [total, pending, resolved, avgRatingAgg, categoryBreakdown] = await Promise.all([
        Feedback.countDocuments(),
        Feedback.countDocuments({ status: { $ne: 'Resolved' } }),
        Feedback.countDocuments({ status: 'Resolved' }),
        Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]),
        Feedback.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
            { $project: { category: '$_id', count: 1, avgRating: { $round: ['$avgRating', 1] }, _id: 0 } },
            { $sort: { count: -1 } }
        ])
    ]);

    return ApiResponse.success(res, {
        total,
        pending,
        resolved,
        averageRating: avgRatingAgg[0]?.avgRating ? Number(avgRatingAgg[0].avgRating.toFixed(1)) : 4.5,
        categoryBreakdown
    }, 'Feedback analytics fetched');
}));

module.exports = router;
