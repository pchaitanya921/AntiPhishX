'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// Beginner: 100 XP | 10 min | Difficulty 1-2/10 | 3 hints
// Titles from all_titles.txt lines 191-200

const mkLab = (title, difficulty, scenario, transcript, tasks, hints, answer, explanation) => ({
    title, topic: 'vishing', level: 'beginner', type: 'vishing',
    difficulty, points: 100, timeLimit: 600, published: true,
    description: `Beginner vishing simulation: ${title.replace('Vishing - ', '')}. Identify red flags and classify the scam.`,
    scenario,
    content: {
        callTranscript: transcript,
        callerID: 'Unknown / Spoofed',
        callDuration: '2-4 minutes',
        artifacts: [],
    },
    steps: tasks,
    hints,
    correctAnswer: answer,
    explanation,
});

const LABS = [

    mkLab(
        'Vishing - Tech Support Scam', 2,
        'A FinTrust Corp employee receives an unsolicited call from someone claiming to be from the "Microsoft Security Team." The caller states that malware has been detected on the employee\'s computer and that immediate action is required to prevent data loss.',
        `CALLER: "Hello, this is David Harris from the Microsoft Security Team. We've detected serious malware activity coming from your computer. Your system is currently sending infected files across the internet. If we don't fix this right now, your account will be permanently suspended."

EMPLOYEE: "Oh — I wasn't aware of any issue. What do I need to do?"

CALLER: "Don't worry, I can fix it remotely. I just need you to go to anydesk.com and download AnyDesk — it's our secure remote access tool. Once I connect, I'll clean the virus in about 10 minutes."

EMPLOYEE: "Is this really Microsoft? How do I know you're legitimate?"

CALLER: "Ma'am, I'm calling from Microsoft's Global Security Operations Center. Your computer's license ID has flagged a critical error — Event ID 4226, which means your firewall has been disabled by malware. This is extremely urgent."

EMPLOYEE: [Pauses] "Let me check with my IT department first."

CALLER: "No no, please don't — if you restart your computer or call IT, the virus will activate and wipe your hard drive. You need to act NOW."`,
        [
            'Identify the impersonation: who is the caller claiming to represent, and is this a legitimate contact method for that organization?',
            'List all urgency and pressure tactics used by the caller.',
            'Explain why the request to install remote access software (AnyDesk) is a critical red flag.',
            'Classify the attack type and deliver a SOC verdict.',
        ],
        [
            { text: 'Microsoft, Google, and Apple never proactively call individuals about malware on their computers. Unsolicited calls claiming to be from tech companies are almost always scams.' },
            { text: 'The caller discourages contacting IT or restarting the computer — this is a classic isolation tactic to prevent the victim from seeking a second opinion before complying.' },
            { text: 'Installing remote access software (AnyDesk, TeamViewer, AnyConnect) at the request of an unsolicited caller hands the attacker full control of the device — they can install malware, steal files, or extort the victim.' },
        ],
        'phishing',
        'VERDICT: Classic Tech Support Vishing Scam.\n\nRed Flags: (1) Unsolicited call claiming to be Microsoft — Microsoft does not cold-call individuals about malware. (2) Fake technical urgency (Event ID 4226, firewall disabled) to create fear. (3) Request to install remote access software to grant attacker full device control. (4) Isolation tactic: "Don\'t call IT or your hard drive will be wiped" — designed to prevent the victim from consulting anyone. (5) Extreme time pressure to force compliance before rational thinking kicks in.\n\nCorrect Action: Hang up. Call IT security directly. Never install software at the request of an unsolicited caller. Report to SOC.'
    ),

    mkLab(
        'Vishing - IRS / Tax Authority Threat', 2,
        'An employee receives a voicemail stating they owe back taxes and will be arrested within 4 hours unless they call back immediately. When they call back, the "officer" demands immediate payment via Google Play gift cards.',
        `RECORDED VOICEMAIL: "This is Officer Thompson from the Internal Revenue Service Criminal Investigation Division. We have filed a lawsuit against you for tax evasion. You owe $3,847 in back taxes. If you do not call us back within 4 hours, a warrant will be issued for your arrest. Call 1-888-555-0192 immediately."

[Employee calls back]

CALLER: "IRS Criminal Investigation, Officer Thompson."

EMPLOYEE: "I received a voicemail about a lawsuit? I file my taxes every year —"

CALLER: "I understand, but our records show unpaid taxes from 2022 and 2023. To avoid arrest today, you must pay the outstanding amount. We accept Google Play gift cards or iTunes gift cards for immediate payment."

EMPLOYEE: "The IRS accepts gift cards?"

CALLER: "It's a new secure payment method to prevent bank processing delays. Please go to Walgreens now, purchase $3,847 in Google Play cards, and read me the codes. This is your final warning."`,
        [
            'Does the IRS contact individuals via unsolicited threatening phone calls? How does the real IRS initiate contact?',
            'Identify the legal intimidation tactics used and why they are designed to trigger panic.',
            'Why is gift card payment a definitive scam indicator?',
            'Classify the attack type and recommended victim response.',
        ],
        [
            { text: 'The real IRS always initiates contact via postal mail — never phone calls, emails, or texts. If you receive an unsolicited call claiming to be the IRS, it is a scam.' },
            { text: 'Government agencies (IRS, FBI, police) never demand immediate payment over the phone to avoid arrest. Actual tax disputes involve written notices, formal hearings, and legal processes — not 4-hour deadlines.' },
            { text: 'No legitimate government agency, company, or individual accepts gift cards (Google Play, iTunes, Amazon) as payment. Gift card payment demands are the universal indicator of a scam — the codes are untraceable and irreversible.' },
        ],
        'phishing',
        'VERDICT: Government Impersonation Vishing Scam — IRS Fraud.\n\nRed Flags: (1) IRS contacts via postal mail only — never unsolicited phone calls. (2) Threat of immediate arrest within hours — a fear tactic. (3) Gift card payment demand — no government agency accepts gift cards. (4) Callback number (1-888-555-0192) is attacker-controlled, not the real IRS (1-800-829-1040). (5) Urgency designed to prevent the victim from calling the real IRS to verify.\n\nCorrect Action: Hang up. Do not call back the provided number. Call the IRS directly at 1-800-829-1040 to verify any legitimate tax issues. Report to the FTC.'
    ),

    mkLab(
        'Vishing - Grandparent Scam', 1,
        'A retired FinTrust employee\'s elderly parent calls the company HR line in distress — they received a call claiming their grandchild was arrested and needs bail money wired immediately. The caller instructed them to tell no one.',
        `CALLER (impersonating "grandson"): "Grandma? It's me, Tyler. I'm in serious trouble. I was in a car accident and the police found something in my car. I'm in jail. Please don't tell Mom and Dad — I don't want them to find out. I'm so scared."

GRANDMOTHER: "Tyler?! Oh my goodness — are you okay? Where are you?"

CALLER: "I'm okay but the lawyer says I need $4,500 bail money today or I stay in jail all weekend. My phone's broken so I'm using a friend's. Please, grandma, don't tell anyone. The lawyer said it has to be secret or the judge gets angry."

[A second caller then comes on the line]

SECOND CALLER (claiming to be "lawyer"): "Ma'am, this is Attorney Robert Collins. Your grandson Tyler has been arrested. To secure his release by tonight, we require $4,500 wired to our trust account. I strongly advise you not to mention this to other family members as it could complicate his case."`,
        [
            'Identify the emotional manipulation techniques used on the elderly victim.',
            'Why does the scammer instruct the victim to keep the call secret from family members?',
            'What is the "grandchild impersonation" technique based on psychologically?',
            'Deliver a classification and recommended response actions.',
        ],
        [
            { text: 'Grandparent scams exploit the deep emotional bond grandparents have with grandchildren. The caller typically uses vague openers ("It\'s me!") and lets the victim fill in the name themselves, which the caller then confirms.' },
            { text: '"Don\'t tell Mom and Dad" / "Keep this secret" instructions are a calculated isolation tactic. Contacting any family member would instantly expose the scam — so the attacker prevents that single verification step.' },
            { text: 'The key verification is simple: hang up and call the grandchild directly on their known phone number. Real emergencies don\'t require secrecy from the entire family.' },
        ],
        'phishing',
        'VERDICT: Grandparent Scam — Emotional Manipulation Vishing Fraud.\n\nRed Flags: (1) Vague opener ("It\'s me") — victim fills in the identity themselves. (2) Manufactured emotional crisis (arrest, accident). (3) Secrecy instruction — prevents family verification. (4) Second caller posing as lawyer to add authority. (5) Urgency (today only, before weekend).\n\nCorrect Action: Hang up. Call the grandchild directly on their known number — this takes 30 seconds and instantly confirms whether the call was real. Do not wire money without in-person or direct phone verification. Report to local police.'
    ),

    mkLab(
        'Vishing - Bank Account Breach Alert', 1,
        'An employee receives an automated call claiming to be from their bank stating a $2,400 unauthorized transaction was detected. The call then transfers to a "fraud specialist" who asks for one-time password and card details to "reverse" the charge.',
        `AUTOMATED VOICE: "This is an urgent security alert from National Bank. We\'ve detected an unauthorized transaction of $2,400 at an electronics store. If you did NOT make this purchase, press 1. If you DID make this purchase, press 2."

[Employee presses 1]

CALLER: "Thank you for confirming. This is Fraud Specialist Michael Greene. I'm going to block this transaction and issue you a replacement card. First I need to verify your identity."

EMPLOYEE: "Of course, what do you need?"

CALLER: "Please provide your full card number and the 3-digit security code on the back."

EMPLOYEE: "Okay, it's 4532-XXXX-XXXX-1234 and the CVV is —"

CALLER: "Thank you. Now, we're going to send an OTP to your registered mobile number to confirm the reversal. Please read me that code when it arrives."

EMPLOYEE: [Receives OTP] "It's 847291."

CALLER: "Perfect. Your card has been blocked and the transaction reversed. You'll receive a new card in 5-7 days."`,
        [
            'Identify the specific financial data the caller collected — and what each piece enables an attacker to do.',
            'Explain why legitimate banks never ask for your full card number + CVV + OTP in a single inbound call.',
            'What did sharing the OTP actually authorize?',
            'Classify the attack and recommended immediate response.',
        ],
        [
            { text: 'Real bank fraud departments already have your card number on file — they don\'t need to ask you for it during a fraud alert call. If a "bank" asks for your full card number, CVV, and OTP together, it\'s a scam.' },
            { text: 'OTP (One-Time Password) codes sent to your phone are specifically designed to authorize actions like online purchases, wire transfers, or new device logins. Sharing an OTP with anyone — including someone claiming to be your bank — hands them that authorization.' },
            { text: 'When receiving unexpected "bank fraud" calls, hang up and call your bank directly using the number on the back of your card — not the number the caller provides.' },
        ],
        'phishing',
        'VERDICT: Financial Credential Harvesting Vishing Scam.\n\nData Collected: Full card number + CVV (enough for card-not-present fraud) + OTP (authorized a fraudulent transaction by the attacker). The OTP was almost certainly a confirmation code for a purchase the attacker was simultaneously making using the stolen card details.\n\nRed Flags: (1) Unsolicited automated fraud alert call. (2) "Press 1 to dispute" — creates engagement before the real attack begins. (3) Request for full card number + CVV — banks already have this. (4) OTP request — banks never ask you to read OTP codes to them.\n\nImmediate Response: Call real bank immediately on card-back number. Report compromised card. Dispute any fraudulent transactions. Change online banking password.'
    ),

    mkLab(
        'Vishing - Amazon Order Confirmation', 2,
        'An employee receives a robocall claiming to be from Amazon stating a $899 iPhone order was placed on their account, prompting them to "press 1 to cancel" — which connects them to a scam call center.',
        `AUTOMATED VOICE: "Hello, this is Amazon Customer Service. We are calling to confirm your recent order of one Apple iPhone 15 Pro for $899.99 shipped to Dallas, Texas. If you did NOT place this order, press 1 now to cancel and protect your account. If you DID place this order, no action is needed."

[Employee presses 1]

CALLER: "Amazon Fraud Prevention, this is Jessica. I can see the unauthorized order on your account. To reverse this charge and secure your Amazon account, I'll need to verify your identity. Can you confirm your Amazon login email?"

EMPLOYEE: "It's employee@gmail.com."

CALLER: "Thank you. And the password associated with that email?"

EMPLOYEE: "Wait — why do you need my password?"

CALLER: "It's just for identity verification — we need to confirm it's really you. This is standard procedure for fraud cases."`,
        [
            'Explain the "press 1 to cancel" callback phishing mechanism — what is its purpose and why is it effective?',
            'Why does Amazon Customer Service never need your password to investigate an unauthorized order?',
            'Identify the social engineering principle exploited by the fake order ($899 iPhone) alert.',
            'Classify the scam type and recommended response.',
        ],
        [
            { text: '"Press 1" callback phishing works by creating a fake urgent scenario (unauthorized order) and routing anyone who panics to an attacker-controlled call center. The automation filters for people who are worried — making them more likely to cooperate.' },
            { text: 'Amazon (and any legitimate company) can investigate orders using their internal account database. They NEVER need your password to view your account. Any caller asking for your password is attempting to steal it.' },
            { text: 'You can verify any alleged Amazon order by logging into your Amazon account directly at amazon.com (never via a link in a call or email). Your order history shows all purchases instantly.' },
        ],
        'phishing',
        'VERDICT: Callback Phishing / Robocall Vishing Scam.\n\nMechanism: Automated robocall creates fake urgency (unauthorized purchase) → "Press 1" routes panicked victims to attacker call center → caller attempts to harvest Amazon login credentials.\n\nRed Flags: (1) Unsolicited robocall about a purchase. (2) "Press 1" engage mechanism. (3) Request for account password — Amazon never asks for passwords over the phone. (4) No real unauthorized order exists — verification takes 10 seconds on amazon.com.\n\nCorrect Action: Hang up. Check your Amazon account directly at amazon.com. If concerned, call Amazon at 1-888-280-4331 (number from the website — not from the call).'
    ),

    mkLab(
        'Vishing - Lottery Winner Fee', 2,
        'An employee receives a call informing them they have won a $50,000 sweepstakes prize, but must first pay a $500 "processing fee" via wire transfer to claim their winnings.',
        `CALLER: "Congratulations! This is James Wilson from National Sweepstakes Commission. You have been selected as our February 2026 winner — you have won $50,000 cash! Are you excited?"

EMPLOYEE: "I don't remember entering any sweepstakes..."

CALLER: "You were automatically entered through your recent online activity. This is completely legitimate — we work with 50 state lotteries. To release your prize, we just need a small $500 processing and tax fee. Once we receive that, we'll overnight the $50,000 check to you."

EMPLOYEE: "I have to pay money to receive my prize?"

CALLER: "Yes, it\'s a standard government processing requirement. We accept wire transfer or a Zelle payment. Once you send the $500, you\'ll receive the $50,000 within 24-48 hours."`,
        [
            'Explain the "advance fee fraud" model: why must victims pay before receiving anything?',
            'You cannot win a sweepstake\you didn\'t enter. What does this tell you about the scenario?',
            'Why do scammers prefer wire transfer and Zelle over credit cards for "fees"?',
            'Classify the scam and deliver a verdict.',
        ],
        [
            { text: 'Legitimate lottery and sweepstake prizes are NEVER conditional on paying a fee first. Winners never pay taxes or processing fees upfront — any legitimate prize tax handling is done by deducting from the winnings, or handled during annual tax filing.' },
            { text: 'If you didn\'t enter a contest, you cannot have won it. "You were automatically entered" is a fabricated explanation with no legal basis.' },
            { text: 'Once you wire money or send via Zelle/CashApp, it is virtually impossible to recover. Credit cards offer chargeback protection — which is why scammers avoid them. Untraceable, irreversible payments are the hallmark of advance fee fraud.' },
        ],
        'phishing',
        'VERDICT: Advance Fee Fraud (Classic Lottery Scam).\n\nThe $50,000 prize does not exist. The $500 fee IS the attack — once paid, the attacker will disappear or demand more "fees" (customs fee, tax clearance fee, banking fee) until the victim runs out of money.\n\nRed Flags: (1) Winning a contest you never entered. (2) Upfront fee required to claim prize. (3) Wire/Zelle payment (untraceable). (4) Prize too good to be true ($50,000 for no reason).\n\nCorrect Action: Hang up. Never pay any fee to claim any prize. Report to FTC at reportfraud.ftc.gov.'
    ),

    mkLab(
        'Vishing - Fake Police / Jury Duty Scam', 1,
        'An employee receives a call from someone claiming to be a sheriff\'s deputy, stating the employee missed jury duty and now has an outstanding warrant. They can "settle" the fine over the phone immediately.',
        `CALLER: "This is Deputy Harris from the Harris County Sheriff's Department. I'm calling regarding an outstanding arrest warrant in your name for failure to appear for jury duty on February 10th."

EMPLOYEE: "What? I didn't receive any jury summons —"

CALLER: "Failure to receive notification is not an excuse under Texas law. The warrant has been issued. However, you have an option to avoid arrest today — you can pay the fine of $1,200 directly to avoid being taken into custody."

EMPLOYEE: "Can I pay at the courthouse?"

CALLER: "No, due to the active warrant, you must pay immediately over the phone. We accept prepaid Visa cards or Zelle. If you cannot pay right now, I'll need to dispatch officers to your location."

EMPLOYEE: "Let me call my lawyer first —"

CALLER: "If you contact anyone, I'm required to issue the immediate arrest order. You have 10 minutes to decide."`,
        [
            'Does a real sheriff\'s department resolve arrest warrants via phone payment? How are real warrants handled?',
            'Identify the isolation tactics the caller uses to prevent the employee from seeking advice.',
            'Why does the caller insist on prepaid cards or Zelle rather than a court payment system?',
            'Classify and deliver your verdict.',
        ],
        [
            { text: 'Real law enforcement agencies never call to collect fines or resolve warrants over the phone. Actual warrants result in officers arriving in person — not a phone call offering to accept payment via Visa gift card.' },
            { text: 'Police, courts, and government agencies use official payment portals, in-person courthouse payment, certified mail, or formal legal process — never prepaid gift cards or peer-to-peer payment apps.' },
            { text: 'The "10 minutes to decide or we arrest you" ultimatum is designed to prevent the victim from calling a lawyer, contacting family, or verifying the call with the real sheriff\'s office — all of which would immediately expose the scam.' },
        ],
        'phishing',
        'VERDICT: Authority Impersonation Vishing Scam — Fake Law Enforcement Threat.\n\nRed Flags: (1) Police never collect fines via phone. (2) Prepaid card / Zelle payment demand — no court system accepts these. (3) Threat of immediate arrest unless paid "in 10 minutes." (4) Prohibition from calling a lawyer — deliberate isolation. (5) No real warrant can be verified via a cold call.\n\nCorrect Action: Hang up. Call your local police non-emergency line or the county courthouse directly to verify any warrant. No legitimate warrant is resolved via telephone gift card payment.'
    ),

    mkLab(
        'Vishing - Health Insurance \'verification\'', 2,
        'An employee receives a call from someone claiming to verify their health insurance enrollment and begins collecting Aadhaar/SSN, date of birth, and insurance policy numbers for "system update purposes."',
        `CALLER: "Good afternoon, I'm calling from HealthShield Insurance on behalf of your employer's benefits administrator. We're updating our enrollment records and need to verify your details to ensure your coverage remains active."

EMPLOYEE: "What details do you need?"

CALLER: "Just routine verification: your full name, date of birth, Social Security Number, and current health insurance policy number. This will take under 2 minutes."

EMPLOYEE: "I'm not sure I should give my SSN over the phone —"

CALLER: "I completely understand your concern — but this is mandatory for enrollment compliance. If we can't verify by end of day, your coverage could lapse and any claims will be denied. It's in your interest to complete this now."

EMPLOYEE: "Okay — my SSN is 5XX-XX-XXXX and date of birth is —"

CALLER: "Perfect, and the policy number?"`,
        [
            'What specific personal data is being harvested and what identity theft risks does each piece create?',
            'Explain why insurance companies rarely need to call employees to verify SSN/policy details they already hold.',
            'Identify the urgency threat used: "coverage could lapse." How does this bypass rational decision-making?',
            'Classify the attack and recommend verification steps.',
        ],
        [
            { text: 'Your insurance provider already holds your SSN, date of birth, and policy number — they collected these when you enrolled. Legitimate verification calls don\'t need you to re-read your SSN over the phone.' },
            { text: 'If you\'re unsure whether an insurance call is legitimate, hang up and call the benefits/insurance number printed on your insurance card or HR welcome letter — this is always safer than providing information to an inbound caller.' },
            { text: 'SSN + Date of Birth + Name = the primary ingredients for identity theft. With these three pieces of information, an attacker can file fraudulent tax returns, apply for credit cards, or open bank accounts in your name.' },
        ],
        'phishing',
        'VERDICT: Personal Data Harvesting Vishing Scam — Identity Theft Attack.\n\nData Value: SSN + DOB + Name enables full identity theft. Policy number + insurer enables healthcare fraud. This data combination is worth hundreds to thousands of dollars in dark web markets.\n\nRed Flags: (1) Unsolicited inbound call asking for SSN. (2) Insurance provider already has all this data. (3) Urgency threat (coverage lapse). (4) No legitimate enrollment update requires SSN re-submission by phone.\n\nCorrect Action: Hang up. Call HR or the benefits line printed on your insurance card. Never provide SSN, DOB, or policy details to inbound callers you did not initiate contact with.'
    ),

    mkLab(
        'Vishing - Can you hear me? (Yes/No)', 1,
        'An employee answers a call where the caller immediately asks "Can you hear me clearly?" — attempting to record a "yes" voice response that could be misrepresented as consent to a service or purchase.',
        `CALLER: "Hello? Can you hear me clearly?"

EMPLOYEE: "Yes, I can hear you."

CALLER: "Wonderful! I'm calling about your extended warranty that's about to expire on your vehicle. Is this [employee name]?"

EMPLOYEE: "Yes, that's me."

CALLER: "Great. I just want to confirm — you are the primary account holder at this address, correct? And you authorize us to review your warranty options?"

EMPLOYEE: "Well, I'm not sure what warranty you're talking about —"

CALLER: "No problem — I just need a quick yes or no: do you authorize our team to provide you with information about your account?"

[Employee says "Yes"]

CALLER: "Perfect. That's been recorded. You'll receive a call back from our billing department to finalize the details."`,
        [
            'Explain the "Can you hear me?" scam: why is capturing a voice recording of "yes" valuable to scammers?',
            'What specific words is the attacker trying to capture recordings of, and how could these be misused?',
            'Why does the call escalate through multiple "yes/no" confirmation questions?',
            'What is the recommended response when you receive this type of call?',
        ],
        [
            { text: 'Scammers record your voice saying "yes" to use it as apparent consent in fraudulent authorization disputes — for example, if you dispute a charge they made, they claim they have a recording of you authorizing it.' },
            { text: 'The technique layers multiple questions: "Can you hear me?" → "Is this [name]?" → "You authorize us to..." — each designed to capture a clear "yes" that can be spliced into a fabricated consent recording.' },
            { text: 'The defense is simple: never say "yes" to unknown callers. Instead respond with "Who is calling and why?" If asked "Can you hear me?" say "Who is this calling?" — you can hear them perfectly without confirming with "yes."' },
        ],
        'phishing',
        'VERDICT: Consent Recording Scam — Voice Capture Vishing.\n\nMechanism: The attacker records "yes" responses to manufacture a fake consent recording that they may use to authorize fraudulent charges, dispute reversals, or harass the victim with "proof" they agreed to something.\n\nRed Flags: (1) Opener designed to elicit "yes." (2) Multiple escalating yes/no authorization questions. (3) Final statement: "That has been recorded" — implying binding consent. (4) Vague product (warranty, account) to maximize applicability.\n\nCorrect Action: Hang up on calls that open with "Can you hear me?" and ask for yes/no responses. Do not say "yes" or "no" to unknown callers. Register on the Do Not Call list at donotcall.gov.'
    ),

    mkLab(
        'Vishing - Utility Shutoff Threate', 2,
        'An employee\'s elderly neighbor reports receiving a call threatening electricity disconnection in 1 hour unless they pay an overdue balance immediately via prepaid card or app transfer.',
        `CALLER: "This is an urgent disconnect notice from PowerGrid Energy. Your account has an overdue balance of $312. Due to non-payment, your electricity will be disconnected in 60 minutes."

VICTIM: "I pay my bills on time — this must be a mistake!"

CALLER: "Our records show the September payment was returned. To avoid disconnection and a $150 reconnection fee, you must pay immediately. We can accept payment right now via Zelle or a Green Dot prepaid card."

VICTIM: "Can I come into your office to pay?"

CALLER: "No, to avoid disconnection in the next hour, payment must be made NOW by phone only. Go to any Walgreens or CVS, purchase a $312 Green Dot card, call us back, and read us the card number."

VICTIM: "What if I call your main number to verify?"

CALLER: "If you hang up, I'm required to submit the disconnection order immediately. You have 10 minutes."`,
        [
            'Does a real utility company disconnect service with 60 minutes notice via a phone call? How do real utility disconnections work?',
            'Why does the caller insist on prepaid cards over normal bill payment methods?',
            'Identify the double isolation tactic: the caller prevents both physical office visits and verification phone calls.',
            'Classify the attack and recommended response for the victim.',
        ],
        [
            { text: 'Real utility companies send multiple written disconnection notices over weeks before shutting off service. State utility commissions require advance written notice — typically 10+ days. A 60-minute phone disconnection threat does not exist in real utility policy.' },
            { text: 'Green Dot prepaid cards and Zelle transfers are preferred by scammers because they are essentially irreversible and untraceable — unlike credit cards (which have fraud protection and chargebacks) or ACH bank transfers (which have reversal mechanisms).' },
            { text: 'Call your utility company at the real number on your bill or their official website to check your actual balance. If there is genuinely an overdue balance, pay through the official app or website — never to a caller who contacts you first.' },
        ],
        'phishing',
        'VERDICT: Payment Coercion Vishing Scam — Fake Utility Shutoff Threat.\n\nRed Flags: (1) 60-minute disconnection threat — no real utility does this. (2) Prepaid card / Zelle demand. (3) Cannot visit office (attacker has no real office). (4) "Hang up and I disconnect you" — deliberate isolation. (5) No written notice sent (required by law).\n\nCorrect Action: Hang up. Check your actual account balance on the utility\'s official website or app. If there is a real balance issue, pay through official channels. Report to FTC and state utility commission.'
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
    console.log(`\n✅ Done — ${LABS.length} vishing beginner labs upserted. Total in DB: ${total}`);
    process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
