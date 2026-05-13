const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        required: true,
        index: true
    },
    paymentId: {
        type: String,
        index: true
    },
    signature: String,
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    planId: {
        type: String,
        required: true,
        enum: ['core_node', 'neural_advanced', 'enterprise_lattice']
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'annual'],
        default: 'monthly'
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: String,
    invoiceNumber: {
        type: String,
        unique: true
    },
    paidAt: Date,
    metadata: {
        deviceId: String,
        browser: String,
        os: String
    }
}, {
    timestamps: true
});

// Auto-generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
    if (!this.invoiceNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.invoiceNumber = `APX-${year}${month}-${random}`;
    }
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
