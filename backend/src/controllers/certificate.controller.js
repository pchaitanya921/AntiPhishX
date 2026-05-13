const Certificate = require('../models/Certificate');
const certificateService = require('../services/certificate.service');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Get all certificates for logged in user
 * @route   GET /api/certificates
 * @access  Private
 */
exports.getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user.id })
            .sort({ issueDate: -1 });

        res.status(200).json({
            success: true,
            count: certificates.length,
            data: certificates
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Get single certificate by ID
 * @route   GET /api/certificates/:id
 * @access  Private
 */
exports.getCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate('user', 'firstName lastName avatar department');

        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }

        // Check ownership (unless admin)
        if (certificate.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({
            success: true,
            data: certificate
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Verify certificate by Certificate ID
 * @route   GET /api/certificates/verify/:certId
 * @access  Public
 */
exports.verifyCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certId })
            .populate('user', 'firstName lastName avatar department');

        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Invalid Certificate ID' });
        }

        res.status(200).json({
            success: true,
            data: {
                recipient: `${certificate.user.firstName} ${certificate.user.lastName}`,
                department: certificate.user.department,
                domain: certificate.domain,
                level: certificate.level,
                issueDate: certificate.issueDate,
                certificateId: certificate.certificateId,
                metadata: certificate.metadata,
                status: certificate.status
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Download certificate PDF
 * @route   GET /api/certificates/:id/download
 * @access  Private
 */
exports.downloadCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }

        // Check ownership
        if (certificate.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const filePath = path.join(__dirname, `../../uploads/certs/${certificate.certificateId}.pdf`);

        if (!fs.existsSync(filePath)) {
            // Regenerate if missing
            await certificateService.generatePDF(certificate._id);
        }

        res.download(filePath, `AntiPhishX_${certificate.domain}_${certificate.level}.pdf`);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Check eligibility for a specific certificate
 * @route   POST /api/certificates/eligibility
 * @access  Private
 */
exports.getEligibility = async (req, res) => {
    try {
        const { domain, level } = req.body;
        const result = await certificateService.checkEligibility(req.user.id, domain, level);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Check and Issue Certificate manually
 * @route   POST /api/certificates/check
 * @access  Private
 */
exports.checkAndIssue = async (req, res) => {
    try {
        const { domain, level } = req.body;
        const result = await certificateService.issueCertificate(req.user.id, domain, level);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
