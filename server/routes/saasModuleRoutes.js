const express = require('express');
const router = express.Router();
const FeeStructure = require('../models/FeeStructure');
const FeeTransaction = require('../models/FeeTransaction');
const Hostel = require('../models/Hostel');
const TransportRoute = require('../models/TransportRoute');
const ComplianceAudit = require('../models/ComplianceAudit');
const EmployeePayroll = require('../models/EmployeePayroll');
const AssetInventory = require('../models/AssetInventory');
const Student = require('../models/Student');
const { protect, admin, faculty, student } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// ==========================================
// 1. FINANCE & FEE APIS (PHASE 19)
// ==========================================
router.get('/fees/structures', protect, asyncHandler(async (req, res) => {
    const structures = await FeeStructure.find({ isActive: true })
        .populate('course', 'name code')
        .populate('department', 'name code')
        .lean();
    return ApiResponse.success(res, structures, 'Fee structures retrieved');
}));

router.post('/fees/structures', protect, admin, asyncHandler(async (req, res) => {
    const structure = await FeeStructure.create({ ...req.body, createdBy: req.user._id });
    return ApiResponse.success(res, structure, 'Fee structure created successfully', 201);
}));

router.get('/fees/my-status', protect, student, asyncHandler(async (req, res) => {
    const studentDoc = await Student.findOne({ user: req.user._id }).populate('course', 'name code').lean();
    if (!studentDoc) return ApiResponse.error(res, 'Student profile not found', 404);

    const feeStructure = await FeeStructure.findOne({
        $or: [{ course: studentDoc.course?._id }, { semester: studentDoc.semester }]
    }).lean() || {
        totalAmount: 57500,
        components: { tuitionFee: 45000, examinationFee: 2500, libraryFee: 1500, laboratoryFee: 3500, cautionDeposit: 5000 }
    };

    const transactions = await FeeTransaction.find({ studentUser: req.user._id }).sort('-paymentDate').lean();
    const totalPaid = transactions.reduce((acc, t) => acc + (t.amountPaid || 0), 0);
    const balanceDue = Math.max(0, feeStructure.totalAmount - totalPaid);

    return ApiResponse.success(res, {
        student: studentDoc,
        feeStructure,
        transactions,
        totalPayable: feeStructure.totalAmount,
        totalPaid,
        balanceDue,
        isFullyPaid: balanceDue === 0
    }, 'Student fee statement retrieved');
}));

router.post('/fees/pay', protect, student, asyncHandler(async (req, res) => {
    const { amount, paymentMethod, feeStructureId } = req.body;
    const studentDoc = await Student.findOne({ user: req.user._id });

    const transaction = await FeeTransaction.create({
        receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
        student: studentDoc?._id,
        studentUser: req.user._id,
        feeStructure: feeStructureId,
        semester: studentDoc?.semester || 5,
        amountPaid: Number(amount),
        totalPayable: Number(amount),
        paymentMethod: paymentMethod || 'Online (UPI / Gateway)',
        paymentGatewayReference: `GATEWAY_MOCK_${Date.now()}`,
        status: 'Paid'
    });

    return ApiResponse.success(res, transaction, 'Fee payment processed and official receipt generated', 201);
}));

// ==========================================
// 2. HR & PAYROLL APIS (PHASE 20)
// ==========================================
router.get('/hr/payrolls', protect, asyncHandler(async (req, res) => {
    const payrolls = await EmployeePayroll.find({ isActive: true }).sort('-createdAt').lean();
    return ApiResponse.success(res, payrolls, 'HR & Payroll records retrieved');
}));

router.post('/hr/payrolls', protect, admin, asyncHandler(async (req, res) => {
    const record = await EmployeePayroll.create({ ...req.body, createdBy: req.user._id });
    return ApiResponse.success(res, record, 'Salary slip & employee payroll created', 201);
}));

// ==========================================
// 3. HOSTEL MANAGEMENT APIS (PHASE 21)
// ==========================================
router.get('/hostels', protect, asyncHandler(async (req, res) => {
    const hostels = await Hostel.find({ isActive: true }).lean();
    return ApiResponse.success(res, hostels, 'Hostel blocks retrieved');
}));

router.post('/hostels', protect, admin, asyncHandler(async (req, res) => {
    const hostel = await Hostel.create(req.body);
    return ApiResponse.success(res, hostel, 'Hostel block registered', 201);
}));

// ==========================================
// 4. TRANSPORT FLEET APIS (PHASE 22)
// ==========================================
router.get('/transport', protect, asyncHandler(async (req, res) => {
    const routes = await TransportRoute.find({ isActive: true }).lean();
    return ApiResponse.success(res, routes, 'Transport routes retrieved');
}));

router.post('/transport', protect, admin, asyncHandler(async (req, res) => {
    const route = await TransportRoute.create(req.body);
    return ApiResponse.success(res, route, 'Transport route registered', 201);
}));

// ==========================================
// 5. ASSET & INVENTORY APIS (PHASE 23)
// ==========================================
router.get('/inventory', protect, asyncHandler(async (req, res) => {
    const assets = await AssetInventory.find({ isActive: true }).sort('-createdAt').lean();
    return ApiResponse.success(res, assets, 'Asset & equipment inventory retrieved');
}));

router.post('/inventory', protect, admin, asyncHandler(async (req, res) => {
    const asset = await AssetInventory.create({ ...req.body, createdBy: req.user._id });
    return ApiResponse.success(res, asset, 'Asset logged into university register', 201);
}));

// ==========================================
// 6. ACCREDITATION & NAAC COMPLIANCE (PHASE 24)
// ==========================================
router.get('/compliance/audits', protect, asyncHandler(async (req, res) => {
    const audits = await ComplianceAudit.find({ isActive: true }).lean();
    return ApiResponse.success(res, audits, 'Compliance & accreditation criteria retrieved');
}));

router.post('/compliance/audits', protect, admin, asyncHandler(async (req, res) => {
    const audit = await ComplianceAudit.create(req.body);
    return ApiResponse.success(res, audit, 'Accreditation criteria recorded', 201);
}));

module.exports = router;
