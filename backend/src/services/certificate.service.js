const Certificate = require('../models/Certificate');
const User = require('../models/User');
const LabProgress = require('../models/UserProgress');
const Lab = require('../models/Lab');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

class CertificateService {
    constructor() {
        this.tracks = {
            executive_intelligence: {
                title: 'Executive Intelligence Certification',
                domains: ['executive_intelligence'],
                requirements: {
                    beginner: { labsRequired: 25, minResilience: 30 },
                    intermediate: { labsRequired: 50, minResilience: 50 },
                    advanced: { labsRequired: 75, minResilience: 75 }
                }
            },
            tactical_defense: {
                title: 'Tactical Defense Certification',
                domains: ['tactical_defense'],
                requirements: {
                    beginner: { labsRequired: 25, minResilience: 30 },
                    intermediate: { labsRequired: 50, minResilience: 50 },
                    advanced: { labsRequired: 75, minResilience: 75 }
                }
            },
            cognitive_security: {
                title: 'Cognitive Security Certification',
                domains: ['cognitive_security'],
                requirements: {
                    beginner: { labsRequired: 25, minResilience: 30 },
                    intermediate: { labsRequired: 50, minResilience: 50 },
                    advanced: { labsRequired: 75, minResilience: 75 }
                }
            },
            advanced_ai_adaptive: {
                title: 'Advanced AI Adaptive Defense Certification',
                domains: ['advanced_ai_adaptive'],
                requirements: {
                    beginner: { labsRequired: 25, minResilience: 30 },
                    intermediate: { labsRequired: 50, minResilience: 50 },
                    advanced: { labsRequired: 75, minResilience: 75 }
                }
            }
        };
    }

    /**
     * Check if a user is eligible for a certificate
     */
    async checkEligibility(userId, domain, level) {
        const track = this.tracks[domain];
        if (!track) return { eligible: false, reason: 'Invalid certification track' };

        const requirements = track.requirements[level];
        const user = await User.findById(userId);
        
        // 1. Check Labs Completed in this domain and level
        const completedLabsCount = await LabProgress.countDocuments({
            user: userId,
            completed: true,
            topic: domain,
            level: { $in: this.getLevelsUpTo(level) }
        });

        // 2. Check Resilience/Risk Score (Inverse of Risk)
        const resilienceScore = 100 - (user.behavioralProfile?.riskScore || 50);

        const isEligible = 
            completedLabsCount >= requirements.labsRequired &&
            resilienceScore >= requirements.minResilience;

        return {
            eligible: isEligible,
            stats: {
                completedLabs: completedLabsCount,
                requiredLabs: requirements.labsRequired,
                resilienceScore,
                requiredResilience: requirements.minResilience
            }
        };
    }

    getLevelsUpTo(level) {
        const levels = ['beginner', 'intermediate', 'advanced'];
        return levels.slice(0, levels.indexOf(level) + 1);
    }

    /**
     * Issue a new certificate
     */
    async issueCertificate(userId, domain, level) {
        // Check if already issued
        const existing = await Certificate.findOne({ user: userId, domain, level });
        if (existing) return existing;

        const eligibility = await this.checkEligibility(userId, domain, level);
        if (!eligibility.eligible) {
            throw new Error(`Ineligible for ${domain} ${level} certification: ${JSON.stringify(eligibility.stats)}`);
        }

        const user = await User.findById(userId);
        const certId = `APX-${domain.slice(0,3).toUpperCase()}-${uuidv4().split('-')[0].toUpperCase()}`;
        const verToken = uuidv4();

        const certificate = await Certificate.create({
            user: userId,
            domain,
            level,
            certificateId: certId,
            verificationToken: verToken,
            metadata: {
                ...eligibility.stats,
                avgDetectionSpeed: user.behavioralProfile?.detectionSpeed,
                neutralizationAccuracy: user.behavioralProfile?.neutralizationAccuracy
            }
        });

        // Generate PDF in background (or return promise)
        await this.generatePDF(certificate._id);

        return certificate;
    }

    /**
     * Generate a premium PDF certificate
     */
    async generatePDF(certObjectId) {
        const cert = await Certificate.findById(certObjectId).populate('user');
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margin: 0
        });

        const filePath = path.join(__dirname, `../../uploads/certs/${cert.certificateId}.pdf`);
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // --- Design Background (Dark Premium) ---
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#050505');

        // Abstract Patterns (Holographic/Cyber feel)
        doc.save();
        doc.opacity(0.1);
        for (let i = 0; i < 20; i++) {
            doc.circle(Math.random() * 800, Math.random() * 600, Math.random() * 100)
               .stroke('#10b981');
        }
        doc.restore();

        // Border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
           .lineWidth(2)
           .stroke('#10b981');
        
        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
           .lineWidth(0.5)
           .stroke('#34d399');

        // --- Content ---
        doc.fillColor('#10b981')
           .font('Helvetica-Bold')
           .fontSize(40)
           .text('ANTIPHISHX', 0, 80, { align: 'center', characterSpacing: 5 });

        doc.fillColor('#ffffff')
           .fontSize(14)
           .font('Helvetica')
           .text('ENTERPRISE CYBERSECURITY ACCREDITATION', 0, 130, { align: 'center', characterSpacing: 2 });

        doc.moveDown(4);
        doc.fontSize(18)
           .text('This certifies that', { align: 'center' });

        doc.moveDown(1);
        doc.fillColor('#10b981')
           .fontSize(36)
           .font('Helvetica-Bold')
           .text(cert.user.fullName.toUpperCase(), { align: 'center' });

        doc.moveDown(1);
        doc.fillColor('#ffffff')
           .fontSize(18)
           .font('Helvetica')
           .text('has successfully completed the comprehensive curriculum for', { align: 'center' });

        doc.moveDown(1);
        doc.fillColor('#10b981')
           .fontSize(24)
           .font('Helvetica-Bold')
           .text(`${this.tracks[cert.domain].title} - ${cert.level.toUpperCase()}`, { align: 'center' });

        // --- Stats / Metadata ---
        doc.moveDown(3);
        doc.fillColor('#ffffff')
           .fontSize(10)
           .font('Helvetica')
           .text(`Resilience Score: ${cert.metadata.resilienceScore}%  |  Neutralization Accuracy: ${cert.metadata.neutralizationAccuracy}%`, { align: 'center' });

        // --- Verification QR ---
        const qrData = `https://antiphishx.io/verify/${cert.certificateId}`;
        const qrImage = await QRCode.toDataURL(qrData);
        doc.image(qrImage, doc.page.width - 150, doc.page.height - 150, { width: 100 });

        doc.fontSize(8)
           .fillColor('#444444')
           .text('SCAN TO VERIFY AUTHENTICITY', doc.page.width - 160, doc.page.height - 40);

        // --- Signatures & Footer ---
        doc.fillColor('#ffffff')
           .fontSize(12)
           .text('__________________________', 80, doc.page.height - 100);
        doc.text('AI Instructor - Node-01', 80, doc.page.height - 80);

        doc.text('__________________________', 320, doc.page.height - 100);
        doc.text('Chief Information Security Officer', 320, doc.page.height - 80);

        doc.fontSize(10)
           .fillColor('#10b981')
           .text(`CERTIFICATE ID: ${cert.certificateId}`, 80, doc.page.height - 40);
        
        doc.fillColor('#444444')
           .text(`ISSUED ON: ${cert.issueDate.toDateString()}`, 320, doc.page.height - 40);

        doc.end();

        return filePath;
    }
}

module.exports = new CertificateService();
