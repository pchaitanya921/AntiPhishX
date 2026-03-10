
'use strict';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DIFF_MAP = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
const pts = (l) => ({ beginner: 100, intermediate: 200, advanced: 350, expert: 500 }[l]);
const time = (l) => ({ beginner: 600, intermediate: 900, advanced: 1200, expert: 1800 }[l]);
const diff = (l) => ({ beginner: Math.floor(Math.random() * 2) + 1, intermediate: Math.floor(Math.random() * 2) + 3, advanced: Math.floor(Math.random() * 2) + 6, expert: Math.floor(Math.random() * 2) + 8 }[l]);

// ─── EMAIL PHISHING ───────────────────────────────────────────────────────────
function emailLab(title, level, short) {
    const spf = level === 'beginner' ? 'FAIL' : level === 'intermediate' ? 'SOFTFAIL' : 'PASS';
    const dkim = level === 'beginner' ? 'FAIL' : 'PASS';
    const dmarc = (spf === 'PASS' && dkim === 'PASS') ? 'PASS' : 'FAIL';
    return {
        type: 'email',
        content: {
            sender: `security-alert@${short}-verify.net`,
            senderDisplay: `${short} Security Team`,
            recipient: 'analyst@acmecorp.com',
            subject: `[ACTION REQUIRED] ${title}`,
            body: `Dear Analyst,\n\nWe detected unusual activity on your account related to: ${title}.\n\nPlease verify your credentials immediately at the link below to avoid suspension.\n\n[Verify Account] → https://acmecorp.${short}-secure-login.xyz/auth?token=8f2a1e\n\nThis link expires in 24 hours.\n\nRegards,\n${short} Security Operations`,
            headers: {
                spf,
                dkim,
                dmarc,
                replyTo: `phish@${short}-mail.ru`,
                receivedFrom: '185.220.101.47 (tor-exit node)',
            },
            attachments: level !== 'beginner' ? [{ name: 'Verification_Form.html', size: '42KB', suspicious: true }] : [],
            links: [{ display: `https://acmecorp.${short}.com/verify`, actual: `https://acmecorp.${short}-secure-login.xyz/auth?token=8f2a1e` }],
        },
        scenario: `A suspicious email flagged by the email gateway is awaiting triage. Your role as L1 SOC analyst is to determine its legitimacy and recommend appropriate action.`,
        steps: [
            'Inspect the sender address and display name for impersonation indicators.',
            'Review SPF, DKIM, and DMARC authentication results in the header panel.',
            'Compare the visible hyperlink URL against the actual destination URL.',
            'Evaluate urgency language and psychological manipulation techniques.',
            'Submit your final verdict: PHISHING or LEGITIMATE.',
        ],
        hints: [
            { text: 'Check if the Reply-To domain matches the From domain.' },
            { text: 'Look at the receiving IP — is it associated with known exit nodes?' },
            { text: 'Authentication failures (SPF/DKIM) are strong phishing indicators.' },
        ],
        correctAnswer: 'phishing',
        explanation: `Multiple red flags confirm this is a phishing email: authentication failures (${spf} SPF, ${dkim} DKIM, ${dmarc} DMARC), a lookalike domain in the actual URL, a Reply-To pointing to a suspicious foreign domain, and urgency language designed to bypass rational analysis.`,
    };
}

