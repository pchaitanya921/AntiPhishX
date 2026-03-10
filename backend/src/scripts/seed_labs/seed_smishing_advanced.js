'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// Advanced Smishing: 350 XP | 20 min | 1 hint | Difficulty 6-7/10

const mkLab = (title, difficulty, scenario, thread, indicators, tasks, hint, answer, explanation) => ({
    title, topic: 'smishing', level: 'advanced', type: 'smishing',
    difficulty, points: 350, timeLimit: 1200, published: true,
    description: `Advanced smishing simulation: ${title.replace('Smishing - ', '')}. Multi-artifact infrastructure investigation required.`,
    scenario,
    content: { smsThread: thread, indicators, artifacts: [] },
    steps: tasks,
    hints: [{ text: hint }],
    correctAnswer: answer,
    explanation,
});

const LABS = [
    mkLab('Smishing - Targeted Pig Butchering Initiation', 7,
        'A user receives a personalized investment-approach SMS referencing their LinkedIn profile. Infrastructure analysis reveals a coordinated Sha Zhu Pan (pig butchering) campaign originating from organized crime operators in Southeast Asia.',
        [
            { time: '11:22 AM', sender: '+91 79XX22XXXX', message: 'Hi Sai, this is Ananya from Chennai Investors Group. Saw your crypto post on LinkedIn. Are you currently investing in USDT futures?' },
            { time: '11:25 AM', sender: 'You', message: 'Who is this?' },
            { time: '11:26 AM', sender: 'Ananya', message: 'I\'m part of a private investor circle. We share daily signals. I made ₹2L last week. Can I add you to our Telegram group?' },
        ],
        ['Telegram group: t.me/investfastvip (3,200 members — majority fake/bot accounts)', 'Domain in bio: invest-gainfast[.]pro — registered 6 days ago', 'Hosting: VPS Singapore (ASN previously associated with 14 phishing kits)', 'SMS Origin: VoIP gateway routed through Hong Kong', 'Carrier Reputation Score: 18/100', 'Device fingerprint: correlated to 12 previous pig butchering campaigns in threat intel database'],
        ['Perform domain WHOIS on "invest-gainfast.pro" — correlate domain age (6 days) to campaign launch timing.', 'Analyze the Telegram group t.me/investfastvip: how do you determine member legitimacy, and what does a 95%+ bot-account ratio indicate?', 'Map the pig butchering campaign phases this SMS represents — where in the full attack chain is this first message?', 'Correlate the ASN hosting history to previous phishing kits and determine threat actor attribution likelihood.'],
        'This SMS is the "first contact" phase of a pig butchering (Sha Zhu Pan) operation. The attacker used LinkedIn OSINT to personalize the opener — creating a plausible reason for contact. The goal is to establish trust before introducing a fraudulent investment platform weeks later.',
        'phishing',
        'VERDICT: Advanced Social Engineering — Pig Butchering (Sha Zhu Pan) Campaign Initiation.\n\nPhase Identification: This SMS represents the "first contact" phase. The full chain: (1) First Contact (this SMS), (2) Weeks of relationship building, (3) Platform introduction, (4) Fake profits shown, (5) Large investment request, (6) Exit/disappear.\n\nInfra: invest-gainfast.pro (6 days old) + Singapore VPS with phishing ASN history + VoIP-routed SMS via Hong Kong = HIGH confidence organized criminal operation. Device fingerprint matching 12 prior campaigns confirms established threat actor.\n\nTelegram: 95%+ bot-member ratio creates artificial credibility — victims who join see a "thriving investor community" all fabricated by the operator.\n\nResponse: Block and report. Share IOCs (invest-gainfast.pro, Telegram group) with CERT teams and FS-ISAC.'
    ),

    mkLab('Smishing - Apple Pay Wallet Credential Harvest', 6,
        'A user receives an SMS claiming a new Apple Pay device was added to their iCloud account. The linked page hosts a self-signed TLS credential harvest that posts collected data to a Moldovan exfiltration endpoint.',
        [
            { time: '02:08 PM', sender: 'Apple', message: 'A new Apple Pay device has been added to your Apple ID. If this wasn\'t you, remove it: https://wallet-device-remove[.]com/verify' },
        ],
        ['TLS certificate: Self-signed (issuer "SecureWallet LLC" — not Apple CA)', 'JS redirect chain: wallet-device-remove.com → credential-collect[.]pw', 'Form POST destination: api-gateway-wallet[.]cc/collect.php', 'Server: Moldova (bulletproof hosting AS 197695)', 'POST response header: X-Harvest-ID: AW-8821 (per-victim tracking)', 'Proxy logs confirm victim submitted credentials'],
        ['Inspect TLS certificate: what does self-signed "SecureWallet LLC" confirm about the site\'s identity?', 'Trace the JS redirect chain from wallet-device-remove.com to credential-collect.pw — what does multi-hop redirection achieve for the attacker?', 'Analyze the exfiltration endpoint "api-gateway-wallet.cc/collect.php" — why is /collect.php a reliable phishing kit signature?', 'Assess what credentials were stolen and enumerate victim remediation steps.'],
        'Apple Pay management is exclusively handled via device Settings or appleid.apple.com. Apple never sends wallet management links via SMS to third-party domains. A self-signed certificate is the critical trust failure — browser warnings flag this but SMS link previews do not.',
        'phishing',
        'VERDICT: Advanced Smishing — Apple Pay Impersonation / Credential Harvesting with Moldovan Exfiltration.\n\nRedirect Chain: wallet-device-remove.com (lure) → JS redirect → credential-collect.pw (phishing form) → POST → api-gateway-wallet.cc/collect.php (Moldova exfil).\n\nTLS Failure: Apple uses DigiCert/Sectigo OV certificates explicitly stating "Apple Inc." Any deviation = fake site. Self-signed certificate from "SecureWallet LLC" should trigger immediate browser warning.\n\n/collect.php Signature: PHP phishing kits universally name the log script "collect.php," "grab.php," or "log.php" — reliable kit attribution pattern.\n\nRemediation: Change Apple ID password immediately → Review Sign-in activity → Revoke unknown sessions → Enable Advanced Data Protection → Consider hardware security key for Apple ID.'
    ),

    mkLab('Smishing - Political Donation Payment Harvesting', 6,
        'During election season, a smishing campaign targets registered voters with donation links cloned from a legitimate party donation page. Infrastructure shares a favicon hash with a known kit deployed across 14 domains on shared hosting.',
        [
            { time: '04:30 PM', sender: 'CampaignAlert', message: 'Support campaign reform today. Your donation makes a difference: https://secure-vote-support[.]net/donate — Every ₹ counts.' },
        ],
        ['Domain shares hosting server with 14 other phishing domains', 'Favicon hash: SHA256 matches "DonationPhish v2.1" kit', 'Payment form: Collects full card number, CVV, expiry, billing address', 'Gateway: Routes to fraud merchant ID flagged by Visa/MC', 'Campaign: "Campaign Reform Alliance" — not in ECI registered party database'],
        ['Verify if "Campaign Reform Alliance" is a registered ECI political party via eci.gov.in.', 'Analyze shared hosting: 14 phishing domains on same server — what threat intelligence value does this provide?', 'Explain how fraudulent merchant accounts are acquired to process harvested card data.', 'Recommend multi-stakeholder response: SOC, payment networks, hosting provider, law enforcement.'],
        'Political donation campaigns peak during elections — emotional investment reduces scrutiny. Verify any donation target: (1) search the party name on eci.gov.in, (2) manually navigate to the party\'s official website, (3) use official payment portal only.',
        'phishing',
        'VERDICT: Advanced Smishing — Political Impersonation / Payment Card Harvesting Campaign.\n\nKit Attribution: Favicon SHA256 match to "DonationPhish v2.1" + 14-domain cluster on shared infrastructure = single operator running multiple campaigns simultaneously.\n\nECI Check: "Campaign Reform Alliance" does not exist in the EC India registered party database — the entire political identity is fabricated.\n\nFraud Merchant: Card data entered is processed as a real ₹X transaction (victim\'s funds transferred) while simultaneously logged for subsequent CNP fraud.\n\nActions: SOC (block domain cluster), Visa/MC (revoke merchant ID), Hosting (abuse report), ECI + cybercrime.gov.in (formal complaint).'
    ),

    mkLab('Smishing - FluBot-Style Banking Trojan APK', 7,
        'An employee receives an SMS directing them to install a delivery tracking APK. Static and dynamic analysis reveals a banking trojan with SMS interception, contact harvesting, self-propagation, and Accessibility Service overlay capabilities.',
        [
            { time: '01:15 PM', sender: 'DHLDelivery', message: 'Your DHL package was delayed. Install our tracking app for real-time updates: https://dhl-track-app[.]net/trackdelivery.apk' },
        ],
        ['Not from Google Play Store — direct APK download', 'Permissions: READ_SMS, RECEIVE_SMS, SEND_SMS, READ_CONTACTS, CALL_PHONE, BIND_ACCESSIBILITY_SERVICE', 'C2 domain: api-control-android[.]xyz (hardcoded in strings.xml)', 'Hardcoded C2 IP: 185.221.XX.XX (prior FluBot attribution)', 'Behavior: Intercepts all SMS → forwards to C2 | Auto-sends SMS to contacts | Accessibility overlay on banking apps', 'C2 beacon: Every 300 seconds'],
        ['Analyze permissions: why does READ_SMS + SEND_SMS + READ_CONTACTS create a self-propagating worm capability?', 'Explain BIND_ACCESSIBILITY_SERVICE abuse: how does this permission enable credential overlay on banking apps without root access?', 'The C2 IP appears in FluBot attribution feeds — what does shared C2 infrastructure tell you about threat actor continuity?', 'Recommend device response steps for an employee who installed this APK.'],
        'APKs downloaded via URL bypass Google Play Protect scanning. Android blocks "Install from unknown sources" by default. Legitimate logistics companies (DHL, FedEx) track shipments via their official Play Store app — they never deliver APKs via SMS links.',
        'phishing',
        'VERDICT: Advanced Smishing — FluBot-Variant Banking Trojan / Mobile Malware Delivery. Risk: CRITICAL.\n\nSelf-Propagation: READ_CONTACTS provides full contact list. SEND_SMS broadcasts the same smishing message to every contact. Each infected device becomes a new smishing sender — exponential campaign growth.\n\nAccessibility Abuse: BIND_ACCESSIBILITY_SERVICE enables: (a) transparent credential overlays on banking apps, (b) reading all on-screen content, (c) auto-clicking UI elements. This defeats app-level isolation entirely.\n\nDevice Response:\n1. Do NOT enter any credentials — assume all banking sessions compromised.\n2. Factory reset (Accessibility abuse can persist through uninstall).\n3. Change all passwords from a clean device.\n4. Notify bank of potential compromise. Change SIM PIN (OTP interception risk).'
    ),

    mkLab('Smishing - SIM Swap Detection via Two-Day Pre-conditioning', 6,
        'A victim\'s phone loses signal for 45 minutes. During this window, their banking password is reset and £9,800 transferred. Carrier logs trace active SIM swap preceded by a social engineering call that used a reference number planted in a prior SMS the day before.',
        [
            { time: '09:00 AM (DAY BEFORE)', sender: 'O2Network', message: 'Your SIM card will be upgraded automatically. If you notice service interruption, it is temporary. Reference: SIM-UK-88221. No action needed.' },
            { time: '10:47 AM (ATTACK DAY)', sender: 'Carrier log', message: '[SIM swap processed. Residential proxy IP. Social engineering call used reference SIM-UK-88221 as proof of account ownership.]' },
            { time: '11:00 AM', sender: 'HSBC', message: 'Your online banking password has been changed. Not you? Call 03457 404404.' },
            { time: '11:12 AM', sender: 'HSBC', message: 'Transfer of £9,800 to account 88127XXX confirmed.' },
        ],
        ['Day-before SMS planted reference SIM-UK-88221 used by caller to social-engineer carrier', 'SIM swap processed at 10:47 AM from residential proxy IP', 'All SMS OTPs diverted to attacker-controlled SIM for 45 minutes', 'Password reset + transfer completed using intercepted OTPs', 'Victim didn\'t notice SOS-only status until HSBC transfer alert arrived'],
        ['Analyze the day-before SMS: how were its two functions (normalization + reference seeding) achieved in one message?', 'Trace the full attack sequence from day-before SMS through SIM swap to bank transfer.', 'The caller quoted SIM-UK-88221 as account verification — how did this overcome the carrier\'s identity check?', 'Assess SMS-based OTP as a single point of failure — what authentication architecture prevents SIM swap account takeover?'],
        'The day-before SMS served two purposes: (1) it planted the reference number SIM-UK-88221 the attacker could later quote to the carrier as "account owner proof," and (2) it pre-conditioned the victim to expect service disruption so they wouldn\'t call the carrier when service dropped.',
        'phishing',
        'VERDICT: Advanced SIM Swap — Two-Day Pre-Conditioning + Carrier Social Engineering + Bank Account Takeover. £9,800 loss.\n\nFull Sequence:\nDay -1: SMS plants SIM-UK-88221 + normalizes upcoming service drop.\nDay 0 10:17 AM: Attacker calls O2, quotes reference as "account owner," claims damaged phone.\nDay 0 10:47 AM: SIM swap processed to attacker SIM.\n10:47–11:32 AM: All SMS to victim diverted to attacker.\n11:00 AM: HSBC password reset → intercepted OTP → changed.\n11:12 AM: £9,800 transfer → intercepted OTP → confirmed.\n\nSMS OTP Failure: The entire £9,800 loss depended on SMS OTP redirectability. FIDO2/app-based TOTP would have broken the chain — both are SIM-independent.'
    ),

    mkLab('Smishing - Crypto Wallet Drainer via Web3 Phishing', 7,
        'A user receives an SMS promoting a USDT airdrop requiring wallet connection. The linked Web3 site requests a malicious setApprovalForAll contract call that drains all tokens from the victim\'s wallet within 30 seconds of approval.',
        [
            { time: '03:55 PM', sender: 'AirdropAlert', message: '🎁 EXCLUSIVE: Connect your MetaMask wallet to receive 200 USDT airdrop. Limited time: https://meta-airdrop-connect[.]io/claim' },
        ],
        ['Domain: meta-airdrop-connect.io — registered 2 days ago', 'Page requests: setApprovalForAll (ERC-721/ERC-1155) to attacker contract', 'Contract 0x7f3...a91b: Not verified on Etherscan, flagged in Slither static analysis', 'Post-approval: Sweep bot empties all ERC-20/ERC-721 tokens within 30 seconds', 'Attacker wallet 0x4d2...c33a: On-chain trace shows drainage from 847 prior victims'],
        ['Explain setApprovalForAll: what does this ERC-721 function grant and why does it allow total wallet drainage?', 'Trace attacker wallet 0x4d2...c33a on Etherscan — what does the 847-victim drain history reveal about campaign scale?', 'Explain why Web3 phishing requires no server-side credential collection — the victim\'s own wallet signs the malicious transaction.', 'Recommend Web3 wallet practices that prevent approval-based drainer attacks.'],
        '"setApprovalForAll()" grants a specified contract address permission to transfer ALL tokens of a given contract from the victim\'s wallet. It is a legitimate ERC-721 marketplace function that is abused by drainer kits. Never approve "setApprovalForAll" for any site arrived at via SMS.',
        'phishing',
        'VERDICT: Advanced Web3 Smishing — Crypto Wallet Drainer via Malicious Smart Contract Approval.\n\nMechanism: No private key theft. The victim\'s MetaMask signs a legitimate blockchain "setApprovalForAll" transaction granting the attacker\'s contract unlimited spend. The drain bot executes within 30 seconds — irreversibly on-chain.\n\nScale: 0x4d2...c33a received drained funds from 847 prior wallets across previous campaigns.\n\nPrevention:\n1. Never connect wallet to sites arrived at via SMS.\n2. "setApprovalForAll" in any approval prompt = immediate Reject.\n3. Use Revoke.cash to audit and revoke existing token approvals.\n4. Hardware wallet (Ledger/Trezor) adds physical confirmation — but still vulnerable if victim physically confirms the malicious approval.'
    ),

    mkLab('Smishing - WhatsApp Account Hijacking Chain', 6,
        'A victim receives a WhatsApp OTP they didn\'t request, followed by a request from a known contact\'s (already-hijacked) WhatsApp to share the code. Carrier logs confirm a WhatsApp login attempt from Nigeria using an Android emulator.',
        [
            { time: '07:31 PM', sender: 'WhatsApp', message: 'Your WhatsApp code: 384-751. Do not share with others.' },
            { time: '07:32 PM', sender: 'Priya (Contact)', message: 'Hey, I accidentally entered your number. Could you send me the 6-digit code you just received? Sorry!' },
        ],
        ['OTP not initiated by victim', '"Priya\'s" WhatsApp already compromised — message from attacker using her account', 'Carrier log: WhatsApp login attempt from Nigeria (Lagos), Android emulator', '"Priya\'s" last-seen status changed to "Unknown" — active foreign session detected'],
        ['Explain the WhatsApp hijack chain: who compromised "Priya\'s" account first and how her compromised account is now used against you?', 'The carrier log confirms a Nigeria login attempt. What was the attacker doing when your OTP was triggered?', 'Why is an OTP request from a known contact\'s number specifically more dangerous than a request from an unknown number?', 'Recommend recovery steps for both the current victim and for "Priya" whose account is already compromised.'],
        'WhatsApp accounts are hijacked in exponential chains — each compromised account provides a trusted identity to target its contacts. The message from "Priya" is actually the attacker. The OTP you received is for YOUR account, which the attacker is trying to register on a new device.',
        'phishing',
        'VERDICT: Advanced Smishing — WhatsApp Account Hijacking Chain.\n\nChain: Attacker previously hijacked Priya\'s account using the same OTP relay technique → now uses Priya\'s trusted identity to request your OTP → if shared, your account is hijacked → your contacts receive the same message, continuing the chain.\n\nNigeria Login: The carrier log confirms the attacker was on the WhatsApp registration screen in Lagos, had entered your phone number, and was waiting for your OTP to complete account takeover.\n\nResponse:\nYou: Do NOT share. Block report "Priya\'s" number.\nPriya\'s account recovery: Reinstall WhatsApp → re-verify with SIM → take account back (deregisters other sessions).'
    ),

    mkLab('Smishing - eSIM Provisioning Fraud via Fast-Flux Domain', 6,
        'A corporate employee receives an SMS to approve an eSIM activation. The domain was registered 12 hours ago and uses DNS fast-flux (7 different IPs in 35 minutes) to evade block lists. The linked page harvests corporate credentials to fraudulently provision an eSIM.',
        [
            { time: '10:40 AM', sender: 'CarrierSupport', message: 'Your eSIM activation request is ready. Approve within 1 hour: https://esim-portal-confirm[.]com/activate?ref=ESM-2026-8821' },
        ],
        ['Domain: esim-portal-confirm.com — registered 12 hours ago', 'DNS fast-flux: A-record changes every 5 minutes — 7 different IPs in 35-minute monitoring window', 'Carrier confirms: No pending eSIM activation for this number', 'Landing page harvests: Corporate email, password, carrier account number'],
        ['Explain DNS fast-flux: why does rotating through 7 IPs every 5 minutes defeat IP-based block lists?', 'The 12-hour domain age combined with fast-flux DNS — what does this operational security profile indicate about attacker infrastructure management?', 'If the employee approves the eSIM via this link, what control does the attacker gain over corporate communications?', 'Recommend DNS RPZ and mobile device policy controls for eSIM fraud prevention.'],
        'Carriers (Airtel, Jio, O2, Verizon) never provision eSIMs via SMS links. All eSIM changes require in-person ID verification or authenticated carrier app flow. Any "approve eSIM via link" SMS is fraudulent.',
        'phishing',
        'VERDICT: Advanced Smishing — eSIM Provisioning Fraud via Fast-Flux Phishing Infrastructure.\n\nFast-Flux: 5-minute TTL + 7 rotating IPs = IP-based blocks are outdated before they propagate. Domain-level DNS RPZ blocking required.\n\neSIM Impact: Attacker receives eSIM profile for the victim\'s corporate number. All 2FA SMS and voice OTP route to attacker. Any corporate account with SMS MFA = fully compromised.\n\nControls:\n1. DNS RPZ: Block domains <48 hours old at corporate resolver.\n2. Mobile policy: eSIM changes require helpdesk ticket + management approval.\n3. Carrier: Out-of-band PIN verification mandatory for all eSIM provisioning.'
    ),

    mkLab('Smishing - Corporate Credential Harvesting via HR Smish', 6,
        'Seventeen FinTrust Corp employees receive SMS messages about a mandatory payroll audit. The link delivers an intranet-cloned login page that exfiltrates AD credentials to an offshore server. Active Directory logs show all 17 accounts accessed from a Ukrainian IP within 30 minutes.',
        [
            { time: '09:15 AM', sender: 'HR-Payroll', message: 'ACTION REQUIRED: Payroll audit form must be completed by 12 PM today. Use your corporate login: https://hr-update-portal[.]co/payroll-audit-2026' },
        ],
        ['Domain: hr-update-portal.co — not corporate HR domain', 'Page: Clone of internal HR portal (UI scraped from employee social media posts)', 'Credential POST: collect-hr[.]xyz/log.php (Ukrainian server)', '17 AD accounts submitted credentials — all accessed from Ukrainian IP within 30 minutes', 'Active Directory logs: 17 foreign logins at 09:30–10:25 AM'],
        ['Assess business impact: 17 AD credentials compromised. What systems are at immediate risk and what is the likely next-phase attack?', 'How did the attacker obtain internal intranet screenshots to build a convincing HR portal clone?', 'The 15-minute gap between credential submission and AD login reveals the attacker is operating automated tooling. Explain.', 'Design a 30-minute response playbook for the first half-hour after discovering this credential compromise.'],
        'Corporate credential smishing campaigns typically launch Monday or Tuesday mornings — when employees are most likely to act quickly on "urgent" HR communications. Payroll references create financial anxiety that overrides security awareness training.',
        'phishing',
        'VERDICT: Advanced Corporate Smishing — Active Directory Credential Harvest + Immediate Account Takeover. 17 accounts compromised.\n\nNext-Phase Risks: With 17 AD credentials: corporate email (OWA), VPN, SharePoint files, cloud SSO apps, network shares. Beachhead for ransomware or BEC wire fraud.\n\nClone Method: Internal UI screenshots obtained via (a) employee social media posts, (b) prior low-privilege compromised account access.\n\n30-Min Response:\n0-5 min: Force-reset all 17 AD accounts. Revoke all active sessions (Azure AD).\n5-10 min: Block Ukrainian IP range at firewall + VPN ACL.\n10-20 min: Audit all email/file access from 17 accounts in prior 60 minutes.\n20-30 min: Notify affected employees. Sweep remaining phishing SMSes from gateway logs.'
    ),

    mkLab('Smishing - Fake Customs Fee Multi-Hop Payment Redirect', 6,
        'A smishing campaign targets online shoppers with a fake customs clearance fee. The payment link routes through 3 redirect hops before landing on a card harvesting page. The shared server IP links this campaign to 4 prior logistics smishing operations in CERT-In advisories.',
        [
            { time: '04:22 PM', sender: 'CustomsAlert', message: 'Your international shipment is held at customs. Pay ₹2,999 clearance fee: https://customs-fast-clear[.]site/pay?pkg=IN-88221' },
        ],
        ['Redirect chain: customs-fast-clear.site → cdn-relay-pay[.]org → secure-payment-india[.]cc (card harvest form)', 'All 3 domains share server IP 185.130.44.XX', 'IP 185.130.44.XX in 4 prior CERT-In logistics smishing advisories', 'Card form collects: card number, CVV, expiry, OTP', 'Post-entry: ₹2,999 charged + second unauthorized charge attempt ₹29,999'],
        ['Trace the 3-hop redirect chain — what security benefit does each additional hop provide (blocklist evasion, geographic filtering, time-delayed rotation)?', 'The server IP appears in 4 prior CERT-In advisories — how does persistent IP reuse aid threat actor attribution?', 'Explain the unauthorized second charge (₹29,999): how is it attempted without the victim re-entering card details?', 'Recommend payment security controls preventing unauthorized recurring charges from harvested card data.'],
        'CBIC customs duties are paid exclusively via the official ICEGATE portal (icegate.gov.in) or through the courier company\'s official payment system. Any SMS requesting customs payment via an external link is always fraudulent.',
        'phishing',
        'VERDICT: Advanced Smishing — Fake Customs Fee / Multi-Hop Payment Harvesting. CERT-In attributed infrastructure.\n\nRedirect Chain Purpose:\nHop 1: Primary campaign URL — first to be reported/blocked. Short-lived.\nHop 2: Geographic filtering — serves CDN content to scanner IPs, phishing to mobile UA.\nHop 3: Final harvest endpoint — most robust infrastructure, last to be taken down.\n\nIP Attribution: 185.130.44.XX in 4 prior CERT-In advisories = same threat actor reusing hosting infrastructure across campaign waves — cost optimization behavior.\n\nSecond Charge: Harvesting backend tokenizes stored card for repeat card-not-present (CNP) fraud. Virtual one-time card numbers (RuPay/Visa Click-to-Pay) would prevent card-on-file abuse.'
    ),
];

async function seed() {
    const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/antiphishx';
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB\n');
    for (const lab of LABS) {
        await Lab.findOneAndUpdate({ title: lab.title }, lab, { upsert: true, new: true, runValidators: false });
        console.log(`  ✔ [ADV ${lab.difficulty}/10] ${lab.title}`);
    }
    const total = await Lab.countDocuments();
    console.log(`\n✅ Done — ${LABS.length} smishing advanced labs upserted. Total: ${total}`);
    process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
