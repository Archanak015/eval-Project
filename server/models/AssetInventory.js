const mongoose = require('mongoose');

const AssetInventorySchema = new mongoose.Schema({
    assetCode: { type: String, required: true, unique: true }, // e.g. "LAB-CS-042"
    assetName: { type: String, required: true }, // e.g. "Dell OptiPlex High-Performance Workstation"
    category: {
        type: String,
        enum: ['Laboratory Equipment', 'Computing Hardware', 'Classroom Smart Board', 'Network Appliance', 'Library Fixture', 'Furniture'],
        default: 'Computing Hardware'
    },
    location: { type: String, required: true }, // e.g. "Turing Advanced Computing Lab - Room 302"
    department: { type: String, default: 'Computer Science' },
    quantity: { type: Number, default: 1 },
    purchaseDate: { type: Date, default: Date.now },
    purchaseCost: { type: Number, required: true, default: 65000 },
    vendorName: { type: String, default: 'Dell Global Tech Corp' },
    warrantyExpiryDate: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 3) }, // 3 years
    warrantyStatus: {
        type: String,
        enum: ['Active Warranty', 'Expiring Soon', 'Out of Warranty', 'Under AMC'],
        default: 'Active Warranty'
    },
    condition: {
        type: String,
        enum: ['Optimal / Operational', 'Requires Maintenance', 'Decommissioned'],
        default: 'Optimal / Operational'
    },
    lastInspectionDate: { type: Date, default: Date.now },
    qrTagId: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('AssetInventory', AssetInventorySchema);