// ─── SMISHING ─────────────────────────────────────────────────────────────────
function smishingLab(title, level) {
    const senderMap = { beginner: '+1-800-FAKE-BANK', intermediate: 'ACME-ALERTS', advanced: '+44 7700 900123', expert: 'FRAUDWATCH' };
    const domainMap = { beginner: 'amaz0n-secure.info', intermediate: 'delivery-customs-fee.com', advanced: 'bit.ly/3xR9qpA', expert: 'acme-sec-portal.xyz' };
    const domain = domainMap[level];
    const url = `https://${domain}`;
    return {
        type: 'sms',
        content: {
            sms: {
                sender: senderMap[level],
                timestamp: 'Today 9:41 AM',
                message: `[ALERT] ${title}: Your account requires immediate verification. Tap here to avoid suspension in 2 hrs.`,
                links: [url],
            },
            // Metadata for LabManual / analysis panel
            senderType: level === 'beginner' ? 'international_number' : level === 'intermediate' ? 'alphanumeric' : 'short_code',
            url,
            domainAge: level === 'beginner' ? '3 days' : level === 'intermediate' ? '11 days' : '2 months',
            tlsValid: level !== 'beginner',
            redirectChain: level === 'expert' ? ['bit.ly → tracklink.io → acme-sec-portal.xyz'] : [],
            context: title,
        },
        scenario: `An employee received this SMS on their corporate device and forwarded it to the security team. Analyze the message for smishing indicators and recommend a response.`,
        steps: [
            'Identify the sender ID type and evaluate spoofing likelihood.',
            'Analyze urgency and fear language in the message body.',
            'Inspect the URL and check the domain registration age.',
            'Determine whether the TLS certificate and redirect chain are legitimate.',
            'Classify verdict: SMISHING or LEGITIMATE.',
        ],
        hints: [
            { text: 'Legitimate institutions never send unsolicited account-verification links via SMS.' },
            { text: 'Domains registered within the last 30 days are high-risk.' },
            { text: 'Redirect chains can mask the true destination — always expand short URLs.' },
        ],
        correctAnswer: 'smishing',
        explanation: `The message exhibits classic smishing patterns: a recently registered domain (${level === 'beginner' ? '3' : '11'} days old), urgency language, a suspicious redirect chain, and no prior authentication relationship with the sender.`,
    };
}

// ─── VISHING ──────────────────────────────────────────────────────────────────
function vishingLab(title, level) {
    const spoofed = { beginner: 'blocked', intermediate: '+1 (800) 275-2273', advanced: 'INTERNAL-IT', expert: 'HR-HELPDESK' };
    const totalDuration = { beginner: 90, intermediate: 150, advanced: 200, expert: 260 }[level];
    const transcript = [
        { speaker: 'CALLER', text: `Hi, I'm calling from the IT Security team regarding a critical ${title} incident on your account.`, time: 2 },
        { speaker: 'TARGET', text: 'Oh really? What kind of incident?', time: 14 },
        { speaker: 'CALLER', text: `We've detected unauthorized access. I'll need to verify your identity — can you confirm your employee ID and the last 6 digits of your corporate card?`, time: 20 },
        { speaker: 'TARGET', text: 'I\'m not sure I should give that out over the phone...', time: 42 },
        { speaker: 'CALLER', text: 'I completely understand, but this is time-sensitive — your access will be locked in 10 minutes if we can\'t verify. I\'m showing your name as Target — is that correct?', time: 52 },
        { speaker: 'TARGET', text: 'That\'s correct, but... how did you get this number?', time: 76 },
        { speaker: 'CALLER', text: 'Our systems auto-dial when anomalies are detected. Please provide your credentials quickly to keep your account secure.', time: 85 },
    ];
    return {
        type: 'call',
        content: {
            call: {
                caller: 'Unknown Caller',
                callerDisplay: spoofed[level],
                callerActual: '+7 495 123 4567',
                isSpoof: true,
                duration: totalDuration,
                tactics: level === 'beginner' ? ['urgency', 'fear'] : level === 'intermediate' ? ['authority', 'pretexting'] : ['reciprocity', 'social_proof', 'urgency'],
                requestedAction: 'Employee ID, last 6 digits of corporate payment card, current MFA code.',
                transcript,
            },
        },
        scenario: `A staff member received this call and grew suspicious. The call was recorded per policy. Analyze the transcript and caller metadata to determine if this is a vishing attempt.`,
        steps: [
            'Answer the call and listen to the Live Transcript as it unfolds.',
            'Identify the persuasion techniques used by the caller (urgency, authority, pretexting).',
            'Evaluate the legitimacy of the caller ID against the actual origin number.',
            'Assess the information being requested and its sensitivity level.',
            'Choose the correct response: escalate to SOC or verify independently via a known good number.',
        ],
        hints: [
            { text: 'Real IT teams never request card details or MFA codes over an inbound call.' },
            { text: 'Compare the displayed caller ID with your internal corporate directory.' },
            { text: 'Urgency + credential request = classic vishing attack pattern.' },
        ],
        correctAnswer: 'vishing',
        explanation: `The caller displayed a spoofed internal ID while originating from a foreign number. They employed urgency, authority impersonation, and pretexting to extract sensitive credentials. The request for card digits and MFA codes is unambiguous vishing. Correct response: hang up, report to SOC, and call IT via the official directory number.`,
    };
}

