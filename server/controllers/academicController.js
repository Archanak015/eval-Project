const Department = require('../models/Department');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const FacultyAssignment = require('../models/FacultyAssignment');
const StudentRegistration = require('../models/StudentRegistration');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Result = require('../models/Result');
const Timetable = require('../models/Timetable');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const academicService = require('../services/academicService');

// ==========================================
// 1. DEPARTMENTS CONTROLLERS
// ==========================================
exports.getDepartments = asyncHandler(async (req, res) => {
    const result = await academicService.queryWithPagination(
        Department,
        req.query,
        ['name', 'code', 'description'],
        [{ path: 'headOfDepartment', select: 'employeeId designation' }]
    );
    return ApiResponse.success(res, result.data, 'Departments retrieved successfully', 200, result.pagination);
});

exports.createDepartment = asyncHandler(async (req, res) => {
    const { name, code, description, headOfDepartment } = req.body;
    if (!name || !code) {
        return ApiResponse.error(res, 'Department name and unique code are required', 400);
    }

    const existing = await Department.findOne({
        $or: [{ code: code.trim().toUpperCase() }, { name: name.trim() }]
    });
    if (existing) {
        return ApiResponse.error(res, 'Department with this name or code already exists', 409);
    }

    const dept = await Department.create({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description,
        headOfDepartment,
        createdBy: req.user._id
    });

    return ApiResponse.success(res, dept, 'Department created successfully', 201);
});

exports.updateDepartment = asyncHandler(async (req, res) => {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dept) return ApiResponse.error(res, 'Department not found', 404);
    return ApiResponse.success(res, dept, 'Department updated successfully');
});

// ==========================================
// 2. COURSES CONTROLLERS
// ==========================================
exports.getCourses = asyncHandler(async (req, res) => {
    const result = await academicService.queryWithPagination(
        Course,
        req.query,
        ['name', 'code', 'duration'],
        [{ path: 'department', select: 'name code' }]
    );
    return ApiResponse.success(res, result.data, 'Courses retrieved successfully', 200, result.pagination);
});

exports.createCourse = asyncHandler(async (req, res) => {
    const { name, code, duration, department, totalSemesters } = req.body;
    if (!name || !code) {
        return ApiResponse.error(res, 'Course name and course code are required', 400);
    }

    const existing = await Course.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
        return ApiResponse.error(res, 'Course code already exists', 409);
    }

    const course = await Course.create({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        duration,
        department,
        totalSemesters: totalSemesters || 8,
        createdBy: req.user._id
    });

    return ApiResponse.success(res, course, 'Course created successfully', 201);
});

// ==========================================
// 3. SUBJECTS CONTROLLERS
// ==========================================
exports.getSubjects = asyncHandler(async (req, res) => {
    const result = await academicService.queryWithPagination(
        Subject,
        req.query,
        ['name', 'code', 'department', 'course'],
        [
            { path: 'faculty', select: 'name email' },
            { path: 'courseRef', select: 'name code' },
            { path: 'departmentRef', select: 'name code' }
        ]
    );
    return ApiResponse.success(res, result.data, 'Subjects retrieved successfully', 200, result.pagination);
});

exports.createSubject = asyncHandler(async (req, res) => {
    const { name, code, course, department, semester, credits, maxMarks, internalMarks, externalMarks, faculty } = req.body;
    if (!name || !code || !course || !department || !semester) {
        return ApiResponse.error(res, 'Name, code, course, department, and semester are required', 400);
    }

    const existing = await Subject.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
        return ApiResponse.error(res, 'Subject code already exists', 409);
    }

    const subject = await Subject.create({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        course,
        department,
        semester: Number(semester),
        credits: Number(credits) || 4,
        maxMarks: Number(maxMarks) || 100,
        internalMarks: Number(internalMarks) || 40,
        externalMarks: Number(externalMarks) || 60,
        faculty,
        createdBy: req.user._id
    });

    return ApiResponse.success(res, subject, 'Subject created successfully', 201);
});

// ==========================================
// 4. FACULTY ASSIGNMENT CONTROLLERS
// ==========================================
exports.getFacultyAssignments = asyncHandler(async (req, res) => {
    const baseQuery = {};
    // If faculty, restrict to their assignments
    if (req.user.role === 'faculty') {
        baseQuery.facultyUser = req.user._id;
    }

    const result = await academicService.queryWithPagination(
        FacultyAssignment,
        req.query,
        ['section', 'roleInSubject'],
        [
            { path: 'faculty', select: 'employeeId department designation' },
            { path: 'facultyUser', select: 'name email' },
            { path: 'subject', select: 'name code credits semester' },
            { path: 'course', select: 'name code' },
            { path: 'department', select: 'name code' }
        ],
        baseQuery
    );
    return ApiResponse.success(res, result.data, 'Faculty assignments retrieved', 200, result.pagination);
});

