'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// Beginner Smishing: 100 XP | 10 min | 3 hints | Difficulty 1-2/10

const mkLab = (title, difficulty, scenario, thread, indicators, tasks, hints, answer, explanation) => ({
    title,
    topic: 'smishing',
    level: 'beginner',
    type: 'smishing',
    difficulty,
    points: 100,
    timeLimit: 600,
    published: true,
    description: `Beginner smishing simulation: ${title.replace('Smishing - ', '')}. Identify SMS-based social engineering tactics.`,
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

    mkLab('Smishing - Wrong Number Pretexting', 2,
        'You receive an unexpected text from an unknown number addressing you by a different name. After you clarify it\'s a wrong number, the conversation rapidly escalates to a money request.',
        [
            { time: '09:12 AM', sender: 'Unknown (+91 83XX45XX12)', message: 'Hi Rahul, is this your office number? I need the UPI transfer urgently.' },
            { time: '09:14 AM', sender: 'You', message: 'Sorry, wrong number.' },
            { time: '09:15 AM', sender: 'Unknown', message: 'Oh sorry brother 😅 Since you replied, can you help me with ₹5,000? I will transfer back immediately. It\'s urgent.' },
            { time: '09:17 AM', sender: 'Unknown', message: 'Please send to this UPI ID: quickpayhelp@upi' },
        ],
        ['Unknown sender', 'Social familiarity tactic ("brother")', 'Rapid escalation to money request', 'External/unverifiable UPI ID', 'No social proof of identity'],
        [
            'Identify the social engineering pretext used to initiate contact.',
            'Explain why the scammer escalated from a "wrong number" apology to a money request so quickly.',
            'Identify what makes the UPI ID "quickpayhelp@upi" suspicious.',
            'Classify the attack type and recommend the correct response.',
        ],
        [
            { text: 'This technique is called "wrong number pretexting" — the initial wrong-number message is deliberate, designed to get you to respond. Once you reply, the scammer has an "opening" to continue the conversation.' },
            { text: 'After you reply, the scammer uses "since you responded" as justification for the money request — turning your politeness into a social obligation. This is a manipulation of reciprocity.' },
            { text: 'Legitimate UPI IDs are associated with verified bank accounts or merchants. A UPI ID like "quickpayhelp@upi" with no verifiable business or person behind it is a red flag — money sent to unknown UPI IDs is unrecoverable.' },
        ],
        'phishing',
        'VERDICT: Smishing — Financial Social Engineering via Wrong Number Pretext.\n\nTechnique Used: The wrong-number opener is deliberate. Once you respond (even to correct them), the scammer has established contact and uses it to escalate to a financial request. The word "brother" is used to create false familiarity and social obligation.\n\nKey Red Flags: (1) Unknown sender claims to know you by name. (2) After correction, immediately pivots to money request. (3) Urgency ("immediately") reduces hesitation. (4) UPI ID has no verifiable identity behind it.\n\nCorrect Response: Do not reply to wrong-number messages requesting money. Block and report the number. Never transfer money to unverified UPI IDs received via SMS.'
    ),

    mkLab('Smishing - Fake Account Suspension URL', 2,
        'You receive an SMS from "PaySecure" claiming your account will be suspended in 2 hours and must be verified via a link.',
        [
            { time: '11:03 AM', sender: 'PaySecure', message: 'Your account will be suspended within 2 hours. Verify immediately: https://pay-secure-alert[.]com/login' },
        ],
        ['Urgency (2-hour deadline)', 'Domain mismatch (pay-secure-alert.com ≠ PaySecure official domain)', 'Newly registered domain (3 days old on WHOIS lookup)', 'Threat of account loss', 'No personalization (no account number/name)'],
        [
            'Perform a domain WHOIS check on "pay-secure-alert.com" — what does a 3-day-old domain indicate?',
            'Identify what brand is being impersonated and how the domain is crafted to appear legitimate.',
            'Explain why urgency (2-hour deadline) is used in credential harvesting attacks.',
            'Recommend a block rule and classify the attack.',
        ],
        [
            { text: 'Legitimate payment platforms (PayPal, Stripe, Razorpay) use their own verified domains — never a domain with the company name embedded in a longer string like "pay-secure-alert.com." Check the actual domain against the real company\'s official domain.' },
            { text: 'A domain created 3 days ago is a critical red flag. Legitimate corporate services use established infrastructure. Phishing campaigns purchase new domains days before launching to avoid initial URL block lists.' },
            { text: 'Urgency ("within 2 hours") is a social engineering technique that bypasses critical thinking — when people feel time pressure, they act without verifying. Real account actions typically allow days, not hours, for response.' },
        ],
        'phishing',
        'VERDICT: Smishing — Credential Harvesting via Brand Impersonation.\n\nDomain Analysis: "pay-secure-alert.com" was registered 3 days ago — a pattern consistent with phishing campaigns that buy fresh domains to evade block lists. The real PaySecure (or any payment platform) would never send account alerts from a newly registered third-party domain.\n\nSocial Engineering: The 2-hour suspended account threat creates immediate emotional stress and urgency, bypassing rational evaluation. The victim is pressured to act before they think.\n\nCorrect Response: Do NOT click the link. Open the official app or type the official website URL manually. Check for any real account alerts. Report the SMS as spam/phishing.'
    ),

    mkLab('Smishing - CEO Gift Card Scam', 1,
        'You receive an SMS claiming to be from your organization\'s CEO, asking you to urgently purchase Amazon gift cards and send the codes.',
        [
            { time: '02:31 PM', sender: 'CEO Office (+91 98765XXXXX)', message: 'I\'m in a client meeting and can\'t talk. I need you to purchase 5 Amazon gift cards worth ₹10,000 each and send me the codes immediately. I\'ll reimburse you. Don\'t let anyone know — it\'s a surprise for a client.' },
        ],
        ['Unknown mobile number (not a corporate number)', 'Gift card purchase request', 'Secrecy instruction ("don\'t let anyone know")', 'Authority impersonation (CEO)', 'Out-of-band, unverifiable request'],
        [
            'Identify the "authority + secrecy" social engineering combination — why is this particularly effective?',
            'Explain why requesting payment via gift card codes is a definitive fraud indicator.',
            'Verify the sender: your company directory shows the CEO\'s work number is a corporate landline extension. What does this tell you about this SMS?',
            'Classify the attack and recommend the response.',
        ],
        [
            { text: 'No legitimate business transaction uses Amazon/Google Play/iTunes gift cards as payment. Gift card codes are functionally equivalent to untraceable cash — they cannot be refunded or reversed once shared. This is always fraud.' },
            { text: '"Don\'t let anyone know" is a deliberate social engineering tactic to prevent the victim from consulting colleagues who might identify the scam. Legitimate management requests for purchases go through official procurement channels, not secret SMS requests.' },
            { text: 'CEOs and executives communicate via corporate email and official channels — never via an unrecognized personal mobile number for financial requests. Always verify unusual financial requests via a second channel (call the CEO\'s known corporate number directly).' },
        ],
        'phishing',
        'VERDICT: Smishing — Business Smishing / Executive Impersonation via Gift Card Scam.\n\nAttack Pattern: This is an "executive gift card scam" — one of the most common and financially damaging SMS scams. The attacker impersonates a senior authority figure, creates urgency, imposes secrecy (to prevent verification), and requests untraceable gift card payments.\n\nWhy Gift Cards: Gift card codes are immediately redeemable, untraceable, globally usable, and completely irreversible. Once the codes are shared, recovery is impossible.\n\nCorrect Response: Do not purchase anything. Call or email the CEO via their known corporate contact to verify. Report to IT security. The CEO\'s real number should be on record — any other number asking for money is fraudulent.'
    ),

    mkLab('Smishing - Fake Tax Refund Lure', 2,
        'You receive an SMS claiming you are eligible for a tax refund of ₹12,450, with a 1-hour window to claim via a government-looking link.',
        [
            { time: '09:45 AM', sender: 'INCOMETAX', message: 'You are eligible for a tax refund of ₹12,450. Claim within 1 hour at: http://gov-refund-fast[.]in — Income Tax Dept.' },
        ],
        ['Non-official domain (gov-refund-fast.in ≠ incometaxindia.gov.in)', 'Urgency (1-hour claim window)', 'Unverifiable refund amount (victim has no pending refund)', 'Fake government sender ID', 'HTTP link (not HTTPS on a government domain)'],
        [
            'Identify the real Income Tax India domain — how does "gov-refund-fast.in" compare?',
            'Explain why a 1-hour refund claim window is operationally impossible for a real government refund process.',
            'What does the presence of fake government branding (logo, sender ID "INCOMETAX") indicate about the attacker\'s preparation?',
            'Classify the attack and recommend mitigation.',
        ],
        [
            { text: 'All legitimate Indian government services operate on NIC-managed .gov.in domains (e.g., incometaxindia.gov.in, efiling.incometax.gov.in). Any SMS linking to a .in domain that is NOT a .gov.in sub-domain is not from the government — regardless of branding.' },
            { text: 'Government refund processes involve verified bank account details filed during ITR submission. Legitimate refunds are processed automatically to your registered bank account — they never require you to "claim" via a link within hours.' },
            { text: 'Alphanumeric sender IDs like "INCOMETAX" can be registered by anyone in India via a bulk SMS provider. They are not verified against the actual organization name. Seeing "INCOMETAX" as the sender does not confirm the message is from the Income Tax Department.' },
        ],
        'phishing',
        'VERDICT: Smishing — Government Impersonation / Tax Refund Credential Harvesting.\n\nBrand Spoofing: The attacker uses an alphanumeric sender ID ("INCOMETAX") and fake government language to imitate official communications. The link "gov-refund-fast.in" is designed to look government-adjacent without using the protected .gov.in domain.\n\nHarvest Target: The linked page collects PAN number, Aadhaar details, bank account number, and OTP — sufficient to drain the victim\'s bank account.\n\nCorrect Response: Never click refund links from SMS. Check actual refund status by logging directly into the official Income Tax e-filing portal (efiling.incometax.gov.in). Report the SMS to CERT-In (cert-in.org.in).'
    ),

    mkLab('Smishing - OTP Harvesting (Someone Else\'s Account)', 2,
        'You receive an OTP you didn\'t request. Moments later, an unknown number texts you claiming they "accidentally" entered your number and asks you to share the OTP.',
        [
            { time: '10:05 AM', sender: 'HDFC-OTP', message: 'Your OTP is 482193. Do NOT share with anyone. Valid for 5 minutes.' },
            { time: '10:06 AM', sender: 'Unknown (+91 70XX44XX90)', message: 'Hi, so sorry — I think I accidentally entered your number for my account. Could you please share the OTP? It\'s for my credit card application.' },
        ],
        ['Unsolicited OTP (victim did not initiate any transaction)', 'Immediate follow-up from unknown number after OTP', 'Request to share OTP despite "Do NOT share" warning', 'No verifiable identity of the sender', 'Rapid timing correlation (OTP at 10:05, request at 10:06)'],
        [
            'Explain what actually happened: who initiated the action that triggered this OTP to be sent to your number?',
            'Why does the "I accidentally entered your number" explanation not hold up logically?',
            'The OTP message itself says "Do NOT share with anyone." Why is this instruction present and what does it actually protect against?',
            'Classify the attack and recommend the correct response.',
        ],
        [
            { text: 'An OTP you didn\'t request means someone else has entered YOUR phone number into a service and is trying to access/create an account. The follow-up "wrong number" call is from that same person, trying to collect the OTP to complete the account action they initiated.' },
            { text: 'If someone genuinely entered the wrong phone number for their application, the OTP would go to an incorrect, unknown number — they would have no way of knowing WHOSE number received it, and therefore no way to call or text that person. The immediate targeted follow-up proves the number was entered deliberately.' },
            { text: 'The "Do NOT share with anyone" instruction in OTP messages exists specifically because sharing the OTP with anyone — regardless of their claimed reason — allows them to complete the action, whether it\'s accessing your account, creating a new account in your name, or authorizing a transaction.' },
        ],
        'phishing',
        'VERDICT: Smishing — OTP Harvesting Social Engineering / Account Takeover Attempt.\n\nWhat Happened: The attacker entered your phone number into a service to initiate a login or account registration. The OTP was sent to you as the verified phone number. They then texted you, claiming it was accidental, to convince you to hand over the OTP and complete their unauthorized access.\n\nThe Timing Proof: A 1-minute gap between OTP delivery and the "sorry wrong number" text is not coincidental — this is the attacker monitoring for OTP delivery and immediately following up.\n\nCorrect Response: NEVER share an OTP with anyone, for any reason. Delete the OTP message. Block the requesting number. If you are concerned your number may be used for unauthorized account creation, contact the bank whose OTP prefix appeared (HDFC-OTP).'
    ),

    mkLab('Smishing - Prize / Lottery Win Advance Fee', 1,
        'You receive an unsolicited SMS claiming you\'ve won an iPhone 15 Pro and must pay a ₹1,999 delivery fee to claim the prize.',
        [
            { time: '03:15 PM', sender: 'PRIZEWINNER', message: 'Congratulations! You\'ve been selected as the winner of an iPhone 15 Pro! 🎉 To receive your prize, pay the ₹1,999 delivery fee at: prize-delivery-now[.]site — Offer expires in 24 hours!' },
        ],
        ['Unsolicited prize notification', 'No contest entered', 'Advance fee required', 'Suspicious domain (prize-delivery-now.site)', 'Artificial 24-hour expiry', 'Emoji-heavy messaging to appear informal/friendly'],
        [
            'Identify the advance fee fraud model: what do scammers actually do after receiving the ₹1,999?',
            'Explain why you can\'t win a contest you never entered.',
            'What does the domain "prize-delivery-now.site" indicate about legitimacy?',
            'Classify the attack.',
        ],
        [
            { text: 'This is "advance fee fraud" — the victim pays a small amount (₹1,999) expecting a much larger reward (iPhone). After payment, either: (a) the prize never materializes, (b) additional fees are requested ("customs fee," "government tax"), or (c) card details entered for the "fee" are harvested for larger fraud.' },
            { text: 'Legitimate prize programs (competitions, sweepstakes) only award prizes to participants who explicitly entered. Receiving a prize notification for a contest you don\'t remember entering = it\'s a scam.' },
            { text: 'Real brands running prize campaigns use their official domains (apple.com, samsung.com). A domain like "prize-delivery-now.site" registered with no brand connection is a temporary phishing infrastructure.' },
        ],
        'phishing',
        'VERDICT: Smishing — Advance Fee Fraud / Prize Scam.\n\nPattern: Classic "Nigerian prince" structure adapted to modern SMS — promise of valuable item contingent on small upfront payment. The payment is the scam. No prize exists.\n\nEscalation Risk: After initial payment, victims are often targeted with follow-up fees ("customs clearance," "VAT," "insurance") — each time extracting more money. Victims who have already paid once are statistically more likely to pay again due to sunk cost bias.\n\nCorrect Response: Block and report. Never pay upfront fees for unexpected prizes. If you believe you won something, verify by searching the company name independently and calling their official support.'
    ),

    mkLab('Smishing - Netflix Payment Declined (Brand Clone)', 2,
        'You receive an SMS claiming your Netflix payment has been declined and you must update billing details via a link.',
        [
            { time: '07:22 PM', sender: 'Netflix', message: 'NETFLIX: Your payment method has been declined. Update your billing information to continue your subscription: https://netflix-support-update[.]co/billing' },
        ],
        ['Domain mismatch (netflix-support-update.co ≠ netflix.com)', 'Generic message (no account name or last 4 card digits)', 'Subscription cancellation threat', 'Alphanumeric sender spoofed as "Netflix"', '.co TLD used instead of .com'],
        [
            'Verify whether your Netflix subscription actually shows any billing issue by checking the official app — what is the result?',
            'Compare the link domain "netflix-support-update.co" to the official Netflix domain "netflix.com" — what indicators confirm this is not Netflix?',
            'Explain why Netflix would include your name and partial card information in a real billing alert but this SMS does not.',
            'Classify the attack.',
        ],
        [
            { text: 'Netflix always communicates billing issues at netflix.com or via their app. They will NEVER send you to a third-party domain (netflix-support-update.co) for billing updates. The .co TLD in particular is commonly used in brand imitation attacks to create look-alike domains.' },
            { text: 'Legitimate billing alerts from companies like Netflix personalize their messages — they include your name, subscription plan, and the last 4 digits of the card on file. A generic message with no personalization is a sign it was sent in bulk to thousands of numbers, not targeted to your account.' },
            { text: 'Check your Netflix account directly by opening the Netflix app or going to netflix.com manually. If there is a genuine payment issue, it will show there. If the app shows no issue, the SMS is fraudulent.' },
        ],
        'phishing',
        'VERDICT: Smishing — Brand Impersonation / Credential Harvesting (Netflix).\n\nCloned Experience: The linked page mimics the Netflix login/billing page to collect email, password, and full credit card details. With these, the attacker can access the victim\'s Netflix account and use the stored card for fraudulent purchases elsewhere.\n\nDomain Tell: "netflix-support-update.co" — the .co TLD (Colombia) is frequently used for brand impersonation due to visual similarity to .com. Netflix owns netflix.com — they would never send customers to a .co domain.\n\nCorrect Response: Delete the SMS. Check Netflix app directly. If concerned, change Netflix password. Report the domain to Netflix (phishing@netflix.com).'
    ),

    mkLab('Smishing - Fake Job Recruiter (Advance Fee)', 1,
        'You receive an SMS offering a lucrative work-from-home position, requiring a "registration fee" to be paid upfront before starting.',
        [
            { time: '11:45 AM', sender: '+91 63XX99XX14', message: 'We\'re hiring! Work from home ₹30,000/week. No experience needed. Immediate joining. Registration fee: ₹1,500. Reply YES to apply. Limited slots available.' },
        ],
        ['Unrealistically high salary (₹30,000/week for unskilled work)', 'Upfront registration/processing fee', 'Unknown sender (no company name)', 'No company details or website', '"No experience needed" + "immediate joining"', 'Artificial scarcity ("limited slots")'],
        [
            'Explain why ₹30,000/week for unskilled work-from-home is an unrealistic salary signal.',
            'Identify the advance fee model: what happens to the ₹1,500 registration fee?',
            'A legitimate employer never charges candidates a fee. What does a registration fee requirement tell you about this offer?',
            'Classify the attack.',
        ],
        [
            { text: 'Legitimate employment opportunities always include: company name, official website, job description, and recruitment contact details. No legitimate recruiter operates from an anonymous mobile number with no company name or website.' },
            { text: '₹30,000/week (~₹1,20,000/month) for zero-experience work-from-home falls well above average entry-level salaries — this is deliberately set to attract desperate or opportunity-seeking individuals. If it sounds too good to be true, it is.' },
            { text: 'The registration fee (₹1,500) is the actual revenue for the scammer — they collect fees from thousands of applicants. No job offer ever requires you to pay money to be considered for employment. Any fee-based "job" is always a scam.' },
        ],
        'phishing',
        'VERDICT: Smishing — Employment Fraud / Advance Fee Scam.\n\nBusiness Model: The scammer collects ₹1,500 from thousands of responders. At 1,000 victims × ₹1,500 = ₹15,00,000 — highly profitable with zero overhead. No job exists; the fee is the entire point.\n\nVariants: Some variants also collect personal documents (Aadhaar, PAN) for identity theft in addition to the fee payment.\n\nCorrect Response: Never pay any fee to apply for a job. Report the number to the National Cyber Crime Reporting Portal (cybercrime.gov.in). Verify any job opportunity by searching the company name independently.'
    ),

    mkLab('Smishing - Fake Package Delivery', 2,
        'You receive an SMS from a "courier company" claiming your delivery failed due to an incomplete address, asking you to update details via a link within 2 hours.',
        [
            { time: '01:08 PM', sender: 'CourierExpress', message: 'Your package delivery attempt FAILED — incomplete address. Update within 2 hours to avoid return: http://track-update-parcel[.]info/redeliver?id=TRK8821X' },
        ],
        ['No courier company or tracking number context verifiable independently', 'Non-brand domain (track-update-parcel.info)', 'Urgency (2-hour window)', 'Generic tracking ID', 'HTTP (not HTTPS)', '"Incomplete address" is vague — no specific delivery details'],
        [
            'You currently have no pending deliveries. How does this inform your analysis of this SMS?',
            'Verify the tracking ID "TRK8821X" by searching official courier websites (e.g., track.dtdc.com, bluedart.com). What would you find?',
            'Explain why "track-update-parcel.info" is not a legitimate courier domain.',
            'Classify the attack and recommend the response.',
        ],
        [
            { text: 'Major courier companies (FedEx, DHL, DTDC, BlueDart) have established domains and apps for package tracking. They never redirect customers to third-party generic domains like "track-update-parcel.info." If you have a package, track it directly on the courier\'s official site using the tracking number.' },
            { text: 'This attack works by volume — attackers send millions of these messages knowing that a percentage of recipients will coincidentally be expecting a delivery. The "failed delivery" pretext is the most common smishing lure globally (called "parcel mule smishing" by Europol).' },
            { text: 'The linked page typically collects home address, contact number, and payment details for a "re-delivery fee" — this compromises financial information even though the entry cost appears small.' },
        ],
        'phishing',
        'VERDICT: Smishing — Logistics Impersonation / Credential and Financial Harvesting.\n\nThis is the most common smishing category globally. The attack relies on statistical probability — with millions of messages sent, a significant percentage of recipients will be expecting a package and will click without verifying.\n\nWhat the Page Collects: Home address, phone number, and payment/card details for the "re-delivery fee." The fee itself is usually small (₹50-200) to normalize payment, while the real target is the full card details entered.\n\nCorrect Response: Check any pending deliveries via official courier apps using your actual tracking numbers. Never update delivery address via an SMS link. Report to cybercrime.gov.in.'
    ),

    mkLab('Smishing - Fake Bank Fraud Alert', 2,
        'You receive an alarming SMS claiming ₹75,000 has been debited from your account without authorization, with a link to dispute the transaction immediately.',
        [
            { time: '08:42 PM', sender: 'SBIBANK', message: 'ALERT: ₹75,000 has been debited from your account ending XXXX. If NOT authorized by you, click to dispute NOW: http://secure-bank-action[.]org/dispute — SBI Customer Care' },
        ],
        ['Amount designed to cause immediate fear (₹75,000)', 'Generic account reference "XXXX" (no actual digits)', 'Non-official domain (secure-bank-action.org ≠ sbi.co.in)', 'Short-code alert from official banks use verified sender IDs', 'HTTP link instead of HTTPS on an official bank domain', 'Leads to credential harvesting page'],
        [
            'Check your bank account directly via the official SBI app or netbanking (sbi.co.in). Is there actually a ₹75,000 debit?',
            'Compare the link domain "secure-bank-action.org" to SBI\'s official domain "sbi.co.in" — what does this discrepancy confirm?',
            'Why do real bank fraud alerts include your full name and the last 4-6 actual digits of your account number — and this one says "XXXX"?',
            'Classify the attack and enumerate what data the linked page is designed to harvest.',
        ],
        [
            { text: 'Real SBI fraud alerts come from verified short codes (e.g., "SBIINB") and always include your registered name and the actual last 4 digits of your account number. "Account ending XXXX" with no real digits is a mass-blast template sent to millions of numbers — the attacker has no actual knowledge of your account.' },
            { text: 'The ₹75,000 amount is strategically chosen to cause maximum financial alarm while remaining plausible. Financial fear is the most effective trigger for bypassing rational SMS evaluation — the goal is to make you act before you think.' },
            { text: 'SBI\'s official dispute process is through their official app, netbanking, or their verified customer care number (1800 1234). They never ask you to click an external link via SMS to dispute a transaction.' },
        ],
        'phishing',
        'VERDICT: Smishing — Financial Credential Harvesting via Fear Trigger (Bank Fraud Alert Clone).\n\nHarvest Target: The linked page mimics SBI netbanking and collects Customer ID, password, and OTP — sufficient for complete account takeover.\n\nFear Engineering: The ₹75,000 amount is the emotional trigger. Seeing a large debit you don\'t recognize causes immediate panic, bypassing normal scrutiny of the SMS and the link.\n\nCorrect Response: NEVER click links in bank fraud alert SMSes. Open the bank\'s official app (downloaded from Play Store/App Store) or go directly to sbi.co.in. If the debit is real, call SBI customer care at 1800 1234. Report to cybercrime.gov.in.'
    ),
];

async function seed() {
    const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/antiphishx';
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB\n');
    for (const lab of LABS) {
        await Lab.findOneAndUpdate({ title: lab.title }, lab, { upsert: true, new: true, runValidators: false });
        console.log(`  ✔ [BGN ${lab.difficulty}/10] ${lab.title}`);
    }
    const total = await Lab.countDocuments();
    console.log(`\n✅ Done — ${LABS.length} smishing beginner labs upserted. Total: ${total}`);
    process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
