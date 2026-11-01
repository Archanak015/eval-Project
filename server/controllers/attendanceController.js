const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// 1. Get Eligible Students for a subject (with strict faculty authorization & subject registration)
exports.getEligibleStudents = asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId);
    if (!subject) return ApiResponse.error(res, 'Subject not found', 404);

    // Faculty Authorization Check
    if (req.user.role === 'faculty') {
        const isAssigned = 
            subject.faculty?.toString() === req.user._id.toString() ||
            (req.facultyScope && req.facultyScope.assignedSubjectIds.some(id => id.toString() === subjectId.toString())) ||
            (req.facultyScope && req.facultyScope.departments.some(d => d.toLowerCase() === (subject.department || '').toLowerCase()));

        if (!isAssigned) {
            return ApiResponse.error(res, 'HTTP 403 Forbidden: You are not authorized to access students or mark attendance for this subject.', 403);
        }
    }

    // 1. Enrolled students who specifically registered for this subject
    let students = await Student.find({
        enrolledSubjects: subject._id
    }).populate('user', 'name email').lean();

    // 2. If subject registration is by department and semester cohort
    if (students.length === 0) {
        const deptRegex = new RegExp(`^${(subject.department || '').trim()}$`, 'i');
        students = await Student.find({
            department: deptRegex,
            semester: subject.semester
        }).populate('user', 'name email').lean();
    }

    // Return students matching authorized teaching assignment only
    return ApiResponse.success(res, students, students.length > 0 ? 'Eligible students loaded' : 'No students are registered for this subject.');
});

// 2. Mark or Upsert Lecture Attendance
exports.markAttendance = asyncHandler(async (req, res) => {
    const { subjectId, date, records } = req.body;

    if (!subjectId || !records || !Array.isArray(records)) {
        return ApiResponse.error(res, 'Subject ID and records array are required', 400);
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) return ApiResponse.error(res, 'Subject not found', 404);

    // Verify Faculty Authorization for Subject
    if (req.user.role === 'faculty') {
        const isAssigned = 
            subject.faculty?.toString() === req.user._id.toString() ||
            (req.facultyScope && req.facultyScope.assignedSubjectIds.some(id => id.toString() === subjectId.toString())) ||
            (req.facultyScope && req.facultyScope.departments.some(d => d.toLowerCase() === (subject.department || '').toLowerCase()));

        if (!isAssigned) {
            return ApiResponse.error(res, 'HTTP 403 Forbidden: You cannot mark attendance for an unassigned subject.', 403);
        }
    }

    const sessionDate = new Date(date);
    sessionDate.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ subject: subjectId, date: sessionDate });

    if (attendance) {
        attendance.records = records;
        await attendance.save();
    } else {
        attendance = await Attendance.create({
            subject: subjectId,
            date: sessionDate,
            faculty: req.user._id,
            records
        });
    }

    if (req.user) {
        await Activity.create({
            user: req.user._id,
            action: 'ATTENDANCE_MARKED',
            module: 'ATTENDANCE',
            details: `Marked attendance for ${records.length} students`
        }).catch(err => console.error(err.message));
    }

    return ApiResponse.success(res, attendance, 'Attendance recorded successfully', 201);
});

// 3. Get Attendance History for a subject
exports.getAttendanceBySubject = asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const history = await Attendance.find({ subject: subjectId })
        .populate('records.student', 'enrollmentNo')
        .sort({ date: -1 })
        .lean();

    return ApiResponse.success(res, history, 'Attendance history fetched');
});

// 4. Student self-attendance lookup
exports.getStudentAttendance = asyncHandler(async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return ApiResponse.error(res, 'Student profile not found', 404);

    const records = await Attendance.find({ 'records.student': student._id })
        .populate('subject', 'name code credits')
        .lean();

    return ApiResponse.success(res, records, 'Student attendance fetched');
});

// 5. Lookup individual student by enrollment number
exports.getStudentByEnrollment = asyncHandler(async (req, res) => {
    const { enrollmentNo } = req.params;
    const student = await Student.findOne({ enrollmentNo })
        .populate('user', 'name email')
        .lean();

    if (!student) {
        return ApiResponse.error(res, 'Student not found with this enrollment number', 404);
    }

    return ApiResponse.success(res, student, 'Student found');
});
