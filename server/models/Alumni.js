const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    degree: { type: String, required: true }, // e.g. "B.E Computer Science"
    currentCompany: { type: String, required: true }, // e.g. "Google", "Microsoft"
    currentDesignation: { type: String, required: true }, // e.g. "Senior Staff Software Engineer"
    location: { type: String, default: 'Bengaluru, India' },
    email: { type: String, required: true },
    linkedInUrl: { type: String },
    mentorshipAvailable: { type: Boolean, default: true },
    donationContributed: { type: Number, default: 0 },
    successStory: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

AlumniSchema.index({ graduationYear: 1, currentCompany: 1 });

module.exports = mongoose.model('Alumni', AlumniSchema);
