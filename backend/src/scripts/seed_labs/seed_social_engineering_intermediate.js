'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// Social Engineering – Intermediate: 200 XP | 15 min | 2 hints | Difficulty 3-4/10

const mkLab = (title, difficulty, scenario, artifact, indicators, socAnalysis, impact, hints, answer, explanation) => ({
    title,
    topic: 'social_engineering',
    level: 'intermediate',
    type: 'social_engineering',
    difficulty,
    points: 200,
    timeLimit: 900,
    published: true,
    description: `Intermediate Social Engineering lab: ${title.replace('SocEng Mid - ', '')}. Correlate multi-source behavioral and technical indicators, identify the attack chain, and deliver a structured SOC verdict.`,
    scenario,
    content: {
        artifact,
        indicators,
        socAnalysis,
        impact,
        artifacts: [],
    },
    steps: socAnalysis.tasks,
    hints: hints.map(h => ({ text: h })),
    correctAnswer: answer,
    explanation,
});

const LABS = [
    mkLab(
        'SocEng Mid - Vishing: IT Support Impersonation',
        3,
        'FinTrust Corp employees receive calls from someone claiming to be from the IT helpdesk. The caller states that their workstation has been flagged for a "critical security patch" and instructs the employee to install a remote desktop tool by visiting a link the caller provides via SMS. Three employees comply before the SOC detects outbound RDP connections to an external IP. The caller used accurate internal jargon, knew each employee\'s name and department, and referenced a real recent IT maintenance window.',
        {
            type: 'call_log_and_network_alert',
            callSource: '+91-80-XXXX-1122 (VoIP number — spoofed to match FinTrust IT helpdesk caller ID)',
            affectedEmployees: 3,
            smsLink: 'https://fintrust-itsupport-patch[.]com/install.exe (sent via SMS after call)',
            networkAlert: {
                rule: 'Outbound RDP (TCP 3389) to external IP',
                destinationIP: '45.142.212.158 (Netherlands — bulletproof VPS)',
                processInitiating: 'anydesk.exe (remote desktop tool installed by employee)',
                timestamp: '2026-02-21 15:14 – 15:47',
            },
            callerKnowledge: [
                'Called each employee by first name',
                'Referenced correct department names and manager names',
                'Mentioned the real IT maintenance window (Feb 19 – scheduled for OS patches)',
                'Knew the internal ticketing system name (ServiceNow)',
            ],
            socialEngineeringTactics: 'Authority (IT helpdesk identity), urgency (critical patch, security risk), pre-built trust (internal knowledge)',
        },
        [
            'Spoofed caller ID: +91-80 prefix matching office number — VoIP caller ID spoofing trivially achievable',
            'Installation request: legitimate IT never installs software via external URL in SMS — always via SCCM/Intune',
            'anydesk.exe: legitimate remote desktop tool weaponized — EDR may not block it by default',
            'Outbound RDP/AnyDesk to external IP: corporate policy violation — all remote support is inbound from IT',
            'Attacker knew real IT maintenance window: prior OSINT from IT announcements, internal newsletters, or insider source',
            'Three employees compromised before detection: rapid multi-target call campaign run in parallel',
            'SMS link domain: fintrust-itsupport-patch.com — not fintrust.com — domain mismatch is the key tell',
        ],
        {
            attackType: 'Vishing — IT Support Impersonation with Remote Access Tool Installation',
            threatLevel: 'Critical',
            tasks: [
                'Map the attacker\'s OSINT reconnaissance: what public or semi-public sources would yield employee names, departments, manager names, and internal maintenance windows?',
                'Explain why anydesk.exe establishing outbound connections to an external IP is specifically dangerous even though AnyDesk itself is a legitimate tool.',
                'Write a policy rule that IT helpdesk must follow for any software installation request that would have prevented all three employees from being compromised.',
            ],
        },
        {
            remoteAccess: '3 workstations fully accessible to attacker via AnyDesk session — keyboard/mouse control, file access, screen view',
            lateralMovement: 'From any 3 workstations: network drive enumeration, credential harvesting from browser, pivot to internal systems',
            dwellRisk: 'AnyDesk persistence: attacker may have installed additional backdoor before SOC isolated hosts',
        },
        [
            'OSINT sources for internal knowledge: LinkedIn (employee profiles with employer + role + manager tags), company press releases, IT job postings (mention internal tools), Glassdoor (employees mention IT processes), conference/event registrations that show employee+department pairings. Maintenance windows: sometimes leaked in LinkedIn posts ("Finally the Feb OS patches are rolling out") or visible via email out-of-office messages.',
            'AnyDesk weaponization: AnyDesk is signed, legitimate software — not flagged by most AV/EDR. Outbound connections to AnyDesk relay servers (or direct to attacker IP on port 3389) appear as legitimate remote support traffic. Attacker gets full GUI access to the workstation with the victim\'s privilege level — equivalent to sitting at the keyboard.',
        ],
        'phishing',
        'VERDICT: Vishing — IT Impersonation + Remote Access Tool Compromise. 3 Workstations Fully Controlled. CRITICAL RISK.\n\nKey Failures: (1) Employees installed software from SMS link without IT ticket verification. (2) AnyDesk not blocked by application allowlist. (3) Outbound RDP/AnyDesk to external IPs not alerted immediately.\n\nDefensive Controls:\n(1) Application allowlist: block unauthorized remote desktop tools (AnyDesk, TeamViewer, AnyDesk not in allowlist = blocked).\n(2) Policy: ALL IT software installation via SCCM/Intune — never via external URL in SMS/email.\n(3) Callback verification: employees must call back IT on internal extension before following ANY installation instruction.\n(4) Network rule: outbound TCP 3389 and AnyDesk relay ports blocked at firewall for non-IT endpoints.\n(5) Immediate isolation of 3 hosts + AnyDesk session termination + full forensic investigation.'
    ),

    mkLab(
        'SocEng Mid - Spear Phishing via OSINT-Crafted Email',
        4,
        'A senior financial analyst at FinTrust Corp receives a highly personalized phishing email that references her recent LinkedIn post about attending a Mumbai CFO conference, names her direct manager correctly, and attaches a "conference proceedings" PDF that exploits a known Adobe Reader vulnerability (CVE-2024-ADBR). The email appears to come from the conference organizer domain. The SOC detects a suspicious process spawned by AcroRd32.exe 90 seconds after the attachment is opened.',
        {
            type: 'email_plus_edr_alert',
            targetEmployee: 'Nisha Mehta — Senior Financial Analyst, FinTrust Corp Finance',
            fromAddress: 'proceedings@mum-cfo-summit[.]org',
            subject: 'CFO Mumbai Summit 2026 — Your Personalized Proceedings PDF',
            body: 'Dear Nisha, Thank you for attending this year\'s Mumbai CFO Summit! As requested by Deepak sir [manager name], we\'ve compiled the personalized session notes for FinTrust Corp\'s delegation. Please find attached. Warm regards, Conference Secretariat.',
            attachmentName: 'CFO_Summit_2026_FinTrust_Proceedings.pdf',
            emailHeaders: {
                'SPF': 'PASS (mum-cfo-summit.org authorized sender)',
                'DKIM': 'PASS (signed by mum-cfo-summit.org)',
                'DMARC': 'PASS',
                'Domain-Age': 'mum-cfo-summit.org — registered 8 days ago',
            },
            edrAlert: {
                time: '2026-02-21 16:23:47',
                parentProcess: 'AcroRd32.exe (Adobe Acrobat Reader)',
                childProcess: 'cmd.exe → powershell.exe -ep bypass -w hidden -enc <base64>',
                networkConn: '23.105.131.141:443 (US — known malware C2)',
                technique: 'CVE-2024-ADBR — PDF JavaScript exploit → code execution',
            },
            linkedinOSINT: {
                postContent: 'Excited to attend the Mumbai CFO Summit 2026 next week! Looking forward to sessions on fintech risk.',
                postLikes: 47,
                postDate: '2026-02-14 (7 days before attack)',
            },
        },
        [
            'OSINT precision: LinkedIn post from 7 days ago → attacker registered conference-lookalike domain same day',
            'Domain age: 8 days — conference organizer domain should be years old',
            'SPF/DKIM/DMARC all PASS: attacker controlled mum-cfo-summit.org — legitimate sender for that domain',
            'Manager name in email body: OSINT from LinkedIn (employee tagged manager in previous post)',
            'CVE-2024-ADBR: known Adobe Reader vulnerability — PDF triggers JavaScript exploit on open',
            'AcroRd32.exe spawning cmd.exe → powershell.exe: parent-child process anomaly — document readers should never spawn shells',
            'PowerShell -ep bypass -w hidden -enc: bypass execution policy, hidden window, base64-encoded payload — classic LOLBaS',
        ],
        {
            attackType: 'Spear Phishing — OSINT-Targeted PDF Exploit with C2 Beacon',
            threatLevel: 'Critical',
            tasks: [
                'Trace the full attacker reconnaissance timeline from LinkedIn post to email delivery — list each step and the data obtained.',
                'SPF, DKIM, and DMARC all passed for this email. Explain why this does NOT mean the email is safe, and what additional header indicator reveals the domain is malicious.',
                'Write the Sysmon detection rule (Event ID and filter) that catches AcroRd32.exe spawning powershell.exe as a child process.',
            ],
        },
        {
            systemCompromise: 'Financial analyst workstation fully compromised — C2 beacon established via HTTPS to known malware host',
            dataAtRisk: 'Financial models, SWIFT-linked apps, M&A data, email access — all within analyst\'s session context',
            lateralMovement: 'PowerShell C2 from analyst account → network enumeration → pivot to Finance shared drives',
        },
        [
            'Domain age is the key tell: SPF/DKIM/DMARC all pass because the attacker OWNS mum-cfo-summit.org — they set up all email authentication correctly for their malicious domain. But a 8-day-old conference domain for an event that was "last week" is impossible for a legitimate organizer.',
            'Sysmon Event ID 10 (ProcessAccess) catches LSASS access; for parent-child you need Event ID 1 (ProcessCreate) with ParentImage matching AcroRd32.exe and Image matching powershell.exe — this rule should fire at near-zero false positive rate since legitimate PDFs never spawn PowerShell.',
        ],
        'phishing',
        'VERDICT: OSINT-Driven Spear Phishing — PDF Zero-Day Exploit + C2 Beacon. Financial Analyst Workstation Compromised. CRITICAL RISK.\n\nAttack Chain: LinkedIn post (Feb 14) → domain registration (Feb 14) → targeted email (Feb 21) → PDF exploit → PowerShell C2.\n\nDefensive Controls:\n(1) Adobe Reader: disable JavaScript in PDFs (Edit > Preferences > JavaScript > uncheck) — eliminates PDF JS exploit class.\n(2) Patch Adobe Reader: CVE-2024-ADBR patched in latest release — patch lag = exploitable window.\n(3) Application sandboxing: PDF opened in isolated container — child process creation blocked.\n(4) LinkedIn privacy: employees review post visibility settings — conference attendance posts visible to attacker via public search.\n(5) Email: domain age check in email gateway — flag emails from domains <30 days old.'
    ),

    mkLab(
        'SocEng Mid - Reverse Social Engineering: Fake Help Desk',
        3,
        'An attacker first creates a problem (sabotages the Wi-Fi access of targeted employees via a deauth attack), then advertises themselves as the solution — posting a note in the breakroom: "Wi-Fi Issues? Call IT Support: ext. 4499." The extension belongs to an attacker-controlled VoIP line. Employees calling for help are walked through "troubleshooting steps" that include entering their AD credentials into a spoofed "network diagnostics portal" at the attacker\'s URL.',
        {
            type: 'physical_note_plus_call_log',
            physicalEvidence: {
                location: 'FinTrust Corp breakroom — 3rd floor',
                note: '"NOTICE: Wi-Fi connectivity issues reported across 3rd floor. IT Support is aware. Call ext. 4499 for immediate assistance. — IT Team"',
                noteCharacteristics: 'Printed on plain white paper, no official FinTrust letterhead, no helpdesk ticket reference number',
                attackerDeauth: 'Attacker used 802.11 deauth attack from parking lot — targeted 3rd floor APs only, creating condition that prompted employees to seek help',
            },
            callLog: {
                extension: '4499 (VoIP — not in FinTrust internal directory, not a registered extension)',
                callsReceived: 11,
                callsWhereCredentialsEntered: 7,
                scriptUsed: '"Please go to network-diag-fintrust.com/check and enter your network login credentials so I can test your account connectivity."',
            },
            portalDetails: {
                URL: 'https://network-diag-fintrust[.]com/check',
                appearance: 'Cloned FinTrust AD login page',
                domainAge: '3 days',
                dataCollected: 'AD username + password',
            },
        },
        [
            'Reverse SE structure: attacker CREATES the problem (deauth attack) → positions as solver → harvests credentials during "repair"',
            'Physical note: no letterhead, no ticket number, unofficial paper — FinTrust IT always uses official communication channels',
            'Extension 4499: not in internal directory — employees did not verify before calling',
            'Script: "enter credentials at external URL to test connectivity" — legitimate IT never requests credentials via third-party portal',
            '802.11 deauth attack: creates real, verifiable problem — employees experience actual Wi-Fi failure → panic → seek help → trust solver',
            '7 of 11 callers provided AD credentials: 63% success rate — high yield from reverse SE structure',
            'Domain: 3 days old, -fintrust.com pattern (not fintrust.com) — subdomain-style lookalike in different TLD',
        ],
        {
            attackType: 'Reverse Social Engineering — Create-Problem-Become-Solution with AD Credential Harvest',
            threatLevel: 'Critical',
            tasks: [
                'Explain the three-phase structure of a reverse social engineering attack (Sabotage → Advertising → Assistance) and why it achieves higher trust than direct pretexting.',
                'Seven employees entered their Active Directory credentials into an external portal. List the specific Active Directory attack paths now available to the attacker with those credentials.',
                'How would a Wireless Intrusion Detection System (WIDS) detect the initial 802.11 deauth attack, and what automated response would prevent employees from experiencing the outage?',
            ],
        },
        {
            credentialCompromise: '7 AD credential pairs — full domain user access for 7 employees',
            adAttackPaths: 'Pass-the-password, Kerberoasting amplification, BloodHound path analysis to admin accounts',
            physicalThreat: 'Attacker still has physical proximity (deauth from parking lot) — may attempt follow-on access',
        },
        [
            'Reverse SE achieves higher trust because: (1) The victim seeks out the attacker (not the reverse) — victim is in a problem-solving mindset and grateful. (2) The attacker is perceived as the solution — authority comes from demonstrated competence (they knew about the problem because they caused it). (3) No cold-call suspicion — the victim initiated contact.',
            'AD paths with 7 credential pairs: (1) Direct login to domain workstations as those users. (2) Kerberoasting: request TGS tickets for service accounts → crack offline. (3) BloodHound ACL analysis: check if any of the 7 users has AdminTo, GenericAll, or WriteDACL paths to admin accounts. (4) Password spraying: use same passwords against O365, VPN, other systems (password reuse).',
        ],
        'phishing',
        'VERDICT: Reverse Social Engineering — 7 AD Credentials Harvested. Problem Manufactured by Attacker. CRITICAL RISK.\n\nAttack Chain: 802.11 deauth (physical proximity) → breakroom note → ext. 4499 → AD portal clone → 7 credential pairs.\n\nDefensive Controls:\n(1) Wireless IDS: deauth frame flood detection → automatic AP isolation or alert.\n(2) Official IT communication only: IT announcements via verified internal email/Teams — never physical notes.\n(3) Extension registry: all IT support numbers published in verified internal directory — any non-listed extension = report to security.\n(4) Policy: AD credentials NEVER entered into any external or non-AD-integrated portal.\n(5) Force AD password reset for 7 compromised accounts immediately + enable MFA.'
    ),

    mkLab(
        'SocEng Mid - Insider Threat Grooming via External Contact',
        4,
        'An IT administrator at FinTrust Corp begins receiving LinkedIn messages from an individual claiming to be a "cybersecurity researcher." Over 6 weeks, the contact builds rapport, shares valuable security research, discusses the admin\'s frustrations with his manager, and eventually offers ₹3,00,000 for a "one-time export of user access logs." The admin exports and shares the logs. The SOC detects an anomalous log export 3 hours later via DLP alert.',
        {
            type: 'dlp_alert_plus_communication_log',
            dlpAlert: {
                rule: 'Bulk export of user access logs via personal email',
                file: 'user_access_logs_2025_full.csv (847 MB — 2.2M rows)',
                destination: 'admin_personal@gmail.com → then forwarded to unknown recipient',
                timestamp: '2026-02-21 21:04',
                userAccount: 'IT Admin — Vikram Sharma (IT Infrastructure)',
            },
            linkedInCommunicationTimeline: [
                { week: 1, message: '"Hi Vikram, loved your post on IAM best practices — I\'m researching insider threat controls. Would love to connect."' },
                { week: 2, message: 'Shares 3 research papers on network segmentation — genuinely valuable content' },
                { week: 3, message: '"What challenges do you face with your manager\'s priorities on security budget?" [probes grievance]' },
                { week: 4, message: '"Your insights are worth more than your salary — you\'re clearly the most skilled person there."' },
                { week: 5, message: '"I\'m consulting for a firm that needs anonymized user access data for threat research. Would you consider sharing? We pay ₹3L for clean datasets."' },
                { week: 6, message: '"It\'s not really wrong — it\'s just log data. No personal info. And no one will know. The payment is via crypto."' },
            ],
            adminResponse: 'Admin exported logs, attached to personal email, forwarded. Did not report the contact to security.',
        },
        [
            'Six-week grooming: long-duration trust building — patience indicates organized threat actor, not opportunistic',
            'Grievance probing: week 3 message explicitly elicits frustration with management — identifies psychological vulnerability',
            'Flattery + identity validation: "most skilled person there" — exploits professional recognition gap',
            'Rationalization provided by attacker: "it\'s just log data, no personal info, no one will know"',
            'Crypto payment: untraceability + further rationalization (if it were legal, they would want a bank transfer)',
            'User access logs: 2.2M rows — full employee access history, system access patterns, privileged account activity',
            'DLP: personal email exfil of 847 MB internal log file — should trigger immediately on file size + content',
        ],
        {
            attackType: 'Insider Threat Grooming — External Social Engineering of Privileged IT Employee',
            threatLevel: 'Critical',
            tasks: [
                'Map the psychological manipulation techniques used across the 6-week timeline to Cialdini\'s influence principles.',
                'The exported file is "user_access_logs_2025_full.csv — 847 MB, 2.2M rows." What specific intelligence would an APT extract from a full-year user access log dataset?',
                'Design a DLP policy rule that would have blocked this exfil BEFORE the file reached Gmail, not after.',
            ],
        },
        {
            dataExfiltrated: '847 MB user access logs — full 2025 access history for all IT systems',
            abuseScenarios: 'Access pattern analysis: identify when admins are NOT monitoring (night/weekend); identify most-used privileged accounts for targeting; map system dependencies from login sequences',
            legalExposure: 'IT Admin: potential criminal liability under IT Act 2000 Section 66 + DPDP Act 2023 data processor obligations',
        },
        [
            'Cialdini mapping: Week 1=Liking (shared interest, connect), Week 2=Reciprocity (valuable papers → builds obligation), Week 3=Social Proof + grievance probe, Week 4=Liking + Flattery (validation), Week 5=Commitment/Consistency (small ask after big rapport), Week 6=Rationalization (removes psychological barrier). The full 6-week sequence is a textbook insider threat grooming playbook.',
            'Intelligence from access logs: (a) User-to-system access patterns → identify which admins access crown jewels. (b) Time-of-day patterns → plan attacks when admins are inactive. (c) Account creation/deletion events → identify recently terminated employees for credential abuse. (d) Service account activity → identify accounts for Kerberoasting or credential misuse.',
        ],
        'phishing',
        'VERDICT: Insider Threat Grooming — Privileged IT Admin Recruited via LinkedIn. User Access Logs Exfiltrated. CRITICAL RISK.\n\nGrooming Duration: 6 weeks — sophisticated, patient threat actor with clear intelligence objective.\n\nData Impact: Full 2025 user access history → complete organizational access map for follow-on APT attack.\n\nDefensive Controls:\n(1) DLP: block bulk file transfers to personal email — rule: attachments >50 MB to non-corporate domain = auto-block + alert.\n(2) Insider threat program: report external contacts offering payment for internal data — mandatory reporting, no stigma.\n(3) LinkedIn monitoring for personnel in sensitive roles: awareness training on grooming patterns.\n(4) Privileged access review: IT admin bulk export capability should require dual approval + reason logging.\n(5) Terminate Vikram\'s access immediately + full forensic investigation + law enforcement referral.'
    ),

    mkLab(
        'SocEng Mid - Elicitation via Conference Small Talk',
        3,
        'A FinTrust Corp senior engineer attends an industry cybersecurity conference. During a networking dinner, she engages in what appears to be casual conversation with another attendee. Over 90 minutes, the conversation flows naturally — covering job roles, current projects, team structure, and upcoming product launches. The "attendee" is a competitor intelligence operative. The engineer unknowingly disclosed key details about FinTrust\'s unannounced product roadmap and internal security architecture.',
        {
            type: 'conversation_reconstruction',
            setting: 'SICON 2026 Networking Dinner — Mumbai Taj Hotel, Feb 20',
            duration: '90 minutes',
            operative: {
                name: 'Claimed: "Arjun Nair, Product Security at CloudFin"',
                realIdentity: 'Intelligence operative — conference badge obtained as sponsor representative',
                technique: 'Elicitation via guided open-ended questions, quid pro quo information sharing, false commonality',
            },
            conversationExcerpts: [
                '"We\'re also struggling with third-party API security — how does your team handle it?"',
                '"That\'s interesting — so you\'re running on Azure with a custom IAM layer? We tried that but found issues with [X]." [prompts correction]',
                '"So when\'s your next major release? We\'re aiming for Q3 — curious if there\'s industry convergence."',
                '"Your CISO sounds tough on budget — [similar complaint] — what\'s your firewall vendor currently?"',
                '"So it\'s basically just your team of 6 securing a 500-person org? That sounds like resource constraints."',
            ],
            engineerDisclosures: [
                'Current cloud provider (Azure) + IAM vendor name',
                'Q2 product launch date + key feature — unannounced',
                'Security team size (6 FTE) and reporting structure',
                'Current firewall vendor + WAF product name',
                'Active vulnerability remediation priority (API security gaps acknowledged)',
            ],
        },
        [
            'Elicitation technique: operative never directly asks for sensitive info — uses false commonality, flattery, quid pro quo',
            'Correction exploitation: "we tried X and had issues" → engineer corrects with accurate internal detail',
            '"How do you handle Y?" — open-ended questions that invite detailed explanation',
            'Team size + resource constraints: disclosed — creates attack surface map (6 FTE → understaffed)',
            'Unannounced Q2 product launch: competitive intelligence',
            'Firewall vendor + WAF: technical attack surface enumeration disguised as tech chat',
            'Conference setting: low guard — social setting, wine dinner, 90 minutes — psychological comfort reduces information control',
        ],
        {
            attackType: 'Elicitation — Intelligence Gathering via Engineered Social Interaction',
            threatLevel: 'High',
            tasks: [
                'Define elicitation as an intelligence technique and explain why it is more effective than direct interview or phishing in a conference context.',
                'Map each of the 5 disclosures to the specific elicitation technique that triggered it (correction, quid pro quo, flattery, open-ended question, false commonality).',
                'Write a "conference conversation security" briefing — 5 bullet points — that employees should receive before attending any industry event.',
            ],
        },
        {
            competitiveIntelligence: 'Q2 launch date + feature → competitor can accelerate product roadmap to pre-empt',
            technicalIntelligence: 'Azure + IAM vendor + firewall + WAF → targeted vulnerability research against known vendor stack',
            organizationalIntelligence: '6-person security team → optimal attack timing when team is smallest (weekends, holidays)',
        },
        [
            'Elicitation vs. direct: Direct questions raise suspicion and defenses. Elicitation feels like natural conversation — the target volunteers information because they\'re engaged, not interrogated. In a conference setting, sharing expertise is seen as networking value — the social norm encourages disclosure. Phishing requires system access; elicitation works in a hotel dinner with zero technical tools.',
            'Technique mapping: (1) Azure + IAM vendor: correction exploitation ("we tried X but had issues" → engineer corrects with their actual setup). (2) Q2 launch: false commonality ("we\'re aiming for Q3, curious if there\'s industry convergence"). (3) Security team size: open-ended + sympathy ("your CISO sounds tough — what\'s your team like?"). (4) Firewall vendor: quid pro quo (operative shared their vendor first). (5) API security gaps: agreement bait ("we\'re struggling with API security too — how does your team handle it?").',
        ],
        'phishing',
        'VERDICT: Conference Elicitation — Competitive + Technical Intelligence Harvested via Social Engineering. HIGH RISK.\n\nNo technical tools. No malware. No phishing link. 90 minutes of engineered conversation yielded: cloud stack, security tools, team size, unannounced roadmap, and acknowledged vulnerabilities.\n\nDefensive Controls:\n(1) Pre-conference briefing: what to share vs. what to protect (product roadmap, team size, vendors = restricted).\n(2) Need-to-share principle: only share information the conversation actually requires — not extra context.\n(3) Quid pro quo awareness: reciprocity pressure feels natural at conferences — recognize it before disclosing.\n(4) "False commonality" red flag: if someone claims to have the same exact challenges → be cautious about corrections.\n(5) Post-conference debrief: report any conversation involving detailed technical or strategic questions to security team.'
    ),

    mkLab(
        'SocEng Mid - Physical Impersonation: Fake Vendor Engineer',
        4,
        'An individual posing as an engineer from FinTrust Corp\'s firewall vendor (FortiNet) arrives at the data center reception with a printed work order and branded polo shirt. They claim to have a scheduled maintenance appointment that "was arranged last week." After a 40-minute wait, a harried IT manager approves their access as a guest without completing the formal vendor access process. The individual spends 2 hours in the data center server room and departs before the verification discrepancy is discovered.',
        {
            type: 'physical_access_audit',
            location: 'FinTrust Corp data center — Rack Row 7 (Core Switch Infrastructure)',
            incidentDate: '2026-02-21',
            individualDetails: {
                claimed: 'FortiNet Field Engineer — Rajesh Kumar',
                equipment: 'Laptop bag, FortiNet branded polo shirt (purchased online), printed "work order" (forged)',
                badge: 'Visitor badge issued by reception after IT manager approval — valid for 2 hours',
            },
            workOrderAnalysis: {
                fortinetContact: 'FortiNet India support confirms no scheduled maintenance for FinTrust on this date',
                workOrderFormat: 'Realistic but missing FortiNet internal case number format (uses sequential number vs. cloud ticket ID)',
                signature: 'Printed signature of "FortiNet SE" — not a real FortiNet employee name in their directory',
            },
            timeInDataCenter: '2 hours 13 minutes — unescorted access to server room',
            cctv: 'Individual connected personal laptop to a patch panel port in Rack 7 → then disconnected after 8 minutes → moved to Rack 12 (Storage)',
        },
        [
            'No scheduled maintenance: FortiNet confirms no appointment — work order is forged',
            'Work order format error: sequential case number vs. FortiNet cloud ticket ID format — verifiable red flag',
            'Branded apparel: FortiNet polo purchased online (Amazon/vendor swag sites) — not proof of employment',
            'IT manager ad-hoc approval: bypassed formal vendor access process (vendor registration, ID verification, escort requirement)',
            'Laptop connected to patch panel: 8 minutes — sufficient for network tap installation or port mirror configuration',
            'Unescorted access: security policy requires escorted vendor access at all times in data center',
            'Rack 12 storage access: attacker moved beyond stated maintenance scope — no firewall engineer needs storage racks',
        ],
        {
            attackType: 'Physical Impersonation — Fake Vendor Engineer with Forged Work Order',
            threatLevel: 'Critical',
            tasks: [
                'What could an attacker accomplish by connecting a personal laptop to a patch panel port for 8 minutes in a core switch infrastructure rack?',
                'Identify the specific procedural control failure that allowed the individual access, and redesign the vendor access approval process to prevent it.',
                'The individual also accessed Rack 12 (storage). What data exfiltration methods are available with unsupervised physical access to a storage rack?',
            ],
        },
        {
            networkCompromise: 'Patch panel connection: potential network tap, SPAN port configuration, or rogue switch installation',
            storageTampering: 'Rack 12 access: drive extraction, SAN controller access, storage network tap',
            persistentThreat: '2+ hours unescorted — multiple attack opportunities; implanted devices may remain active',
        },
        [
            'Patch panel port connection (8 minutes): (1) Passive network tap: hardware device clips to cable, mirrors all traffic — invisible, no configuration needed, survives reboots. (2) Rogue switch: replace patch cable with device that adds hidden port. (3) Laptop with Wireshark: capture network traffic for the segment. (4) SPAN port configuration: if laptop connected to managed switch CLI, attacker may configure SPAN session to mirror all traffic to their device.',
            'Vendor access process redesign: (1) Pre-registration required: ALL vendor visits must be registered in ServiceNow ≥24 hours ahead with FortiNet-side case number. (2) Verification: security calls FortiNet India support line (from internal directory, not business card) to confirm appointment. (3) ID check: government-issued + company ID both required. (4) Escort mandatory: IT staff escorts vendor at ALL times in data center. (5) Equipment log: all devices entering/leaving data center require serial number logging.',
        ],
        'phishing',
        'VERDICT: Physical Impersonation — Fake FortiNet Engineer. 2+ Hours Unsupervised Data Center Access. CRITICAL RISK.\n\nForged work order + branded apparel + IT manager fatigue = bypassed all physical security layers.\n\nNetwork tap or rogue device may be installed in Rack 7 — conduct full infrastructure sweep immediately.\n\nDefensive Controls:\n(1) Vendor pre-registration: mandatory in ticketing system — ad-hoc approvals forbidden.\n(2) Vendor verification: call vendor on published support number before ANY access granted.\n(3) Escort policy: physical escort of all non-employees in data center — unaccompanied = security alert.\n(4) Equipment inspection: all bags/equipment logged and photographed on entry and exit.\n(5) Immediate: physical sweep of Rack 7 and Rack 12 for implanted devices. SPAN and port mirror audit.'
    ),

    mkLab(
        'SocEng Mid - Honeytrap LinkedIn: Executive Intelligence Harvest',
        4,
        'A fake LinkedIn profile of an attractive industry consultant sends connection requests to 23 FinTrust Corp executives and senior managers. After connecting, the persona engages each in professional conversation. Over 4 weeks, she collects: org chart details, upcoming merger discussions, key vendor relationships, and internal IT project names. One executive shares a photo of his laptop screen during a video call — revealing an internal project dashboard. Another forwards a "confidential strategy deck" to her personal email for off-channel feedback.',
        {
            type: 'osint_linkedin_investigation',
            fakeProfile: {
                name: 'Divya Sharma — Independent Strategy Consultant, Ex-McKinsey',
                followers: 1240,
                connections: 847,
                profileAge: '7 months (created July 2025)',
                photo: 'AI-generated professional woman — no reverse image match across LinkedIn or web',
                recommendations: '4 fake recommendations from profiles created same month',
                posts: '12 posts — reposted genuine industry content + 3 original thought leadership pieces',
            },
            connectionsAccepted: 23,
            informationHarvested: [
                'Org chart: reporting lines from VP to Director level at FinTrust — 4 executives shared organically in conversation',
                'Merger discussion: Executive A mentioned "our Q2 acquisition target" in context of strategy advice request',
                'Vendor relationships: 3 executives named current security vendors in response to "what tools do you recommend?"',
                'Internal project names: "Project Falcon" and "Initiative Mercury" — referenced by two executives',
                'Laptop screen photo: Executive B shared screen during video call — internal Jira board visible with task names and assignees',
                'Strategy deck: Executive C forwarded "FinTrust Corp Strategic Priorities 2026 — CONFIDENTIAL" to divyasharma.consulting@gmail.com',
            ],
            discoveryMethod: 'Executive C\'s assistant noticed the "confidential deck forwarded to Gmail" in sent items — reported to CISO',
        },
        [
            'AI-generated profile photo: no reverse image match — undetectable via standard image search (Midjourney/Stable Diffusion)',
            'Profile depth: 7 months, 847 connections, 12 posts, 4 recommendations — significant investment to build realistic persona',
            'Executive engagement: sought "strategy advice" — flatters senior leaders into sharing organizational context',
            'Laptop screen exposure: video call frame — executives forget that screen content is visible to camera',
            'Strategy deck exfiltration: "confidential deck" forwarded to Gmail — DLP should have caught this',
            '"What tools do you recommend?": elicitation via professional opinion request → vendor enumeration',
            'Acquisition target leak: "Q2 acquisition target" mentioned — MNPI (material non-public information) exposure',
        ],
        {
            attackType: 'Honeytrap Social Engineering — Fake Persona for Executive Intelligence Harvest',
            threatLevel: 'Critical',
            tasks: [
                'Assess the AI-generated profile\'s sophistication level — what indicators remain detectable even for AI-generated personas, and what OSINT verification steps would expose this profile?',
                'Executive C forwarded a "CONFIDENTIAL" strategy deck to an external Gmail address. What DLP rule should have blocked this, and why might it have failed?',
                'The acquisition target discussion constitutes potential MNPI leakage. What regulatory obligations does FinTrust Corp have under SEBI Insider Trading regulations after this discovery?',
            ],
        },
        {
            mnpiExposure: 'Acquisition target details — if disclosed externally: SEBI insider trading violation exposure',
            competitiveIntelligence: 'Org chart + project names + vendor stack + strategy deck = full organizational intelligence picture',
            adversarialUse: 'Intelligence package enables targeted spear phishing, vendor impersonation, or acquisition counter-strategy',
        },
        [
            'AI persona detection indicators: (1) Profile created with full content on day 1 (no organic growth pattern). (2) All recommendations from profiles created same month. (3) No tagged photos with real people. (4) No alumni group membership. (5) Company verification badge absent. OSINT verification: search "Divya Sharma McKinsey" on Google/LinkedIn — real ex-McKinsey consultants have traceable history.',
            'MNPI regulatory obligation: SEBI (Prohibition of Insider Trading) Regulations 2015, Reg. 3 — "connected persons" must not communicate UPSI (unpublished price sensitive information) to third parties. FinTrust must: (1) Report to SEBI Compliance Officer immediately. (2) Assess whether the persona has a connection to market participants. (3) If acquisition details reached market — potential market manipulation investigation trigger.',
        ],
        'phishing',
        'VERDICT: Honeytrap LinkedIn Persona — Executive-Level Intelligence Harvest. Strategy Deck Exfiltrated. MNPI Possible Exposure. CRITICAL RISK.\n\n7-Month Investment: Sophisticated AI-generated persona built specifically for executive access at financial institutions.\n\nDefensive Controls:\n(1) Executive social media policy: no discussion of unreleased projects, acquisition targets, or strategy on LinkedIn — regardless of context.\n(2) DLP: any file with "CONFIDENTIAL" classification forwarded to non-corporate email → auto-block + alert.\n(3) LinkedIn connection vetting: executives given OSINT checklist before accepting connections from unknown consultants.\n(4) Video call awareness: never share screens showing internal dashboards without explicit intent — use screen blur/blur background.\n(5) AI persona training: executives trained to identify AI-generated profile indicators.'
    ),

    mkLab(
        'SocEng Mid - Deepfake Voice Call: Emergency Fund Transfer',
        4,
        'The CFO\'s executive assistant at FinTrust Corp receives a phone call that sounds exactly like the CFO\'s voice, requesting an emergency international wire transfer of ₹47,00,000 before the close of business. The caller provides accurate context about a real ongoing deal. The assistant initiates the transfer via the banking portal. The SOC is alerted by the bank\'s fraud detection system 40 minutes later. Investigation reveals the CFO was on a flight with no phone signal during the call.',
        {
            type: 'call_recording_plus_bank_alert',
            callDetails: {
                inboundNumber: '+91-98765-XXXXX (CFO\'s known mobile number — spoofed)',
                callDuration: '3 minutes 47 seconds',
                voiceAuthenticity: 'Indistinguishable from CFO voice — assistant confirmed "sounded exactly like him"',
                contentAccuracy: 'Referenced real deal: "Bangalore data center acquisition — Anand sir needs this by 5 PM"',
                transferInstructed: '₹47,00,000 to account: ICICI XXXX XXXX 8812 — "DeltaCore Infra Solutions"',
            },
            bankAlert: {
                flagReason: 'New beneficiary + amount above ₹10L threshold + first-time international routing flag',
                alertTime: '40 minutes post-authorization',
                transferStatus: 'Pending — bank held for manual review due to threshold alert',
                outcome: 'Transfer blocked before settlement',
            },
            cfoAlibi: {
                flightDetails: 'CFO on IndiGo 6E-204 (Mumbai–Singapore) — departed 14:30, call received at 15:22',
                phoneStatus: 'Airplane mode — no cellular signal',
                cfoBriefed: 'CFO unaware of any transfer instruction — confirmed with executive directly after landing',
            },
            technologyUsed: 'Real-time voice synthesis — AI deepfake of CFO voice using <5 minutes of training audio from public conference recordings',
        },
        [
            'Caller ID spoofed: CFO mobile number — VoIP caller ID spoofing trivially achievable, not authentication',
            'CFO on flight: verifiable alibi — call occurred when CFO was inaccessible (attacker may have known the flight schedule)',
            'New beneficiary: DeltaCore Infra Solutions — not a registered FinTrust vendor',
            'Real-time deepfake voice: <5 min training audio from public sources (conference speech, earnings call recording)',
            'Deal context accuracy: attacker knew about Bangalore data center acquisition — prior intelligence gathering',
            'Urgency: "by 5 PM" + "Anand sir" (familiar first name) = high-pressure but personal-sounding instruction',
            'Bank threshold alert: ₹47L + new beneficiary + international routing → triggered manual hold (saving the transfer)',
        ],
        {
            attackType: 'Deepfake Voice Social Engineering — AI Voice Synthesis CFO Impersonation',
            threatLevel: 'Critical',
            tasks: [
                'Explain how a real-time AI voice deepfake works: what is the minimum training audio required, which public sources would yield CFO audio, and how would liveness detection during the call work?',
                'The assistant verified by voice recognition alone. Design a dual-channel verification protocol for emergency wire requests that is resistant to both voice deepfake and caller ID spoofing.',
                'The attacker knew about the Bangalore data center acquisition. List three attack vectors by which an attacker could obtain non-public deal information to use as context for a deepfake call.',
            ],
        },
        {
            financialNearMiss: '₹47L almost transferred — blocked by bank threshold hold, not by internal control',
            deepfakeRisk: 'Voice authentication as a factor is now defeated by accessible AI tools — enterprise risk rerating required',
            intelGap: 'Attacker had non-public acquisition knowledge — possible insider source or prior compromise',
        },
        [
            'Minimum training audio: modern voice cloning (ElevenLabs, Resemble AI) can clone voice from 30 seconds of clean audio. CFO public sources: (1) Company earnings call recordings (mandatory published quarterly). (2) Conference keynote recordings (YouTube). (3) Podcast appearances. (4) YouTube company announcements. Real-time synthesis: tools like RealVoice-AI can synthesize speech in <500ms latency — convincing on phone call.',
            'Dual-channel protocol: (1) Any wire >₹5L requires OUT-OF-BAND verification — assistant must send WhatsApp to CFO\'s verified personal number AND receive text reply. (2) If CFO unreachable: transfer frozen until direct confirmation. (3) Pre-agreed codeword: CFO and assistant have a secret verbal codeword used only for emergency authorizations. (4) New beneficiaries: always require 24-hour cooling period regardless of urgency claim.',
        ],
        'phishing',
        'VERDICT: Deepfake Voice Social Engineering — ₹47L Wire Transfer Attempt. Blocked by Bank Threshold Alert (Not Internal Control). CRITICAL RISK.\n\nDeepfake AI Technology: Voice cloned from <5 minutes of public conference audio — indistinguishable from real CFO to assistant.\n\nKey Control Failure: No independent verification channel — voice alone used as authentication for a ₹47L transfer.\n\nDefensive Controls:\n(1) Wire transfer policy: NO authorization via voice/phone alone — dual-channel required (call + WhatsApp from verified number).\n(2) Emergency override prevention: "urgency" explicitly cannot bypass dual-control verification.\n(3) New beneficiary rule: 24-hour cooling period — no exceptions.\n(4) Deepfake awareness: finance and executive assistant training on AI voice synthesis attacks.\n(5) Liaise with bank: register for proactive fraud alerts on all transactions >₹1L to new beneficiaries.'
    ),

    mkLab(
        'SocEng Mid - Supply Chain Vendor Impersonation',
        3,
        'FinTrust Corp receives an invoice from what appears to be their regular cloud infrastructure provider (AWS India). The invoice is for ₹8,20,000 and requests payment to a new bank account, citing "banking system migration." The accounts payable team processes the payment without verifying the new account details through the vendor\'s official channel. Investigation reveals the invoice domain is aws-india-billing[.]com — not amazonaws.com.',
        {
            type: 'invoice_forensic',
            invoiceDetails: {
                from: 'AWS India Billing Team <billing@aws-india-billing[.]com>',
                to: 'accounts.payable@fintrust.com',
                amount: '₹8,20,000',
                invoiceNumber: 'AWS-IN-2026-02-1847',
                paymentAccount: 'HDFC XXXX XXXX 7719 — "Amazon Web Services India Pvt Ltd"',
                bankingNote: '"Due to our banking system migration, please update your records with the new account number provided above for all future payments."',
                visualAppearance: 'Pixel-perfect AWS branding — logo, colors, layout matches real AWS invoices',
            },
            domainAnalysis: {
                invoiceDomain: 'aws-india-billing.com',
                realAWSDomain: 'amazonaws.com / aws.amazon.com',
                domainAge: 'aws-india-billing.com — registered 19 days ago',
                SPF: 'PASS (aws-india-billing.com has SPF record configured)',
                emailAuthenticity: 'Email looks legitimate — passes spam filters due to self-signed SPF',
            },
            realAWSAccount: {
                actualAmount: 'Real AWS invoice for same period: ₹7,65,000 (different amount)',
                accountNumber: 'Existing account on file: ICICI XXXX XXXX 2234',
                AWSSupportConfirmation: 'AWS India support confirmed: no banking migration, no new account number',
            },
        },
        [
            'Sender domain: aws-india-billing.com vs. amazonaws.com — domain substitution with plausible alternative',
            'Invoice amount discrepancy: ₹8,20,000 vs. real ₹7,65,000 — ₹55,000 overage (attacker invoice amount slightly higher)',
            'New bank account: "banking system migration" — standard pretextual explanation for account change requests',
            'Payment made without verification: accounts payable did not call AWS on the account number on file',
            'Account name: "Amazon Web Services India Pvt Ltd" — account name matching increases trust',
            'Domain age: 19 days — real AWS billing domain has existed since 2006',
            'Visual cloning: perfect branding does NOT indicate authenticity — logo/colors trivially copyable',
        ],
        {
            attackType: 'Business Email Compromise — Vendor Invoice Fraud (Payment Diversion)',
            threatLevel: 'Critical',
            tasks: [
                'Map all 6 red flags in this invoice to the specific validation step that would have detected each one.',
                'The accounts payable policy says "verify new bank accounts via phone." Why did this control fail, and how should the policy be strengthened to ensure execution?',
                'Write a vendor payment change request procedure that makes invoice fraud of this type operationally infeasible.',
            ],
        },
        {
            financialLoss: '₹8,20,000 transferred to attacker mule account — likely irrecoverable within 24 hours',
            fraudPattern: 'Invoice fraud / BEC: one of the highest-financial-value social engineering attacks globally',
            systemicRisk: 'If AP team doesn\'t verify, same attack works for any vendor — Microsoft Azure, Cisco, Fortinet etc.',
        },
        [
            'Red flag validation mapping: (1) Domain mismatch → email domain check: compare from-address domain to vendor\'s registered domain on file. (2) Amount discrepancy → cross-check against master contract or previous invoices before payment. (3) New bank account → mandatory verification: call vendor on number from finance system (not from email). (4) Domain age → email gateway header check: alert on domains <90 days old. (5) "Banking migration" rationale → policy: account changes require written + phone confirmation regardless of stated reason.',
            'Procedure hardening: (1) Bank account change requests: must arrive on vendor letterhead + be verified by calling vendor\'s official account manager from a number registered in the finance system. (2) Dual authorization: any account change requires both AP manager and Finance Director sign-off. (3) New account cooling period: 10 business days. (4) Amount tolerance: any invoice >5% above contract baseline requires additional review.',
        ],
        'phishing',
        'VERDICT: Invoice Fraud / BEC — ₹8,20,000 Transferred to Fraudulent Account. CRITICAL RISK.\n\nPerfect branding + plausible domain + SPF pass = bypassed email security and AP judgement.\n\nRoot Cause: Accounts payable did not call AWS on a verified number before processing account change.\n\nDefensive Controls:\n(1) Mandatory phone verification: any new or changed bank account number must be verified by outbound call to vendor (number from CRM/finance system — not from the invoice).\n(2) Invoice domain check: email gateway alerts when vendor sender domain differs from registered vendor domain.\n(3) Dual-control: two AP officers must approve any payment >₹1L to a new or changed account.\n(4) Finance training: "banking migration" is the #1 invoice fraud pretext — trigger mandatory escalation.\n(5) Notify HDFC Bank fraud team immediately + file FIR for wire fraud.'
    ),

    mkLab(
        'SocEng Mid - Pretexting a Data Center: Fake CPCB Compliance Audit',
        4,
        'Two individuals arrive at FinTrust Corp\'s co-location data center claiming to be CPCB (Central Pollution Control Board) environmental compliance auditors. They present official-looking CPCB identification and state that diesel generator emissions data must be recorded urgently due to a regulatory deadline. The data center manager, under time pressure, grants them unescorted access to the generator room — which is adjacent to the primary network equipment room. CCTV later shows one individual entering the network room during the visit.',
        {
            type: 'physical_audit_plus_cctv',
            location: 'FinTrust Corp co-lo data center — Pune facility',
            incidentDate: '2026-02-21 10:30 AM',
            individualsDetails: {
                claimed: 'CPCB Environmental Compliance Officers — Mr. Suresh Iyer and Ms. Priya Nair',
                IDs: 'Laminated CPCB photo IDs — "CPCB Regional Office, Pune"',
                vehicle: 'White Maruti Suzuki — no government number plate (private)',
                equipment: 'Clipboards, printed audit forms, tablet with "CPCB Compliance App"',
            },
            reasonVerified: false,
            CPCBVerification: {
                checked: 'Data center manager did NOT call CPCB Pune regional office to verify appointment',
                realCPCBStatus: 'CPCB India confirmed: no audit scheduled for this facility on this date. No officers named Suresh Iyer or Priya Nair in Pune office.',
            },
            cctvFindings: [
                '10:31 – Generator room access granted (escorted by junior staff)',
                '10:41 – Individual A remains in generator room',
                '10:42 – Individual B visible moving toward network equipment room door',
                '10:43 – Network equipment room door status log: opened (using fire safety override — not badge)',
                '10:54 – Both individuals exit building. Visit total: 24 minutes.',
            ],
            fireOverrideMechanism: 'Emergency egress override: green button outside network room allows push-to-open — no badge required (fire code requirement)',
        },
        [
            'No CPCB appointment pre-registered: legitimate government audits are scheduled and documented in advance',
            'Private vehicle: government officers use government-plated vehicles for field visits',
            'Data center manager did not call CPCB: verification phone call would have exposed the fraud in <5 minutes',
            'Fire safety override to enter network room: attacker specifically knew this vulnerability (prior reconnaissance or insider knowledge)',
            'Individual B separated from escort: unescorted time in adjacent room = 12 minutes in network equipment room',
            'Laminated IDs: CPCB IDs are easily fabricated — not electronic, no central verification system for field staff',
            '24-minute visit: sufficient for hardware implant in network switch cabinet or physical device tap',
        ],
        {
            attackType: 'Physical Pretexting — Fake Government Regulatory Audit for Data Center Access',
            threatLevel: 'Critical',
            tasks: [
                'Why is a "government compliance audit" pretext particularly effective against data center managers, and what psychological pressures make verification less likely in this context?',
                'Individual B used the fire safety override to enter the network room. What security architecture change eliminates push-to-open vulnerabilities while maintaining fire code compliance?',
                'Design a "government audit arrival" protocol for data center staff that provides verification before access regardless of urgency or official-seeming credentials.',
            ],
        },
        {
            networkRoomAccess: '12+ minutes unescorted in primary network equipment room — sufficient for hardware tap, rogue device, or SPAN configuration',
            persistentThreat: 'Implanted device may be active in network rack — immediate physical sweep required',
            pretextEffectiveness: 'Government authority + regulatory deadline = highest-pressure pretexting scenario, overrides standard caution',
        },
        [
            'Government audit psychology: (1) Fear of regulatory consequences: "non-compliance = fine/shutdown" — manager prioritizes avoiding regulatory trouble over security procedure. (2) Authority compliance: government identity triggers deference ingrained from institutional and legal norms. (3) Deadline pressure: "regulatory deadline today" removes time to think. (4) Effort vs. risk: calling CPCB seems like bureaucratic obstruction when the person is standing in front of you with official IDs.',
            'Fire safety override architecture: (1) Alarmed push-bar: emergency egress allowed OUT of room via fire bar, but ENTRY still badge-required (common secure data center design). (2) Intrusion alarm: fire override triggers SOC alert when used outside tested schedule. (3) CCTV + 30-second delay: SOC can remotely deny access or lock down if camera confirms unauthorized use. (4) Two-person rule: network room requires two badged individuals to open — one push-to-open cannot be used without a second badge.',
        ],
        'phishing',
        'VERDICT: Physical Pretexting — Fake CPCB Audit. Network Equipment Room Accessed. Hardware Implant Possible. CRITICAL RISK.\n\nGovernment authority pretext + fire safety vulnerability = network room access without badge in 12 minutes.\n\nDefensive Controls:\n(1) All government audit requests: pre-verify with government office (call number from official government website — not from audit team\'s card).\n(2) No unescorted access: visitor must be within visual range of escorting staff at ALL times.\n(3) Fire override alarm: any use outside scheduled test = immediate SOC alert + lockdown.\n(4) Physical sweep: full equipment audit of network room for unauthorized hardware (taps, rogue switches, USB devices).\n(5) Penetration test: include physical pretexting scenarios in annual red team exercise — specifically test government authority scenarios.'
    ),
];

async function seed() {
    const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/antiphishx';
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB\n');

    for (const lab of LABS) {
        await Lab.findOneAndUpdate(
            { title: lab.title },
            lab,
            { upsert: true, new: true, runValidators: false }
        );
        console.log(`  ✔ [MID ${lab.difficulty}/10] ${lab.title}`);
    }

    const total = await Lab.countDocuments();
    console.log(`\n✅ Done — ${LABS.length} Social Engineering Intermediate labs upserted.`);
    console.log(`   🗄️  Total labs in DB: ${total}`);
    process.exit(0);
}

seed().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
