'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// Expert Smishing: 500 XP | 30 min | 0 hints | Difficulty 8-9/10

const mkLab = (title, difficulty, scenario, thread, indicators, tasks, answer, explanation) => ({
    title, topic: 'smishing', level: 'expert', type: 'smishing',
    difficulty, points: 500, timeLimit: 1800, published: true,
    description: `Expert smishing simulation: ${title.replace('Smishing - ', '')}. Enterprise SOC deep-dive — no hints provided.`,
    scenario,
    content: { smsThread: thread, indicators, artifacts: [] },
    steps: tasks,
    hints: [],
    correctAnswer: answer,
    explanation,
});

const LABS = [

    mkLab('Smishing - SMS Pumping Fraud (IRSF via OTP API)', 9,
        'FinTrust Corp\'s SMS platform shows an 800% OTP volume spike in 4 hours. Analysis reveals an automated bot is triggering OTP sends to sequential premium-rate international numbers — generating revenue for the attacker through carrier revenue-share agreements.',
        [
            { time: '02:00–06:00 AM', sender: 'Platform Logs', message: '[OTP SMS volume: Normal = ~200/hr. Observed: 1,800/hr for 4 consecutive hours. Destination numbers: +883-XXXXXXXX (International Mobile Satellite — premium rate). Sequential patterns detected in destination numbers. Total SMSes sent: 7,200. Estimated platform cost: $3,240 at $0.45/msg.]' },
        ],
        [
            'Volume spike: 800% above baseline — 4-hour window',
            'Destination: +883 prefix (premium-rate international satellite numbers)',
            'Number pattern: Sequential (883-0000-0001 through 883-0000-7200)',
            'Account creation pattern: 7,200 new accounts created at same rate as OTP sends',
            'Account source IP: Rotating residential proxies (30-second rotation)',
            'Bot behavior: Account creation → trigger OTP → dispose account → next',
        ],
        [
            'Explain the SMS Pumping / IRSF (International Revenue Share Fraud) business model: who profits from premium-rate SMS delivery and how does automated account creation enable this at scale?',
            'The attacker rotated residential proxies every 30 seconds. Explain why residential proxy rotation specifically defeats IP-rate-limiting defenses that would stop datacenter proxy traffic.',
            'Design API-level rate limiting and anomaly detection rules that would have capped this attack at under 200 fraudulent SMSes before triggering a sandbox hold.',
            'Calculate the monthly financial exposure if this attack pattern ran undetected: 7,200/4hrs × 24hrs × 30 days × $0.45/msg.',
        ],
        'phishing',
        'VERDICT: SMS Pumping Fraud — IRSF via OTP API Abuse. Direct Cost: $3,240 in 4 hours.\n\nIRSF Mechanism: Attacker controls (or rents access to) premium-rate satellite number ranges (+883). Each OTP SMS delivered to these numbers generates carrier revenue — paid by the platform\'s SMS provider, shared with the attacker\'s premium-rate operator. Zero interaction from real users required.\n\nResidential Proxy Evasion: Residential proxies use real ISP-assigned IP addresses from actual home broadband connections — they blend into legitimate user traffic patterns. Rate-limiting by IP is ineffective because each request arrives from a different residential address. Behavioral fingerprinting (inter-request timing, browser JS challenge) is required.\n\nFinancial Exposure: 7,200/4h = 1,800/h × 24 = 43,200/day × 30 = 1,296,000 SMS/month × $0.45 = $583,200/month undetected.\n\nDetection Rules:\n1. OTP send rate alert: >150% of hourly baseline = automatic sandbox (hold OTPs, alert SOC).\n2. International premium-rate number block list (+883, +882, +881) — no legitimate user has these numbers.\n3. Sequential number pattern detection: >10 consecutive numbers = bot flag.\n4. New account OTP velocity: >3 OTP sends per account per hour = block.'
    ),

    mkLab('Smishing - Automated OTP Phishing Bot (AiTM)', 8,
        'A victim receives 5 rapid OTP messages they didn\'t request, accompanied by an SMS directing them to "approve" a login to prevent suspension. Behind the scenes, an automated Adversary-in-the-Middle (AiTM) bot is relaying their credentials and OTPs to a target service in real time.',
        [
            { time: '11:00 AM', sender: 'BankOTP', message: 'Your OTP is 847201. Do not share.' },
            { time: '11:01 AM', sender: 'BankOTP', message: 'Your OTP is 293847. Do not share.' },
            { time: '11:02 AM', sender: 'BankOTP', message: 'Your OTP is 918273. Do not share.' },
            { time: '11:03 AM', sender: 'BankOTP', message: 'Your OTP is 374859. Do not share.' },
            { time: '11:04 AM', sender: 'BankOTP', message: 'Your OTP is 561820. Do not share.' },
            { time: '11:05 AM', sender: 'login-secure-fast[.]site', message: 'Suspicious login detected. Approve session to prevent account suspension: https://login-secure-fast[.]site/approve' },
        ],
        [
            'Proxy logs: login-secure-fast.site relays all user inputs in real-time to the real bank portal',
            'AiTM infrastructure: EvilProxy-variant framework detected (TLS stripping between victim and real bank)',
            'OTP failures: First 4 OTPs expired before victim clicked the phishing link — bot requested new OTPs each time',
            'Successful session: 5th OTP (561820) relayed to bank portal → session cookie harvested',
            'Session token: Stored in bot C2 → used to access bank account from a Bulgarian IP',
            'Credential stuffing pre-work: Victim email/password sourced from HaveIBeenPwned breach dataset',
        ],
        [
            'Explain the AiTM (Adversary-in-the-Middle) architecture: how does the phishing proxy relay credentials AND session cookies from the real bank site to the attacker in real time?',
            'The first 4 OTPs failed (expired). What does this tell you about the interaction between the attacker\'s automation and the victim\'s real bank session?',
            'Session cookie theft is more valuable than password theft in 2026 — explain why harvesting the authenticated session cookie defeats even hardware MFA.',
            'Recommend detection of AiTM activity from the bank\'s server-side perspective — what anomalies in the session would reveal proxy-mediated access?',
        ],
        'phishing',
        'VERDICT: Expert Smishing — AiTM OTP Bot / Session Cookie Harvesting. Authentication fully bypassed.\n\nAiTM Architecture: The phishing site (login-secure-fast.site) acts as a transparent proxy between the victim and the real bank. When the victim submits credentials, the proxy forwards them to the real bank, receives the real bank\'s session cookie, and both serves the response to the victim AND stores the session cookie for attacker use. The OTP is similarly relayed — the victim types the real OTP into the phishing proxy, which forwards it to the real bank. The session cookie harvested after successful OTP is used by the attacker from Bulgaria — with a fully authenticated session.\n\nFirst 4 OTP Failures: The automated bot was relaying OTP without the victim\'s involvement — it was trying to reuse OTPs before they expired. This confirms the bot was actively attempting authentication on the real bank simultaneously with engineering the victim to the phishing site. The victim\'s click on the "approve session" link at 11:05 provided the live OTP relay that completed authentication.\n\nSession Cookie vs Password: Once authenticated, the session cookie represents a live authenticated browser session — it bypasses the need for any MFA because authentication was already completed. Hardware FIDO2 would prevent this IF the device binding is enforced (FIDO2 keys are domain-bound — the phishing proxy\'s domain would not pass the binding check).\n\nBank-Side AiTM Detection:\n1. TLS fingerprint mismatch: AiTM proxies present different JA3 TLS fingerprints than real mobile browsers.\n2. IP geolocation + device fingerprint correlation: Session authenticated from India but used from Bulgaria within 5 minutes.\n3. Headless browser UA: Bot-driven proxies often use non-standard or headless User-Agent strings.'
    ),

    mkLab('Smishing - Dark Pattern Unsubscribe Trap', 8,
        'A malicious SMS unsubscribe link secretly enrolls victims in premium SMS subscriptions while appearing to remove them from a mailing list. Carrier billing logs confirm £12.99/month charges were silently activated on 4,300 victims\' phone bills.',
        [
            { time: 'Various', sender: 'SpamSource', message: '[User has been receiving frequent unsolicited SMS messages for 3 days]' },
            { time: '03:45 PM', sender: 'StopSpam', message: 'You\'re receiving these messages by mistake. Reply STOP or click to unsubscribe: https://stop-sms-now[.]click/unsubscribe?id=[UNIQUE_ID]' },
        ],
        [
            'Domain: stop-sms-now.click — registered by same registrar as the original spam SMSes',
            'Unsubscribe link: Triggers WAP-billing subscription confirmation silently on mobile networks',
            'WAP-billing: Carrier-direct billing — charge appears on phone bill, not bank statement',
            '£12.99/month subscription: "PremiumSMSAlerts" — victim never consented',
            '4,300 victims enrolled in 72 hours',
            'Carrier: Direct-carrier-billing API used without user-visible confirmation dialog',
        ],
        [
            'Explain WAP-billing / Direct Carrier Billing: how can a URL click trigger a monthly subscription charge on a mobile phone bill without requiring credit card entry or visible confirmation?',
            'Map the "dark pattern" deception: how does presenting the link as "unsubscribe" make victims MORE likely to click than a generic promotion — and why does this generate higher conversion for the attacker?',
            'Regulatory framework: Which regulators govern premium SMS billing in the UK/India, and what disclosures are legally required before a WAP-billing charge can be activated?',
            'Recommend investigation steps to identify and cancel unauthorized WAP-billing subscriptions across 4,300 victim accounts.',
        ],
        'phishing',
        'VERDICT: Expert Smishing — Dark Pattern WAP-Billing Subscription Fraud. £12.99/month × 4,300 victims = £55,857/month ongoing unauthorized revenue.\n\nWAP-Billing Mechanism: Direct Carrier Billing (DCB/WAP-billing) allows mobile operators to charge subscription fees directly to phone bills when a mobile user\'s browser loads a billing API endpoint on carrier network data (not WiFi). No credit card entry required — the user\'s phone number is detected via the carrier network, and a carrier-direct API call registers the subscription. This is legitimate technology (used by Spotify, Google Play) that is being abused here without visible consent.\n\nDark Pattern Psychology: "Unsubscribe" is among the highest-trust click triggers in the SMS ecosystem — users who are frustrated by spam WANT to click unsubscribe. The attacker deliberately bombardarded victims with spam for 3 days to engineer the emotional state (frustration, desire to stop messages) that would make the unsubscribe offer irresistible.\n\nRegulatory Requirements (UK): PSA (Phone-paid Services Authority) Code of Practice §2.3.2 requires explicit user-visible confirmation before any DCB subscription is activated. Silent WAP-billing is a Code violation. Report to PSA (psauthority.org.uk) and Ofcom.\n\nVictim Remediation: Text "STOP" to the premium number on the phone bill. Contact carrier (O2, EE, Vodafone) to request refund and block all future DCB charges ("DCB block"). Check last 3 phone bills for unrecognized £X.99 charges.'
    ),

    mkLab('Smishing - Emergency Alert System (EAS) Impersonation', 9,
        'A smishing campaign mimics the official Emergency Alert System (EAS / FEMA WEA) format — displaying as a high-priority presidential alert with a link for "mandatory registration." The campaign exploits the high-trust nature of real emergency alerts.',
        [
            { time: '09:00 AM', sender: 'Emergency Alert', message: 'PRESIDENTIAL ALERT: This is a test of the National Emergency Alert System. All residents in your area must register at: https://alert-registration-gov[.]com/mandatory — Failure to register within 2 hours may affect emergency notification eligibility.' },
        ],
        [
            'Real WEA alerts: Broadcast via Cell Broadcast (CB) technology — no link, no sender, purely carrier-broadcast',
            'This message: Delivered as a standard P2P SMS — not Cell Broadcast',
            'Domain: alert-registration-gov.com — .com TLD (real FEMA uses .gov)',
            'FEMA.gov confirms: No registration requirement exists for WEA/Emergency Alerts',
            'Sender ID "Emergency Alert": Registered via commercial bulk SMS provider',
            'The linked page harvests SSN, home address, date of birth for "registration"',
        ],
        [
            'Explain the fundamental technical difference between real Wireless Emergency Alerts (WEA/Cell Broadcast) and standard SMS — why can real presidential alerts NOT contain links?',
            'Assess the "mandatory registration" pretext: what does requiring SSN and home address for "emergency notification" actually harvest, and what identity fraud is enabled by this combination?',
            'Real FEMA alerts are sent via Cell Broadcast to all phones in a geographic area simultaneously — no targeting, no opt-in, no links. Explain how this technical design prevents smishing from mimicking real EAS alerts at the delivery layer.',
            'Design a public awareness campaign element and a carrier-level technical control that would reduce EAS impersonation smishing effectiveness.',
        ],
        'phishing',
        'VERDICT: Expert Smishing — Emergency Alert System Impersonation / High-Trust Channel Exploitation.\n\nCell Broadcast vs SMS: Real Wireless Emergency Alerts (WEA — implemented under FCC/OFCOM) are transmitted via Cell Broadcast (CB), a fundamentally different channel from SMS. CB messages: (a) are broadcast simultaneously to all phones in a cell site\'s coverage area, (b) cannot contain URLs or linked content, (c) have no "sender" field — they arrive as system alerts, not SMS. Any "Emergency Alert" arriving as a normal SMS with a URL = definitively not a real alert.\n\nHarvest Target: SSN + date of birth + home address = complete identity profile sufficient for: synthetic identity fraud, account takeover via KBA, tax refund fraud (IRS), and opening new credit accounts. This is among the highest-value PII combinations an attacker can obtain in a single form submission.\n\nCarrier-Level Controls: Carriers can implement Cell Broadcast-only filtering for messages using "Emergency Alert" sender IDs — any SMS (non-CB) attempting to use this sender ID would be blocked. TRAI in India and OFCOM in the UK have both issued guidance on this.\n\nPublic Awareness Key Message: Real emergency alerts make your phone vibrate and emit a loud tone — they appear as system banners with no sender name and NEVER contain website links. Any emergency-claiming SMS with a link = scam.'
    ),

    mkLab('Smishing - High-Fidelity Brand Clone Forensics', 8,
        'A user submits a screenshot of a suspicious banking SMS. Forensic image analysis reveals subtle pixel-level logo distortion, font inconsistency, and certificate metadata anomalies consistent with a high-fidelity phishing kit.',
        [
            { time: '10:30 AM', sender: 'ICICIBANK', message: 'Dear Customer, your account requires immediate KYC verification. Complete here: https://icici-kyc-secure[.]net/verify' },
        ],
        [
            'Logo analysis: ICICI Bank logo shows 1.7px horizontal distortion on bottom-right curve — consistent with downscaling from screenshot capture rather than vector source',
            'Font inconsistency: Body font is "Roboto Regular" — ICICI official uses "ING ME" proprietary font family',
            'SSL certificate: icici-kyc-secure.net — DV (Domain Validation) certificate from Let\'s Encrypt. ICICI Bank uses OV (Organization Validated) certificates from DigiCert',
            'Certificate metadata: Issued 4 days ago. Organization field: blank (DV certificate)',
            'Image steganography check: No hidden payload detected in screenshot',
            'HTML comparison: 94.3% similarity to ICICI official portal HTML (at /login endpoint)',
        ],
        [
            'Explain the significance of logo distortion from downscaling — how does this specific artifact reveal that the attacker scraped the logo from a screenshot rather than obtaining the official brand asset files?',
            'Compare DV (Domain Validation) vs OV (Organization Validated) TLS certificates: why does a DV Let\'s Encrypt certificate fail to provide any organization identity assurance?',
            'The HTML similarity score of 94.3% indicates the page was cloned with automated tools. Describe the cloning methodology and what the remaining 6.7% difference likely contains.',
            'Design a forensic image analysis checklist for evaluating submitted suspicious SMS screenshots — covering logo, font, domain, TLS, and HTML dimensions.',
        ],
        'phishing',
        'VERDICT: Expert Smishing Forensics — High-Fidelity ICICI Bank Clone. Confidence: Very High (phishing).\n\nLogo Distortion Analysis: The 1.7px distortion on the ICICI logo is a downscale artifact — when an image is captured via screenshot and re-uploaded, the pixel rounding creates characteristic curve distortion particularly visible on circular/curved brand elements. Official brand implementations use vector SVG assets directly — screenshots cannot produce perfect vectors. This alone is a reliable indicator of kit-cloned logos.\n\nDV vs OV Certificate: Let\'s Encrypt issues DV certificates automatically via domain validation — it verifies only that the applicant controls the domain, NOT their organizational identity. A certificate for "icici-kyc-secure.net" from Let\'s Encrypt contains zero information confirming this site is ICICI Bank. ICICI\'s real certificates (OV/EV) explicitly state "ICICI Bank Ltd." in the Organization field. Check the padlock → Certificate details → Organization.\n\n6.7% HTML Difference: The modified sections typically contain: (1) the credential POST endpoint (changed from ICICI\'s real endpoint to the attacker\'s collection server), (2) removed or disabled anti-fraud JavaScript, (3) any UI modifications to the "success" redirect. These modifications are the unique fingerprints of the specific phishing kit variant.\n\nForensic Checklist:\n✓ Logo pixel distortion analysis (vector vs raster)\n✓ Font family comparison to official brand guide\n✓ TLS certificate type (DV vs OV/EV) + issuer + org field\n✓ Domain age + WHOIS registrar\n✓ HTML similarity score vs official site\n✓ POST endpoint destination analysis\n✓ Mobile rendering consistency (responsive vs stretched)'
    ),

    mkLab('Smishing - Zero-Click Exploit Indicators (NSO Pegasus Pattern)', 9,
        'A mobile security team detects indicators consistent with a zero-click exploit delivery attempt via iMessage. A targeted FinTrust executive received a blank SMS followed by abnormal system process behavior — matching documented Pegasus spyware deployment patterns.',
        [
            { time: '03:12 PM', sender: 'Unknown (+1 202 555 XXXX)', message: '[Blank SMS — no visible content. Device received but displayed nothing.]' },
        ],
        [
            'System logs immediately post-receipt: Unknown process "IMDApersistentURLConnection" spawned',
            'Outbound encrypted traffic spike: +340% above baseline for 47 seconds post-SMS',
            'DNS queries observed: api-telemetry[.]xyz, cdn-cache-update[.]io (not standard Apple CDN)',
            'Process tree anomaly: launchd → imagent → IMTransferAgent → [Unknown child process — PID 8821]',
            'iStatistica baseline deviation: CPU spike from 3% to 84% for 23 seconds post-receipt',
            'MDM telemetry: Device sent data to non-corporate endpoint',
        ],
        [
            'Explain zero-click exploit delivery: how can a blank SMS or iMessage deliver malicious code to a device without any user interaction — referencing the BLASTPASS/FORCEDENTRY exploit chain mechanisms.',
            'Analyze the process tree anomaly: why does "launchd → imagent → IMTransferAgent → [Unknown child]" indicate a successful exploit-chain execution rather than normal iMessage processing?',
            'The 47-second outbound traffic spike immediately post-blank-SMS is consistent with C2 beacon registration. What payload would Pegasus-class spyware establish during this initial window?',
            'Design an MDM-level detection and response protocol for suspected zero-click spyware compromise on executive devices.',
        ],
        'phishing',
        'VERDICT: Expert Smishing — Zero-Click Spyware Delivery Indicators / Potential NSO Pegasus-Class Exploit Attempt.\nRisk: CRITICAL — Executive device potentially fully compromised. National security-grade threat.\n\nZero-Click Mechanism: Exploits like BLASTPASS and FORCEDENTRY target memory corruption vulnerabilities in iMessage\'s media parsing libraries (PDF, GIF, WebP image parsers). A malformed image or media attachment sent via iMessage triggers the vulnerable parser without display — the "blank" message contains a malformed media object. The exploit achieves code execution at the imagent process level (high privilege, not user-space), then escalates to kernel access via a secondary privilege escalation exploit. No tap, no click, no view required.\n\nProcess Tree Analysis: launchd → imagent is normal (iMessage daemon). imagent → IMTransferAgent is normal (media download). IMTransferAgent → [Unknown PID 8821] is NOT normal. Successfully signed Apple processes have known PID chains. An unknown child spawned from IMTransferAgent indicates execution via exploit — not legitimate Apple code.\n\n47-Second C2 Window: Pegasus establishes: (1) device identity beacon (IMEI, UDID, iOS version), (2) operator-specific C2 server connection, (3) kernel exploit persistence module, (4) silence (all future comms encrypted, zero-knowledge to MDM).\n\nMDM Response Protocol:\n1. Immediate: Remote MDM data wipe + device quarantine.\n2. Device replacement: Issue clean replacement device — do not restore from compromised backup.\n3. Forensic image: Capture full device image BEFORE wipe for Citizen Lab / law enforcement analysis.\n4. NSO Pegasus Check: Submit device to Amnesty Tech Mobile Verification Toolkit (MVT) for forensic indicator matching.\n5. Credential rotation: All passwords accessible from compromised device — full rotation.'
    ),

    mkLab('Smishing - SS7 Network SMS Interception (OTP Diversion)', 9,
        'A corporate treasury manager\'s banking OTPs are being silently diverted by an attacker who purchased SS7 network access. The diversion is detected only after £195,000 in unauthorized transfers are identified — with OTP delivery logs showing delivery to the victim\'s number but no device receipt.',
        [
            { time: 'Transaction log', sender: 'Carrier OTP infrastructure', message: '[5 OTPs for FinTrust Corp treasury account delivered to +44 7700 XXXXXX per carrier log. Device receipt confirmed by SMS gateway. Bank portal authenticated successfully each time. Treasury manager\'s phone: 0 OTPs received per device logs (Cellebrite forensic extraction).]' },
        ],
        [
            'SS7 attack: SendRoutingInfoForSM (HLR query) → SMS delivery location returned',
            'ForwardSM message: Attacker redirected SMS delivery to attacker-controlled MSC',
            'Carrier gateway: Shows successful delivery to victim MSISDN (correct — attacker intercepted at MSC level, not carrier level)',
            'Discrepancy: Gateway shows delivered → device shows not received = interception between carrier gateway and device',
            'Attack timing: Parallel with unauthorized wire transfer attempts (5 OTPs = 5 transfer auth sessions)',
            'Recovery: £195,000 partially recovered (£85,000 cleared to offshore account)',
        ],
        [
            'Map the SS7 interception layer precisely: at what point in the SMS delivery chain was the message diverted, and why does this create a "delivered" status at the carrier level while the device shows no receipt?',
            'The bank portal authenticated 5 times using OTPs the treasury manager never received. What does this tell you about the attacker\'s level of access to the corporate banking credentials prior to launching the SS7 attack?',
            'Assess the forensic proof chain: Cellebrite device extraction showing 0 OTPs vs carrier gateway showing 5 delivered OTPs creates an evidential gap. How is this gap legally significant in a fraud recovery claim?',
            'Design an SMS-independent treasury payment control architecture that would make SS7-level OTP interception irrelevant.',
        ],
        'phishing',
        'VERDICT: Expert Smishing — SS7 OTP Interception / Corporate Treasury Account Takeover. Financial Loss: £195,000.\n\nSS7 Interception Point: Standard SMS delivery: Sender → SMSC (SMS center) → HLR query (home location register lookup for recipient\'s current MSC) → delivery to MSC (Mobile Switching Center) → delivery to device. SS7 attack intercepts at the HLR-to-MSC step: attacker\'s ForwardSM command diverts delivery to attacker-controlled MSC instead of the real MSC. The SMSC shows "delivered" (it delivered to a valid MSC address) — but that MSC is attacker-controlled. The device never receives it.\n\nPrior Credential Compromise: The 5 OTP authentications confirm the attacker already had the treasury manager\'s banking username + password before deploying SS7 interception. The SS7 attack was specifically to bypass MFA — not to capture primary credentials.\n\nEvidential Gap Significance: The carrier "delivered" status vs Cellebrite "not received" discrepancy is the forensic proof of SS7 interception. For legal fraud recovery: (a) The carrier log proves OTPs were delivered to an address other than the device. (b) The bank authentication records prove those OTPs were used by a different IP. (c) This combination establishes that the account holder did NOT authorize the transfers — strengthening recovery under APP fraud liability rules.\n\nSMS-Independent Treasury Architecture:\n1. FIDO2 hardware keys for ALL treasury authentication — not SMS, not TOTP, not email.\n2. Out-of-band voice confirmation: All transfers >£10K require callback to the treasury manager on a known corporate number.\n3. Dual-control: Two officers must independently authorize wire transfers via separate authentication.\n4. Behavioral monitoring: Flag any wire transfer initiated outside of business hours or from a new IP.'
    ),

    mkLab('Smishing - Spear-Smishing Executive Whaling', 8,
        'A CEO receives a highly personalized SMS referencing a real upcoming board meeting, recent news about a company acquisition, and the CFO\'s name — directing them to review a "board resolution" via a link that delivers a credential harvest page with the same TLS fingerprint as a prior BEC campaign.',
        [
            { time: '07:45 AM', sender: '+44 7891 XXXXXX', message: 'Sai, board resolution for TechCore acquisition needs your review before 6 PM. CFO Ananya flagged this as urgent. Secure access: https://board-secure-access[.]co/resolution?ref=TC-2026-FEB' },
        ],
        [
            'Acquisition news: FinTrust-TechCore deal publicly announced 2 days ago (Bloomberg article)',
            'CFO name "Ananya": Publicly listed on FinTrust Corp website (leadership page)',
            'Reference "TC-2026-FEB": Matches real internal project codename (obtained via OSINT — used in public earnings call transcript)',
            'TLS fingerprint: JA3 hash of board-secure-access.co matches BEC infrastructure from prior campaign (3 months ago)',
            'Domain: Registered 36 hours ago, hosted on bulletproof VPS',
            'Page delivers: Microsoft SharePoint login clone → credential exfiltration',
        ],
        [
            'OSINT reconstruction: Which specific public sources provided (a) acquisition news, (b) CFO name, (c) project codename TC-2026-FEB? Assess the attacker\'s OSINT research depth.',
            'Explain TLS JA3 fingerprint matching: how does a cryptographic fingerprint of the TLS handshake link two separate domains to the same attacker infrastructure?',
            'The SMS included highly specific internal details (project codename from an earnings call). Assess whether this level of OSINT access requires any insider assistance or is achievable purely via public data.',
            'Recommend executive OSINT hardening and technical controls that reduce the personal information surface available for spear-smishing personalization.',
        ],
        'phishing',
        'VERDICT: Expert Spear-Smishing — Executive Whaling via Multi-Source OSINT + BEC Infrastructure Reuse. Confidence: CRITICAL.\n\nOSINT Source Reconstruction:\n- Acquisition news: Bloomberg/Reuters/Reuters public article (2 days ago) → FinTrust-TechCore deal\n- CFO name "Ananya": FinTrust.com leadership page (public)\n- Project codename "TC-2026-FEB": Q4 2025 earnings call transcript (public via SEC Edgar / investor relations page) — executive mentioned "Project TC" in analyst Q&A\nAll OSINT is 100% publicly available — no insider required.\n\nJA3 TLS Fingerprint: The TLS handshake contains negotiated parameters (cipher suites, extensions, elliptic curves) in a specific order determined by the TLS library/version used. The JA3 hash is a fingerprint of these parameters. Two domains sharing a JA3 hash use the same TLS stack — indicating the same server framework, likely same deployed tool (e.g., same EvilProxy instance, same VPS configuration). This links board-secure-access.co to the prior BEC infrastructure with high confidence.\n\nIntelligence Assessment: The specificity of the project codename is the most concerning element — it demonstrates the attacker invested significant research time (listening to earnings calls, cross-referencing acquisition news). This is APT-level persistence applied to a financially motivated attack.\n\nExecutive OSINT Hardening:\n1. Remove project codenames from public earnings call language (generalize to "strategic initiatives").\n2. Leadership page: List only executive names + titles — remove direct contact numbers/social profiles.\n3. SMS: Executives should have corporate mobile numbers separate from any public profile.\n4. Technical: Microsoft 365 Conditional Access — require FIDO2 for all C-suite authentication.'
    ),

    mkLab('Smishing - Silent SMS (Type 0) Surveillance Ping', 9,
        'FinTrust Corp\'s mobile security team detects Type 0 (silent) SMS messages being delivered to executive devices. These messages leave no visible trace on the device but trigger GSM protocol responses that expose device location to the sender.',
        [
            { time: 'Various', sender: 'Carrier log only', message: '[Type 0 SMS detected in carrier SMSC logs for CEO, CFO, and Legal Director devices. No visible message delivered to device. SMSC logs show delivery confirmation. Timing: 3 messages per device over 72-hour period, sent at 07:00 AM, 12:00 PM, and 06:00 PM daily.]' },
        ],
        [
            'Type 0 SMS: Flash/Class 0 message — stored in carrier SMSC, not delivered to device storage or display',
            'Device response: Device sends implicit GSM delivery receipt (DELIVER-REPORT) revealing current serving cell tower',
            'Cell tower triangulation: 3 delivery receipts per day → location trace of each executive\'s daily routine',
            'Sender: Routes through SS7-accessible international carrier (Nigeria → Germany → UK)',
            'Purpose: Build movement pattern database for physical surveillance or targeted timing of subsequent attack',
            'Legal Director routine identified: Arrives at FinTrust headquarters 08:45-09:10 AM daily, leaves 18:30-18:45 PM',
        ],
        [
            'Explain Type 0 (silent/flash) SMS technically: why does the device never display or store the message while still generating a network-level delivery response?',
            'Map how the cell tower delivery receipt provides geographic intelligence to the attacker — what precision is achievable from cell tower triangulation alone?',
            'The 3-per-day timing (07:00, 12:00, 18:00) was deliberate. What behavioral intelligence is the attacker building with morning/midday/evening location pings?',
            'Recommend carrier-level and MDM-level detection and blocking of Type 0 SMS surveillance — and explain why this attack is technically sophisticated despite requiring no user interaction.',
        ],
        'phishing',
        'VERDICT: Expert Smishing — Type 0 Silent SMS Surveillance Campaign / Executive Location Intelligence Gathering.\nRisk: CRITICAL — Physical security threat to named executives.\n\nType 0 SMS Technical Mechanism: GSM TS 23.040 defines Class 0 (flash) messages. These are delivered directly to the handset display and NOT stored in the device\'s message store — they vanish when dismissed (or in the case of non-display Type 0, are never shown). However, the device MUST respond to the SMSC with a "DELIVER-REPORT" acknowledgment — this is a mandatory GSM protocol response. This response travels back through the SS7 network, and the sender (via SS7 access) can observe which cell tower processed the report — revealing current device location.\n\nCell Tower Precision: Urban cell towers cover 100m–500m radius. Rural towers: 2–10km. Consistent 07:00 AM delivery reports from the same tower for 3 days = the Legal Director\'s home address localized to within ~300 meters. 09:00 AM tower shift = route from home to FinTrust HQ identifiable.\n\nBehavioral Intelligence Built: 07:00 = home location + device active (device on at work). 12:00 = lunchtime location (office or nearby restaurant patterns). 18:00 = departure time + route direction. This builds a complete daily routine map suitable for physical surveillance or timed targeted attacks (e.g., swatting, robbery, or confrontation).\n\nCountermeasures:\n1. Carrier: Implement Type 0 SMS filtering policy — block inbound Type 0 from non-approved originator IDs.\n2. MDM: Deploy mobile threat defense (MTD) agents (Zimperium, Lookout) that detect Type 0 message receipt in carrier log without device display.\n3. Executive travel security: Stagger departure times + vary routes — undermine location pattern predictability.'
    ),

    mkLab('Smishing - RCS Phishing (Rich Communication Services)', 8,
        'An employee receives a rich RCS message impersonating their bank with an animated logo, verified-carrier-badge lookalike, and inline action button. Packet capture reveals the RCS message routes through a compromised RCS aggregator and embeds a token-capture redirect.',
        [
            { time: '02:15 PM', sender: 'Barclays (Verified badge displayed)', message: '[RCS Rich Message: Animated Barclays logo | Blue verified checkmark badge | "Confirm your identity for enhanced fraud protection" | [Button: Secure Verify →]]' },
        ],
        [
            'RCS sender verification: Badge appears as "Verified Business" but is issued by an unauthorized RCS aggregator (not Barclays-registered aggregator)',
            'Packet capture: RCS message body contains embedded URL redirect to barclays-verify-rcs[.]com',
            'Button action: "Secure Verify →" triggers HTTP GET to barclays-verify-rcs.com/init?token=[JWT]',
            'JWT token: Contains pre-signed session parameters — clicking captures device ID and RCS MSISDN',
            'Redirect chain: barclays-verify-rcs.com → rcs-collector-api[.]cc/harvest?session=[TOKEN]',
            'Collection endpoint: Harvests RCS identity token + prompts for banking credentials',
            'Barclays RCS sender: Official Barclays RCS sender ID is verified via Google Messages Business API — this message uses a third-party aggregator not in Google\'s verified list',
        ],
        [
            'Explain how the RCS "Verified Business" badge system works — and identify the specific verification failure that allowed an unauthorized aggregator to display a badge-like element to the victim.',
            'The JWT token in the button URL captures device ID and MSISDN without the victim entering any data. Explain this pre-click data harvesting technique and its privacy implications.',
            'Compare the security posture of RCS attacks vs traditional SMS smishing: what new attack surfaces does RCS introduce, and what legacy SMS attacks does RCS prevent?',
            'Recommend how financial institutions should protect their RCS sender identities and how users can verify authentic RCS business messages.',
        ],
        'phishing',
        'VERDICT: Expert Smishing — RCS (Rich Communication Services) Brand Impersonation / Token-Capture Phishing.\nRisk: HIGH — Exploits emerging RCS security gaps for higher-fidelity impersonation than SMS.\n\nRCS Verification System Gap: Google Messages RCS Verified Business program requires businesses to register their sender profile via an authorized aggregator and undergo brand verification. The "Verified" badge is only granted to registered senders. However: (a) badge visual elements can be replicated in rich card UI without official verification (attacker-created blue checkmark icon in message body ≠ system-granted verification badge), and (b) unauthorized aggregators can send RCS messages that display business-appearing profiles without full verification in some configurations.\n\nPre-Click JWT Harvesting: The button URL contains a JWT (JSON Web Token) pre-signed by the attacker with a unique session ID. When the victim taps the button, an HTTP GET request fires BEFORE any redirect occurs — this request includes the device\'s RCS MSISDN (phone number) in RCS metadata headers + the device model string. The attacker logs this data from the GET request even if the victim immediately closes the browser. This represents a zero-interaction data harvest for every button-tap.\n\nRCS vs SMS Attack Surface:\nRCS Eliminates: Sender ID spoofing (registered senders), basic domain-less links\nRCS Introduces: Rich UI spoofing (animated logos, buttons, verified badge mimicry), pre-click data capture via button URLs, carousel and action button social engineering vectors, video/audio attachment delivery channels\n\nInstitution Protection: (a) Register RCS sender profile exclusively via Google-verified aggregators. (b) File Google Business Messages trademark/impersonation report immediately for unauthorized use of brand RCS profile. (c) Advise customers: Barclays\' official RCS sender will NEVER ask for login credentials within the RCS message.'
    ),
];

async function seed() {
    const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/antiphishx';
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB\n');
    for (const lab of LABS) {
        await Lab.findOneAndUpdate({ title: lab.title }, lab, { upsert: true, new: true, runValidators: false });
        console.log(`  ✔ [EXP ${lab.difficulty}/10] ${lab.title}`);
    }
    const total = await Lab.countDocuments();
    console.log(`\n✅ Done — ${LABS.length} smishing expert labs upserted. Total: ${total}`);
    process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
