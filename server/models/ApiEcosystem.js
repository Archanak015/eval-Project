const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    keyPrefix: { type: String, required: true },
    hashedKey: { type: String, required: true },
    scopes: [{ type: String }], // e.g. ["read:attendance", "read:students", "write:admissions"]
    rateLimitPerMinute: { type: Number, default: 120 },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    lastUsedAt: { type: Date }
}, { timestamps: true });

const WebhookSchema = new mongoose.Schema({
    url: { type: String, required: true },
    event: { type: String, required: true }, // e.g. "RESULT_PUBLISHED", "STUDENT_REGISTERED"
    secret: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    failureCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = {
    ApiKey: mongoose.model('ApiKey', ApiKeySchema),
    Webhook: mongoose.model('Webhook', WebhookSchema)
};
