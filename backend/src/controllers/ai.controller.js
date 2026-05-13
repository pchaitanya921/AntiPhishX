const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const CyberUserProfile = require('../models/CyberUserProfile');
const AIRiskTracking = require('../models/AIRiskTracking');
const llmService = require('../services/llm.service');

/**
 * AI Controller
 * Handles all AI chat operations with multi-mode support
 */

/**
 * @route   POST /api/ai/chat
 * @desc    Send message to AI and get response
 * @access  Private
 */
exports.chat = async (req, res) => {
    try {
        const { sessionId, message, mode, context = {} } = req.body;
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User identity not found. Please log in again.'
            });
        }

        // Validate mode
        if (!['lab', 'cyber', 'instructor', 'support'].includes(mode)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid mode. Must be: lab, cyber, instructor, or support'
            });
        }

        // Instructor mode - admin only
        if (mode === 'instructor' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Instructor mode is restricted to administrators only'
            });
        }

        let session;

        // Get or create session
        if (sessionId) {
            session = await ChatSession.findOne({ _id: sessionId, user: userId });
            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Chat session not found'
                });
            }
        } else {
            // Create new session
            session = await ChatSession.create({
                user: userId,
                mode,
                title: 'New Chat'
            });
        }

        // Save user message
        const userMessage = await ChatMessage.create({
            session: session._id,
            role: 'user',
            content: message,
            lab: context.labId || null,
            topic: context.topic || null,
            level: context.level || null
        });

        // Get conversation history
        const messages = await ChatMessage.find({ session: session._id })
            .sort({ createdAt: 1 })
            .limit(20); // Last 20 messages

        // Format messages for LLM
        const formattedMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Get user profile for cyber mode
        let userProfile = null;
        if (mode === 'cyber') {
            const UserBehavior = require('../models/UserBehavior');
            const behavior = await UserBehavior.findOne({ user: userId });
            if (behavior) {
                context.behaviorMap = behavior.cognitiveVulnerabilityMap;
            }
            
            userProfile = await CyberUserProfile.findOne({ user: userId });
            if (userProfile) {
                context.skillLevel = userProfile.skillLevel;
            }
        }

        // --- NEW: Context Injection for Support Mode ---
        if (mode === 'support') {
            const User = require('../models/User');
            const UserProgress = require('../models/UserProgress');
            const Certificate = require('../models/Certificate');
            const Organization = require('../models/Organization');

            // 1. Get Full User with Org
            const user = await User.findById(userId).populate('organization');
            context.user = {
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                currentPlan: user.currentPlan,
                billingCycle: user.billingCycle,
                subscriptionStatus: user.subscriptionStatus,
                planExpiresAt: user.planExpiresAt
            };
            if (user.organization) {
                context.organization = {
                    name: user.organization.name,
                    plan: user.organization.plan
                };
            }

            // 2. Get Progress Summary
            const progress = await UserProgress.find({ user: userId });
            const completedLabs = progress.filter(p => p.completed);
            context.progress = {
                completedCount: completedLabs.length,
                totalAttempted: progress.length,
                lastLab: progress.length > 0 ? progress.sort((a,b) => b.updatedAt - a.updatedAt)[0].lab : null
            };

            // 3. Get Certificates
            const certs = await Certificate.find({ user: userId });
            context.certificates = certs.map(c => ({
                domain: c.domain,
                level: c.level,
                issueDate: c.issueDate
            }));
        }

        // Generate AI response
        const aiResponse = await llmService.chat(formattedMessages, mode, context);

        // Save AI response
        const assistantMessage = await ChatMessage.create({
            session: session._id,
            role: 'assistant',
            content: aiResponse,
            lab: context.labId || null,
            topic: context.topic || null,
            level: context.level || null
        });

        // Update session timestamp and title (if new)
        if (session.title === 'New Chat' && message.length > 0) {
            session.title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
        }
        session.updatedAt = Date.now();
        await session.save();

        res.json({
            success: true,
            data: {
                sessionId: session._id,
                message: {
                    id: assistantMessage._id,
                    role: 'assistant',
                    content: aiResponse,
                    createdAt: assistantMessage.createdAt
                }
            }
        });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate AI response',
            message: error.message
        });
    }
};

/**
 * @route   GET /api/ai/sessions
 * @desc    Get all chat sessions for current user
 * @access  Private
 */
