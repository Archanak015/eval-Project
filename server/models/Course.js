const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // e.g., "Bachelor of Engineering"
    code: { type: String, required: true, unique: true, uppercase: true, trim: true }, // e.g., "B.E", "B.Tech", "M.Tech", "MCA", "MBA"
    description: { type: String, trim: true },
    duration: { type: String, default: '4 Years', trim: true }, // e.g., "4 Years"
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    totalSemesters: { type: Number, default: 8, min: 1, max: 12 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

courseSchema.index({ code: 1, status: 1 });

module.exports = mongoose.model('Course', courseSchema);
