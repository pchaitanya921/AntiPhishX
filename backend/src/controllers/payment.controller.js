const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const { PLAN_CONFIG } = require('../config/plans');
const { v4: uuidv4 } = require('uuid');

const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};

/**
 * Helper to activate subscription and create invoice
 */
const activateSubscription = async ({ userId, planId, billingCycle, paymentId, orderId, signature, amount, method, metadata }) => {
    const plan = PLAN_CONFIG[planId];
    if (!plan) throw new Error('Invalid plan for activation');

    const cycle = billingCycle || 'monthly';
    const expiresAt = new Date();
    
    if (cycle === 'annual') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    // Update User
    const user = await User.findByIdAndUpdate(userId, {
        currentPlan: planId,
        billingCycle: cycle,
        subscriptionStatus: 'active',
        paymentId: paymentId,
        planActivatedAt: new Date(),
        planExpiresAt: expiresAt,
        activatedAt: new Date(),
        expiresAt: expiresAt,
        maxDevices: plan.deviceLimit,
        razorpayOrderId: null
    }, { new: true });

    // Create Invoice record
    const invoice = await Invoice.create({
        user: userId,
        orderId: orderId,
        paymentId: paymentId,
        signature: signature,
        amount: amount / 100, // Store in Rupees
        planId: planId,
        billingCycle: cycle,
        status: 'paid',
        paymentMethod: method || 'unknown',
        paidAt: new Date(),
        metadata: metadata
    });

    return { user, invoice };
};

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payments/order
 * @access  Private
 */
exports.createOrder = async (req, res) => {
    try {
        const { planId, billingCycle } = req.body;
        const plan = PLAN_CONFIG[planId];
        const cycle = billingCycle || 'monthly';

        if (!plan || !plan.pricing || !plan.pricing[cycle]) {
            return res.status(400).json({ success: false, message: 'Invalid plan or billing cycle selected' });
        }

        const pricing = plan.pricing[cycle];

        const options = {
            amount: pricing.amount,
            currency: "INR",
            receipt: `rcpt_${uuidv4().substring(0, 8)}`,
            notes: {
                userId: req.user._id.toString(),
                planId: planId,
                billingCycle: cycle
            }
        };

        const razorpay = getRazorpayInstance();
        const order = await razorpay.orders.create(options);

        // Create initial pending invoice
        await Invoice.create({
            user: req.user._id,
            orderId: order.id,
            amount: pricing.amount / 100,
            planId: planId,
            billingCycle: cycle,
            status: 'pending'
        });

        // Update user
        await User.findByIdAndUpdate(req.user._id, {
            razorpayOrderId: order.id
        });

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('RAZORPAY_ORDER_ERROR_CRITICAL:', {
            message: error.message,
            stack: error.stack,
            planId,
            userId: req.user?._id
        });
        res.status(500).json({ 
            success: false, 
            message: 'Payment gateway initialization failed',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @desc    Verify Razorpay Payment Signature
 * @route   POST /api/payments/verify
 * @access  Private
 */
exports.verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            planId 
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Check for duplicate payment ID to prevent double processing
            const existingPayment = await Invoice.findOne({ paymentId: razorpay_payment_id });
            if (existingPayment && existingPayment.status === 'paid') {
                return res.status(200).json({
                    success: true,
                    message: 'Payment already processed',
                    invoiceNumber: existingPayment.invoiceNumber
                });
            }

            const razorpay = getRazorpayInstance();
            const payment = await razorpay.payments.fetch(razorpay_payment_id);

            const { user, invoice } = await activateSubscription({
                userId: req.user._id,
                planId: planId,
                billingCycle: payment.notes.billingCycle || 'monthly',
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                amount: payment.amount,
                method: payment.method,
                metadata: payment.notes
            });

            // 🔔 Notify User
            const notificationService = require('../services/notification.service');
            await notificationService.subscriptionAlert(
                req.user.id,
                'Subscription Activated',
                `Your AntiPhishX upgrade to ${payment.notes.planId || 'Premium'} is now live. All modules unlocked.`,
                '/dashboard'
            );

            res.status(200).json({
                success: true,
                message: 'Subscription activated successfully',
                invoiceNumber: invoice.invoiceNumber
            });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ success: false, message: 'Subscription activation failed' });
    }
};

/**
 * @desc    Razorpay Webhook Handler
 * @route   POST /api/payments/webhook
 * @access  Public
 */
exports.handleWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature'];

        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const expectedSignature = shasum.digest('hex');

        if (expectedSignature !== signature) {
            return res.status(400).send('Invalid signature');
        }

        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        if (event === 'payment.captured') {
            const userId = payload.notes.userId;
            const planId = payload.notes.planId;
            
            // Check if already processed
            const existingInvoice = await Invoice.findOne({ paymentId: payload.id });
            if (!existingInvoice) {
                await activateSubscription({
                    userId: userId,
                    planId: planId,
                    billingCycle: payload.notes.billingCycle || 'monthly',
                    paymentId: payload.id,
                    orderId: payload.order_id,
                    amount: payload.amount,
                    method: payload.method,
                    metadata: payload.notes
                });

                // 🔔 Notify User
                const notificationService = require('../services/notification.service');
                await notificationService.subscriptionAlert(
                    userId,
                    'Payment Successful',
                    `Your payment for the ${planId} plan has been processed successfully.`,
                    '/dashboard'
                );
            }
        } else if (event === 'payment.failed') {
            const userId = payload.notes.userId;
            const planId = payload.notes.planId;
            
            // Log failure in Audit Logs for admin visibility
            const AuditLog = require('../models/AuditLog');
            const User = require('../models/User');
            const user = await User.findById(userId);

            if (user) {
                await AuditLog.create({
                    organization: user.organization,
                    user: userId,
                    eventType: 'PAYMENT_FAILED',
                    severity: 'MEDIUM',
                    details: {
                        reason: payload.error_description,
                        orderId: payload.order_id,
                        paymentId: payload.id,
                        planId: planId
                    }
                });

                // 🔔 Notify User of Failure
                const notificationService = require('../services/notification.service');
                await notificationService.securityAlert(
                    userId,
                    'Payment Failed',
                    `Transaction for ${planId} failed: ${payload.error_description}. Please try again.`,
                    '/billing'
                );
            }

            // Update pending invoice if exists
            await Invoice.findOneAndUpdate(
                { orderId: payload.order_id },
                { status: 'failed', metadata: { error: payload.error_description } }
            );
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).send('Webhook failed');
    }
};