// ─── QR ATTACKS ───────────────────────────────────────────────────────────────
function qrLab(title, level) {
    const domains = { beginner: 'paypa1.com', intermediate: 'xn--paypl-ota.com', advanced: 'pay-pal-secure.xyz', expert: 'payp\u0430l.com' };
    return {
        type: 'qr',
        content: {
            placement: `QR code found on ${level === 'beginner' ? 'a public notice board' : level === 'intermediate' ? 'a printed office memo' : level === 'advanced' ? 'a conference table card' : 'an official-looking vendor invoice'}`,
            displayUrl: 'https://paypal.com/security/verify',
            actualUrl: `https://${domains[level]}/auth?ref=qr_${Math.random().toString(36).slice(2, 8)}`,
            domainAge: level === 'beginner' ? '2 days' : level === 'intermediate' ? '14 days' : '6 months',
            tlsCert: level === 'beginner' ? 'SELF-SIGNED' : level === 'intermediate' ? 'Let\'s Encrypt — 2 days old' : 'DigiCert — appears valid',
            redirectChain: level === 'expert' ? ['qr-link.io → cdn-paypal-verify.com → payp\u0430l.com'] : level === 'advanced' ? ['short.link → pay-pal-secure.xyz'] : [],
            homographDetected: level === 'expert',
            context: title,
        },
        scenario: `A QR code was reported by an employee as suspicious. Scan the artifact and analyze the destination URL, certificate, and redirect chain to determine if this QR leads to a malicious site.`,
        steps: [
            'Identify the placement context and assess legitimacy of the QR placement.',
            'Compare the displayed URL with the actual scanned destination.',
            'Check the domain registration age and TLS certificate issuer.',
            'Inspect the redirect chain for tracking or typosquatting hops.',
            'Submit verdict: MALICIOUS or SAFE.',
        ],
        hints: [
            { text: 'A Cyrillic "a" looks identical to Latin "a" — look for homograph attacks.' },
            { text: 'Legitimate services use long-established domains, not recently registered ones.' },
            { text: 'Multiple redirects before the final destination are a red flag.' },
        ],
        correctAnswer: 'malicious',
        explanation: `The QR code leads to a homograph or lookalike domain masquerading as a trusted service. The newly issued certificate, suspicious redirect chain, and domain registration age confirm this is a malicious QR code phishing attack.`,
    };
}

// ─── SOCIAL ENGINEERING ───────────────────────────────────────────────────────
function socialLab(title, level) {
    return {
        type: 'social_engineering',
        content: {
            pretext: `Attacker poses as a new IT contractor performing a system audit related to: ${title}`,
            targetRole: level === 'beginner' ? 'Receptionist' : level === 'intermediate' ? 'HR Coordinator' : level === 'advanced' ? 'Network Administrator' : 'Finance Director',
            environment: `${level === 'beginner' ? 'Office lobby during lunch hour' : level === 'intermediate' ? 'HR floor, 9am on a Monday' : level === 'advanced' ? 'Server room entry checkpoint' : 'Executive floor, board meeting day'}`,
            biasExploited: level === 'beginner' ? 'Authority and helpfulness' : level === 'intermediate' ? 'Reciprocity and liking' : level === 'advanced' ? 'Scarcity and urgency' : 'Social proof, authority, and commitment',
            dialogue: `[ATTACKER]: Hi, I'm Alex from TechCore — we were brought in by management to run a quick audit for ${title}. [TARGET]: Oh, I didn't get a notice about that. [ATTACKER]: It was a last-minute thing — CTO authorized it this morning. Could you badge me in so I don't lose time? The audit findings are due by 3pm.`,
        },
        scenario: `A suspicious individual was observed attempting to gain access to secure areas using social engineering. Review the scenario artifacts and identify the techniques used.`,
        steps: [
            'Identify the pretext the attacker used to establish a plausible cover story.',
            'Determine which psychological biases were being exploited.',
            `Identify the policy violation in the target's potential response.`,
            'Recommend the correct defensive response for the target.',
            'Rate the risk severity: LOW / MEDIUM / HIGH / CRITICAL.',
        ],
        hints: [
            { text: 'Legitimate vendors are always pre-approved and logged in the visitor system.' },
            { text: 'Urgency + authority claims should trigger verification, not compliance.' },
            { text: 'Always verify identity via a known internal contact before granting access.' },
        ],
        correctAnswer: 'high',
        explanation: `The attacker used a classic authority + urgency social engineering pretext. The target should have verified the contractor via the IT department using a known internal contact — not via the contact information provided by the attacker.`,
    };
}

