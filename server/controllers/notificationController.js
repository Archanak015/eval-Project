const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiFeatures = require('../utils/apiFeatures');

exports.createNotice = asyncHandler(async (req, res) => {
    const { title, message, targetRole } = req.body;
    if (!title || !message) {
        return ApiResponse.error(res, 'Title and message are required', 400);
    }

    const notice = await Notification.create({
        title,
        message,
        targetRole: targetRole || 'all',
        sender: req.user._id
    });

    // Log Activity
    await Activity.create({
        user: req.user._id,
        action: 'NOTIFICATION_SENT',
        module: 'COMMUNICATION',
        details: `Notice posted: "${title}" for target role: ${targetRole || 'all'}`
    }).catch(err => console.error(err.message));

    return ApiResponse.success(res, notice, 'Notice published successfully', 201);
});

exports.getNotices = asyncHandler(async (req, res) => {
    const role = req.user ? req.user.role : 'all';
    const baseQuery = Notification.find({
        $or: [
            { targetRole: { $in: ['all', role] } },
            { sender: req.user ? req.user._id : null }
        ]
    });

    const features = new ApiFeatures(baseQuery, req.query)
        .search(['title', 'message'])
        .sort('-createdAt');

    const total = await Notification.countDocuments(features.query.getFilter());

    if (req.query.page) {
        features.paginate(10);
    }

    const notices = await features.query.populate('sender', 'name role').lean();
    return ApiResponse.success(res, notices, 'Notices fetched', 200, {
        total,
        page: features.page || 1,
        limit: features.limit || total
    });
});
