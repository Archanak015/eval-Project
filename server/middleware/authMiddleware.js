const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
            }

            req.user = user;
            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
            }
            return res.status(401).json({ success: false, message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' });
    }
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden: Admin role required' });
};

exports.faculty = (req, res, next) => {
    if (req.user && (req.user.role === 'faculty' || req.user.role === 'admin')) {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden: Faculty or Admin role required' });
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Role '${req.user ? req.user.role : 'Guest'}' is not authorized.`
            });
        }
        next();
    };
};
