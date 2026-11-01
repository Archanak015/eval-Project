const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiFeatures = require('../utils/apiFeatures');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Auto-creates notifications for connected events
const notifyUser = async (userId, title, message) => {
    try {
        await Notification.create({
            title,
            message,
            targetRole: 'all',
            sender: userId,
            readBy: []
        });
    } catch (e) {
        console.error('Notification trigger error:', e.message);
    }
};

exports.register = asyncHandler(async (req, res) => {
    const { 
        name, 
        email, 
        password, 
        role, 
        enrollmentNo, 
        department, 
        semester, 
        employeeId,
        courseId,
        academicYear
    } = req.body;

    if (!name || !email || !password) {
        return ApiResponse.error(res, 'Name, email, and password are required', 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return ApiResponse.error(res, 'User already exists with this email', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'student'
    });

    if (role === 'student') {
        // Resolve Course: find provided courseId or assign first available course
        let enrolledCourse = null;
        if (courseId) {
            enrolledCourse = await Course.findById(courseId);
        }
        if (!enrolledCourse) {
            enrolledCourse = await Course.findOne();
        }

        const studentDept = department || (enrolledCourse ? enrolledCourse.name : 'Computer Science');
        const studentSem = Number(semester) || 1;

        // Auto-discover subjects matching department & semester for instant onboarding
        const matchingSubjects = await Subject.find({
            $or: [
                { department: new RegExp(`^${studentDept.trim()}$`, 'i'), semester: studentSem },
                { semester: studentSem }
            ]
        });

        const subjectIds = matchingSubjects.map(s => s._id);

        await Student.create({
            user: user._id,
            enrollmentNo: enrollmentNo || `STU-${Date.now().toString().slice(-6)}`,
            department: studentDept,
            semester: studentSem,
            academicYear: academicYear || '2026-2027',
            course: enrolledCourse ? enrolledCourse._id : null,
            courses: enrolledCourse ? [enrolledCourse._id] : [],
            enrolledSubjects: subjectIds
        });

        // Welcome notification
        await notifyUser(user._id, 'Welcome to UniConnect', `Your student profile has been created and registered in ${enrolledCourse ? enrolledCourse.name : studentDept}.`);

    } else if (role === 'faculty') {
        await Faculty.create({
            user: user._id,
            employeeId: employeeId || `FAC-${Date.now().toString().slice(-4)}`,
            department: department || 'Computer Science'
        });

        await notifyUser(user._id, 'Faculty Onboarding', `Welcome Dr./Prof. ${name}! Your faculty profile is ready.`);
    }

    // Audit Activity
    await Activity.create({
        user: user._id,
        action: 'LOGIN',
        module: 'AUTH',
        details: `Account created and onboarded as ${user.role} (${user.email})`,
        ipAddress: req.ip || '127.0.0.1'
    }).catch(err => console.error(err.message));

    return ApiResponse.success(res, {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
    }, 'User registered successfully', 201);
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return ApiResponse.error(res, 'Please provide both email and password', 400);
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        await Activity.create({
            user: user._id,
            action: 'LOGIN',
            module: 'AUTH',
            details: `User signed in successfully`,
            ipAddress: req.ip || '127.0.0.1'
        }).catch(err => console.error(err.message));

        return ApiResponse.success(res, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        }, 'Login successful');
    } else {
        return ApiResponse.error(res, 'Invalid email or password', 401);
    }
});

exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password').lean();
    let profile = null;

    if (user.role === 'student') {
        profile = await Student.findOne({ user: user._id })
            .populate('course', 'name code duration')
            .populate('enrolledSubjects', 'name code credits semester department')
            .lean();
    } else if (user.role === 'faculty') {
        profile = await Faculty.findOne({ user: user._id })
            .populate('assignedCourses', 'name code duration')
            .populate('assignedSubjects', 'name code credits semester department course')
            .lean();

        // Also fetch all subjects where this faculty is assigned on the Subject model
        const taughtSubjects = await Subject.find({
            $or: [
                { faculty: user._id },
                { _id: { $in: profile?.assignedSubjects || [] } }
            ]
        }).lean();

        // Also find all courses linked to these subjects or departments
        const taughtCourses = await Course.find({
            $or: [
                { _id: { $in: profile?.assignedCourses || [] } },
                { department: profile?.department }
            ]
        }).lean();

        if (profile) {
            profile.assignedSubjectsList = taughtSubjects;
            profile.assignedCoursesList = taughtCourses;
        } else {
            profile = {
                user: user._id,
                department: 'Computer Science',
                employeeId: 'EMP-FACULTY',
                designation: 'Assistant Professor',
                assignedSubjectsList: taughtSubjects,
                assignedCoursesList: taughtCourses
            };
        }
    }

    return ApiResponse.success(res, { user, profile }, 'Profile retrieved successfully');
});

exports.getUsersByRole = asyncHandler(async (req, res) => {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password').sort('-createdAt').lean();
    return ApiResponse.success(res, users, 'Users retrieved successfully');
});

// Filtered student directory based on calling user role and course
exports.getAllStudents = asyncHandler(async (req, res) => {
    let baseFilter = {};

    // If faculty, filter to students in faculty's department or assigned subjects
    if (req.user && req.user.role === 'faculty') {
        const facultyProfile = await Faculty.findOne({ user: req.user._id });
        if (facultyProfile && facultyProfile.department) {
            baseFilter.department = new RegExp(`^${facultyProfile.department.trim()}$`, 'i');
        }
    }

    const features = new ApiFeatures(Student.find(baseFilter), req.query)
        .search(['enrollmentNo'])
        .filter(['department', 'semester', 'course'])
        .sort('-createdAt');

    const total = await Student.countDocuments(features.query.getFilter());

    if (req.query.page) {
        features.paginate(15);
    }

    const students = await features.query
        .populate('user', 'name email')
        .populate('course', 'name code')
        .populate('enrolledSubjects', 'name code')
        .lean();

    return ApiResponse.success(res, students, 'Students retrieved successfully', 200, {
        page: features.page || 1,
        limit: features.limit || total,
        total,
        pages: Math.ceil(total / (features.limit || 15))
    });
});