// ─── ADVANCED THREATS ─────────────────────────────────────────────────────────
function advancedLab(title, level) {
    return {
        type: 'file',
        content: {
            networkOverview: `Enterprise hybrid cloud (Azure AD, on-prem DC). 1,200 endpoints. EDR deployed on 94% of fleet.`,
            trafficAnomaly: `Outbound HTTPS to ${title.toLowerCase().replace(/\s+/g, '-')}-c2.io:443 — 128KB beacons every 5 minutes for 72 hours from HOST-FINANCE-09.`,
            cloudIdentityLog: `Azure AD: 3 impossible-travel sign-in events for user jdoe@acmecorp.com (Chicago → Amsterdam → Singapore within 40 mins). MFA bypassed on 2nd and 3rd events.`,
            historicalContext: `ACMECORP was targeted by a spear-phishing campaign 6 weeks ago. Two accounts reported credential compromise.`,
            indicators: [
                `SHA256: a3f7c9d8e2b14560ac98f701234567890abcdef1234567890abcdef12345678`,
                `C2: 185.220.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)} (AS-TOR)`,
                `Registry: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run → svchost32.exe`,
            ],
        },
        scenario: `Threat intelligence flagged anomalous behavior across the ACMECORP network related to ${title}. Multiple log sources indicate a potential advanced persistent threat. Correlate the evidence and recommend containment.`,
        steps: [
            'Analyze the traffic anomaly summary and identify C2 beaconing patterns.',
            'Correlate the cloud identity log events with the on-prem EDR indicators.',
            'Classify the attack category (APT, ransomware precursor, insider threat, cloud compromise).',
            'Identify the most likely initial access vector based on available evidence.',
            'Recommend an immediate containment strategy and escalation priority.',
        ],
        hints: [
            { text: 'Impossible travel + MFA bypass = likely credential-based cloud attack or adversary-in-the-middle.' },
            { text: 'Regular outbound beacons to a new domain correlate with C2 implant activity.' },
            { text: 'Check the timing of the cloud sign-in events against the beacon start time.' },
        ],
        correctAnswer: 'apt',
        explanation: `The combination of phishing-based initial access, credential compromise, MFA bypass, impossible-travel events, and regular C2 beaconing are characteristic of a multi-stage APT intrusion. Immediate isolation of HOST-FINANCE-09 and credential reset for jdoe are critical first steps.`,
    };
}

