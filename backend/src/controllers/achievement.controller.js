const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const Certificate = require('../models/Certificate');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
exports.getAllAchievements = async (req, res, next) => {
    try {
        const achievements = await Achievement.find().sort('points');
        res.status(200).json({ success: true, count: achievements.length, data: achievements });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get my achievements
// @route   GET /api/achievements/my-achievements
// @access  Private
exports.getMyAchievements = async (req, res, next) => {
    try {
        const myAchievements = await UserAchievement.find({ user: req.user.id }).populate('achievement');
        const totalAvailable = await Achievement.countDocuments();

        const normalised = myAchievements.map((ua, idx) => ({
            _id: ua._id,
            earnedAt: ua.unlockedAt || ua.createdAt,
            achievement: ua.achievement
                ? ua.achievement
                : {
                      name: `Achievement #${idx + 1}`,
                      description: 'Achievement earned on the platform',
                      type: 'milestone',
                      points: 0,
                      icon: 'trophy'
                  }
        }));

        const stats = {
            totalPoints: normalised.reduce((acc, curr) => acc + (curr.achievement?.points || 0), 0),
            unlockedCount: normalised.length,
            totalAvailable,
            progress: totalAvailable > 0 ? Math.round((normalised.length / totalAvailable) * 100) : 0
        };
        res.status(200).json({ success: true, data: { achievements: normalised, stats } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all badges
// @route   GET /api/achievements/badges
// @access  Public
exports.getAllBadges = async (req, res, next) => {
    try {
        const badges = await Badge.find().sort('points');
        res.status(200).json({ success: true, count: badges.length, data: badges });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get my badges
// @route   GET /api/achievements/my-badges
// @access  Private
exports.getMyBadges = async (req, res, next) => {
    try {
        const myBadges = await UserBadge.find({ user: req.user.id }).populate('badge');
        const normalised = myBadges.map((ub, idx) => ({
            _id: ub._id,
            earnedAt: ub.unlockedAt || ub.createdAt,
            badge: ub.badge
                ? ub.badge
                : {
                      name: `Badge #${idx + 1}`,
                      description: 'Badge earned on the platform',
                      type: 'technical',
                      points: 0,
                      icon: 'medal'
                  }
        }));
        res.status(200).json({ success: true, count: normalised.length, data: normalised });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get my certificates
// @route   GET /api/achievements/my-certificates
// @access  Private
exports.getMyCertificates = async (req, res, next) => {
    try {
        const certificates = await Certificate.find({ user: req.user.id }).populate('course');
        res.status(200).json({ success: true, count: certificates.length, data: certificates });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Seed initial achievements & badges (Admin only)
// @route   POST /api/achievements/seed
// @access  Private/Admin
exports.seedAchievements = async (req, res, next) => {
    try {
        const achievementSeeds = [
            { name: 'First Login', description: 'Log in for the first time', type: 'milestone', points: 10, icon: 'Users', criteria: { type: 'login_count', value: 1 } },
            { name: 'First Lab', description: 'Complete your first lab', type: 'milestone', points: 50, icon: 'CheckCircle', criteria: { type: 'labs_completed', value: 1 } },
            { name: 'Phishing Master', description: 'Complete all Phishing labs', type: 'mastery', points: 200, icon: 'Shield', criteria: { type: 'topic_completed', value: 'Phishing' } },
            { name: 'Quiz Whiz', description: 'Score 100% on 5 labs', type: 'performance', points: 150, icon: 'Zap', criteria: { type: 'perfect_scores', value: 5 } }
        ];

        const badgeSeeds = [
            { name: 'Vanguard', description: 'Complete 5 phishing labs without a single mistake.', type: 'technical', points: 100, icon: 'shield', criteria: { type: 'streak', value: 5, topic: 'phishing' } },
            { name: 'Swift Response', description: 'Complete a lab in under 2 minutes.', type: 'technical', points: 50, icon: 'clock', criteria: { type: 'time', value: 120 } },
            { name: 'Pathfinder', description: 'Complete all beginner-level training modules.', type: 'milestone', points: 150, icon: 'target', criteria: { type: 'level_mastery', value: 'beginner' } }
        ];

        for (const seed of achievementSeeds) {
            await Achievement.findOneAndUpdate({ name: seed.name }, seed, { upsert: true, new: true });
        }

        for (const seed of badgeSeeds) {
            await Badge.findOneAndUpdate({ name: seed.name }, seed, { upsert: true, new: true });
        }

        res.status(201).json({ success: true, message: 'Achievements and Badges seeded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
