const express = require('express');
const router = express.Router();
const SmartAcademicEngine = require('../services/smartAcademicEngine');
const campusBus = require('../services/realtimeBus');
const Institution = require('../models/Institution');
const { protect, admin, faculty, student } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// ==========================================
// 1. AI & ACADEMIC PREDICTION APIS (PHASE 14)
// ==========================================
router.get('/ai/attendance-risk', protect, faculty, asyncHandler(async (req, res) => {
    const predictions = await SmartAcademicEngine.getAttendanceRiskPredictions();
    return ApiResponse.success(res, predictions, 'AI attendance risk predictions generated');
}));

router.get('/ai/performance-forecast/:studentId', protect, asyncHandler(async (req, res) => {
    const forecast = await SmartAcademicEngine.getStudentPerformanceForecast(req.params.studentId);
    return ApiResponse.success(res, forecast, 'Performance forecast & SGPA calculated');
}));

router.post('/ai/query', protect, asyncHandler(async (req, res) => {
    const { query } = req.body;
    if (!query) return ApiResponse.error(res, 'Natural language query text is required', 400);

    const result = await SmartAcademicEngine.processNaturalLanguageQuery(query);
    return ApiResponse.success(res, result, 'Smart query processed');
}));

// ==========================================
// 2. REAL-TIME EVENT STREAM (SSE) (PHASE 15)
// ==========================================
router.get('/realtime/stream', protect, (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const onNotice = (data) => {
        res.write(`event: notification\ndata: ${JSON.stringify(data)}\n\n`);
    };

    campusBus.on('CAMPUS_NOTIFICATION', onNotice);

    // Initial heartbeat
    res.write(`data: ${JSON.stringify({ status: 'CONNECTED', timestamp: new Date() })}\n\n`);

    req.on('close', () => {
        campusBus.off('CAMPUS_NOTIFICATION', onNotice);
    });
});

// ==========================================
// 3. MULTI-TENANT INSTITUTION APIS (PHASE 13)
// ==========================================
router.get('/institutions', protect, asyncHandler(async (req, res) => {
    const institutions = await Institution.find({ isActive: true }).lean();
    return ApiResponse.success(res, institutions, 'Institutions retrieved');
}));

router.post('/institutions', protect, admin, asyncHandler(async (req, res) => {
    const institution = await Institution.create(req.body);
    return ApiResponse.success(res, institution, 'Institution created successfully', 201);
}));

module.exports = router;
