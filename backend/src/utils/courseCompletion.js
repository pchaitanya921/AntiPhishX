const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const UserProgress = require('../models/UserProgress');
const crypto = require('crypto');

/**
 * Updates a user's progress in a course and issues a certificate if completed.
 * @param {string} userId - ID of the user
 * @param {string} courseId - ID of the course
 */
exports.updateCourseProgress = async (userId, courseId) => {
    try {
        const course = await Course.findById(courseId);
        if (!course) return;

        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment || enrollment.status === 'completed') return;

        // Get all lab IDs from the course modules
        const allLabIds = course.modules.reduce((acc, module) => {
            return acc.concat(module.labs);
        }, []);

        if (allLabIds.length === 0) return;

        // Count completed labs for this user
        const completedLabsCount = await UserProgress.countDocuments({
            user: userId,
            lab: { $in: allLabIds },
            completed: true
        });

        const progressPercent = Math.round((completedLabsCount / allLabIds.length) * 100);

        enrollment.progress = progressPercent;

        if (progressPercent === 100) {
            enrollment.status = 'completed';
            enrollment.completionDate = Date.now();

            // Calculate average score
            const progressDocs = await UserProgress.find({
                user: userId,
                lab: { $in: allLabIds },
                completed: true
            });

            const totalScore = progressDocs.reduce((acc, curr) => acc + (curr.score || 0), 0);
            const averageScore = Math.round(totalScore / allLabIds.length);

            // Issue Certificate
            await this.issueCertificate(userId, courseId, averageScore);
        }

        await enrollment.save();
    } catch (err) {
        console.error('Error updating course progress:', err);
    }
};

/**
 * Creates a unique certificate for the user and course.
 */
exports.issueCertificate = async (userId, courseId, score) => {
    try {
        // Check if certificate already exists
        const existingCert = await Certificate.findOne({ user: userId, course: courseId });
        if (existingCert) return existingCert;

        const credentialId = `AX-${crypto.randomBytes(3).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

        const certificate = await Certificate.create({
            user: userId,
            course: courseId,
            credentialId,
            score,
            issueDate: Date.now(),
            verificationUrl: `https://antiphishx.com/verify/${credentialId}`
        });

        console.log(`[COMPLETION] Certificate issued to user ${userId} for course ${courseId}`);
        return certificate;
    } catch (err) {
        console.error('Error issuing certificate:', err);
    }
};
