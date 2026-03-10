const oldCurriculum = require('../lab_curriculum');
const phishing = require('./phishing');
const smishing = require('./smishing');
const vishing = require('./vishing');
const qr_code = require('./qr_code');
const social_engineering = require('./social_engineering');
const malware = require('./malware');
const advanced_threats = require('./advanced_threats');

const CURRICULUM = {
    ...oldCurriculum,
    phishing: phishing, // Override phishing
    smishing: smishing, // Override smishing
    vishing: vishing,   // Override vishing
    qr_code: qr_code,   // Override qr_code
    social_engineering: social_engineering, // Override social_engineering
    malware_detection: malware,   // Override malware (Mapped to malware_detection)
    advanced_threats: advanced_threats // Override advanced_threats
};

module.exports = CURRICULUM;
