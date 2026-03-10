'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// Social Engineering – Beginner: 100 XP | 10 min | 3 hints | Difficulty 1-2/10

const mkLab = (title, difficulty, scenario, artifact, indicators, socAnalysis, impact, hints, answer, explanation) => ({
    title,
    topic: 'social_engineering',
    level: 'beginner',
    type: 'social_engineering',
    difficulty,
    points: 100,
    timeLimit: 600,
    published: true,
    description: `Beginner Social Engineering lab: ${title.replace('SocEng - ', '')}. Identify the attack type, behavioral indicators, and select the correct verdict.`,
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
        'SocEng - Shoulder Surfing at Café',
        2,
        'A FinTrust Corp employee is working remotely from a café. They open the corporate HR portal on their laptop and log in with their credentials. A CCTV review later reveals that an unknown individual seated directly behind them had their phone angled toward the employee\'s screen throughout the login process. The same individual left the café within 60 seconds of the employee completing login. The employee was not using a screen privacy filter.',
        {
            type: 'cctv_log',
            location: 'Central Café — Table 7 (corner seat, no privacy screen)',
            timestamp: '2026-02-21 11:14 AM',
            cctvObservations: [
                'Unknown individual seated 0.9m behind employee — arrived 3 minutes after employee',
                'Phone held in landscape at 45° angle — camera lens directed at employee laptop screen',
                'Repeated focus adjustments consistent with zooming toward keyboard',
                'Employee enters password (full sequence visible on CCTV — no privacy filter)',
                'Unknown individual exits café 58 seconds after employee completes login',
            ],
            employeeDevice: 'Dell XPS 15 — no privacy screen filter installed',
            hrPortalURL: 'https://hr.fintrust.com/login',
            postIncidentNote: 'Employee\'s HR portal account showed two logins from unknown IP (Singapore) within 2 hours of café visit',
        },
        [
            'No privacy screen filter — full display visible from behind at close range',
            'Attacker positioned optimally: 0.9m directly behind, phone at 45° angle = clear line of sight to keyboard and screen',
            'Suspicious camera behavior: landscape hold, repeated zoom adjustments — consistent with screen capture',
            'Attacker departure timing: 58 seconds post-login — objective achieved, tactical exit',
            'Subsequent unauthorized login from Singapore IP — confirms credential compromise',
            'Public Wi-Fi environment: additional risk layer for network eavesdropping',
        ],
        {
            attackType: 'Physical Reconnaissance — Shoulder Surfing',
            threatLevel: 'High',
            tasks: [
                'Identify the primary physical indicator that made this shoulder surfing attack possible.',
                'Correlate the Singapore IP login with the café incident — what is the most likely credential exfil method?',
                'List three immediate actions the employee should take upon being notified of the Singapore login.',
            ],
        },
        {
            credentialExposure: 'HR portal username + password captured via visual recording',
            accountCompromise: 'Unauthorized Singapore login — possible HR data access (salary, employee IDs, personal info)',
            passwordReuse: 'If password reused across systems, blast radius extends to all reused accounts',
            organizationalRisk: 'HR portal data breach: 2,400+ employee records accessible',
        },
        [
            'No privacy filter + public location = credential exposure. The attacker needed only line-of-sight to the keyboard during password entry.',
            'The 58-second departure after login completion is a strong behavioral indicator — attacker achieved their objective and executed tactical withdrawal to minimize exposure.',
            'Immediate actions: (1) Change HR portal password immediately. (2) Check all other accounts using same password. (3) Report incident to IT Security with CCTV timestamp.',
        ],
        'phishing',
        'VERDICT: Shoulder Surfing — Physical Credential Compromise. HIGH RISK.\n\nAttack: Opportunistic physical surveillance in public workspace. Credentials captured visually via phone recording during HR portal login.\n\nConfirmed: Singapore IP login within 2 hours demonstrates credentials were immediately operationalized.\n\nDefensive Controls:\n(1) MANDATORY: Privacy screen filters on all laptops (company policy violation to work without one in public).\n(2) MFA on HR portal — password alone insufficient for login even if captured.\n(3) Physical security awareness: always scan environment before entering credentials in public.\n(4) Remote work policy: sensitive system access prohibited in unsecured public venues.'
    ),

    mkLab(
        'SocEng - Pretexting: The New Hire',
        1,
        'An IT helpdesk analyst at FinTrust Corp receives a phone call from someone claiming to be "Ankit, the new Finance department hire." The caller explains that their manager asked them to call IT directly to get VPN credentials set up urgently before an 11 AM board meeting. The caller uses accurate internal terminology (mentions the IT ticketing system name, the Finance VP\'s name) and creates strong urgency — the CFO needs a file immediately and only VPN access will do.',
        {
            type: 'call_log',
            callTimestamp: '2026-02-21 10:38 AM',
            callerID: '+91-98XXXXXXXX (mobile — not internal extension)',
            duration: '4 minutes 12 seconds',
            transcript: [
                'CALLER: "Hi, this is Ankit from Finance. IT told me to call because my ServiceNow account isn\'t set up yet."',
                'ANALYST: "Sure, can I get your employee ID?"',
                'CALLER: "I haven\'t received it yet — I just joined Monday. But Deepak sir [Finance VP] knows about this."',
                'ANALYST: "I need to verify your identity before I can help with VPN."',
                'CALLER: "I understand, but the CFO needs this file in 18 minutes. Deepak sir approved it. Can\'t you just create a temp credential?"',
                'ANALYST: "Let me check with your manager first."',
                'CALLER: "There\'s no time! He\'s in the board meeting. Just create a guest VPN — it\'ll take 2 minutes."',
                'ANALYST: [placed caller on hold — checked HR system — no "Ankit" in Finance department]',
                'ANALYST: "I don\'t see a new hire named Ankit in Finance. Can you hold while I verify?"',
                'CALLER: [disconnects]',
            ],
            hrSystemCheck: 'No employee named "Ankit" in Finance department. No new hire onboarding scheduled for this week.',
        },
        [
            'Caller ID: mobile number, not internal extension — legitimate new hires receive extension during onboarding',
            'No employee ID + no HR record — fundamental identity verification failure',
            'Name-dropping: Finance VP "Deepak sir" and CFO — authority without verifiable confirmation',
            'Urgency + time pressure: "18 minutes" and "board meeting" — classic social engineering pressure tactics',
            'Internal terminology usage (ServiceNow, Finance VP name): suggests prior reconnaissance or insider knowledge',
            'Call disconnect upon identity check request — attacker recognized verification was imminent, abandoned',
        ],
        {
            attackType: 'Pretexting — Authority + Urgency Social Engineering',
            threatLevel: 'Medium (attacker abandoned before success)',
            tasks: [
                'Identify the specific social engineering techniques (per Cialdini\'s influence principles) used in this call.',
                'The caller knew the Finance VP\'s name. How could an attacker obtain this information without inside access?',
                'Write the correct analyst response at the point where the caller says "There\'s no time — just create a guest VPN."',
            ],
        },
        {
            ifSucceeded: 'VPN credential issuance → full internal network access to Finance systems, shared drives, email',
            lateralMovement: 'Finance VPN access → SWIFT portal, financial models, M&A documents',
            organizationalRisk: 'Single helpdesk agent bypassing verification = single point of policy failure',
        },
        [
            'Cialdini\'s principles in play: AUTHORITY (CFO/VP name-dropping), SCARCITY/URGENCY (18 minutes, board meeting), SOCIAL PROOF (IT told me to call you). None of these override identity verification.',
            'Finance VP name obtainable via: LinkedIn company page, corporate website team page, press releases, company annual report — all public OSINT. The attacker did not need insider access.',
            'Correct response: "I\'m sorry, but our security policy requires identity verification before any credential creation. I cannot issue VPN access without confirmed employee ID and manager approval via our ticketing system. I\'ll create a ticket and your manager can authorize it from their verified account."',
        ],
        'phishing',
        'VERDICT: Pretexting — Authority + Urgency Manipulation. Unsuccessful (analyst verified). MEDIUM RISK.\n\nAttack Pattern: New hire pretext + name-dropping + time pressure = classic vishing/pretexting combination designed to override standard verification procedure.\n\nAnalyst Action: CORRECT — verification attempt prompted attacker abandonment.\n\nDefensive Controls:\n(1) Absolute callback policy: ALL credential requests verified via manager\'s ticketing system — never over inbound phone.\n(2) Zero credential sharing by phone regardless of stated urgency.\n(3) Warm transfer protocol: analyst must speak directly with verified manager (via internal extension) before any access provisioning.\n(4) Log and report all social engineering attempts — this call should be filed as a security incident.'
    ),

    mkLab(
        'SocEng - Watering Hole: Trusted News Site',
        2,
        'FinTrust Corp employees regularly visit a well-known Indian financial news website (financetoday.in) for market updates. The SOC receives an EDR alert: multiple employees\' browsers are executing an unexpected JavaScript file from a foreign CDN domain. HTTP proxy logs show that all affected employees visited financetoday.in in the past 24 hours. The legitimate site appears to be loading a malicious third-party script.',
        {
            type: 'proxy_log_and_edr_alert',
            timeRange: '2026-02-20 14:00 – 2026-02-21 09:30',
            affectedEndpoints: 7,
            proxyLogSnippet: [
                'GET https://financetoday.in/market-update → 200 OK (legitimate)',
                'GET https://cdn-news-assets[.]ru/analytics/mal.js → 200 OK [INJECTED — loaded by financetoday.in]',
                'POST https://cdn-news-assets[.]ru/collect → 200 OK [beaconing: browser fingerprint + session cookies]',
                'GET https://cdn-news-assets[.]ru/stage2.js → 200 OK [second-stage payload loaded]',
            ],
            edrAlert: {
                rule: 'Suspicious script execution from browser',
                process: 'chrome.exe',
                fileWritten: '%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\updater.js',
                networkConn: '185.244.25.91:443 — Russia (ASN: AS58172 — bulletproof host)',
            },
            domainAge: 'cdn-news-assets.ru — registered 6 days ago, Russia ccTLD',
        },
        [
            'Trusted site (financetoday.in) loading scripts from unrelated foreign domain (cdn-news-assets.ru)',
            'Russian ccTLD (.ru) + bulletproof ASN — high-risk hosting infrastructure',
            'Domain age: 6 days — newly registered CDN domains are a strong malware indicator',
            'POST /collect endpoint: beaconing browser fingerprints + session cookies — credential theft',
            'Stage2.js: secondary payload — multi-stage attack confirms automated exploitation chain',
            'Persistence: startup folder JS file written — browser compromise escalated to system persistence',
            '7 employees affected — all via same trusted site — watering hole confirmed (not individual targeting)',
        ],
        {
            attackType: 'Watering Hole Attack — Compromised Third-Party Site',
            threatLevel: 'High',
            tasks: [
                'Explain why a watering hole attack is more dangerous against security-aware employees than a direct phishing email.',
                'The proxy log shows POST /collect sending browser fingerprint + session cookies. What data would the attacker prioritize and why?',
                'The EDR alert shows updater.js written to the Startup folder. What is the attacker\'s persistence objective and how would you remove this artifact?',
            ],
        },
        {
            sessionCookies: '7 employee browser sessions potentially exfiltrated — banking, email, intranet access',
            persistentAccess: 'updater.js in Startup folder — beaconing on every boot even after browser closed',
            lateralOpportunity: 'Finance employees visiting during market hours — session cookies may include trading platforms, SWIFT-linked apps',
        },
        [
            'Watering hole vs. phishing: Phishing asks a user to click something suspicious. Watering hole exploits a site the user ALREADY TRUSTS and visits routinely. Security training says "don\'t click suspicious links" — it says nothing about "don\'t visit financetoday.in." Trained security awareness does not protect against watering holes.',
            'Attacker prioritizes: (1) Session cookies for banking/email/VPN apps (immediate account access without password). (2) Corporate SSO tokens (access to all internal apps). (3) Browser saved passwords. Session cookies are most valuable — valid immediately, no password needed.',
            'Remove updater.js: (1) Delete %APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\updater.js. (2) Run full EDR scan. (3) Check scheduled tasks and registry Run keys for additional persistence. (4) Revoke all browser sessions and force re-login on all corporate apps.',
        ],
        'phishing',
        'VERDICT: Watering Hole Attack — Compromised Third-Party CDN. 7 Employees Affected. HIGH RISK.\n\nAttack: Attacker compromised financetoday.in\'s CDN supply chain or injected script via site vulnerability → all visitors receive malware silently.\n\nPersistence: Startup folder JS file — system-level persistence established from browser exploit.\n\nDefensive Controls:\n(1) Content Security Policy (CSP) monitoring — flag script loads from non-whitelisted domains.\n(2) Web proxy with script inspection: block .js loads from newly registered or foreign domains.\n(3) EDR: startup folder write + foreign IP beacon = auto-isolate rule.\n(4) Revoke all 7 employees\' browser sessions and corporate SSO tokens immediately.'
    ),

    mkLab(
        'SocEng - Quid Pro Quo: Survey for Chocolate',
        1,
        'During FinTrust Corp\'s "Cybersecurity Awareness Month," a person sets up an unofficial stand at the lobby entrance. They offer employees free imported chocolate in exchange for filling out a short "employee satisfaction survey" on a tablet. The survey collects corporate email, date of birth, home postal code, and asks for "your workplace Wi-Fi password hint (just the first 3 characters)." No official branding, no visitor badge visible on the survey collector.',
        {
            type: 'survey_form_artifact',
            location: 'FinTrust Corp lobby — unofficial stand near reception',
            incentive: 'Ferrero Rocher box (₹850 retail) per completed survey',
            surveyFields: [
                'Full Name',
                'Corporate Email Address',
                'Date of Birth',
                'Home Postal Code',
                'Which department do you work in?',
                'Your Wi-Fi password hint (just first 3 characters — for "security research")',
                'What device do you use most: laptop / phone / tablet?',
            ],
            collectorDetails: 'No visitor badge. No official FinTrust lanyard. Claims to be from "a third-party HR consultancy."',
            officeManagerNote: 'Front desk confirms: no authorized survey activity registered for today.',
        },
        [
            'No official branding or ID — unauthorized data collection in physical premises',
            'Incentive (chocolate) = quid pro quo: something-for-something social engineering tactic',
            'Data overcollection: DOB + postal code + corporate email = sufficient for identity fraud / phishing targeting',
            'Wi-Fi password hint (first 3 characters) — direct network credential harvesting disguised as "research"',
            'No registered visitor — security desk has no record of authorized survey activity',
            'Cybersecurity Awareness Month context: employees in "security mindset" mode still fell for physical social engineering',
        ],
        {
            attackType: 'Quid Pro Quo — Incentive-Based Data Harvesting',
            threatLevel: 'Medium-High',
            tasks: [
                'What combination of data fields collected enables the most damaging follow-on attacks?',
                'The attacker chose Cybersecurity Awareness Month to conduct this attack. What psychological insight does this timing demonstrate?',
                'Draft the immediate security response procedure from the moment an employee reports this stand to the security desk.',
            ],
        },
        {
            dataHarvested: 'Corporate emails (phishing list), DOB + postal code (identity pre-fill for social engineering), Wi-Fi hints (network access)',
            followOnAttacks: 'Targeted spear phishing using name + corporate email + DOB; Wi-Fi hint enables brute force narrowing',
            identityFraud: 'DOB + name + postal code sufficient for some Indian identity verification systems (banking, telecom)',
        },
        [
            'Most dangerous data combination: Corporate email + Full Name + DOB + postal code = spear phishing with pre-filled personal data. Adding the Wi-Fi hint reduces password brute-force space significantly. This dataset enables: targeted phishing, Wi-Fi access, and identity pre-text for further social engineering calls.',
            'Cybersecurity Awareness Month timing: employees attend awareness sessions → feel security-conscious → paradoxically lower guard in face-to-face interactions because "I just learned about phishing — this is different, it\'s in person." The attacker exploits the perception gap between digital and physical threats.',
            'Immediate response: (1) Security desk: politely detain collector and request ID. (2) Collect tablet + survey forms as evidence. (3) Alert all employees via email/Slack immediately. (4) Log all who completed survey — notify them of data exposure. (5) Escort collector out. (6) File police complaint and internal security incident report.',
        ],
        'phishing',
        'VERDICT: Quid Pro Quo Social Engineering — Unauthorized Data Harvesting. MEDIUM-HIGH RISK.\n\nTactic: Physical charm + low-cost gift = high compliance rate even among security-aware staff.\n\nData at Risk: Corporate emails, DOBs, postal codes, Wi-Fi hints — full spear-phishing prerequisite dataset.\n\nDefensive Controls:\n(1) Visitor management: ALL surveys/research in premises require advance HR/Security approval.\n(2) Data minimization training: employees should never share work credentials, DOB, or postal code in any survey without explicit security clearance.\n(3) Security desk checklist: unknown stands or tables → immediate escalation to security officer.\n(4) Awareness: address physical social engineering explicitly — not just digital phishing.'
    ),

    mkLab(
        'SocEng - Evil Twin WiFi at Branch Office',
        2,
        'Employees at FinTrust Corp\'s Bangalore branch office report inconsistent internet speeds throughout the day. An IT audit of wireless networks reveals two SSIDs broadcasting simultaneously in the building: the official "FinTrust-Corp-Guest" and an unregistered "FinTrust_Corp_Guest_Free" (with underscore and "Free" suffix). The rogue SSID has a stronger signal than the official one. Users connecting to the rogue network are redirected to a captive portal requesting their corporate email and password.',
        {
            type: 'wifi_audit_scan',
            scanTimestamp: '2026-02-21 14:22',
            officialSSID: {
                name: 'FinTrust-Corp-Guest',
                BSSID: '00:1A:2B:3C:4D:5E',
                signal: '-65 dBm',
                security: 'WPA2-Enterprise (802.1x)',
                registered: true,
            },
            rogueSSID: {
                name: 'FinTrust_Corp_Guest_Free',
                BSSID: 'CC:FF:EE:DD:BB:AA',
                signal: '-48 dBm (stronger than official)',
                security: 'WPA2-Personal (simple password: "guest123")',
                captivePortal: 'http://wifi-auth-portal[.]net/login',
                registered: false,
            },
            captivePortalFields: ['Corporate Email Address', 'Network Password'],
            deviceLocation: 'Rogue AP signal strongest from visitor parking — device likely in a car/van outside building',
        },
        [
            'SSID spoofing: "FinTrust_Corp_Guest_Free" vs. official "FinTrust-Corp-Guest" — underscores vs. hyphens, "Free" appended',
            'Stronger signal (-48 dBm vs. -65 dBm) — rogue AP boosted to override legitimate signal preference',
            'Security downgrade: WPA2-Enterprise (802.1x — no password sharing) vs. WPA2-Personal (shared password)',
            'Captive portal over HTTP (not HTTPS) — credentials submitted in plaintext',
            'Captive portal URL: wifi-auth-portal.net — not fintrust.com domain',
            'Rogue AP location: visitor parking — external threat actor with line-of-sight from outside perimeter',
        ],
        {
            attackType: 'Evil Twin Attack — Rogue Access Point with Credential Harvest Portal',
            threatLevel: 'High',
            tasks: [
                'How does a rogue AP with stronger signal manipulate device auto-connection behavior on Windows/Android?',
                'The captive portal uses HTTP, not HTTPS. Why is this significant for credential security?',
                'List the steps to locate and disable the rogue AP physically.',
            ],
        },
        {
            credentialHarvest: 'Corporate email + password from all employees/visitors who connected to rogue AP',
            networkInterception: 'All HTTP traffic from connected devices interceptable (MITM position)',
            furtherAttack: 'Harvested corporate credentials enable email access, VPN login, internal system access',
        },
        [
            'Windows auto-connection: devices connect to strongest signal matching a remembered SSID name. "FinTrust_Corp_Guest_Free" is a DIFFERENT SSID (underscores) — but visually similar. Users reading quickly on their phone may select it manually assuming it\'s the office network. Android/iOS also show signal strength — stronger = listed first.',
            'HTTP captive portal: credentials submitted in cleartext. Anyone in MITM position (the attacker IS in MITM position as the rogue AP) receives username + password in plaintext — no TLS interception needed. A legitimate captive portal always uses HTTPS.',
            'Locate rogue AP: (1) Walk the building with WiFi analyzer (signal strongest near parking = source direction). (2) MAC address lookup (CC:FF:EE:DD:BB:AA) — random/spoofed confirms rogue device. (3) Physical sweep of visitor parking area. (4) Disable at source or use 802.11 deauth flood to disconnect clients while locating.',
        ],
        'phishing',
        'VERDICT: Evil Twin / Rogue AP Attack — Corporate Credential Harvest. HIGH RISK.\n\nRogue AP positioned externally (visitor parking) — stronger signal attracts employee/visitor devices.\n\nHTTP captive portal = plaintext credential submission directly to attacker.\n\nDefensive Controls:\n(1) WPA3-Enterprise for all corporate WiFi — prevents evil twin from offering equivalent security level.\n(2) 802.1x certificate authentication — even if employee connects to rogue AP, authentication fails without valid certificate.\n(3) Wireless IDS (WIDS): alert on duplicate SSID + unregistered BSSID.\n(4) DNS filtering: block non-corporate captive portals.\n(5) Employee training: verify exact SSID spelling + HTTPS requirement before entering any credentials in WiFi portal.'
    ),

    mkLab(
        'SocEng - Tailgating: The Friendly Intruder',
        1,
        'A FinTrust Corp security officer reviewing lobby CCTV footage identifies a pattern over 3 days: an unknown male individual enters the secure 4th floor (Financial Operations) by closely following badged employees through the access-controlled door, always carrying items in both hands (laptop bag + coffee cup) — making badge presentation physically awkward and exploiting employee courtesy. The individual spent between 45 and 90 minutes on the floor on each visit before departing.',
        {
            type: 'cctv_composite_log',
            location: 'FinTrust Corp HQ — 4th Floor (Financial Operations) badge-controlled door',
            incidents: [
                { date: '2026-02-17 Monday', time: '09:12 AM', duration: '47 min', method: 'Followed employee with coffee cup + laptop bag — employee held door open' },
                { date: '2026-02-19 Wednesday', time: '02:34 PM', duration: '91 min', method: 'Engaged target employee in conversation at door — entered as employee scanned badge' },
                { date: '2026-02-21 Friday', time: '11:08 AM', duration: '63 min', method: 'Arrived with food delivery bags — employee assumed authorized delivery person' },
            ],
            physicalAppearance: 'Business casual attire, no visible badge, 30–35 years, laptop bag',
            accessObservation: 'Individual visited open desk area near Finance director\'s office — no challenges from staff',
            noBadgeAlert: 'Door access log shows no badge swipe for the unknown individual on any of the 3 dates',
        },
        [
            'No badge swipe on 3 separate entries — door access log discrepancy (1 badge swipe, 2 people entering)',
            'Both hands occupied (laptop + cup, food bags) — classic tailgating prop technique to prompt door-holding',
            'Business casual attire — blends with office environment, reduces challenge likelihood',
            'No staff challenge on any of 3 visits — exploits workplace courtesy and social norms',
            '3 visits in one week — persistent, reconnaissance-focused intrusion pattern',
            'Extended floor time (45–91 minutes): sufficient for physical device tampering, photography of screens/documents, USB drop',
        ],
        {
            attackType: 'Tailgating / Piggybacking — Physical Access Control Bypass',
            threatLevel: 'High',
            tasks: [
                'Why do both-hands-full props (coffee cup + laptop bag) specifically increase tailgating success rates?',
                'The individual spent up to 91 minutes on the Finance floor undetected. List 5 malicious activities achievable in 91 minutes with unsupervised physical access to an open office.',
                'Write the challenge script a Finance floor employee should use when encountering an unknown individual without a visible badge.',
            ],
        },
        {
            physicalBreach: 'Finance Operations floor — access to physical documents, unlocked screens, unattended devices',
            possibleActions: 'Screen photography, USB implant, document theft, device hardware keylogger, network tap installation',
            cumulativeRisk: '3 successful entries × 45–91 minutes = 135–273 minutes total unsupervised access to sensitive floor',
        },
        [
            'Hands-full prop psychology: social conditioning makes holding doors for people carrying items automatic and considered polite. Refusing feels rude/unkind. The prop also makes it physically harder for the attacker to present a badge — which the victim then feels bad about asking for. This exploits human helpfulness and social norm compliance.',
            '5 activities in 91 minutes: (1) USB drop on unattended workstation. (2) Photo finance documents on desks. (3) Install hardware keylogger on keyboard. (4) Note usernames visible on screens. (5) Plant hidden camera device (spy cam) aimed at open desk area.',
            'Challenge script: "Hi! I don\'t think I\'ve seen you before — could I see your badge? I\'m required to verify anyone on this floor." [If no badge] "No problem, I\'ll need to walk you to reception to get a visitor pass. Company policy requires all visitors to be registered — let me help you with that."',
        ],
        'phishing',
        'VERDICT: Tailgating — 3 Successful Unauthorized Physical Access Events. HIGH RISK.\n\nPattern: Deliberate, repeated — reconnaissance or device implant mission. 3 visits indicates objective not yet complete OR multiple objectives.\n\nFinance floor access: real risk of keylogger, USB implant, document photography, or network tap.\n\nDefensive Controls:\n(1) Turnstile/mantrap: physical infrastructure that prevents tailgating (one person per badge swipe).\n(2) Visitor management: all unescorted visitors = immediate challenge from any employee.\n(3) Security drill: "challenge unknown individuals" role-play — employees practice challenge script monthly.\n(4) Badge visibility enforcement: lanyards required at all times. No badge visible = immediate report to security.\n(5) CCTV real-time monitoring with door anomaly alert (1 swipe, 2 entries).'
    ),

    mkLab(
        'SocEng - USB Drop: Salary Increment List',
        2,
        'A USB flash drive is found in FinTrust Corp\'s employee parking lot. The drive is labeled with printed adhesive tape: "SALARY INCREMENT LIST 2025-26 — CONFIDENTIAL." An employee picks it up and plugs it into their workstation in the Finance department. The EDR system generates a critical alert 8 seconds after insertion. The building\'s CCTV shows the USB was deliberately placed, not accidentally lost.',
        {
            type: 'edr_alert_plus_usb_forensic',
            discoveryLocation: 'Employee parking lot — Section B, near Finance staff reserved parking',
            usbLabel: '"SALARY INCREMENT LIST 2025-26 — CONFIDENTIAL"',
            insertionTimestamp: '2026-02-21 08:47:23',
            edrAlertTimestamp: '2026-02-21 08:47:31 (8 seconds post-insertion)',
            edrAlertDetails: {
                rule: 'Autorun execution + outbound C2 connection attempt',
                process: 'autorun.inf → payload.exe',
                fileWritten: '%TEMP%\\winlogon32.exe',
                registryModified: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run → winlogon32.exe',
                networkAttempt: '185.244.25.91:4444 (TCP — Metasploit default C2 port, Russia)',
            },
            usbForensic: {
                filesystem: 'FAT32',
                files: ['autorun.inf', 'payload.exe', 'Salary_Increment_2025.pdf.lnk'],
                autorunContent: '[autorun]\nopen=payload.exe\nicon=salary.ico',
                lnkTarget: 'C:\\Windows\\System32\\cmd.exe /c payload.exe && start decoy.pdf',
            },
            cctvNote: 'USB placed deliberately between 07:50–08:15 AM by unknown individual (hooded, face obscured)',
        },
        [
            'autorun.inf: Windows autorun execution — triggers payload.exe on insertion without user action (on unpatched systems)',
            'payload.exe: C2 beacon to 185.244.25.91:4444 — Metasploit meterpreter default port, Russian IP',
            'winlogon32.exe in %TEMP% + Run registry key: persistence via process name masquerading as Windows logon process',
            'Decoy PDF displayed after execution: victim sees "Salary file" — no suspicion while malware runs silently',
            'Label "CONFIDENTIAL — Salary": highest-curiosity bait for Finance employees — targeted placement',
            'USB deliberately placed pre-business hours: timed for first-arrival employee to find before IT is fully staffed',
        ],
        {
            attackType: 'USB Baiting — Malware Delivery via Physical Media',
            threatLevel: 'Critical',
            tasks: [
                'What is the psychological principle behind labeling the USB "Salary Increment List — CONFIDENTIAL"?',
                'The EDR alert fired 8 seconds after insertion. What event chain triggered the alert and what would happen if EDR was absent?',
                'Identify the MITRE ATT&CK technique IDs for: (a) USB autorun execution, (b) C2 over TCP, (c) Run key persistence.',
            ],
        },
        {
            systemCompromise: 'Remote shell (meterpreter) established to attacker — full system access',
            persistence: 'Startup Run key — survives reboot, re-establishes C2 on every boot',
            lateralMovement: 'From Finance workstation: access to Finance shared drives, SWIFT-linked systems, financial data',
        },
        [
            'Psychological principle: CURIOSITY + SELF-INTEREST (salary information is directly relevant to every employee) + AUTHORITY/CONFIDENTIALITY (labeled "Confidential" increases perceived value and urgency). This combination overrides logical security thinking — "I know I shouldn\'t, but this is about MY salary." Known as "curiosity gap" exploitation in social engineering.',
            'EDR chain: autorun.inf executed → payload.exe launched → payload.exe attempted TCP connection to 185.244.25.91:4444 → EDR network rule flagged outbound connection to known bad IP. Without EDR: payload.exe silently establishes C2 shell, runs in background, Finance workstation fully controlled by attacker.',
            'MITRE ATT&CK: (a) T1091 — Replication Through Removable Media. (b) T1095 — Non-Application Layer Protocol (raw TCP C2). (c) T1547.001 — Boot or Logon Autostart Execution: Registry Run Keys.',
        ],
        'phishing',
        'VERDICT: USB Baiting — Malware Delivery via Physical Media. CRITICAL RISK. EDR contained.\n\nBait: Curiosity + self-interest = Finance employee plugs unknown USB into corporate workstation.\n\nPayload: Persistent C2 shell (meterpreter). If EDR absent: full Finance system compromise.\n\nDefensive Controls:\n(1) Disable USB storage via Group Policy / Endpoint DLP — block unknown USB insertion entirely.\n(2) Autorun disabled by default on all Windows systems (policy: NoDriveTypeAutoRun).\n(3) Physical security awareness: "If you find a USB, DO NOT plug it in — bring it to IT Security immediately."\n(4) EDR USB insertion alert: any new USB device = alert to SOC.\n(5) Targeted security drill: place test USBs, measure plug-in rate, use as training moment.'
    ),

    mkLab(
        'SocEng - Fake LinkedIn Recruiter: Identity Harvest',
        1,
        'A FinTrust Corp mid-level analyst receives a LinkedIn InMail from someone claiming to be a senior talent partner at "Global Finance Careers" (a seemingly legitimate firm). The message offers a confidential senior role opportunity and asks the analyst to complete a "pre-screening form" to proceed. The form requests standard resume data plus the last 4 digits of their Aadhaar number for "background verification pre-approval."',
        {
            type: 'linkedin_dm_plus_form',
            senderProfile: {
                name: 'Shreya Kapoor — Senior Talent Partner, Global Finance Careers',
                connections: 312,
                profileAge: '3 months old (LinkedIn "Member since: November 2025")',
                profilePhoto: 'Professional headshot — reverse image search returns multiple foreign profiles',
                company: 'Global Finance Careers — LinkedIn company page created 2 months ago, no employee count shown',
                endorsements: '8 generic skills endorsements — all from accounts created same week',
            },
            messageContent: '"Hi [Name], your profile stood out for a confidential VP Finance role at a Tier-1 institution. Salary: ₹38–42L. Urgent opening. Click below to complete our pre-screening — takes 5 minutes. Strictly confidential."',
            formURL: 'https://resume-upload-careerportal[.]co/apply?ref=linkedin',
            formFields: [
                'Full Name',
                'Current Employer',
                'Current CTC',
                'Date of Birth',
                'Personal Email',
                'Personal Mobile Number',
                'Last 4 digits of Aadhaar (for background check pre-registration)',
                'LinkedIn Profile URL',
                'Current Reporting Manager\'s Name',
            ],
            domainAge: 'resume-upload-careerportal.co — registered 11 days ago, .co TLD (not .com)',
        },
        [
            'Profile age: 3 months — legitimate senior recruiters have years of LinkedIn history',
            'Reverse image search: profile photo appears on multiple unrelated foreign profiles = AI-generated or stolen photo',
            'Company: LinkedIn page 2 months old — no legitimate global recruiter has a 2-month-old company page',
            'Form URL: resume-upload-careerportal.co — not a known recruitment platform, 11-day-old domain, .co TLD',
            'Aadhaar last 4 digits: NO legitimate background check requires Aadhaar digits at pre-screening stage — this is a red flag',
            'Reporting manager\'s name: collected for follow-on social engineering (impersonation calls to victim\'s employer)',
            'Urgency framing: "urgent opening" + "strictly confidential" = prevents due diligence and sharing with others',
        ],
        {
            attackType: 'Identity Harvesting via Fake LinkedIn Recruiter',
            threatLevel: 'Medium-High',
            tasks: [
                'Which specific form field is the highest-value data point for identity fraud, and why?',
                'The attacker collected the reporting manager\'s name. How would this be used in a follow-on attack?',
                'Describe three ways to verify a LinkedIn recruiter\'s legitimacy before engaging with any form.',
            ],
        },
        {
            dataHarvested: 'Name, DOB, mobile, Aadhaar partial, employer + manager name, personal email, current salary',
            identityFraud: 'DOB + partial Aadhaar + name + mobile = pre-fill for many Indian financial/telecom KYC flows',
            professionalRisk: 'Current CTC disclosed → salary negotiation leverage lost; manager name → used for impersonation of victim to employer',
        },
        [
            'Highest-value field: Aadhaar last 4 digits + DOB + full name + mobile. Together these four unlock many Indian account recovery and KYC flows. "Last 4 Aadhaar" is used as a verification field in UPI apps, some banking systems, and telecom SIM management — a combination attack.',
            'Manager name use: Attacker calls victim\'s company claiming to be a reference checker. "Hi, I\'m calling about [victim name] — [manager name] is listed as their supervisor?" → confirms victim\'s employment, tries to social engineer manager into confirming additional data (reporting structure, pending projects, internal contacts for spear phishing).',
            'Recruiter verification: (1) Search company name + "recruiter" + "LinkedIn" — genuine firm has established digital footprint. (2) Look up the person\'s full name on the company\'s OFFICIAL website. (3) Request their corporate email (name@companydomain.com) — real recruiters use company email, not Gmail. (4) Check LinkedIn join date — under 6 months for a "senior recruiter" is suspicious.',
        ],
        'phishing',
        'VERDICT: Fake LinkedIn Recruiter — Identity Harvesting Scam. MEDIUM-HIGH RISK.\n\nGoal: Collect PII dataset for identity fraud (Aadhaar partial + DOB + mobile + name) and organizational intelligence (manager names for follow-on social engineering).\n\nDefensive Controls:\n(1) Policy: Corporate email + Aadhaar data NEVER shared through external forms — period.\n(2) LinkedIn awareness training: fake recruiter profile indicators (age, photo, company, domain).\n(3) Before submitting any form from LinkedIn: verify domain age (whois.domaintools.com), verify company, contact recruiter via official company website.\n(4) Report suspicious recruiter to LinkedIn Trust & Safety immediately.'
    ),

    mkLab(
        'SocEng - CEO Email Whaling: Urgent Wire Transfer',
        2,
        'A Finance Officer at FinTrust Corp receives an email appearing to be from the CEO requesting an urgent wire transfer. The email uses a spoofed display name matching the CEO, creates extreme urgency, instructs secrecy, and provides alternate reply instructions. Email header analysis reveals critical authentication failures. The Finance Officer nearly authorized the transfer before the SOC team intervened.',
        {
            type: 'email_with_headers',
            displayName: 'CEO – Ramesh Gupta (FinTrust)',
            fromAddress: 'ceo.fintrust.ramesh@gmail[.]com',
            toAddress: 'priya.finance@fintrust.com',
            subject: 'URGENT — Wire Transfer Required Before Market Close',
            body: 'Priya, I\'m in a board meeting and cannot take calls. We need to wire ₹18,50,000 to a new vendor account immediately — legal has approved. Send to:\n\nAccount: HDFC XXXX XXXX 4471\nBeneficiary: FastGlobal Trading Pvt Ltd\nIFSC: HDFC0000XXX\n\nComplete by 3:30 PM today. Do not discuss with anyone — this is under NDA. Confirm by replying directly to: financewire.fintrust@outlook[.]com\n\nRamesh',
            emailHeaders: {
                'Received-From': 'mail.gmail.com [216.58.XX.XX]',
                'SPF': 'FAIL — gmail.com not authorized sender for fintrust.com',
                'DKIM': 'NONE — no DKIM signature present',
                'DMARC': 'FAIL — policy: quarantine (not enforced — delivered to inbox)',
                'Reply-To': 'financewire.fintrust@outlook.com',
                'Message-ID': '<Xy9z.gmail.com>',
            },
            beneficiaryCheck: 'FastGlobal Trading Pvt Ltd — MCA search: company registered 12 days ago, no operations history',
        },
        [
            'From: Gmail address — CEO uses ramesh.gupta@fintrust.com (corporate domain), never Gmail',
            'SPF FAIL: gmail.com not authorized to send on behalf of fintrust.com',
            'DKIM: NONE — no organizational signing',
            'DMARC FAIL: policy quarantine but not enforced — delivered despite failure (policy misconfiguration)',
            'Reply-To: outlook.com — replies go to attacker-controlled address, not CEO\'s real address',
            'Urgency + secrecy: "before market close," "under NDA" — prevents dual-approval and verification',
            'Beneficiary: 12-day-old company — mule/shell company for money laundering',
            '"Board meeting, can\'t take calls" — pre-empts phone verification',
        ],
        {
            attackType: 'Business Email Compromise (BEC) — CEO Whaling / Wire Fraud',
            threatLevel: 'Critical',
            tasks: [
                'Explain why SPF FAIL + DKIM NONE + DMARC FAIL (not enforced) allowed this email to reach the inbox.',
                'The email instructs "do not discuss with anyone." What social engineering principle makes this instruction effective?',
                'Write the dual-control wire verification procedure that would have stopped this transfer.',
            ],
        },
        {
            financialLoss: '₹18,50,000 attempted wire transfer to attacker-controlled mule account',
            recoveryRisk: 'Wire transfers to Indian accounts typically irrecoverable within hours of completion',
            organizationalRisk: 'If successful: financial loss + regulatory reporting obligations + reputational damage',
        },
        [
            'Email delivery despite failures: SPF FAIL means Gmail sent the email but fintrust.com\'s SPF record denies Gmail as authorized sender. DKIM NONE means email body is unsigned — unverifiable. DMARC FAIL should quarantine/reject. BUT: DMARC policy was "quarantine" not "reject" AND enforcement was not active → email delivered to inbox. Fix: DMARC policy should be "p=reject" — this email would never reach the inbox.',
            '"Do not discuss with anyone — NDA" uses AUTHORITY (CEO + legal NDA) + SCARCITY (deadline) to isolate the victim from colleagues who might spot the fraud. Dual-approval requires a second person → secrecy instruction is specifically designed to disable this control. This is a classic BEC manipulation: eliminate the human safety net before the victim notices.',
            'Wire verification procedure: (1) ANY wire request by email — regardless of sender — requires voice verification via the CEO\'s OFFICIAL internal phone extension. (2) Two-person authorization: Finance Officer initiates + Finance Manager approves independently. (3) Beneficiary DD: any new beneficiary requires 48-hour cooling period + vendor onboarding verification. (4) Amount threshold: transactions >₹5L require CFO countersignature.',
        ],
        'phishing',
        'VERDICT: CEO Whaling / BEC — ₹18,50,000 Wire Fraud Attempt. SOC Intervened Before Transfer. CRITICAL RISK.\n\nEmail Spoofing: Display name mimics CEO. Gmail sender, SPF/DKIM/DMARC all failed — but DMARC not enforced → delivered.\n\nDefensive Controls:\n(1) DMARC p=reject: all emails failing authentication auto-rejected — this email never reaches inbox.\n(2) Finance policy: zero wire transfers via email instruction alone — all wires require verified phone callback.\n(3) Dual authorization for all transfers >₹1L.\n(4) Beneficiary cooling period: 48 hours for new accounts.\n(5) CEO spoofing training: Finance team specific drill — highest-risk BEC target group.'
    ),

    mkLab(
        'SocEng - Dumpster Diving: HR Document Disposal Failure',
        1,
        'A FinTrust Corp security officer conducting a facility audit discovers a public waste bin near the HR department contains unshredded printed documents. The documents include employee salary records, partial Aadhaar numbers, employee ID lists, and a printed email chain discussing a pending performance improvement plan (PIP). The bin is accessible to delivery personnel, cleaning staff, and visitors without any access control.',
        {
            type: 'physical_document_audit',
            location: 'Open waste bin — corridor outside HR department, 4th floor',
            accessible: 'Cleaning staff, delivery personnel, visitor escort zone — no badge required for corridor access',
            documentsFound: [
                {
                    type: 'Salary register printout (Q4 2025)',
                    content: 'Full employee names, employee IDs, CTC, bank account names',
                    sensitivity: 'CONFIDENTIAL',
                    shredded: false,
                },
                {
                    type: 'Aadhaar copy printout × 3',
                    content: 'Name, DOB, partial Aadhaar number (last 4 digits visible), photo',
                    sensitivity: 'HIGHLY CONFIDENTIAL — PII',
                    shredded: false,
                },
                {
                    type: 'Email chain printout',
                    content: 'Subject: PIP Initiation — [Employee Name] | Details of performance issue + manager comments',
                    sensitivity: 'CONFIDENTIAL — HR',
                    shredded: false,
                },
                {
                    type: 'Access control request form',
                    content: 'Employee name, ID, requested system access, approver name + signature',
                    sensitivity: 'INTERNAL',
                    shredded: false,
                },
            ],
            discoveredBy: 'Security officer — routine facility audit',
            nondestruction: 'Documents appear fully intact — not shredded, not torn',
        },
        [
            'Zero document destruction: all documents intact and readable — no shredding policy followed',
            'PII documents (Aadhaar, salary) in unsecured open bin — accessible to non-employees in corridor',
            'Employee ID + bank account names: sufficient for phishing calls impersonating bank ("your account has suspicious activity")',
            'PIP email: reveals employee underperformance — attackers use this for targeted social engineering against vulnerable employees',
            'Access control request form with approver signature: potential for document forgery to claim authorized access',
            'Clustered high-value data: one bin visit yields enough for multi-vector attack campaign',
        ],
        {
            attackType: 'Dumpster Diving — Physical Document Intelligence Gathering',
            threatLevel: 'High',
            tasks: [
                'Rank the four document types by attack utility (1 = most useful to attacker) and justify each ranking.',
                'The PIP email reveals an employee under performance review. How could an attacker weaponize this specific information?',
                'Write a clean desk and document disposal policy that would prevent this incident.',
            ],
        },
        {
            identityTheft: 'Aadhaar partial + name + DOB: pre-fill for Indian identity fraud, SIM swap pre-work',
            targetedPhishing: 'Employee ID + bank account names: targeted banking impersonation calls',
            socialEngineering: 'PIP employee: vulnerable target for insider threat recruitment or social engineering ("we can help you — leak this data")',
            documentForgery: 'Access request form + approver signature: template for forged authorization documents',
        },
        [
            'Ranking by attack utility: (1) Aadhaar copies — direct PII for identity fraud, SIM swap, KYC bypass. (2) Salary register — employee IDs + bank names for targeted banking impersonation phishing. (3) Access request form + signature — document forgery template for unauthorized access claim. (4) PIP email — targeted social engineering against vulnerable employee (insider threat recruitment).',
            'PIP employee weaponization: Attacker contacts the employee: "I know about your situation at FinTrust. I can help you — I just need [data/access] in exchange." This is insider threat recruitment via social engineering of a psychologically vulnerable individual. The attacker uses the PIP information as: (a) proof of insider knowledge (builds trust), (b) emotional leverage.',
            'Clean desk and disposal policy: (1) All printed documents must be cross-cut shredded before disposal — no exceptions. (2) Shredder bins in every HR/Finance area — accessible at desk level. (3) Locked document destruction bins with scheduled shred service for bulk. (4) Clean desk rule: no documents left unattended on desk or in open bins at end of day. (5) Classified document register: all CONFIDENTIAL prints must be logged and destruction confirmed.',
        ],
        'phishing',
        'VERDICT: Dumpster Diving — Sensitive Data Disposal Failure. HIGH RISK.\n\nSingle facility audit reveals: salary data, Aadhaar PII, HR confidential communications, and document forgery templates — in an open, uncontrolled bin.\n\nAttacker requires: zero technical skill, zero system access — only physical proximity to a corridor.\n\nDefensive Controls:\n(1) Cross-cut shredder in every HR/Finance team area — mandatory before any document disposal.\n(2) Locked document destruction bins with weekly certified shred service.\n(3) Clean desk policy audit: monthly random inspection by security.\n(4) DPDP Act 2023 compliance: unshredded Aadhaar/PII disposal = regulatory violation — reportable data breach.\n(5) Visitor management: corridor outside HR must be badge-controlled — no open access to disposal areas.'
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
        console.log(`  ✔ [BGN ${lab.difficulty}/10] ${lab.title}`);
    }

    const total = await Lab.countDocuments();
    console.log(`\n✅ Done — ${LABS.length} Social Engineering Beginner labs upserted.`);
    console.log(`   🗄️  Total labs in DB: ${total}`);
    process.exit(0);
}

seed().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
