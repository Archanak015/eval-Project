const AcademicActivity = require('../models/AcademicActivity');
const Subject = require('../models/Subject');

exports.logActivity = async (req, res) => {
    try {
        console.log('Logging Activity Body:', req.body);
        const activity = await AcademicActivity.create({ ...req.body, faculty: req.user._id });
        res.status(201).json(activity);
    } catch (error) {
        console.error('ACTIVITY_TRACKER_ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getSubjectActivities = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const activities = await AcademicActivity.find({ subject: subjectId }).sort({ createdAt: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await AcademicActivity.find({ faculty: req.user._id })
            .populate('subject', 'name')
            .sort({ createdAt: -1 })
            .limit(5);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