exports.createFacultyAssignment = asyncHandler(async (req, res) => {
    const { facultyId, subjectId, courseId, departmentId, semester, section, academicYearId, roleInSubject } = req.body;

    if (!facultyId || !subjectId || !semester) {
        return ApiResponse.error(res, 'facultyId, subjectId, and semester are required', 400);
    }

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return ApiResponse.error(res, 'Faculty profile not found', 404);

    const subject = await Subject.findById(subjectId);
    if (!subject) return ApiResponse.error(res, 'Subject not found in curriculum', 404);

    const assignment = await FacultyAssignment.findOneAndUpdate(
        { faculty: facultyId, subject: subjectId, section: section || 'A', semester: Number(semester) },
        {
            faculty: facultyId,
            facultyUser: faculty.user,
            subject: subjectId,
            course: courseId || subject.courseRef,
            department: departmentId || subject.departmentRef,
            semester: Number(semester),
            section: section || 'A',
            academicYear: academicYearId,
            roleInSubject: roleInSubject || 'Primary Lecturer',
            createdBy: req.user._id,
            status: 'Active',
            isActive: true
        },
        { upsert: true, new: true, runValidators: true }
    );

    // Keep faculty and subject models synchronized
    if (!faculty.assignedSubjects.includes(subjectId)) {
        faculty.assignedSubjects.push(subjectId);
        await faculty.save();
    }
    subject.faculty = faculty.user;
    subject.assignedFaculty = faculty._id;
    await subject.save();

    return ApiResponse.success(res, assignment, 'Faculty officially assigned to subject', 201);
});

// ==========================================
// 5. STUDENT REGISTRATION CONTROLLERS
// ==========================================
exports.getStudentRegistrations = asyncHandler(async (req, res) => {
    const baseQuery = {};
    if (req.user.role === 'student') {
        baseQuery.studentUser = req.user._id;
    } else if (req.user.role === 'faculty') {
        // Faculty only sees registrations for subjects assigned to them
        const myAssignments = await FacultyAssignment.find({ facultyUser: req.user._id }).select('subject section semester');
        const allowedSubjectIds = myAssignments.map(a => a.subject);
        baseQuery.subject = { $in: allowedSubjectIds };
    }

    const result = await academicService.queryWithPagination(
        StudentRegistration,
        req.query,
        ['section', 'registrationType'],
        [
            { path: 'student', select: 'enrollmentNo usn department semester section' },
            { path: 'studentUser', select: 'name email' },
            { path: 'subject', select: 'name code credits semester' },
            { path: 'course', select: 'name code' }
        ],
        baseQuery
    );
    return ApiResponse.success(res, result.data, 'Student registrations retrieved', 200, result.pagination);
});

exports.registerStudentSubject = asyncHandler(async (req, res) => {
    const { studentId, subjectId, semester, section, academicYearId, registrationType } = req.body;

    if (!studentId || !subjectId) {
        return ApiResponse.error(res, 'studentId and subjectId are required', 400);
    }

    const student = await Student.findById(studentId);
    if (!student) return ApiResponse.error(res, 'Student profile not found', 404);

    const subject = await Subject.findById(subjectId);
    if (!subject) return ApiResponse.error(res, 'Subject not found in curriculum', 404);

    const registration = await StudentRegistration.findOneAndUpdate(
        { student: studentId, subject: subjectId },
        {
            student: studentId,
            studentUser: student.user,
            subject: subjectId,
            course: student.course,
            department: student.departmentRef,
            semester: semester ? Number(semester) : student.semester,
            section: section || student.section || 'A',
            academicYear: academicYearId,
            registrationType: registrationType || 'Core',
            approvalStatus: 'Approved',
            createdBy: req.user._id,
            status: 'Active',
            isActive: true
        },
        { upsert: true, new: true, runValidators: true }
    );

    // Keep student enrolledSubjects in sync
    if (!student.enrolledSubjects.includes(subjectId)) {
        student.enrolledSubjects.push(subjectId);
        await student.save();
    }

    return ApiResponse.success(res, registration, 'Student officially registered for subject', 201);
});

// ==========================================
// 6. MARKS & GRADING CONTROLLERS
// ==========================================
exports.getMarks = asyncHandler(async (req, res) => {
    const baseQuery = {};
    if (req.user.role === 'student') {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) return ApiResponse.error(res, 'Student profile not found', 404);
        baseQuery.student = student._id;
    }

    const result = await academicService.queryWithPagination(
        Marks,
        req.query,
        ['examType', 'remarks'],
        [
            { path: 'student', select: 'enrollmentNo usn' },
            { path: 'subject', select: 'name code credits semester' },
            { path: 'examination', select: 'name totalMarks date' }
        ],
        baseQuery
    );
    return ApiResponse.success(res, result.data, 'Marks retrieved successfully', 200, result.pagination);
});

exports.recordMarks = asyncHandler(async (req, res) => {
    const { studentId, subjectId, examType, marksObtained, totalMarks, examinationId, remarks } = req.body;

    if (!studentId || !subjectId || marksObtained === undefined) {
        return ApiResponse.error(res, 'studentId, subjectId, and marksObtained are required', 400);
    }

    // Faculty check: can only upload marks for assigned subjects
    if (req.user.role === 'faculty') {
        const subject = await Subject.findById(subjectId);
        const isAssigned = subject?.faculty?.toString() === req.user._id.toString();
        if (!isAssigned) {
            return ApiResponse.error(res, 'HTTP 403 Forbidden: You can only record marks for assigned subjects', 403);
        }
    }

    const markRecord = await Marks.findOneAndUpdate(
        { student: studentId, subject: subjectId, ...(examinationId ? { examination: examinationId } : { examType: examType || 'ISA 1' }) },
        {
            student: studentId,
            subject: subjectId,
            examination: examinationId,
            examType: examType || 'ISA 1',
            marksObtained: Number(marksObtained),
            totalMarks: Number(totalMarks) || 100,
            faculty: req.user._id,
            remarks,
            createdBy: req.user._id,
            status: 'Submitted',
            isActive: true
        },
        { upsert: true, new: true, runValidators: true }
    );

    return ApiResponse.success(res, markRecord, 'Evaluation marks recorded successfully', 201);
});
