'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// Intermediate Smishing: 200 XP | 15 min | 2 hints | Difficulty 3-4/10

const mkLab = (title, difficulty, scenario, thread, indicators, tasks, hints, answer, explanation) => ({
    title,
    topic: 'smishing',
    level: 'intermediate',
    type: 'smishing',
    difficulty,
    points: 200,
    timeLimit: 900,
    published: true,
    description: `Intermediate smishing simulation: ${title.replace('Smishing - ', '')}. Multi-signal analysis and SOC-grade verdict required.`,
    scenario,
    content: {
        smsThread: thread,
        indicators,
        artifacts: [],
    },
    steps: tasks,
    hints,
    correctAnswer: answer,
    explanation,
});

const LABS = [

    mkLab('Smishing - Fake 2FA Security Alert', 3,
        'An employee receives an SMS claiming there was a login attempt to their account from Russia, asking them to cancel via a link. Backend authentication logs show no such login event occurred.',
        [
            { time: '08:15 AM', sender: 'AccountSecurity', message: 'Login attempt detected from Russia (Moscow) on your account. If this wasn\'t you, cancel access immediately: https://account-secure-cancel[.]com/alert?id=RU-7812' },
        ],
        ['Fake login alert (backend logs confirm no login attempt)', 'Domain: account-secure-cancel.com (not an official service domain)', 'Geographic fear trigger (Russia login)', 'Session ID parameter in URL (tracks click-through)', '"Cancel access" CTA leads to credential harvest page'],
        [
            'Check backend authentication logs: is there any login event from a Russian IP in the last 24 hours for this account?',
            'Analyze the URL "account-secure-cancel.com/alert?id=RU-7812": what does the "id=RU-7812" parameter reveal about how the attacker tracks victims?',
            'Explain why "Russia" is specifically used as the geographic fear trigger in this alert.',
            'Perform a domain age check on account-secure-cancel.com and deliver a full verdict.',
        ],
        [
            { text: 'The "id=RU-7812" query parameter is a per-victim tracking token — it allows the attacker to know exactly which phone number clicked the link. Each SMS contains a unique ID, helping the attacker build a database of active/responsive targets for follow-up attacks.' },
            { text: 'Geographic fear triggers like "Russia" or "North Korea" are chosen to maximize alarm — these are countries widely associated with cybercrime in public perception. The goal is to provoke immediate action before the recipient evaluates the SMS critically.' },
        ],
        'phishing',
        'VERDICT: Smishing — Fake 2FA Security Alert / Credential Harvesting.\n\nLog Validation: Authentication logs show zero events from Russian IPs — the "login from Russia" is entirely fabricated. This is a fabricated threat designed to induce fear and urgency.\n\nURL Forensics: The "?id=RU-7812" parameter is a unique per-victim tracking token. Professional smishing operations use these to: (a) confirm click-through, (b) personalize the harvesting page, and (c) segment responsive victims for follow-up.\n\nAccount-secure-cancel.com: Age check confirms domain registered <7 days ago — consistent with freshly deployed phishing infrastructure.\n\nVictim Action: The "cancel access" page presents a login form that harvests username and password. After submission, the page may present a fake "access revoked" confirmation to prevent immediate discovery.'
    ),

    mkLab('Smishing - Credential Harvesting via Google Form Clone', 3,
        'Employees receive an SMS directing them to complete an "HR Compliance Update" via what appears to be a Google Forms link — but is actually a cloned credential-harvesting page on a lookalike domain.',
        [
            { time: '10:00 AM', sender: 'HR-Portal', message: 'ACTION REQUIRED: Complete HR Compliance Update Form by EOD. Use your corporate credentials: https://forms-hr-update[.]site/compliance2026' },
        ],
        ['Domain: forms-hr-update.site (not forms.google.com or the corporate HR domain)', 'Request for corporate credentials (SSO should not require re-entry)', 'No mention of specific HR policy reference', 'Sender ID "HR-Portal" not a verified corporate source', 'Page collects email + password (unlike real Google Forms)'],
        [
            'Explain why employees would be conditioned to trust "forms.google.com" — and how "forms-hr-update.site" exploits that conditioning.',
            'A real internal HR form would use corporate SSO (Single Sign-On) — the employee would already be authenticated. Why does requiring manual credential entry expose this as fake?',
            'Analyze what "forms-hr-update.site" collects vs what a real Google Form collects — how do their data profiles differ?',
            'Classify the attack and recommend how to validate legitimate internal HR communications.',
        ],
        [
            { text: 'Real Google Forms URLs always begin with "docs.google.com/forms/" or "forms.gle/" — they never use third-party domains. "forms-hr-update.site" is a lookalike domain designed to trigger the visual association with Google Forms in the victim\'s mind.' },
            { text: 'Corporate HR forms using genuine Google Workspace would authenticate via the company\'s Google SSO — employees would see their corporate account already logged in. Any HR form asking you to type in your email and password separately is harvesting credentials, not collecting form responses.' },
        ],
        'phishing',
        'VERDICT: Smishing — Corporate Credential Harvesting via HR Form Impersonation.\n\nPage Analysis: The harvesting page mimics Google Forms UI but posts submitted data (email + corporate password) to a collection endpoint on "forms-hr-update.site." Real Google Forms collect form field responses — they never ask for a username and password login.\n\nDelivery Domain: "forms-hr-update.site" — .site TLD commonly used in phishing due to low registration cost. Domain registered recently with no organizational connection.\n\nProcess Gap Exploited: Employees are accustomed to receiving HR forms via links. Establishing a policy that all HR forms come via the corporate intranet portal (not external SMS links) eliminates this attack vector.'
    ),

    mkLab('Smishing - Subscription Bomb (Distraction Attack)', 4,
        'An employee receives 30+ SMS messages within 10 minutes from various marketing and subscription services — then receives one final message offering a link to "stop the spam." The real purpose is to distract from an account takeover notification hidden within the flood.',
        [
            { time: '11:01 AM', sender: 'Various', message: '[30 subscription confirmation SMS messages received in 10 minutes — news alerts, shopping confirmations, travel deals, OTP confirmations from unrecognized services]' },
            { time: '11:06 AM', sender: 'HDFCBNK', message: 'OTP 847293 for ₹48,500 transfer. Do NOT share.' },
            { time: '11:10 AM', sender: 'StopSpam', message: 'Receiving too many SMS? Click here to remove from all lists: https://remove-fast-subscription[.]link' },
        ],
        ['Subscription bomb (30 SMS in 10 minutes, coordinated)', 'High-value OTP hidden in flood (₹48,500 transfer — not initiated by victim)', 'Attacker-controlled "unsubscribe" link immediately after flood', 'OTP from real bank (HDFCBNK) embedded during the noise'],
        [
            'Explain the subscription bomb technique: what is the attacker doing DURING the flood that requires the victim to be distracted?',
            'Identify the most important SMS in the 10-minute flood — and explain why it was at risk of being missed.',
            'What does the "StopSpam" unsubscribe link actually do — and why is it sent by the attacker?',
            'Recommend the immediate response and explain how to identify and review critical OTPs during a subscription bomb.',
        ],
        [
            { text: 'A subscription bomb is a deliberate coordinated attack where the attacker registers the victim\'s email or phone number with dozens of free mailing lists simultaneously — flooding the inbox to hide one critical message. The hidden message is usually an account takeover alert, OTP, or password reset notification.' },
            { text: 'Review all SMS messages received during a bombing event carefully — the critical one is often the OTP or security alert with a recognizable bank sender code (e.g., HDFCBNK). The ₹48,500 OTP at 11:06 is an unauthorized transaction someone else is attempting to authorize using the victim\'s account.' },
        ],
        'phishing',
        'VERDICT: Smishing — Subscription Bomb / Distraction Attack enabling Unauthorized Transaction.\n\nAttack Sequence: Attacker has victim\'s banking credentials (from prior phishing/breach) → initiates ₹48,500 transfer → real bank sends OTP to victim\'s phone → attacker launches subscription bomb to hide OTP in noise → attacker calls victim requesting OTP (or victim is confused and doesn\'t notice) → transfer completes.\n\nCritical SMS Missed: The HDFCBNK OTP for ₹48,500 at 11:06 was the one the victim needed to see and NOT share. The flood was specifically timed to hide it.\n\nUnsubscribe Link: The "StopSpam" link is the final component — collecting the victim\'s number as "confirmed active + susceptible" or harvesting credentials for a follow-up attack.\n\nResponse: If you experience a subscription bomb, immediately check your bank accounts and email security notifications. Contact your bank immediately if you see OTPs for transactions you didn\'t initiate.'
    ),

    mkLab('Smishing - SIM Swap Precursor', 4,
        'A user receives an SMS appearing to be from their telecom provider asking them to "confirm a SIM upgrade" by replying YES. Carrier analysis reveals a SIM change request was submitted 3 hours after the SMS, originating from a residential proxy IP.',
        [
            { time: '02:30 PM', sender: 'Airtel-Care', message: 'Your SIM upgrade to our new 5G network is scheduled. Reply YES to confirm OR to disable, visit: airtel-sim-update[.]com/disable — Airtel Customer Care' },
        ],
        ['Sender ID spoofed as "Airtel-Care"', 'SIM change request appears in carrier logs 3 hours later', 'Domain: airtel-sim-update.com (not airtel.in)', '"Reply YES" creates a social engineering record for the attacker', 'Carrier confirms no 5G SIM upgrade was initiated for this number'],
        [
            'Explain the SIM swap attack chain: what does an attacker need to successfully swap someone\'s SIM, and how does this SMS contribute?',
            'The SMS asks you to "Reply YES" — what does the attacker do with that YES reply?',
            'Carrier logs show a SIM change request originated from a residential proxy 3 hours after the SMS. What does this indicate about the attacker\'s next step?',
            'Recommend telecom-level and user-level controls to prevent SIM swap fraud.',
        ],
        [
            { text: 'SIM swap fraud requires the attacker to convince the carrier to transfer the victim\'s phone number to a new SIM card. To do this, they need identity details (name, DOB, account number). This SMS may be one step in gathering those details — or confirming the number is active and owned by someone susceptible to telecom impersonation.' },
            { text: 'Legitimate carriers (Airtel, Jio, Vi) never upgrade SIMs via SMS replies. SIM changes require in-person ID verification at an authorized store or through the carrier\'s verified app. Any SMS asking you to confirm a SIM change by replying is fraudulent.' },
        ],
        'phishing',
        'VERDICT: Smishing — SIM Swap Precursor / Telecom Impersonation.\n\nAttack Chain: SMS confirms phone number is active + gathers "YES" response as social proof → attacker contacts Airtel customer care with victim\'s number and social-engineered or purchased identity details → claims phone was lost and requests SIM swap → new SIM gives attacker control of victim\'s number → all OTPs (banking, email reset) now diverted to attacker.\n\nCarrier Log Evidence: The SIM change request 3 hours later confirms this SMS was part of an active SIM swap operation.\n\nDefenses: (1) Add a SIM lock / port freeze with your carrier — requires in-person ID to change SIM. (2) Use app-based authenticators (Google Authenticator) instead of SMS OTP for banking MFA. (3) Register with your carrier for a secondary verification PIN for account changes.'
    ),

    mkLab('Smishing - Smishing Kit Campaign Recognition', 3,
        'The SOC receives reports from 23 employees across 3 companies who received identical SMS messages with the same "Update KYC" template on the same day. HTML analysis of the linked pages reveals identical source code across all victims\' reported URLs.',
        [
            { time: 'Various', sender: 'KYC-Alert', message: 'URGENT: Your KYC is incomplete. Account restricted. Update immediately: https://secure-kyc-update[.]co/kyc?uid=[UNIQUE_ID] — Banking Compliance Team' },
        ],
        ['Identical HTML source code across 23 reported URLs (same smishing kit)', 'Unique UID per victim (tracking)', 'Domain cluster: secure-kyc-update.co, kyc-fast-update.org, kyc-verify-now.net — all point to same server', 'Hosting: Bulletproof hosting provider (Russia)', 'Favicon hash: matches 14 previous smishing campaigns'],
        [
            'Explain what a "smishing kit" is: how are they built, sold, and deployed to enable non-technical attackers to run large-scale campaigns?',
            'The favicon hash matches 14 previous campaigns. How does favicon hash analysis help attribute multiple smishing campaigns to the same threat actor or kit provider?',
            'Identify the unique UID parameter\'s purpose — and how many SMSes were sent if 23 employees reported but response rates are typically 5%.',
            'Recommend IOC (Indicator of Compromise) extraction from this campaign for threat intelligence sharing.',
        ],
        [
            { text: 'Smishing kits are pre-built phishing packages sold on cybercriminal marketplaces (Telegram channels, darkweb forums) for $50–500. They include: HTML/CSS files mimicking a target brand, a backend PHP script to collect and log submitted credentials, and instructions for hosting. Non-technical criminals buy the kit and deploy it.' },
            { text: 'Favicon hash analysis: every website has an icon (favicon.ico). The content hash of this file is a reliable fingerprint — if two websites have identical favicon hashes, they likely share the same template/kit. This technique is used by threat intelligence platforms (Shodan, Censys) to cluster phishing infrastructure across IP addresses.' },
        ],
        'phishing',
        'VERDICT: Smishing — Smishing Kit Deployment / Large-Scale KYC Harvesting Campaign.\n\nKit Attribution: Identical HTML source + matching favicon hash across 23+ reports = same kit deployed across multiple domains. This is typical of a rental phishing kit campaign where multiple operators used the same kit framework.\n\nCampaign Scale Estimate: 23 reports at ~5% response rate → ~460 SMSes minimum sent per company × 3 companies = ~1,380+ SMSes in this wave. Actual sending volume likely much higher.\n\nIOC Extraction:\n- IP: Bulletproof hosting server IP\n- Domains: secure-kyc-update.co, kyc-fast-update.org, kyc-verify-now.net\n- Favicon hash: [SHA256 of favicon]\n- URL pattern: /kyc?uid=[0-9a-f]{8}\n- Share via MISP, FS-ISAC, or CERT-In.'
    ),

    mkLab('Smishing - Punycode / Homograph Domain', 4,
        'An SMS appears to link to "apple-security.com" for an iCloud account verification — but the URL uses Unicode lookalike characters (Punycode encoding) that make a fake domain visually indistinguishable from the real one in some SMS clients.',
        [
            { time: '09:33 AM', sender: 'Apple', message: 'Your Apple ID was used to sign in from an unknown device. Verify here: http://аpple-security[.]com/id-verify' },
        ],
        ['Punycode domain: аpple-security.com — the "а" is Cyrillic (U+0430), not Latin "a" (U+0061)', 'Visually identical to "apple-security.com" in most fonts', 'Decoded Punycode: xn--pple-security-u8b.com', 'Sender ID "Apple" spoofed', 'URL decoded to a non-Apple server in Eastern Europe'],
        [
            'Explain Punycode encoding: how does Unicode character substitution create domains that appear identical to legitimate domains in visual inspection?',
            'Copy the "а" in "аpple" into a Unicode analyzer — what code point is it (U+0430 Cyrillic vs U+0061 Latin)? Why can\'t the human eye distinguish these?',
            'Why does the IDN homograph attack specifically target brand recognition rather than critical reading of URLs?',
            'Recommend browser and SMS-level defenses against homograph domain attacks.',
        ],
        [
            { text: 'Internationalized Domain Names (IDN) allow non-Latin characters (Cyrillic, Greek, Arabic, Han) in domain names, encoded via Punycode. Browsers and SMS clients render these in their visual form — Cyrillic "а" (U+0430) looks identical to Latin "a" (U+0061) in non-serif fonts. Attackers exploit this to register domains that appear identical to branded domains.' },
            { text: 'Always inspect URLs by hovering or long-pressing (on mobile) to see the fully decoded URL. Modern browsers (Chrome, Firefox, Safari) now show Punycode-decoded URLs in the address bar when IDN characters from multiple scripts are mixed (e.g., mixing Cyrillic with Latin). SMS clients generally do not.' },
        ],
        'phishing',
        'VERDICT: Smishing — IDN Homograph / Punycode Domain Attack (Apple ID Spoof).\n\nTechnical Analysis: The letter "а" in "аpple-security.com" is Cyrillic (U+0430 — "а" from the Russian alphabet), not the Latin "a" (U+0061). When Punycode-decoded, the real domain name is "xn--pple-security-u8b.com" — completely unrelated to Apple.\n\nWhy It Works: Human visual recognition of brand names is pattern-based, not character-by-character. Seeing "apple" triggers brand recognition before the browser has a chance to flag the domain.\n\nMitigation: Modern browsers now enforce IDN display rules (show raw Punycode for mixed-script domains). Apple registers defensive variants of its domain. SMS links should always be manually typed into the browser rather than tapped directly.'
    ),

    mkLab('Smishing - VoIP Area Code Spoofing', 3,
        'An employee receives an SMS from what appears to be a local area code number. The message contains a phishing link. Carrier analysis reveals the number is a VoIP phone number routed through a SIP trunk, not a genuine local mobile.',
        [
            { time: '03:45 PM', sender: '+91 9876 XXXXXX (Local area code)', message: 'Hi, your KYC isn\'t verified for the new banking tier. Complete it here or access will be restricted: https://kyc-bank-update[.]com/form — Thank you' },
        ],
        ['Sender appears to be a legitimate local mobile number', 'Carrier class lookup: VoIP (SIP) number, not a genuine mobile MSISDN', 'Domain: kyc-bank-update.com (not a bank domain)', 'Number previously used in 3 reported smishing campaigns', 'Message content matches known smishing template'],
        [
            'Explain how VoIP numbers can be configured to display any area code — making locally-appearing numbers unreliable identity signals.',
            'Perform a carrier class lookup on the sender number. What does "VoIP/SIP" classification indicate vs "Mobile MSISDN"?',
            'Explain why local area codes are specifically used in smishing: what psychological effect does a local number have on recipient suspicion?',
            'Recommend SMS security controls that can detect VoIP-originated messages.',
        ],
        [
            { text: 'VoIP/SIP numbers can be provisioned with any area code or geographic prefix through providers like Twilio, Bandwidth, or Vonage. The displayed number does not indicate where the caller is physically located or that the number belongs to a real person in that area. Carrier class lookup (available via telecom APIs) reveals whether a number is genuine mobile, VoIP, landline, or prepaid.' },
            { text: 'Local area codes reduce recipient suspicion by triggering familiarity bias — people are more likely to trust messages from "local" numbers. This is especially effective in India where +91 followed by a state-specific digit pattern (e.g., 9876XXXXXX) implies a real local mobile user.' },
        ],
        'phishing',
        'VERDICT: Smishing — Sender Spoofing via VoIP / Area Code Mimicry.\n\nTechnical Attribution: Carrier lookup reveals the +91 9876XXXXXX number is a VoIP SIP number, not a genuine mobile MSISDN. It has appeared in 3 previous smishing reports — consistent with a recycled smishing number pool.\n\nDefenses: (1) Enterprises can implement SMS filtering that flags VoIP-originated messages. (2) TRAI in India has implemented blockchain-based SMS filtering (TCCCPR) — commercial messages from unregistered headers are blocked. (3) Never trust financial or KYC links from SMS regardless of sender number origin.'
    ),

    mkLab('Smishing - Calendar Injection via SMS', 3,
        'An employee receives an SMS claiming there is a salary review meeting, with a link to confirm attendance. Clicking the link silently adds a fake calendar entry to the device calendar — and the event link contains a further phishing URL.',
        [
            { time: '11:20 AM', sender: 'HR-Scheduler', message: 'Salary Review Meeting scheduled for you. Confirm attendance: https://cal-invite-confirm[.]com/invite?token=SAL-2026-88' },
        ],
        ['Domain: cal-invite-confirm.com (not the corporate calendar system)', 'Link auto-triggers a .ics file download / calendar deep link', 'Calendar event created contains a phishing URL as the "meeting link"', 'Event title: "Salary Review - HR Dept" (emotionally engaging topic)', 'No corresponding entry in corporate calendar system'],
        [
            'Explain the calendar injection attack: how does clicking an SMS link automatically add a calendar event on iOS and Android?',
            'Identify what makes the "salary review" topic particularly effective for calendar injection attacks.',
            'The event\'s "Join Meeting" button links to a phishing page. Explain the two-stage nature of this attack — SMS → calendar → phishing page.',
            'Recommend how to detect and remove maliciously injected calendar events.',
        ],
        [
            { text: 'Both iOS and Android support .ics (iCalendar) file downloads from URLs — these files automatically prompt to be added to the device calendar. Some mobile URLs use deep links (webcal://) that open the calendar app directly. Clicking an SMS link that serves an .ics file adds the fake event without any further user action beyond "Add to Calendar."' },
            { text: 'The calendar event contains a "Join Meeting" URL (the real phishing link). This two-stage approach is effective because: (a) the .ics file itself often evades SMS phishing filters, and (b) the victim sees the event in their calendar for days before clicking the meeting link — when suspicion from the original SMS has faded.' },
        ],
        'phishing',
        'VERDICT: Smishing — Calendar Injection Social Engineering / Multi-Stage Phishing.\n\nTwo-Stage Delivery: Stage 1: SMS delivers .ics link (often not flagged by SMS security). Stage 2: Calendar event sits persistently, delivering the phishing URL at meeting time when victim clicks "Join Meeting."\n\n"Salary Review" Effectiveness: Employees rarely delete calendar entries related to HR processes — and salary reviews generate anxiety that makes people likely to click meeting links without verifying.\n\nRemediation: Review device calendar for entries added via external links (check source of calendar events). Delete any entries added via SMS links. Corporate policy: add calendar events only via the official corporate calendar system (Exchange/Google Calendar authenticated via SSO).'
    ),

    mkLab('Smishing - Alphanumeric Sender ID Spoofing', 3,
        'An employee receives an SMS appearing to come from "HDFCBANK" directing them to update KYC at a non-HDFC domain. The sender ID was registered with a bulk SMS provider — not verified as HDFC.',
        [
            { time: '04:10 PM', sender: 'HDFCBANK', message: 'Dear Customer, your HDFC Bank KYC will expire on 28-Feb-2026. Update immediately to avoid account suspension: https://hdfc-kyc-urgent[.]org/update' },
        ],
        ['Sender ID "HDFCBANK" can be registered by any entity via bulk SMS provider', 'Domain: hdfc-kyc-urgent.org (HDFC official domain is hdfcbank.com)', '.org TLD — HDFC Bank uses .com/.in', 'No last 4 digits of account or customer name (mass blast template)', 'KYC expiry is not a real bank process — KYC is permanent once verified'],
        [
            'Explain alphanumeric sender ID: how does "HDFCBANK" appear as the sender when the message is from an attacker?',
            'Verify the claim: does HDFC Bank KYC actually "expire" and require renewal via SMS? What does research into KYC policy reveal?',
            'Compare "hdfc-kyc-urgent.org" to HDFC Bank\'s actual domain infrastructure.',
            'Assess India\'s TRAI scrubbing policy: what should have prevented this message from being delivered?',
        ],
        [
            { text: 'Alphanumeric sender IDs in India are provisioned through TRAI-registered Telemarketing Entities (TMEs). Historically, any company could register any alphanumeric header including brand names. TRAI\'s 2021 blockchain-based SMS filtering (TCCCPR) requires entities to register their sender IDs — but enforcement gaps allow spoofed sender IDs to still reach recipients, particularly via international SMS routes.' },
            { text: 'Under RBI guidelines and the Prevention of Money Laundering Act (PMLA), KYC is a one-time verification process for bank accounts. Once completed, KYC does not have an expiry date requiring re-verification via SMS. Any SMS claiming KYC "expires" by a specific date is false — HDFC Bank would never send such a message.' },
        ],
        'phishing',
        'VERDICT: Smishing — Sender ID Spoofing / Bank KYC Harvesting (HDFC Impersonation).\n\nSender ID Mechanics: "HDFCBANK" as sender ID was provisioned via a bulk SMS provider exploiting international SMS routing that bypasses TRAI\'s domestic DLT (Distributed Ledger Technology) filtering. The victim sees "HDFCBANK" identically to a real HDFC message.\n\nKYC Policy Fact-Check: RBI KYC guidelines do not include expiry. This is a fabricated urgency. Real HDFC communications come from hdfcbank.com and always include partial account details.\n\nRegulatory Gap: TRAI\'s DLT system is designed to prevent this — but international SMS bypass routes remain an exploitation vector. Report to TRAI (trai.gov.in) and National Cyber Crime Reporting Portal.'
    ),

    mkLab('Smishing - Obfuscated redirect via URL Shortener', 3,
        'An employee receives an SMS with an urgent message accompanied by a bit.ly shortened URL. Expanding the URL reveals a malicious domain hosting a credential harvesting page mimicking a corporate login.',
        [
            { time: '08:55 AM', sender: '+91 7011XXXXXX', message: 'URGENT: Your corporate VPN access will be revoked in 30 mins. Renew authentication: https://bit.ly/3kD8Xyz' },
        ],
        ['URL shortened via bit.ly (hides actual destination)', 'Expanded URL: https://vpn-corp-login[.]pro/authenticate', 'Domain: vpn-corp-login.pro (not the company VPN domain)', '"30 minutes" urgency window', 'VPN renewal via SMS is not a real process', 'bit.ly link redirects through 2 additional redirect hops before landing on harvesting page'],
        [
            'Explain why URL shorteners (bit.ly, tinyurl) are used in smishing — what security control do they bypass?',
            'Expand the bit.ly URL using bit.ly preview (add "+" to the URL). What does the expanded destination reveal?',
            'Trace the redirect chain: bit.ly → [intermediate redirector] → vpn-corp-login.pro. What is the purpose of multi-hop redirection?',
            'Recommend technical controls to block shortened URL smishing in a corporate environment.',
        ],
        [
            { text: 'URL shorteners obfuscate the actual destination — SMS security filters and recipients cannot see the real URL without following the redirect. Many enterprise SMS filters block known malicious domains but cannot evaluate shortened URLs without actively resolving them. Shorteners also allow campaign operators to rotate the destination URL after sending.' },
            { text: 'Multi-hop redirect chains (bit.ly → intermediary → final page) serve two purposes: (1) each hop can change the final destination after SMS delivery (defeating static URL scanners), and (2) each hop can be configured to check the visitor\'s device/geography and serve legitimate content to security researchers while serving phishing pages to real victims.' },
        ],
        'phishing',
        'VERDICT: Smishing — Obfuscated Redirect / Corporate VPN Credential Harvesting.\n\nRedirect Chain Analysis:\n1. bit.ly/3kD8Xyz → (HTTP 301) → redirector-proxy[.]cc/r?c=8821\n2. redirector-proxy.cc → (HTTP 302) → vpn-corp-login[.]pro/authenticate\n\nFinal destination serves a corporate VPN login page clone, collecting domain credentials.\n\nEvasion Technique: The redirect chain allows the attacker to: (a) keep bit.ly URL active even if the final domain is blocked, and (b) serve benign content to scanners (User-Agent detection), real phish to mobile victims.\n\nCorporate Controls: (1) Real-time URL shortener expansion at SMS gateway level. (2) Block access to unrecognized .pro/.xyz/.info domains from corporate devices. (3) VPN multi-factor authentication — stolen password alone insufficient.'
    ),
];

async function seed() {
    const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/antiphishx';
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB\n');
    for (const lab of LABS) {
        await Lab.findOneAndUpdate({ title: lab.title }, lab, { upsert: true, new: true, runValidators: false });
        console.log(`  ✔ [INT ${lab.difficulty}/10] ${lab.title}`);
    }
    const total = await Lab.countDocuments();
    console.log(`\n✅ Done — ${LABS.length} smishing intermediate labs upserted. Total: ${total}`);
    process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
