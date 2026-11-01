const mongoose = require('mongoose');

const transportRouteSchema = new mongoose.Schema({
    routeNumber: {
        type: String,
        required: [true, 'Route number is required (e.g. Route 12)'],
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    routeName: {
        type: String,
        required: true,
        trim: true
    },
    vehicleNumber: {
        type: String,
        required: true,
        trim: true
    },
    driverName: {
        type: String,
        required: true,
        trim: true
    },
    driverPhone: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        default: 45
    },
    allocatedSeats: {
        type: Number,
        default: 0
    },
    stops: [{
        stopName: { type: String, required: true },
        pickupTime: { type: String, required: true }, // e.g. "07:45 AM"
        dropTime: { type: String, required: true },   // e.g. "05:15 PM"
        annualFee: { type: Number, default: 18000 }
    }],
    gpsTrackerId: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'In Maintenance', 'Suspended'],
        default: 'Active',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('TransportRoute', transportRouteSchema);
