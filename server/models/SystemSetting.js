const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema({
    institutionName: {
        type: String,
        default: 'UniConnect Central University',
        trim: true
    },
    institutionCode: {
        type: String,
        default: 'UNI-2026',
        trim: true
    },
    institutionLogo: {
        type: String,
        default: 'https://cdn.uniconnect.edu/assets/logo.png'
    },
    systemTheme: {
        type: String,
        default: 'Clean Slate ERP'
    },
    currentAcademicYear: {
        type: String,
        default: '2026-27'
    },
    attendanceThresholdPct: {
        type: Number,
        default: 75,
        min: 50,
        max: 100
    },
    gradingSystem: {
        type: String,
        enum: ['10-Point CGPA (CBCS / NEP)', 'Letter Grade (A+ to F)', 'Percentage'],
        default: '10-Point CGPA (CBCS / NEP)'
    },
    emailAlertsEnabled: {
        type: Boolean,
        default: true
    },
    twoFactorAuthEnabled: {
        type: Boolean,
        default: false
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
