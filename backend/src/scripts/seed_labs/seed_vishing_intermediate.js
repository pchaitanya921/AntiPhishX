'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// Intermediate: 200 XP | 15 min | Difficulty 3-4/10 | 2 hints

const mkLab = (title, difficulty, scenario, transcript, tasks, hints, answer, explanation) => ({
    title, topic: 'vishing', level: 'intermediate', type: 'vishing',
    difficulty, points: 200, timeLimit: 900, published: true,
    description: `Intermediate vishing simulation: ${title.replace('Vishing - ', '')}. Analyze call artifacts and deliver a SOC-grade verdict.`,
    scenario,
    content: { callTranscript: transcript, callerID: 'Spoofed', callDuration: '3-6 minutes', artifacts: [] },
    steps: tasks,
    hints,
    correctAnswer: answer,
    explanation,
});

const LABS = [

    mkLab('Vishing - Caller ID Spoofing Analysis', 3,
        'The SOC receives a complaint from an employee who received a call that appeared on Caller ID as the company\'s internal IT helpdesk number (ext. 5100). The caller requested password reset credentials. Review the call metadata artifact and deliver an analysis.',
        `CALL METADATA ARTIFACT:
  Displayed Caller ID: +1 (512) 555-5100 (FinTrust IT Helpdesk — verified internal)
  Actual call routing: Received via external PSTN trunk, not internal PBX
  VoIP metadata: Originating IP: 91.102.33.47 (Netherlands VPS)
  SIP INVITE Record: From: "FinTrust IT" <sip:5100@voip-spoof-provider.com>
  Call direction: INBOUND from external line (internal calls route via ext. x5xxx prefix on a separate PBX trunk)

CALL TRANSCRIPT:
CALLER: "Hi, this is Kevin from the IT Helpdesk, extension 5100. We're doing a system migration tonight and need to verify your credentials won't be locked out. Can you confirm your username and current password?"

EMPLOYEE: "Oh sure — it's lakshmi.sai and the password is —"

CALLER: "Perfect — and we'll need the temporary reset code that's being sent to your phone right now."`,
        [
            'Explain how Caller ID spoofing works technically: why does the phone display "+1 (512) 555-5100" even when the call originates from a Netherlands VPS?',
            'Identify the specific metadata field that confirms this is an external call despite the internal-looking number.',
            'What social engineering principle makes spoofed internal numbers particularly effective?',
            'Classify the attack, assess what was compromised, and recommend immediate response.',
        ],
        [
            { text: 'Caller ID (ANI/CLID) is a value set by the caller in the SIP INVITE or outbound call signaling — it is NOT verified by the phone system receiving the call. VoIP providers allow callers to set any arbitrary Caller ID string, meaning anyone can display any number.' },
            { text: 'The critical tell is the call routing path: the call arrived via an EXTERNAL PSTN trunk, not the internal PBX. Real internal calls from ext. 5100 would route internally through the PBX system. This routing discrepancy proves the caller is external despite the displayed internal number.' },
        ],
        'phishing',
        'VERDICT: Caller ID Spoofing Vishing Attack — Internal Helpdesk Impersonation.\n\nSpoofing Mechanism: The attacker used a VoIP provider (VoIP over SIP from Netherlands IP 91.102.33.47) and set the SIP INVITE header "From" to display "FinTrust IT / 5100." The receiving phone system displays whatever caller ID it receives — it does not cryptographically verify it.\n\nKey Metadata Indicator: The call arrived on an external PSTN trunk. All genuine internal helpdesk calls route exclusively through the internal PBX — this technical artifact alone proves the caller was external.\n\nCompromised: Username confirmed. Password was interrupted — check if employee completed the utterance. OTP requested — confirm if shared.\n\nResponse: Force-reset employee credentials immediately. Enable PBX routing alerts for external-to-internal Caller ID mismatches. Train employees: IT helpdesk calls from the internal number are still indistinguishable by phone — always call back on a known internal number rather than responding to inbound requests for credentials.'
    ),

    mkLab('Vishing - Pig Butchering (Romance/Invsetment) Voice', 4,
        'An employee reports that over the past 6 weeks, they have been building a relationship with someone they met on LinkedIn who has been calling regularly. The person recently introduced them to an "exclusive investment platform" and is now pressuring them to invest $15,000.',
        `WEEK 1 CALL: Initial contact — friendly, asks about FinTrust Corp, shares similar professional interests. No financial discussion.

WEEK 3 CALL: "I made $22,000 last month on a crypto platform a friend introduced me to. I only share it with people I really trust. No pressure — I'll tell you more if you're interested."

WEEK 5 CALL: "I deposited $5,000 for you as a gesture of my trust. Log in and see — your balance shows $8,200 already! You can see the profits are real. Now if you add $15,000 from your side, we can make a large position together."

WEEK 6 CALL — PRESSURE: "The platform is closing new accounts next week — it's invite-only. If you want to get in before it closes, you need to wire $15,000 this week. My manager has already approved a 40% return guarantee in writing."

PLATFORM ARTIFACT: "CryptoVault Pro" — domain registered 3 weeks ago | No FCA/SEC registration | Withdrawal requests show "processing" forever | Balance displayed is attacker-controlled UI manipulation`,
        [
            'Explain the "pig butchering" terminology and the psychological investment model used to make victims feel they have already profited before being asked to invest.',
            'Analyze the 6-week timeline: what is the purpose of the long relationship-building phase before the financial ask?',
            'Identify 3 specific platform red flags from the artifact that confirm this is a scam.',
            'Classify the attack and explain why victims of this scam often refuse to believe it is fraud even after being warned.',
        ],
        [
            { text: '"Pig butchering" (Sha Zhu Pan) scams are named for the practice of "fattening a pig before slaughter" — the attacker invests weeks building trust and emotional dependency before introducing the investment platform. By the time money is requested, the victim has significant emotional investment in the relationship.' },
            { text: 'Key verification: any legitimate investment platform is registered with the FCA (UK), SEC (US), or relevant financial regulator. Search the FCA register (register.fca.org.uk) or SEC EDGAR for the platform name. "CryptoVault Pro" registered 3 weeks ago with no regulatory registration = guaranteed scam.' },
        ],
        'phishing',
        'VERDICT: Pig Butchering (Sha Zhu Pan) — Social Engineering Investment Fraud.\n\n6-Week Manipulation Timeline: Week 1-2 = trust building. Week 3-4 = platform introduction with success stories. Week 5 = "I deposited for you" (fake balance shown to prove legitimacy). Week 6 = artificial urgency + closing window to force large investment.\n\nPlatform Red Flags: (1) Domain registered 3 weeks ago. (2) No FCA/SEC registration (illegal to operate investment platform without). (3) Withdrawals perpetually "processing" — money cannot be extracted. (4) Balance is a UI number — not backed by real assets.\n\nWhy Victims Resist: The emotional relationship built over 6 weeks is real to them. The fake profits they see on screen feel real. Accepting it is fraud means accepting the entire relationship was manufactured — a psychologically painful realization. Professional victim support is recommended alongside financial intervention.'
    ),

    mkLab('Vishing - MFA Code Social Engineering', 4,
        'An employee receives a call from someone claiming to be from Microsoft Azure support, stating their account shows a suspicious login from Russia. The caller then walks them through a "verification process" that captures their MFA code.',
        `CALLER: "Hello, this is Microsoft Azure Security, support case #AZ-2026-8841. We've detected a sign-in attempt to your account from Moscow, Russia 12 minutes ago. We suspended the session but the attacker may try again. I need to verify you're the real account holder."

EMPLOYEE: "Yes, how do I verify?"

CALLER: "I'm sending a verification code to your registered phone number right now. Please read me the 6-digit code when it arrives — this is how we confirm identity."

[Employee receives a Microsoft MFA text message]

EMPLOYEE: "I got it: 847-193."

CALLER: "Perfect, that confirms your identity. We've now locked the foreign IP from your account. You should be protected. I'll send you a case confirmation email shortly."

[No email arrives. Employee's account is now logged into from an unknown IP. The attacker used the MFA code to complete a login they initiated moments before the call.]`,
        [
            'Explain the timing attack: what was the attacker doing immediately BEFORE and during the phone call?',
            'The MFA code was sent by the real Microsoft system. Why does having a real Microsoft MFA code not make this call legitimate?',
            'What is the correct response when you receive an authentication code you didn\'t explicitly request?',
            'Classify the bypass technique and its implication for MFA as a security control.',
        ],
        [
            { text: 'The attacker had already obtained the employee\'s username and password (from a breach dump or prior phishing attack) and was at the MFA code screen on the real Microsoft login page when they called. The call was placed to socially engineer the victim into reading out the MFA code that Microsoft then sent to the victim\'s phone.' },
            { text: 'A fundamental rule: you should ONLY enter or share an MFA code if YOU initiated the login yourself, moments ago. If you receive an MFA code unexpectedly (you weren\'t just trying to log in), it means someone else is trying to log into your account with your password — and they\'re trying to trick you into completing their login.' },
        ],
        'phishing',
        'VERDICT: MFA Bypass via Social Engineering — Real-Time OTP Interception.\n\nAttack Sequence: Attacker obtained credentials (from breach/phishing) → Initiated login on Microsoft portal → Hit MFA screen → Called victim claiming to be Microsoft → Convinced victim to read the MFA code → Used code to complete attacker\'s own login → Account compromised.\n\nWhy This Defeats MFA: MFA codes are captured via social engineering (human interception) not technical interception. The code was legitimate — but shared with the wrong person. This attack bypasses MFA entirely without any technical exploit.\n\nImplication: MFA significantly reduces automated credential stuffing attacks but does not protect against real-time social engineering. FIDO2 hardware keys (non-phishable — hardware-bound, domain-verified) are the only MFA type resistant to this attack pattern.'
    ),

    mkLab('Vishing - Fake Employee (Help Desk) Tactic', 4,
        'A new IT contractor calls several employees claiming to be from the internal IT helpdesk, collecting their "temporary credentials" for a system migration that doesn\'t exist. The SOC discovers 12 sets of credentials were collected before the scam was identified.',
        `CALLER: "Hi, this is Sam from IT — we're doing a network directory migration this weekend. I'm calling all staff to collect your current username and temporary emergency access PIN so we can pre-load your profile into the new system. It'll save you 30 minutes of setup on Monday."

EMPLOYEE A: "Sure — my username is a.kumar and my PIN is 4892."

[12 similar calls made over 90 minutes]

SOC ALERT: Multiple employees in the same department reported receiving IT migration calls within a 2-hour window. No migration was scheduled. The caller extension (ext. 5107) does not match any IT staff member. Calls originated from an internal IP — further investigation reveals a contractor laptop connected to the FinTrust guest WiFi network was used to place the calls via a soft-phone application.`,
        [
            'Identify the insider access element: how did the attacker access the internal network to make calls that appeared internal?',
            'What process failure allowed 12 credential disclosures before the scam was identified?',
            'Explain the "pre-texting" social engineering technique used (migration story) and why it reduces victim suspicion.',
            'Recommend systemic controls that would prevent this attack — focusing on both process and technical layers.',
        ],
        [
            { text: 'IT departments should never call employees to collect passwords, PINs, or credentials — for ANY reason, including system migrations. Real migrations use Single Sign-On, Active Directory synchronization, or automated provisioning. Credentials are never "pre-collected" by IT staff over the phone.' },
            { text: 'When receiving calls claiming to be from IT, employees should verify by calling the IT helpdesk back on the published internal number (not the callback number provided by the caller) before sharing any information.' },
        ],
        'phishing',
        'VERDICT: Internal Social Engineering / Insider Threat Vishing Attack.\n\nAttack Vector: Contractor with guest WiFi access used a soft-phone app to originate calls that appeared internal (no external Caller ID). Pre-texted with a plausible migration story during a time when security awareness was lowered.\n\nProcess Failures: (1) No verification requirement before disclosing credentials. (2) IT never announced migration to employees, creating no baseline for staff to verify against. (3) Contractor guest WiFi had access to internal soft-phone VLAN.\n\nControls Required: (1) Policy: IT NEVER collects credentials by phone. Zero exceptions. (2) Guest WiFi VLAN isolation — no access to internal SIP/PBX systems. (3) Migration announcements via signed email from leadership before any contractor contact. (4) Credential disclosure triggers automatic SOC alert.'
    ),

    mkLab('Vishing - Google Voice Scam', 4,
        'A FinTrust employee selling furniture on a marketplace receives a call from a "buyer" who wants to verify the employee is a real person before sending payment — and asks them to share a Google verification code sent to their number.',
        `CONTEXT: Employee posted sofa for sale on Facebook Marketplace.

CALLER: "Hi, I saw your sofa listing — I want to buy it. Before I send payment, I want to verify you're real and not a scammer. I'm going to send you a Google verification code — just read it to me and I know you're genuine."

EMPLOYEE: "Sure." [Receives SMS: "Your Google Voice verification code is 391847. Don't share it with anyone."]

CALLER: "Got the code?"

EMPLOYEE: "391847."

CALLER: "Perfect, you\'re verified! I'll send the payment link shortly."

[No payment arrives. The employee's phone number is now registered to a Google Voice account controlled by the attacker, who uses it for further scams.]`,
        [
            'Explain what actually happened when the employee shared the Google verification code — what did the attacker use it for?',
            'Why does the SMS message itself say "Don\'t share it with anyone" and what does this suggest about Google\'s awareness of this abuse?',
            'How can the attacker misuse a Google Voice number linked to the victim\'s real phone number?',
            'Recommend recovery steps for the victim whose number has been registered to an attacker\'s Google Voice account.',
        ],
        [
            { text: 'Google Voice requires a real phone number to verify account creation. The attacker was creating a new Google Voice account and entered the victim\'s phone number — Google then sent the victim a verification code. When the victim read the code to the attacker, they completed the Google Voice account registration for the attacker — permanently linking the victim\'s real number to the attacker\'s Google Voice account.' },
            { text: 'The SMS explicitly says "Don\'t share it with anyone" because this has been a widespread abuse pattern. This warning IS the red flag — any verification code you didn\'t request yourself should never be shared with anyone, for any reason.' },
        ],
        'phishing',
        'VERDICT: Google Voice Identity Hijacking via Social Engineering.\n\nWhat Happened: The attacker was registering a new Google Voice account. They entered the victim\'s phone number and triggered Google\'s SMS verification. The victim read the code to the attacker, completing registration — the attacker now controls a Google Voice number linked to the victim\'s real number.\n\nMisuse: The attacker uses the victim\'s number for further scams (other victims see the victim\'s real number), 2FA interception for other services, or account recovery attacks.\n\nRecovery: (1) Go to voice.google.com → Sign in or create an account with the victim\'s email → check if a Google Voice account exists claiming their number. (2) Contact Google Support to disconnect the number. (3) Change passwords on accounts that used that phone number for 2FA.'
    ),

    mkLab('Vishing - Bank Impersonation (Number Spoof)', 4,
        'An employee\'s Caller ID shows the exact number printed on the back of their bank card. The caller claims to be a fraud analyst and convinces the employee to transfer funds to a "safe account" to protect them from a fraudulent transaction.',
        `CALLER ID DISPLAYED: 1-800-432-1000 (Chase Bank — matches exactly the number on the back of the employee's card)

CALLER: "Hello, this is Fraud Analyst Nathan Cooper from Chase Bank. We've flagged a $2,300 suspicious transaction on your account made at a Miami jewelry store. We've put a temporary hold on it, but the fraudster may have your card details and is attempting more charges."

EMPLOYEE: "Yes, I should stop it — what should I do?"

CALLER: "We've set up a temporary safe account for account holders in this situation. To protect your money, I need you to transfer your available balance ($4,100) to this safe account number now — we'll transfer it back to your corrected account within 24 hours."

EMPLOYEE: "Transfer to a different account? Is that normal?"

CALLER: "Yes — while we investigate, your current account may be compromised. The safe account is held by Chase and fully insured. Account number: 00271938472. Sort Code: 50-21-19."`,
        [
            'How did the attacker display the exact Chase Bank phone number on the victim\'s Caller ID?',
            'Identify the "safe account" fraud technique — why is this a definitive scam indicator?',
            'What would a real bank fraud department do differently if they detected unauthorized transactions on your account?',
            'Assess what the victim would lose if they completed this transfer and why recovery is extremely difficult.',
        ],
        [
            { text: 'Caller ID spoofing allows anyone to display any number — including the exact number printed on the back of your bank card. Your bank\'s real fraud team can be impersonated perfectly at the Caller ID level. The identity of the caller cannot be verified from Caller ID alone.' },
            { text: 'No legitimate bank ever asks you to transfer money to a "safe account." Banks protect funds by placing temporary holds, sending replacement cards, or reversing fraudulent transactions — never by moving your money to a different account. "Safe account" transfers are the defining characteristic of authorized push payment (APP) fraud.' },
        ],
        'phishing',
        'VERDICT: Authorized Push Payment (APP) Fraud — Safe Account Scam.\n\nTechnique: Caller ID spoofed to show exact bank number → builds maximum credibility → "Safe Account" request to move all funds to attacker-controlled account.\n\nReal Bank Behavior: Genuine fraud teams (a) freeze suspicious transactions, (b) send replacement cards, (c) ask you to call THEM back on the number on your card — they never ask you to initiate a transfer.\n\nRecovery Outlook: Once a bank transfer is authorized by the account holder ("push payment"), recovery is extremely difficult. Banks often treat it as a legitimate transfer since the customer authorized it. UK customers can report to the Payment Systems Regulator for APP fraud reimbursement.\n\nImmediate Response: Call the bank on the number on the card (hang up first — wait 5 minutes for the line to clear, as attackers sometimes hold the line open). Report the transfer immediately as APP fraud.'
    ),

    mkLab('Vishing - Remote Access Scam (AnyDesk)', 4,
        'An employee is convinced by a caller claiming to be from their bank\'s fraud department to install AnyDesk and share the access code — allowing the attacker to take full control of the device and drain the employee\'s bank account while they watch.',
        `CALLER: "This is Sarah from Barclays Fraud Prevention. We've intercepted a real-time attack on your online banking account — someone is currently logged in trying to transfer £6,000. We need to act in the next 5 minutes or the transfer will clear."

EMPLOYEE: "What do I need to do?"

CALLER: "I need you to open your banking app so I can monitor and block the attack. First — download AnyDesk from anydesk.com. It's our bank-approved secure remote monitoring tool."

[Employee installs AnyDesk and reads out the 9-digit code]

CALLER: "Perfect. Now open your banking app — I'll guide you through activating the fraud lock."

[Attacker, now in full control via AnyDesk, navigates to transfers, adds their own account as a payee, and initiates several transfers — all while keeping the employee on the phone and directing attention elsewhere]

CALLER: "Great, the fraud block is now active. Your account is safe. You may close the app."`,
        [
            'Explain what AnyDesk remote access actually grants to the attacker — what can they see and control?',
            'Why does the attacker keep the victim on the phone and engaged throughout the session?',
            'Identify the "social script" used to normalize the AnyDesk installation request.',
            'Classify the attack and recommend immediate response steps for the victim.',
        ],
        [
            { text: 'AnyDesk, TeamViewer, and similar remote access tools give the remote operator full unrestricted access to everything on the host computer: all files, all open applications, keyboard input, screen, and — critically — any banking apps or browser sessions currently open.' },
            { text: 'Banks NEVER use third-party remote access tools (AnyDesk, TeamViewer, LogMeIn) to help customers. Banks have their own secure portals and never need access to your device to protect your account. Any caller asking you to install remote access software is an attacker.' },
        ],
        'phishing',
        'VERDICT: Remote Takeover Vishing — AnyDesk-Enabled Bank Account Draining.\n\nWhat AnyDesk Grants: Full screen view + keyboard/mouse control + file system access + form auto-fill visibility + all open browser sessions including banking portals. The attacker had complete control the moment the employee shared the 9-digit code.\n\nKeeping Victim on Phone: The ongoing call (a) prevents the employee from noticing the screen activity, (b) allows the attacker to direct attention away from what they\'re doing, and (c) stops the employee from calling the real bank.\n\nImmediate Response: Disconnect device from internet (disable WiFi/ethernet). Call bank immediately from a different device using the number on the card. Report transfers as APP fraud. Run full antivirus scan — attacker may have installed additional remote access persistence. Change all passwords from a clean device.'
    ),

    mkLab('Vishing - Fake Charity after Disaster', 3,
        'Following a major earthquake, an employee receives a call from "Global Disaster Relief" soliciting donations for earthquake victims — with high-pressure tactics and requests for immediate payment via gift card or wire transfer.',
        `[Context: A 7.2 magnitude earthquake struck Turkey 48 hours ago, causing widespread media coverage]

CALLER: "Hello, I'm calling from Global Disaster Relief International. As you've seen in the news, the Turkey earthquake has left 40,000 people without shelter. We have aid teams on the ground right now, but we urgently need donations to buy emergency supplies. Can we count on your support today?"

EMPLOYEE: "I'd like to help — how do I donate?"

CALLER: "The fastest way to get aid to victims is through direct donation cards — we process them instantly to our field teams. Can you purchase a $100 Amazon gift card and read me the code? Or I can take a wire transfer to our emergency fund account."

EMPLOYEE: "No major charity accepts gift cards..."

CALLER: "We're using cards specifically because banks freeze donations during international crises — gift cards bypass the regulatory delays. We need to get supplies today, not in 3 weeks."`,
        [
            'Explain the "disaster exploitation" timing: why do scam charities proliferate immediately after natural disasters?',
            'What are the verification steps to confirm a charity is legitimate before donating?',
            'Why does the caller explain gift cards as "faster than banks"? What does this reveal about their intent?',
            'Recommend a safe process for employees who want to donate to disaster relief.',
        ],
        [
            { text: 'Legitimate charities (Red Cross, UNICEF, Doctors Without Borders, Oxfam) accept bank transfers to published accounts, credit card payments on their official websites, PayPal, and cheques. They NEVER accept gift card codes or request wire transfers to personal/unknown accounts. Gift card demands are always fraudulent.' },
            { text: 'Verify charities at: Charity Commission for England & Wales (charitycommission.gov.uk), GuideStar (candid.org), or Charity Navigator (charitynavigator.org). Legitimate charities are registered entities with audited financials. "Global Disaster Relief International" with no registered charity number = scam.' },
        ],
        'phishing',
        'VERDICT: Fake Charity Vishing — Emotion-Exploitation Donation Fraud.\n\nDisaster Exploitation Timing: Scammers monitor major news events and deploy charity scams within hours of disasters — when public empathy and desire to help are highest. The emotional urgency of real victims lowers victim skepticism.\n\nGift Card = Definitive Scam Indicator: No real charity accepts gift cards. The "banks freeze donations" fabrication is the attacker trying to explain away this red flag with a plausible-sounding lie.\n\nSafe Donation Process: Go directly to a known charity\'s official website (type address manually, don\'t use search links) and donate via credit card or bank transfer through their verified portal. Never donate to inbound phone solicitations.'
    ),

    mkLab('Vishing - Student Loan Forgiveness Scam', 3,
        'An employee receives a call offering to process "guaranteed" federal student loan forgiveness within 30 days — for an upfront processing fee, and requiring their FSA login credentials to "submit the application on their behalf."',
        `CALLER: "Hi, calling from Federal Student Aid Processing Center. The new Biden-era loan forgiveness program has limited enrollment windows — and you appear to qualify based on your loan type. I can get your application processed in 30 days for a one-time processing fee of $495."

EMPLOYEE: "Isn't loan forgiveness free to apply for?"

CALLER: "The application itself is free through studentaid.gov, but our specialist processing service fast-tracks your application and guarantees approval within 30 days. The government processing alone takes 18+ months."

EMPLOYEE: "What do I need to provide?"

CALLER: "Your FSA ID username and password so I can log in and submit on your behalf — and the $495 processing fee via Venmo or Zelle."`,
        [
            'Explain why providing your FSA ID username and password to any third party is catastrophically dangerous.',
            'Identify the "government impersonation + service fee" scam model — why do victims believe processing fees are legitimate?',
            'What is the actual free process for applying for federal student loan forgiveness programs?',
            'Classify and deliver a verdict on what the attacker would do with the FSA credentials.',
        ],
        [
            { text: 'FSA ID (studentaid.gov) credentials are the master key to your federal student loan account — they control your federal aid records, loan servicer assignments, and repayment plan changes. Sharing them with any third party allows that party to change your contact information and lock you out of your own account.' },
            { text: 'Federal student loan programs are managed entirely through studentaid.gov — there is no legitimate third-party "fast-track" service. Any company charging fees to apply for government loan programs is either a scam or an illegal debt relief company. Report to the CFPB (consumerfinance.gov/complaint).' },
        ],
        'phishing',
        'VERDICT: Government Policy Impersonation Scam — Student Loan Fraud.\n\nDual Attack: (1) $495 advance fee fraud — payment for worthless "service." (2) FSA credential theft — attacker uses login to change repayment plans to income-driven plans that pocket the "forgiveness" for themselves, or lock victim out of their account entirely.\n\nReal Federal Loan Forgiveness: Apply directly and FREE at studentaid.gov. No third party is authorized to charge fees for federal loan forgiveness applications. Legitimate repayment programs (IDR, PSLF) are administered by your loan servicer at no cost.\n\nReport To: FTC (reportfraud.ftc.gov), CFPB (consumerfinance.gov/complaint), your state attorney general. The CFPB actively pursues illegal student loan debt relief companies.'
    ),

    mkLab('Vishing - Callback Phishing (Hybrid)', 3,
        'An employee receives an email receipt for a $479 McAfee antivirus renewal they didn\'t authorize. A phone number is included to "cancel the charge." When they call, they are walked through a remote access session that gives the attacker full device control.',
        `STEP 1 — EMAIL RECEIVED:
Subject: "McAfee Total Protection — Annual Renewal Receipt $479"
"Your annual McAfee subscription has been renewed. Amount charged to Visa ending 4821: $479. If you did not authorize this charge, call our helpline immediately: 1-888-555-0133"

STEP 2 — EMPLOYEE CALLS 1-888-555-0133:
CALLER: "McAfee Customer Support, how can I help?"
EMPLOYEE: "I didn't authorize a $479 charge — I want to cancel."
CALLER: "Of course — let me pull up your account. I'll need remote access to your computer to process the refund through our system."

STEP 3 — AnyDesk installed, attacker accesses device.
STEP 4 — ATTACKER TACTIC: Opens banking app, instructs victim to "verify their account" for the refund — watches victim enter banking credentials. Then initiates unauthorized transfers.`,
        [
            'Explain the hybrid email + phone (callback phishing) mechanism: why is this two-step attack more effective than either channel alone?',
            'The email was the "lure" — what social engineering principle does the fake $479 charge exploit?',
            'No real company (McAfee, Norton, Microsoft) uses remote access to process refunds. What is the tell in this step?',
            'Map the full attack chain and classify each step.',
        ],
        [
            { text: 'Callback phishing (also called telephone-oriented attack delivery, or TOAD) combines email social engineering with phone-based human manipulation. The email creates the problem (fake charge) and the phone number provides the "solution" (the attacker\'s call center). This is more effective than email phishing alone because it bypasses automated email security and uses a human to handle objections in real-time.' },
            { text: 'McAfee, Norton, Microsoft, and all major software companies process refunds through their websites or automated billing portals. No refund ever requires installing remote access software. This single request — "install AnyDesk/TeamViewer to process your refund" — is the universal attack signature: hang up immediately.' },
        ],
        'phishing',
        'VERDICT: Callback Phishing (TOAD) — Hybrid Email + Vishing Attack Chain.\n\nAttack Chain:\nStep 1: Fake McAfee receipt email creates financial alarm (lure)\nStep 2: Employee calls attacker-controlled number (hook achieved)\nStep 3: Remote access request normalizes with "refund processing" pretext\nStep 4: AnyDesk session → attacker observes banking credential entry\nStep 5: Unauthorized bank transfers initiated by attacker\n\nWhy It Works: The email bypasses initial skepticism by arriving via email (feels more "official"). The phone call then uses a human to handle objections and guide the victim through the remote access steps.\n\nDefense: Recognize fake charge emails → verify charges directly on the vendor\'s official website → never call numbers provided IN the email → never install remote access software for any refund. Report to the FTC.'
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
    console.log(`\n✅ Done — ${LABS.length} vishing intermediate labs upserted. Total: ${total}`);
    process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
