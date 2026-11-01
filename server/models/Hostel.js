const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    buildingName: {
        type: String,
        required: [true, 'Hostel block/building name is required'],
        trim: true,
        index: true
    },
    blockCode: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    genderType: {
        type: String,
        enum: ['Boys', 'Girls', 'Faculty / Staff Block'],
        default: 'Boys'
    },
    wardenName: {
        type: String,
        trim: true
    },
    wardenPhone: {
        type: String,
        trim: true
    },
    totalRooms: {
        type: Number,
        default: 50,
        min: 1
    },
    rooms: [{
        roomNumber: { type: String, required: true },
        floor: { type: Number, default: 1 },
        capacity: { type: Number, default: 3 },
        occupiedBeds: { type: Number, default: 0 },
        amenities: [{ type: String }],
        status: { type: String, enum: ['Available', 'Full', 'Maintenance'], default: 'Available' }
    }],
    messOptionAvailable: {
        type: Boolean,
        default: true
    },
    monthlyMessFee: {
        type: Number,
        default: 4500
    },
    status: {
        type: String,
        enum: ['Active', 'Renovation', 'Inactive'],
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Hostel', hostelSchema);
