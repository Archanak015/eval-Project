const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Student = require('../models/Student');
const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// --- Exams ---
exports.createExam = asyncHandler(async (req, res) => {
    const exam = await Exam.create(req.body);

    if (req.user) {
        await Activity.create({
            user: req.user._id,
            action: 'EXAM_CREATED',
            module: 'EXAMINATION',
            details: `Exam scheduled: ${exam.name} for subject ${exam.subject}`
        }).catch(err => console.error(err.message));
    }

    return ApiResponse.success(res, exam, 'Exam created successfully', 201);
});

exports.getExams = asyncHandler(async (req, res) => {
    const exams = await Exam.find()
        .populate('subject', 'name code semester department')
        .sort('-date')
        .lean();
    return ApiResponse.success(res, exams, 'Exams retrieved successfully');
});

// --- Results ---
exports.uploadMarks = asyncHandler(async (req, res) => {
    const { examId, marks } = req.body; // marks = [{ studentId, marksObtained }]

    if (!examId || !Array.isArray(marks)) {
        return ApiResponse.error(res, 'examId and marks array are required', 400);
    }

    const exam = await Exam.findById(examId).populate('subject');
    if (!exam) {
        return ApiResponse.error(res, 'Exam not found', 404);
    }

    // Verify Faculty Authorization for Subject
    if (req.user.role === 'faculty') {
        const sub = exam.subject;
        const isAssigned = 
            sub?.faculty?.toString() === req.user._id.toString() ||
            (req.facultyScope && req.facultyScope.assignedSubjectIds.some(id => id.toString() === sub?._id?.toString())) ||
            (req.facultyScope && req.facultyScope.departments.some(d => d.toLowerCase() === (sub?.department || '').toLowerCase()));

        if (!isAssigned) {
            return ApiResponse.error(res, 'HTTP 403 Forbidden: You cannot upload marks for an unassigned subject or department.', 403);
        }
    }

    const operations = marks.map(record => ({
        updateOne: {
            filter: { exam: examId, student: record.studentId },
            update: { marksObtained: record.marksObtained },
            upsert: true
        }
    }));

    if (operations.length > 0) {
        await Result.bulkWrite(operations);
    }

    if (req.user) {
        await Activity.create({
            user: req.user._id,
            action: 'MARKS_UPLOADED',
            module: 'EXAMINATION',
            details: `Uploaded/updated marks for ${operations.length} students`
        }).catch(err => console.error(err.message));
    }

    return ApiResponse.success(res, { count: operations.length }, 'Marks uploaded successfully');
});

exports.getStudentResults = asyncHandler(async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
        return ApiResponse.error(res, 'Student profile not found', 404);
    }

    const results = await Result.find({ student: student._id })
        .populate({
            path: 'exam',
            populate: { path: 'subject', select: 'name code credits' }
        })
        .lean();

    return ApiResponse.success(res, results, 'Results retrieved');
});

exports.getExamResults = asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const results = await Result.find({ exam: examId })
        .populate({
            path: 'student',
            populate: { path: 'user', select: 'name email' }
        })
        .lean();

    return ApiResponse.success(res, results, 'Exam results retrieved');
});
