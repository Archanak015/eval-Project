const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Standard JWT Authentication Middleware
 */
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
            return res.status(401).json({ success: false, message: 'Not authorized, token validation failed.' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, authentication token required.' });
    }
};

/**
 * Super Admin Role Middleware
 */
exports.superAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden: Super Admin privilege required' });
};

/**
 * Admin Role Middleware (Super Admin or Admin)
 */
exports.admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden: Admin or Super Admin role required' });
};

/**
 * Faculty Role Middleware (Faculty, Admin, or Super Admin)
 */
exports.faculty = (req, res, next) => {
    if (req.user && (req.user.role === 'faculty' || req.user.role === 'admin' || req.user.role === 'superadmin')) {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden: Faculty or Administrative role required' });
};

/**
 * Student Role Middleware
 */
exports.student = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden: Student role required' });
};

/**
 * Flexible Multi-Role Authorizer
 * Usage: authorize('superadmin', 'admin', 'faculty', 'student')
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        // superadmin always has access
        if (req.user.role === 'superadmin' || roles.includes(req.user.role)) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource.`
        });
    };
};