// ─── MALWARE DETECTION ────────────────────────────────────────────────────────
const HASHES = [
    'a3f7c9d8e2b14560ac98f70123456789', 'deadbeef1234567890abcdef01234567',
    'cafebabe000000001234abcd5678ef90', '0badf00d11223344556677889900aabb',
];
function malwareLab(title, level) {
    const hash = HASHES[Math.floor(Math.random() * HASHES.length)];
    return {
        type: 'file',
        content: {
            processTree: `explorer.exe (PID:1024)\n  └─ powershell.exe -ExecutionPolicy Bypass -EncodedCommand ${Buffer.from(title).toString('base64').slice(0, 20)}== (PID:4488)\n       └─ cmd.exe /c whoami && net user && ipconfig /all (PID:4492)\n            └─ svchost32.exe [UNSIGNED] (PID:5100) — C:\\Users\\Public\\svchost32.exe`,
            commandLine: `powershell.exe -w hidden -ExecutionPolicy Bypass -EncodedCommand ${Buffer.from(title).toString('base64').slice(0, 24)}==`,
            hashes: [
                { type: 'MD5', value: hash },
                { type: 'SHA256', value: hash + hash.split('').reverse().join('').slice(0, 32) },
            ],
            networkBeacons: [
                { dest: `185.220.${Math.floor(Math.random() * 100) + 100}.${Math.floor(Math.random() * 254) + 1}`, port: 443, protocol: 'HTTPS', freq: 'Every 5 min', bytes: '112KB avg' },
            ],
            registryKeys: [
                `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run → svchost32.exe`,
                `HKLM\\SYSTEM\\CurrentControlSet\\Services\\WinDefend → Start: 4 (DISABLED)`,
            ],
            eventLog: `EVT 4688: New process svchost32.exe from C:\\Users\\Public\\\nEVT 7045: New service installed: WinSvc32\nEVT 4625: 14 failed login attempts — ADMIN$ share\nEVT 4104: PowerShell ScriptBlock logging — encoded payload detected`,
        },
        scenario: `EDR flagged suspicious activity on HOST-WS-047. The endpoint is an accountant's workstation. Analyze the process tree, hashes, beaconing, and registry persistence to classify the threat and recommend SOC escalation.`,
        steps: [
            'Review the process tree and identify anomalous parent-child process relationships.',
            'Analyze the PowerShell command-line flags for evasion indicators.',
            'Check the file hash against threat intelligence (MD5 and SHA256).',
            'Evaluate the network beacon pattern for C2 communication.',
            'Confirm persistence mechanism and classify the threat type.',
        ],
        hints: [
            { text: '`-ExecutionPolicy Bypass` and encoded commands are classic living-off-the-land tactics.' },
            { text: 'An executable in C:\\Users\\Public\\ signed by nobody is highly suspicious.' },
            { text: 'WinDefend being disabled after svchost32 spawning is a strong IOC.' },
        ],
        correctAnswer: 'malware',
        explanation: `The process tree reveals a PowerShell-based loader spawning an unsigned binary from a public directory. The binary establishes C2 beaconing, disables Windows Defender, and installs a persistence registry key — strongly indicative of a post-exploitation implant consistent with ${title}.`,
    };
}

// ─── LEVEL ASSIGNMENT ─────────────────────────────────────────────────────────
// For each topic's 40 labs (index 0=hardest, 39=easiest):
// 0-9 = expert, 10-19 = advanced, 20-29 = intermediate, 30-39 = beginner
function assignLevel(index) {
    if (index < 10) return 'expert';
    if (index < 20) return 'advanced';
    if (index < 30) return 'intermediate';
    return 'beginner';
}

// ─── TOPIC CONFIG ─────────────────────────────────────────────────────────────
const TOPIC_MAP = {
    'Malware Detection': { dbTopic: 'malware_detection', gen: malwareLab },
    'Advanced Threats': { dbTopic: 'advanced_threats', gen: advancedLab },
    'Social Engineering': { dbTopic: 'social_engineering', gen: socialLab },
    'QR Attacks': { dbTopic: 'qr_code', gen: qrLab },
    'Vishing': { dbTopic: 'vishing', gen: vishingLab },
    'Smishing': { dbTopic: 'smishing', gen: smishingLab },
    'Email Phishing': { dbTopic: 'phishing', gen: emailLab },
};

/**
 * Build a single lab document from a raw title string like:
 * "Email Phishing - Identify spoofed sender domain"
 */
function buildLab(rawTitle, indexWithinTopic) {
    const dashIdx = rawTitle.indexOf(' - ');
    const topicLabel = rawTitle.slice(0, dashIdx).trim();
    const labTitle = rawTitle.slice(dashIdx + 3).trim();
    const level = assignLevel(indexWithinTopic);
    const cfg = TOPIC_MAP[topicLabel];
    if (!cfg) throw new Error(`Unknown topic: ${topicLabel}`);

    // short key for domains / display
    const short = topicLabel.split(' ')[0].toLowerCase().slice(0, 6);

    const generated = cfg.gen(labTitle, level, short);

    return {
        title: `${topicLabel} - ${labTitle}`,
        description: `${level.charAt(0).toUpperCase() + level.slice(1)}-level simulation: ${labTitle}. Analyze artifacts and deliver a SOC-grade verdict.`,
        topic: cfg.dbTopic,
        level,
        type: generated.type,
        difficulty: diff(level),
        points: pts(level),
        timeLimit: time(level),
        content: generated.content,
        scenario: generated.scenario,
        steps: generated.steps,
        hints: generated.hints,
        correctAnswer: generated.correctAnswer,
        explanation: generated.explanation,
        published: true,
    };
}

module.exports = { buildLab, TOPIC_MAP };
