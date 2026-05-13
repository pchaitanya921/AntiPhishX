const Certificate = require('../models/Certificate');
const Achievement = require('../models/Achievement');
const certificateService = require('../services/certificate.service');
const path = require('path');
const fs = require('fs');

/**
 * @route   GET /api/achievements/my-certificates
 * @desc    Get all certificates earned by the current user
 * @access  Private
 */
exports.getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user.id })
            .sort({ issueDate: -1 });

        res.json({
            success: true,
            data: certificates
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @route   GET /api/achievements/verify/:certId
 * @desc    Publicly verify a certificate
 * @access  Public
 */
exports.verifyCertificate = async (req, res) => {
    try {
        const cert = await Certificate.findOne({ certificateId: req.params.certId })
            .populate('user', 'firstName lastName avatar department');

        if (!cert) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found or invalid'
            });
        }

        res.json({
            success: true,
            data: {
                id: cert.certificateId,
                recipient: cert.user,
                domain: cert.domain,
                level: cert.level,
                issueDate: cert.issueDate,
                metadata: cert.metadata,
                status: cert.status
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @route   GET /api/achievements/download/:id
 * @desc    Download certificate PDF
 * @access  Private
 */
exports.downloadCertificate = async (req, res) => {
    try {
        const cert = await Certificate.findOne({ _id: req.params.id, user: req.user.id });
        if (!cert) return res.status(404).json({ success: false, message: 'Not found' });

        const filePath = path.join(__dirname, `../../uploads/certs/${cert.certificateId}.pdf`);
        
        if (!fs.existsSync(filePath)) {
            // Re-generate if missing
            await certificateService.generatePDF(cert._id);
        }

        res.download(filePath);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @route   POST /api/achievements/check-eligibility
 * @desc    Manually trigger eligibility check for a track
 * @access  Private
 */
exports.checkEligibility = async (req, res) => {
    try {
        const { domain, level } = req.body;
        const result = await certificateService.checkEligibility(req.user.id, domain, level);
        
        if (result.eligible) {
            // Auto-issue if eligible
            const certificate = await certificateService.issueCertificate(req.user.id, domain, level);
            return res.json({
                success: true,
                issued: true,
                data: certificate
            });
        }

        res.json({
            success: true,
            issued: false,
            data: result.stats
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
