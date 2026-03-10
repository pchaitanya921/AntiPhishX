'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// QR Code Attacks – Beginner v2: 100 XP | 10 min | 3 hints | Difficulty 1-2/10

const mkLab = (title, difficulty, scenario, artifact, qrPayload, networkSim, indicators, socTasks, hints, answer, explanation) => ({
    title,
    topic: 'qr_phishing',
    level: 'beginner',
    type: 'qr',
    difficulty,
    points: 100,
    timeLimit: 600,
    published: true,
    description: `Beginner QR Code attack lab: ${title.replace('QR Phishing - ', '')}. Analyze the QR payload, indicators, and network behavior to classify the threat.`,
    scenario,
    content: {
        artifact,
        qrPayload,
        networkSim,
        indicators,
        artifacts: [],
    },
    steps: socTasks,
    hints: hints.map(h => ({ text: h })),
    correctAnswer: answer,
    explanation,
});

const LABS = [
    mkLab(
        'QR Phishing - Payroll Portal Email Embed',
        2,
        'A FinTrust Corp employee receives a corporate-looking email with a QR code image embedded in the body. The subject line reads "Payroll Portal Update." No clickable hyperlink is present — only the embedded QR image. The employee scans it with their phone and sees a login page that looks exactly like the corporate HR portal.',
        {
            type: 'email',
            subject: 'Payroll Portal Update',
            sender: 'hr-notifications@fintrust-payroll[.]com',
            body: 'Dear Employee,\n\nYour payroll statement for February 2026 is now available. For security reasons, please scan the QR code below to access your updated payroll information.\n\n[QR CODE IMAGE]\n\nThis link expires in 24 hours.\n\nHR Department\nFinTrust Corporation',
            attachment: 'payroll_qr_feb2026.png (embedded inline)',
        },
        {
            decoded: 'https://secure-payroll-update[.]com/login',
            format: 'URL',
            deliveryMethod: 'Email body — inline PNG image (QR not in text body, not on link)',
        },
        {
            requests: [
                'GET /login → 200 OK — login page served (corporate portal clone)',
                'POST /auth → 200 OK — credentials submitted',
                'POST /collector.php → credentials exfiltrated to attacker server',
                'Redirect → https://fintrust.com (real site, to avoid suspicion)',
            ],
            formFields: ['employee_id', 'password'],
            exfilEndpoint: '/collector.php',
            serverLocation: 'Shared VPS — Singapore (DigitalOcean AS14061)',
        },
        [
            'Domain: secure-payroll-update.com — registered 6 days ago (not corporate domain)',
            'No SSO redirect — legitimate corporate portals use Okta/Azure AD SSO, not raw login forms',
            'Email sender domain: fintrust-payroll.com — not fintrust.com (lookalike domain)',
            'No SPF/DKIM for fintrust-payroll.com — newly registered',
            'Exfil endpoint /collector.php — PHP phishing kit signature',
            'Email gateway: no URL extracted from image — QR scan bypassed SEG',
        ],
        [
            'Why did the Secure Email Gateway (SEG) fail to flag this email even though it contains a phishing link?',
            'Compare the sender domain "fintrust-payroll.com" to the real "fintrust.com" — what attack technique is used and how would you verify the real corporate domain?',
            'The page shows a corporate-branded login form with NO SSO redirect. Why is the absence of SSO a critical indicator of a fake corporate portal?',
            'Correlate all indicators and provide a classified verdict with risk level.',
        ],
        [
            'Email gateways scan text content and hyperlinks — QR codes in PNG images are opaque to text-based scanners. This is the core "Quishing" bypass: no link = no URL scan. Advanced SEGs (Proofpoint Targeted Attack Protection) now decode QR in images, but older/basic configurations miss them.',
            'Legitimate corporate payroll portals redirect immediately to SSO (Okta/Azure AD) and never display a standalone username+password form. Any corporate login page asking directly for employee_id + password without SSO is a strong phishing indicator.',
            '/collector.php is an extremely reliable phishing kit fingerprint. Virtually all PHP-based credential harvesting kits name their log script "collector.php," "grab.php," or "log.php." Finding this endpoint in proxy logs = near-certain phishing kit.',
        ],
        'phishing',
        'VERDICT: QR-Based Credential Phishing — Email Filter Evasion (Quishing). Risk: HIGH.\n\nAttack Chain: Fake HR email → embedded QR PNG bypasses SEG URL scanner → employee scans on mobile → corporate portal clone → employee_id + password POSTed to /collector.php → victim silently redirected to real FinTrust site.\n\nKey Bypass: QR code image contains the malicious URL — email gateways cannot extract URLs from images without dedicated OCR+QR decoding capability.\n\nIOCs: secure-payroll-update.com, fintrust-payroll.com, /collector.php endpoint, DigitalOcean AS14061 Singapore IP.\n\nRemediation: Enable QR code image decoding in SEG policy. Block both IOC domains at DNS. Reset credentials for any employee who submitted. Search mail logs for all recipients of this email.'
    ),

    mkLab(
        'QR Phishing - Office Notice Board (Delivery Lure)',
        1,
        'A QR code poster is found on an office building\'s internal notice board. The poster reads: "Delivery Failed – Scan to Reschedule Your Package." It has no official courier branding, no tracking number, and no contact details. Three employees scanned it before IT security was notified.',
        {
            type: 'physical_poster',
            location: 'Office lobby notice board — ground floor',
            text: 'DELIVERY FAILED\nYour package could not be delivered.\nScan QR code to reschedule your delivery.\nOffer expires in 2 hours.',
            branding: 'None — no DHL/FedEx/India Post logo or tracking number',
            condition: 'Self-adhesive sticker, printed on standard paper',
        },
        {
            decoded: 'http://delivery-fix-now[.]net',
            format: 'URL',
            deliveryMethod: 'Physical poster — office notice board',
            protocol: 'HTTP (no TLS)',
        },
        {
            requests: [
                'GET http://delivery-fix-now.net → 200 OK — fake delivery portal loaded',
                'POST /reschedule → name, phone, address submitted',
                'POST /confirm → payment card requested ("₹50 rescheduling fee")',
                'POST /payment-process → card number, CVV, expiry collected',
            ],
            formFields: ['full_name', 'phone', 'delivery_address', 'card_number', 'cvv', 'expiry'],
            serverLocation: 'OVH France — bulletproof hosting',
            responseCode: '200 OK → redirect /thankyou.html',
        },
        [
            'HTTP protocol (not HTTPS) — all form data transmitted in cleartext',
            'No official courier tracking reference on poster',
            'Urgency: "expires in 2 hours" — rushed decision making',
            'Domain: delivery-fix-now.net — registered 8 days ago',
            'Physical placement bypasses all digital security controls',
            'Payment requested for "rescheduling" — legitimate couriers never charge rescheduling fees',
        ],
        [
            'This QR was placed physically on an internal office notice board. What does this tell you about the attacker\'s level of access and target selection?',
            'The site loads over HTTP (not HTTPS). When the employee submits card details via this HTTP form, what is the risk compared to an HTTPS connection?',
            'The poster uses "expires in 2 hours" urgency. What psychological manipulation technique is this, and how does it affect decision quality?',
            'Enumerate the harm if an employee completed the payment form: what data was collected and what frauds are possible?',
        ],
        [
            'Physical QR placement requires the attacker to physically enter or access the building — suggesting either an insider, a social-engineer who "walked in," or an opportunistic placement in a publicly accessible lobby. All digital controls (SEG, EDR, DNS filter) are bypassed entirely.',
            'HTTP transmits all form data in cleartext — anyone on the same network (café Wi-Fi, office network if using HTTP) can intercept the POST containing card number + CVV using a trivial Wireshark capture. No "padlock" present = never submit payment data.',
            '"Urgency" is a classic social engineering trigger (Cialdini\'s Principles — Scarcity + Time Pressure). Artificial time limits prevent victims from pausing to verify. Real couriers provide multi-day rescheduling windows, never 2-hour expiry windows.',
        ],
        'phishing',
        'VERDICT: Malicious Physical QR — Social Engineering + Payment Card Harvesting. Risk: HIGH.\n\nData Collected: full_name, phone, delivery_address, card_number, CVV, expiry.\n\nFraud Possibilities: CNP (Card Not Present) fraud, identity theft, physical address for targeted follow-on attacks.\n\nInternal Response: Remove poster, photograph it as evidence, interview staff who scanned it, block delivery-fix-now.net at DNS, file complaint at cybercrime.gov.in.'
    ),

    mkLab(
        'QR Phishing - Crypto Airdrop Wallet Drainer',
        2,
        'A WhatsApp group for crypto enthusiasts receives a forwarded message with an attached image. The image shows a QR code with text: "🚀 URGENT: Scan to receive 0.5 ETH airdrop — Only 200 wallets remaining! Countdown: 14:32." The QR leads to a Web3 site requesting wallet connection and seed phrase entry.',
        {
            type: 'social_media_image',
            platform: 'WhatsApp group (forwarded from unknown contact)',
            message_text: '🚀 EXCLUSIVE ETH AIRDROP — 0.5 ETH FREE!\nScan QR below. Only 200 spots left!\n⏰ Offer ends in 14:32\nTestimonials: "I got my ETH in 5 mins!" — @cryptomoon99',
            image: 'airdrop_qr_promo.jpg — QR embedded in crypto-themed promotional graphic',
        },
        {
            decoded: 'https://eth-airdrop-bonus[.]io/connect',
            format: 'URL',
            deliveryMethod: 'Social media image — WhatsApp forward',
        },
        {
            pageFlow: [
                'GET /connect → Web3 wallet connect modal (MetaMask / WalletConnect UI clone)',
                'Step 1: "Connect Wallet" button → requests wallet authorization',
                'Step 2: Fake error: "Connection failed — enter seed phrase manually to verify ownership"',
                'Step 3: 12/24-word seed phrase entry form',
                'Step 4: POST /verify-wallet → seed phrase transmitted to attacker',
            ],
            additionalBehavior: 'Countdown timer (fake urgency) + fabricated testimonials auto-cycling',
            serverLocation: 'Bulletproof VPS — Latvia',
        },
        [
            'Domain: eth-airdrop-bonus.io — registered 3 days ago',
            'Requests seed phrase — NO legitimate dApp ever asks for seed phrase',
            'Fake countdown timer — same counter resets on page reload (not genuine scarcity)',
            'Fake testimonials — @cryptomoon99 account: 2 posts, created this week',
            'Wallet connect fails deliberately — forces manual seed phrase entry (primary data collection goal)',
            'No on-chain contract verification — not verifiable on Etherscan',
        ],
        [
            'The site first tries wallet-connect, then "fails" and asks for the seed phrase. What is the attacker\'s actual primary goal — and why is the wallet-connect step a deliberate decoy?',
            'Why does a countdown timer that resets on page refresh indicate this is a social engineering prop rather than a genuine limited-time event?',
            'A seed phrase grants complete, permanent, unrecoverable control of a crypto wallet. If an attacker obtains it, what can they do and can it be reversed?',
            'Recommend three rules for safe crypto wallet interactions that would prevent this attack.',
        ],
        [
            'The wallet-connect step fails deliberately — the real goal is always the seed phrase. Wallet-connect only grants limited token approvals (which can later be revoked on Revoke.cash). The seed phrase grants FULL irrevocable control. The "failure" is engineered to frustrate the victim into providing the higher-value credential.',
            'A genuine limited-time event would have a server-synchronized countdown. A countdown that resets on browser refresh is JavaScript-driven client-side — it\'s a psychological prop with no real scarcity. This is a reliable social engineering fake-urgency indicator.',
            'Seed phrase = master key: If obtained, the attacker can import the wallet on any device and drain all assets (ETH, ERC-20 tokens, NFTs) immediately and irreversibly. Blockchain transactions cannot be reversed. Your seed phrase must NEVER be entered on any website, app, or form — ever.',
        ],
        'phishing',
        'VERDICT: Crypto Scam — Seed Phrase Harvest via Fake Airdrop (Wallet Drainer). Risk: CRITICAL/IRREVERSIBLE.\n\nMechanism: Fake countdown + social proof → wallet connect (decoy that fails) → seed phrase form (real goal) → full wallet control transferred to attacker within seconds.\n\nIrreversible: Blockchain transactions cannot be undone. Once seed phrase is submitted, all assets are gone.\n\nRule: Your seed phrase must ONLY be entered when RESTORING a wallet on a freshly wiped device you control. Never on any website, ever.'
    ),

    mkLab(
        'QR Phishing - Rogue WiFi + APK Malware (Café)',
        1,
        'A sticker in a café reads: "Free WiFi — Scan to Connect Instantly." Scanning it auto-connects the device to a rogue access point and opens a captive portal in the browser. The portal prompts for email, phone, and directs Android users to download a "connection app" (APK file).',
        {
            type: 'physical_sticker',
            location: 'Coffee shop table — placed over original café QR menu sticker',
            text: 'FREE HIGH-SPEED WIFI\nScan to connect instantly\nNo password needed!',
        },
        {
            decoded: 'WIFI:T:WPA;S:FreeCafeWiFi;P:freewifi123;;',
            secondaryRedirect: 'http://wifi-login-free[.]net (captive portal auto-opens)',
            format: 'WiFi Config + HTTP URL redirect',
            deliveryMethod: 'Physical sticker — café table overlay',
        },
        {
            captivePortal: 'http://wifi-login-free.net — HTTP only, no HTTPS',
            fields: ['email_address', 'phone_number', '"Accept Terms" checkbox (hidden subscription clause)'],
            androidFlow: 'User-Agent detection: Android → shows "Download WiFi Booster App to activate connection"',
            apkUrl: 'http://wifi-login-free.net/WifiBooster.apk',
            apkBehavior: 'Requests: READ_SMS, SEND_SMS, READ_CONTACTS, BIND_ACCESSIBILITY_SERVICE — banking trojan',
            iosFlow: 'iOS users: only email/phone collected — no APK served',
        },
        [
            'WIFI QR auto-connects without user confirmation — no network identity verification',
            'No HTTPS on captive portal — email + phone transmitted in cleartext',
            'Hidden subscription in "Terms" checkbox — fine print: "£9.99/month auto-renewal"',
            'APK delivery conditional on Android UA detection — targeted malware delivery',
            'APK permissions: READ_SMS + BIND_ACCESSIBILITY_SERVICE = banking trojan capability',
            'SSID "FreeCafeWiFi" differs from real café network "CozyCup_Guest"',
        ],
        [
            'What is the security risk of WIFI QR codes that auto-configure network connections without user review of the SSID and password?',
            'Why does the site serve an APK only to Android users (detected via User-Agent) — and what does READ_SMS + BIND_ACCESSIBILITY_SERVICE permission combination enable on an Android device?',
            'If an employee submits their corporate email on this HTTP captive portal, what can an attacker on the same network do with that data mid-transit?',
            'Name the two separate attack vectors present in this single QR code (beyond credential harvesting).',
        ],
        [
            'WIFI QR codes bypass the normal network selection confirmation step. The device connects silently. Once connected to the rogue AP, the attacker can perform MitM on all HTTP traffic, intercept credentials from non-HTTPS sites, and redirect DNS to malicious pages.',
            'READ_SMS + BIND_ACCESSIBILITY_SERVICE = complete banking trojan capability. READ_SMS intercepts all OTPs sent by banks. BIND_ACCESSIBILITY_SERVICE enables transparent overlays on banking apps (fake login screens), auto-clicking, and reading all on-screen content — without root access.',
            'Two attack vectors: (1) Rogue AP + captive portal — email/phone + hidden subscription + MitM browser traffic. (2) APK malware delivery — banking trojan installs on Android devices. These are independent harms from the same QR code.',
        ],
        'phishing',
        'VERDICT: Malicious QR — Rogue WiFi AP + Captive Portal PII Harvest + Android Banking Trojan Delivery. Risk: CRITICAL.\n\nDouble Attack: (1) Connects victim to attacker-controlled AP — MitM enabled. (2) Android victims served banking trojan APK with OTP interception capability.\n\nRemedy: Forget "FreeCafeWiFi" network. If APK installed — factory reset required. Change all banking passwords from clean network. Enable Play Protect.'
    ),

    mkLab(
        'QR Phishing - Fake MFA Reset (AiTM)',
        2,
        'An employee receives an IT-looking email: "Your Microsoft Authenticator session has expired. Scan the QR code to re-verify your MFA within 24 hours to avoid account suspension." The QR leads to a real-time Adversary-in-the-Middle (AiTM) proxy that relays live OTPs to the attacker.',
        {
            type: 'email',
            subject: 'Action Required: MFA Session Expired',
            sender: 'it-security@microsoft-mfa-reset[.]com',
            body: 'Your Microsoft Authenticator session has expired.\n\nTo maintain access to your corporate account, please scan the QR code below to complete MFA re-verification within 24 hours.\n\nFailure to act will result in account suspension.\n\n[QR CODE IMAGE]\n\nIT Security Team',
        },
        {
            decoded: 'https://mfa-reset-authenticate[.]com/verify',
            format: 'URL',
            deliveryMethod: 'Email — embedded QR image',
        },
        {
            pageType: 'AiTM proxy — real-time relay to live Microsoft login',
            flow: [
                'GET /verify → Microsoft login clone with LIVE relay to login.microsoftonline.com',
                'Employee enters username → relayed live to Microsoft',
                'Employee enters password → relayed live',
                'Microsoft sends OTP → employee enters OTP on phish page → relayed live',
                'Attacker captures: username + password + valid session cookie',
                'Employee sees "MFA re-verified successfully" — unaware',
            ],
            formFields: ['username', 'password', 'otp_code'],
            aitmTooling: 'Evilginx3 / Modlishka reverse proxy',
            sessionCookieStolen: true,
        },
        [
            'Domain: mfa-reset-authenticate.com — not microsoft.com or login.microsoftonline.com',
            'AiTM proxy: page appears identical to real Microsoft login — OTP is valid and accepted',
            'Real-time relay means OTP-based MFA is completely bypassed — attacker uses live session token',
            'Email sender: microsoft-mfa-reset.com — not microsoft.com',
            'Urgency: "24 hours or account suspended"',
            'Microsoft never sends MFA reset requests via QR code email',
        ],
        [
            'Classic MFA phishing tries to steal the OTP code. This attack doesn\'t steal the OTP — it relays it. Explain why this distinction makes OTP-based MFA insufficient against AiTM attacks.',
            'The login page looks perfectly identical to the real Microsoft login — because it IS the real Microsoft login being proxied. What is the only reliable way to detect this during the login flow?',
            'What does "session cookie stolen" mean in practice — what can the attacker do with a valid Microsoft session cookie even after the OTP expires?',
            'What authentication method is NOT vulnerable to AiTM proxy attacks — and why?',
        ],
        [
            'AiTM relays the OTP in real-time to the real Microsoft server — the OTP is valid, not stolen. What\'s stolen is the SESSION COOKIE issued after successful authentication. This bypasses OTP entirely. TOTP/OTP = no longer sufficient; only phishing-resistant MFA (FIDO2/passkeys) defeats this.',
            'URL bar is the only detection method during AiTM: the URL shows "mfa-reset-authenticate.com" not "login.microsoftonline.com." The page looks identical because it IS real Microsoft — just proxied. Training employees to check the URL before entering credentials is the primary behavioral defense.',
            'Session cookie: Authentication systems issue a session token after login. With this token, the attacker can access all Microsoft 365 services (Outlook, SharePoint, Teams) without re-entering credentials, even after the OTP expires — until the session expires (hours to days).',
        ],
        'phishing',
        'VERDICT: Account Takeover — AiTM MFA Bypass via QR-Delivered Evilginx Proxy. Risk: CRITICAL.\n\nMFA bypassed: OTP intercepted and relayed in real-time. Session cookie stolen = full Microsoft 365 access without re-authentication.\n\nRemediation: Immediately revoke ALL active Microsoft sessions (Azure AD → User → Sessions → Revoke All). Reset password. Investigate all mailbox access, forwarding rules, and file downloads in the compromised session window. Migrate to FIDO2 passkeys.'
    ),

    mkLab(
        'QR Phishing - Street Survey Financial Harvest',
        1,
        'A professional banner at a busy street market reads: "₹500 Amazon Gift Card Awaits! Complete our 60-second survey. Scan QR Now!" The QR leads to a survey collecting personal information, culminating in a request for debit card details to "deposit the reward."',
        {
            type: 'physical_banner',
            location: 'Street market — high pedestrian traffic area',
            text: '🎁 WIN ₹500 AMAZON GIFT CARD!\nComplete 60-second survey.\nInstant reward! No catch!\n[QR CODE]',
            branding: 'Generic design — no brand affiliation with Amazon',
        },
        {
            decoded: 'https://reward-survey2025[.]com',
            format: 'URL',
            deliveryMethod: 'Physical banner — street market',
        },
        {
            pageFlow: [
                'GET / → survey page: name, age, "Which brands do you prefer?" (fake consumer survey)',
                'Page 2: phone number, email — "to send your reward"',
                'Page 3: "To deposit ₹500 to your account, enter debit card details"',
                'POST /submit-card → card number, CVV, expiry, UPI PIN collected',
                'JavaScript: var cardData = document.getElementById("card").value; — stored client-side briefly then POSTed',
            ],
            cardDataHandling: 'JS variable captures card data → POST to /api/save-entry.php',
            serverLocation: 'Bulletproof VPS — Netherlands',
        },
        [
            'Amazon never distributes gift cards via street-banner QR surveys — no affiliation',
            'Debit card details + UPI PIN collection — no legitimate reward distribution requires PIN',
            'Card data temporarily stored in JS variable before POST — visible in browser DevTools',
            'Domain: reward-survey2025.com — registered 4 days ago',
            'SSL: Present — victims may assume safety because of padlock',
            '/api/save-entry.php — PHP data collection script signature',
        ],
        [
            'The banner says "Amazon Gift Card" but there is no official Amazon branding or disclaimer. What due diligence should a person perform before participating in any street-QR survey claiming brand affiliation?',
            'The site has a valid HTTPS padlock (SSL certificate present). A victim thinks "it\'s secure because there\'s a padlock." Correct this misconception with a precise technical explanation.',
            'The survey requests a UPI PIN to "deposit" the reward. Why is requesting a UPI PIN especially dangerous — what can an attacker do with it?',
            'Card data is stored in a JavaScript variable visible in browser DevTools. What does this indicate about the quality and intent of the site\'s payment handling?',
        ],
        [
            'Verification: (1) Google the company name + "gift card survey" — check for complaints. (2) Search the domain on whois.domaintools.com — a 4-day-old domain will not be run by a legitimate brand. (3) Amazon\'s official promotions are always announced on amazon.in — never via street QR codes.',
            'HTTPS/TLS only encrypts the connection between client and server — it says nothing about the server\'s intent. A phishing site with valid SSL is encrypted phishing. The padlock means "your data is securely sent to the attacker." Never use SSL presence as a legitimacy indicator.',
            'UPI PIN is the transaction authorization secret — equivalent to a card CVV. With card number + expiry + UPI PIN, an attacker can authorize UPI transfers from the victim\'s account. Unlike OTPs, the UPI PIN doesn\'t expire and enables repeated fraudulent transfers until the victim changes it.',
        ],
        'phishing',
        'VERDICT: Financial Data Theft via QR Survey — Card Number + CVV + UPI PIN Harvested. Risk: CRITICAL.\n\nData Collected: Name, phone, email, debit card number, CVV, expiry, UPI PIN — complete financial identity package.\n\nFraud Enabled: Unauthorized UPI transfers, CNP fraud, identity theft.\n\nActions: Call bank immediately — block card. Change UPI PIN. File cybercrime.gov.in complaint. Report domain to CERT-In.'
    ),

    mkLab(
        'QR Phishing - Electricity Bill UPI Redirect',
        1,
        'Physical mail arrives with a printed electricity bill. The bill includes a QR code labeled "Pay Via QR — Fastest Method." The bill looks genuine but the QR redirects to a cloned BESCOM payment portal rather than the official site. The URL has a one-character domain variation.',
        {
            type: 'physical_mail',
            description: 'Printed electricity bill — near-perfect BESCOM (Bangalore Electricity Supply Company) replica',
            legitimateDomain: 'bescom.co.in (real)',
            qrLabel: 'Scan QR code to pay your electricity bill',
            billDetails: 'Account No: 4XXX-XXXX, Amount Due: ₹1,847, Due Date: Feb 28 2026',
        },
        {
            decoded: 'https://ebill-pay-secure[.]net',
            format: 'URL — not UPI URI',
            deliveryMethod: 'Physical printed mail',
            domainVariation: 'bescom.co.in (real) vs ebill-pay-secure.net (attacker) — no visual similarity until URL bar inspected',
        },
        {
            pageFlow: [
                'GET / → BESCOM payment portal clone — visual replica of bescom.co.in',
                'Form: account number pre-filled, amount pre-filled (from personalized bill data)',
                'Payment method: "UPI" selected → requests UPI ID + UPI PIN',
                'POST /process-payment → UPI ID + PIN sent to attacker',
                'Iframe injection: legitimate Razorpay iframe partially visible — fake legitimacy signal',
            ],
            upiTarget: 'attacker-upi@paytm — not bescom@sbi',
            formFields: ['account_number', 'upi_id', 'upi_pin', 'mobile_number'],
        },
        [
            'Domain mismatch: ebill-pay-secure.net ≠ bescom.co.in — must check URL bar precisely',
            'UPI PIN requested — official BESCOM payment uses UPI push (you initiate, PIN entered in YOUR UPI app — never on a website)',
            'Razorpay iframe partially visible — creates false legitimacy signal (attacker injected it decoratively)',
            'Domain: ebill-pay-secure.net — registered 10 days ago',
            'Bill data appears personalized (account, amount) — suggests prior data breach or public records misuse',
        ],
        [
            'The bill appears personalized with your account number and exact amount. How could attackers obtain this data to create convincing personalized fake bills?',
            'The UPI payment process on legitimate sites (BESCOM, BBMP) works differently than what this site requests. Explain the correct UPI payment flow and why entering the UPI PIN on a website is always wrong.',
            'The page shows a partial Razorpay iframe — a familiar payment brand. How does the attacker use this "borrowed legitimacy" tactic and how do you detect it as fake?',
            'Identify the one-character domain difference between the real and fake BESCOM domains. What eye-strain technique do attackers rely on for this?',
        ],
        [
            'Personalized data sources: (1) Data broker leaks — electricity account numbers are in previously breached datasets. (2) Municipal data leaks — meter reader databases. (3) Social engineering of utility help desks. Personalization makes phishing victims 3x more likely to comply vs. generic messages.',
            'Correct UPI flow: (1) You initiate payment on your UPI app (PhonePe/BHIM/GPay). (2) You search the payee VPA (e.g., bescom@sbi). (3) You enter YOUR UPI PIN IN YOUR APP — never on a website. Any website asking for your UPI PIN DIRECTLY is always fraudulent.',
            'Borrowed legitimacy: Razorpay logo/iframe is embedded but decorative only — the actual POST goes to the attacker\'s endpoint, not Razorpay\'s. Detection: Open browser DevTools → Network tab → observe where POST /process-payment sends data. The destination URL exposes the real endpoint.',
        ],
        'phishing',
        'VERDICT: Payment Redirection Fraud — BESCOM Impersonation + UPI PIN Harvest via Physical QR. Risk: HIGH.\n\nPersonalized Bill: Account + amount pre-filled = high victim compliance rate.\n\nUPI PIN Stolen: Attacker can authorize repeated UPI deductions from victim\'s account until PIN changed.\n\nActions: Call BESCOM helpline (1912) — verify real outstanding bill and pay ONLY via official app/website. Change UPI PIN via bank app immediately. Cybercrime complaint.'
    ),

    mkLab(
        'QR Phishing - Fake IPL Ticket Sale',
        1,
        'A Telegram crypto/sports group shares a message: "🏏 LAST 2 IPL FINAL TICKETS AVAILABLE — ₹1,500 each (face value). Scan QR NOW — selling fast!" The QR leads to a payment-only page with no seat selection, no ticket confirmation, and no brand affiliation with BCCI or BookMyShow.',
        {
            type: 'telegram_message',
            platform: 'Telegram sports group — 12,000 subscribers',
            message: '🏏 URGENT: 2x IPL Final 2026 tickets — ₹1,500 each!\nFace value. No black market markup.\nScan QR | Pay | Receive PDF in 5 mins.\n⚠️ Only 2 seats left. Going fast.',
            sender: 'Anonymous user — account created 3 days ago',
        },
        {
            decoded: 'https://ipl-ticket-lastchance[.]org',
            format: 'URL',
            deliveryMethod: 'Telegram group message with QR image',
        },
        {
            pageFlow: [
                'GET / → IPL-branded ticket "sale" page — BCCI/IPL logos scraped and used without authorization',
                'No seat selection, no match schedule, no stadium seating chart',
                'Only field: quantity (1 or 2) + payment card details',
                'POST /buy-ticket → card details collected',
                '"Your ticket will be emailed within 5 minutes" — no ticket received',
                'Generated: Fake PDF with IPL branding + invalid barcode emailed 10 minutes later',
            ],
            formFields: ['quantity', 'card_number', 'cvv', 'expiry', 'cardholder_name'],
            ticketDelivery: 'Fake PDF — barcode does not exist in BookMyShow/BCCI ticketing database',
        },
        [
            'No official BCCI/IPL/BookMyShow domain — ipl-ticket-lastchance.org is attacker-created',
            'No seat selection or seating chart — legitimate ticket platforms always show seat map',
            'Telegram-only distribution — official IPL ticket sales via bookmyshow.com only',
            'Domain: ipl-ticket-lastchance.org — registered 5 days ago',
            'Fake PDF ticket: barcode generates invalid order ID when scanned at venue',
            'Urgency: "Only 2 left" — artificial scarcity',
        ],
        [
            'What is the one structural red flag in a ticket-buying flow that definitively separates legitimate ticket platforms from fake ones (before any payment)?',
            'The fake PDF ticket appears visually perfect — correct IPL branding, seat number, gate — but fails at venue entry. What system generates the barcode verification that catches it?',
            'The seller\'s Telegram account was created 3 days ago. Why is account age a reliable fraud signal on social media platforms?',
            'If a victim paid by credit card, what is the fastest method of potential fund recovery and what is the time window?',
        ],
        [
            'Seat selection is structurally present on ALL legitimate ticketing platforms — BookMyShow, TicketMaster, Paytm Insider all require choosing specific seats with an interactive map before payment. Any "ticket" site that goes straight to payment with no seat selection has no actual inventory — it\'s a payment harvest page only.',
            'Official venues use a live-database barcode system: each scan at the gate triggers a lookup in the event\'s ticket management system (e.g., Kyazoonga, BookMyShow backend). Fake PDFs generate barcodes that encode non-existent order IDs — the lookup returns "invalid" and the gate refuses entry.',
            'Account age on Telegram: accounts created within days of a campaign launch are almost universally created specifically for that fraud operation. Long-tenured accounts with real history = higher credibility. New accounts = disposable fraud tools.',
        ],
        'phishing',
        'VERDICT: Advance Fee Fraud — QR-Delivered Fake IPL Ticket Sale. Payment harvested, no ticket delivered.\n\nHarm: Card data stolen + venue entry denied on match day.\n\nCredit Card Recovery: File "services not received" chargeback within 24 hours via bank. Credit cards offer better protection than debit cards for CNP disputes.\n\nEventual detection: All fake barcodes rejected at venue gates → crowd management incident similar to real event disruptions.'
    ),

    mkLab(
        'QR Phishing - Parking Meter Sticker Overlay',
        1,
        'In a city center shopping district, 18 parking meters have had QR stickers placed directly over the official BBMP parking QR codes. The stickers appear to be part of the meter. A traffic warden reports that multiple drivers have paid the fake site and received penalty notices because their parking went unregistered.',
        {
            type: 'physical_qr_overlay',
            location: 'BBMP parking meters — Indiranagar, Bengaluru (18 meters affected)',
            official_qr_purpose: 'BBMP ParkSmart — official parking payment app',
            overlay_method: 'Self-adhesive sticker placed directly on meter QR plaque',
            visual_inspection: 'Sticker appears flush with original — no obvious edge visible',
        },
        {
            decoded: 'https://park-now-pay-fast[.]net',
            format: 'URL',
            deliveryMethod: 'Physical QR overlay on parking meter',
        },
        {
            pageFlow: [
                'GET / → Mobile-only responsive design (desktop shows blank) — targeted at phone cameras only',
                'Pre-filled: "BBMP Parking — Zone 4A — ₹40 for 2 hours"',
                'Payment form: card number, CVV, expiry — no BBMP logo authenticity certificate',
                'POST /pay → funds to attacker merchant account (flagged in threat intel)',
                'Redirect: /receipt.html — fake receipt HTML page',
            ],
            formFields: ['vehicle_number', 'duration', 'card_number', 'cvv', 'expiry'],
            mobileOnly: true,
            serverIP: '185.220.XX.XX — flagged in 6 threat intelligence feeds',
        },
        [
            'Mobile-only design — desktop returns blank page (designed purely for phone camera QR scanning)',
            'No BBMP official logo verified — scraped BBMP branding without official app seal',
            'No connection to BBMP ParkSmart system — payment not registered',
            'Server IP 185.220.XX.XX flagged in 6 TI feeds — known fraud infrastructure',
            '18 meters affected — organized physical campaign, not opportunistic',
            'Double harm: payment to attacker + official penalty for unregistered parking',
        ],
        [
            'The site is mobile-only (blank on desktop). What does this tell you about how the attacker designed the attack to be exclusively accessed via phone camera QR scans?',
            'Drivers paid ₹40 to the fake site AND received ₹500 penalty notices. Describe this "double harm" attack outcome and why it makes parking meter quishing particularly damaging.',
            'The server IP is flagged in 6 threat intelligence feeds. How would a SOC analyst discover this, and what does multi-feed flagging indicate about the attacker\'s history?',
            'Recommend two controls that BBMP or any municipality could implement to prevent QR overlay attacks on parking meters.',
        ],
        [
            'Mobile-only design = engineered specifically for the attack vector: phone camera QR scanning. There is no reason for a legitimate city parking payment page to return a blank desktop page. This server-side UA detection ensures the phishing page is only served to the intended targets (mobile QR scanners).',
            'Double harm: (1) Driver pays ₹40 to attacker — money lost, card data exposed. (2) Official BBMP ParkSmart receives no payment — official system shows meter as unpaid → traffic enforcement issues ₹500 penalty notice. The victim loses ₹40 to the scammer AND ₹500 to the city simultaneously.',
            'Multi-TI-feed flagging: SOC tools (VirusTotal, OTX AlienVault, ThreatConnect) aggregate IOC data across thousands of security sources. An IP appearing in 6 separate feeds = high-confidence attribution — this attacker is a repeat offender with established criminal infrastructure.',
        ],
        'phishing',
        'VERDICT: QR Overlay Attack — Fraudulent Parking Payment Gateway. 18 meters compromised. Double victim harm.\n\nResponse: BBMP should remove all stickers, audit all 18 meters, publish public advisory, implement tamper-evident holographic seals. Affected drivers: dispute card charges + petition BBMP for penalty waiver with evidence.'
    ),

    mkLab(
        'QR Phishing - Restaurant Menu Subscription Trap',
        1,
        'Restaurant table QR codes in a popular chain have been replaced by attacker stickers. The new QR loads a convincing menu site that asks for "phone verification" and a "₹1 refundable deposit" to access the menu — but the card form initiates a hidden ₹299/month auto-subscription.',
        {
            type: 'physical_qr_overlay',
            location: 'Restaurant chain tables — 23 table QRs replaced across 3 branches',
            official_purpose: 'Digital menu access (Zomato Order / restaurant-specific menu app)',
            attackerQR: 'Identical sticker size/color to official menu QR — visually indistinguishable',
        },
        {
            decoded: 'https://menu-view-online[.]com/login',
            format: 'URL',
            deliveryMethod: 'Physical QR overlay — restaurant table',
        },
        {
            pageFlow: [
                'GET /login → "Scan to View Menu — Phone Verification Required"',
                'Step 1: Enter phone number + OTP (real OTP via SMS — creates account)',
                'Step 2: "₹1 refundable deposit to unlock premium menu" — card form loads',
                'Step 3: Card entry → POST /charge → ₹1 charged (confirmation builds trust)',
                'Step 4: Auto-subscription activated — hidden ₹299/month recurring charge',
                'Redirect: Generic menu PDF (publicly scraped from restaurant website) — victim sees menu, suspects nothing',
            ],
            subscriptionSetup: 'Recurring mandate silently created using card-on-file + payment gateway recurring API',
            hiddenTerms: 'Checkbox: "I agree to Terms" — subscription clause on page 4 of 12-page PDF ToS',
            formFields: ['phone', 'otp', 'card_number', 'cvv', 'expiry', 'cardholder_name'],
        },
        [
            'No legitimate restaurant requires card payment or phone verification to VIEW a menu',
            'Hidden auto-subscription in ToS checkbox — designed for non-review',
            '₹1 charge (instead of ₹299 immediately) builds trust and avoids fraud trigger thresholds',
            'OTP sent to real phone — creates convincing legitimacy of "real service"',
            'Domain: menu-view-online.com — not affiliated with any restaurant brand',
            'Real menu shown after payment — victim unaware of subscription for 30 days',
        ],
        [
            'The site charges ₹1 first (not ₹299) before initiating the subscription. Why do attackers start with a small charge rather than the full subscription amount — what fraud and behavioral rationale underlies this?',
            'A real SMS OTP is sent to the victim\'s phone. How does receiving a real OTP from a real SMS service increase the victim\'s trust — and why does this not make the site legitimate?',
            'The victim sees the actual restaurant menu after payment and suspects nothing. Why is this "victim experience satisfaction" a deliberate attacker design decision?',
            'Name the two harms a victim experiences in this attack — one immediate, one delayed.',
        ],
        [
            '₹1 charge rationale: (1) Fraud detection threshold — banks rarely flag ₹1 charges for review. (2) Trust building — victim sees "only ₹1" and proceeds. (3) Mandate establishment — once card is authorized for ₹1 recurring, the payment gateway\'s recurring API can charge ₹299 monthly perpetually without new card authorization.',
            'Real OTPs sent via legitimate SMS gateways create an illusion of a professional service. However, any company can integrate an SMS API (Twilio, AWS SNS) for ₹0.10/message — fraudsters routinely use legitimate SMS infrastructure. OTP authenticity ≠ site legitimacy.',
            'Satisfied victim = silent victim. If the victim saw a broken page or received nothing, they\'d immediately contact the restaurant or call their bank. Serving the real menu ensures the victim has no complaint, no suspicion, and does NOT cancel the card or report fraud — giving the attacker 30+ days of undetected ₹299/month charges.',
        ],
        'phishing',
        'VERDICT: Subscription Trap + Card Data Harvest — QR Overlay on Restaurant Tables. Risk: HIGH.\n\nHarm 1 (Immediate): Card data stored by attacker for subsequent CNP fraud.\nHarm 2 (Delayed/Monthly): ₹299 recurring subscription charged until victim notices (avg 2-3 months = ₹598-₹897 total).\n\nRemediation: Call bank — cancel card, dispute all charges, block recurring mandate. Report to cybercrime.gov.in. Alert restaurant chain to inspect and replace all table QR codes.'
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
    console.log(`\n✅ Done — ${LABS.length} QR Code Beginner (v2) labs upserted.`);
    console.log(`   🗄️  Total labs in DB: ${total}`);
    process.exit(0);
}

seed().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
