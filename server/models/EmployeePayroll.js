const mongoose = require('mongoose');

const EmployeePayrollSchema = new mongoose.Schema({
    employeeName: { type: String, required: true },
    employeeCode: { type: String, required: true, unique: true },
    designation: { type: String, required: true },
    department: { type: String, default: 'Computer Science & Engineering' },
    monthYear: { type: String, required: true }, // e.g. "October 2026"
    basicPay: { type: Number, required: true, default: 50000 },
    hra: { type: Number, default: 15000 },
    da: { type: Number, default: 10000 },
    specialAllowance: { type: Number, default: 5000 },
    deductions: {
        providentFund: { type: Number, default: 6000 },
        professionalTax: { type: Number, default: 200 },
        incomeTax: { type: Number, default: 3500 },
        totalDeduction: { type: Number, default: 9700 }
    },
    grossSalary: { type: Number, required: true, default: 80000 },
    netPayable: { type: Number, required: true, default: 70300 },
    paymentStatus: {
        type: String,
        enum: ['Generated', 'Approved', 'Disbursed', 'Pending'],
        default: 'Disbursed'
    },
    disbursementDate: { type: Date, default: Date.now },
    leaveBalance: {
        casualLeaves: { type: Number, default: 8 },
        earnedLeaves: { type: Number, default: 12 },
        sickLeaves: { type: Number, default: 5 }
    },
    performanceScore: { type: Number, default: 4.8 }, // 1.0 to 5.0
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('EmployeePayroll', EmployeePayrollSchema);