exports.getSessions = async (req, res) => {
    try {
        const { mode } = req.query;
        const userId = req.user.id;

        const filter = { user: userId };
        if (mode) {
            filter.mode = mode;
        }

        const sessions = await ChatSession.find(filter)
            .sort({ updatedAt: -1 })
            .limit(50);

        res.json({
            success: true,
            data: sessions
        });
    } catch (error) {
        console.error('Get Sessions Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve chat sessions'
        });
    }
};

/**
 * @route   GET /api/ai/sessions/:id
 * @desc    Get specific chat session with messages
 * @access  Private
 */
exports.getSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const session = await ChatSession.findOne({ _id: id, user: userId });

        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Chat session not found'
            });
        }

        const messages = await ChatMessage.find({ session: id })
            .sort({ createdAt: 1 });

        res.json({
            success: true,
            data: {
                session,
                messages
            }
        });
    } catch (error) {
        console.error('Get Session Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve chat session'
        });
    }
};

/**
 * @route   DELETE /api/ai/sessions/:id
 * @desc    Delete a chat session
 * @access  Private
 */
exports.deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const session = await ChatSession.findOne({ _id: id, user: userId });

        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Chat session not found'
            });
        }

        // Delete all messages in session
        await ChatMessage.deleteMany({ session: id });

        // Delete session
        await session.deleteOne();

        res.json({
            success: true,
            message: 'Chat session deleted successfully'
        });
    } catch (error) {
        console.error('Delete Session Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete chat session'
        });
    }
};

/**
 * @route   PUT /api/ai/sessions/:id
 * @desc    Update chat session (rename)
 * @access  Private
 */
exports.updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const userId = req.user.id;

        const session = await ChatSession.findOne({ _id: id, user: userId });

        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Chat session not found'
            });
        }

        if (title) {
            session.title = title;
            await session.save();
        }

        res.json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error('Update Session Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update chat session'
        });
    }
};

/**
 * @route   GET /api/ai/profile
 * @desc    Get or create user's cyber profile
 * @access  Private
 */
exports.getCyberProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        let profile = await CyberUserProfile.findOne({ user: userId });

        if (!profile) {
            // Create default profile
            profile = await CyberUserProfile.create({
                user: userId,
                skillLevel: 'beginner',
                weakTopics: [],
                strongTopics: [],
                learningScore: 0
            });
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Get Cyber Profile Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve cyber profile'
        });
    }
};

/**
 * @route   PUT /api/ai/profile
 * @desc    Update user's cyber profile
 * @access  Private
 */
exports.updateCyberProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skillLevel, careerGoal } = req.body;

        let profile = await CyberUserProfile.findOne({ user: userId });

        if (!profile) {
            profile = await CyberUserProfile.create({
                user: userId,
                skillLevel: skillLevel || 'beginner',
                careerGoal: careerGoal || ''
            });
        } else {
            if (skillLevel) profile.skillLevel = skillLevel;
            if (careerGoal !== undefined) profile.careerGoal = careerGoal;
            await profile.save();
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Update Cyber Profile Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update cyber profile'
        });
    }
};

/**
 * @route   POST /api/ai/risk/violation
 * @desc    Record a risk violation for a user in a lab
 * @access  Private
 */
exports.recordViolation = async (req, res) => {
    try {
        const { labId, violationType } = req.body;
        const userId = req.user.id;

        let riskTracking = await AIRiskTracking.findOne({ user: userId, lab: labId });

        if (!riskTracking) {
            riskTracking = await AIRiskTracking.create({
                user: userId,
                lab: labId
            });
        }

        await riskTracking.recordViolation(violationType);
        const action = riskTracking.getRecommendedAction();

        res.json({
            success: true,
            data: {
                riskScore: riskTracking.riskScore,
                action: action.action,
                message: action.message
            }
        });
    } catch (error) {
        console.error('Record Violation Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to record violation'
        });
    }
};
/**
 * @route   POST /api/ai/adaptive/generate
 * @desc    Generate an adaptive lab challenge based on user HRI profile
 * @access  Private
 */
exports.generateAdaptiveChallenge = async (req, res) => {
    try {
        const { domain = 'General Enterprise' } = req.body;
        const User = require('../models/User');
        
        const user = await User.findById(req.user.id || req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const hriProfile = user.behavioralProfile;
        
        // Generate the lab content via LLM
        const labContent = await llmService.generateAdaptiveLab(hriProfile, domain);

        res.json({
            success: true,
            data: labContent
        });
    } catch (error) {
        console.error('Adaptive Generation Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate adaptive AI challenge',
            message: error.message
        });
    }
};
