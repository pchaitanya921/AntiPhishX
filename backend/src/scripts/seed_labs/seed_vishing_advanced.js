'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// Advanced: 350 XP | 20 min | Difficulty 6-7/10 | 1 hint
// Titles: lines 171-180 in all_titles.txt (reversed)

const mkLab = (title, difficulty, scenario, transcript, tasks, hint, answer, explanation) => ({
    title, topic: 'vishing', level: 'advanced', type: 'vishing',
    difficulty, points: 350, timeLimit: 1200, published: true,
    description: `Advanced vishing simulation: ${title.replace('Vishing - ', '')}. Multi-artifact SOC analysis required.`,
    scenario,
    content: { callTranscript: transcript, callerID: 'Spoofed / Unknown', callDuration: '5-15 minutes', artifacts: [] },
    steps: tasks,
    hints: [{ text: hint }],
    correctAnswer: answer,
    explanation,
});

const LABS = [

    mkLab('Vishing - Two-Pronged Vishing (The Setup)', 7,
        'An enterprise attack unfolds in two coordinated phases: Phase 1 — an automated fraud alert induces employee fear. Phase 2 — a "bank security officer" calls offering to help, already knowing account details gathered from Phase 1 DTMF inputs. Analyze the full two-phase chain.',
        `PHASE 1 — 09:00 AM (Automated Robocall):
"This is National Bank fraud detection. We've flagged a $3,200 debit at a Miami electronics store. To confirm this was you, press 1. To dispute, press 2 and verify your card details."
[Employee presses 2 → enters Card Number via DTMF keypad → CVV → ZIP code]
"Thank you. A security officer will call you within 2 minutes to complete the verification."

[09:02 AM — PHASE 2 INBOUND CALL]
CALLER: "National Bank Security, Officer Reed. I'm calling about the fraud case on your XXXX-1234 Visa. I have your card details confirmed — your billing ZIP is 78702, correct? We need to confirm your online banking PIN to complete the freeze."

EMPLOYEE: [Surprised the caller knows the details] "Yes, that's right — I'm surprised you have all that so quickly."
CALLER: "Yes, our fraud system syncs in real-time. Your PIN?"`,
        [
            'Map the two-phase technical flow: what data was collected in Phase 1 via DTMF, and how was it used to build trust in Phase 2?',
            'Explain why the "already knowing your details" trust signal in Phase 2 is specifically engineered — and why it is the most dangerous element of this attack.',
            'Identify what data the attacker still lacks vs what they\'ve collected — and what Phase 2 is specifically designed to acquire.',
            'Recommend detection and prevention controls for each phase of this coordinated attack.',
        ],
        'DTMF (Dual-Tone Multi-Frequency) keypad inputs on automated calls are captured by the robocall system — not a real bank. Data entered in Phase 1 (card number, CVV, ZIP) was used in Phase 2 to impersonate a real bank officer. The "knowing your details" moment was engineered using YOUR own data.',
        'phishing',
        'VERDICT: Coordinated Two-Pronged Vishing — Automated Data Harvest (Phase 1) + Social Engineer (Phase 2).\n\nPhase 1 Data Collected via DTMF: Card number, CVV, ZIP code (3 of 4 card-not-present fraud ingredients).\nPhase 2 Target: Online banking PIN (4th ingredient: full account access).\n\nThe Trust Manipulation: "We already know your details" is the most sophisticated element. The employee believes the caller is a real bank officer because they know the card details. In reality, the attacker sourced those details FROM the employee 2 minutes earlier in Phase 1. The data is used back against the victim as a trust signal.\n\nDefense Controls:\nPhase 1: Never enter sensitive financial data (card numbers, CVVs, PINs) into automated robocall systems initiated by inbound calls. Call your bank on the number from your card back.\nPhase 2: Legitimate bank security officers NEVER ask for your PIN or online banking password. Banks enforce this universally — no exception exists. A "security officer" requesting your PIN is confirming they are attackers.'
    ),

    mkLab('Vishing - War Dialing / War Walking', 6,
        'FinTrust Corp\'s telecom security team detects an anomalous inbound call pattern: 1,400 calls made to the company\'s published phone range over 4 hours, with sequential numbering. Some calls triggered auto-attendant recordings. Analyze the call log artifact.',
        `CALL LOG ARTIFACT (sample from PABX logs):
  09:00:01 — INBOUND: +1-512-555-0100 → No answer (voicemail: "You\'ve reached accounting...")
  09:00:03 — INBOUND: +1-512-555-0101 → Answered (silence — call dropped after 2 sec)
  09:00:05 — INBOUND: +1-512-555-0102 → Voicemail: "Hi, this is Sarah Chen, HR Manager, extension 5102..."
  09:00:07 — INBOUND: +1-512-555-0103 → Voicemail: "You\'ve reached the payroll helpdesk..."
  [Pattern continues sequentially through +1-512-555-1500]

PATTERN ANALYSIS:
  Total calls: 1,423 in 4 hours
  Call interval: ~2 seconds between each
  Originating IP: Multiple rotating IPs (VoIP gateway)
  Voicemails answered: 287 (20% answer rate)
  Data extracted via greetings: Names, roles, departments, extension numbers
  Highest-value hit: Greetings revealed CFO name, assistant name, and that "the CFO is in London until February 25th"`,
        [
            'Explain war dialing as a reconnaissance technique: what is the attacker mapping and why is extension range enumeration valuable for subsequent social engineering?',
            'Assess the intelligence value of the data collected from voicemail greetings alone — specifically what a follow-on vishing attack could use.',
            'Why does the CFO travel disclosure (London until Feb 25) significantly increase attack risk for the next 4 days?',
            'Recommend PABX configuration and policy controls to defend against war dialing reconnaissance.',
        ],
        'War dialing is an automated reconnaissance technique where attackers sequentially dial every number in a company\'s phone range to map: (a) which numbers are active, (b) who answers each extension, (c) role/department from voicemail greetings, and (d) operational intelligence (absences, org structure) disclosed in personal greetings.',
        'phishing',
        'VERDICT: War Dialing Reconnaissance Attack — Pre-Attack Intelligence Gathering.\nThreat Level: HIGH (precursor to targeted vishing attack).\n\nData Collected:\n- Active extension map (1,423 dialed → 287 answered)\n- Employee names by extension (from voicemail greetings)\n- Department assignments and role titles\n- CFO absence: London until Feb 25 (critical — enables CFO impersonation attack on finance team while CFO is "unreachable")\n\nNext-Phase Attack Risk: Within 72 hours, expect targeted vishing calls impersonating executives known to be traveling, using acquired staff names/roles for internal credibility.\n\nImmediate Actions:\n1. Alert finance and executive assistants — suspicious calls incoming.\n2. PABX config: Block sequential call pattern rate limiting (>10 calls/minute from single source).\n3. Remove identifying information from voicemail greetings (use department name only — not personal name + travel schedule).\n4. Implement call pattern anomaly alerting in telecom management platform.'
    ),

    mkLab('Vishing - Toll Fraud (IRSF)', 6,
        'FinTrust Corp\'s telecom team identifies a $43,000 spike in the monthly phone bill. Analysis reveals IRSF (International Revenue Share Fraud) — the company\'s PBX was compromised and used to route thousands of calls to premium-rate international numbers overnight.',
        `TELECOM AUDIT ARTIFACT:

Normal monthly spend: ~$2,200
This month's bill: $45,190 — SPIKE: +$42,990

CALL LOG ANALYSIS (flagged period: 02:00–05:30 AM last Saturday):
  3,412 outbound calls to: +881 (International Mobile Satellite — $0.45/min)
  Average duration: 8.3 minutes per call
  Total duration: 28,319 minutes
  Revenue to attacker (via premium number profit sharing): ~$12,750

PBX VULNERABILITY IDENTIFIED:
  Voicemail-to-email feature left default password (1234) on 3 extensions
  Attacker accessed voicemail remotely → triggered "callback" feature → routed calls
  Attack originated from IP: 185.130.44.22 (Known IRSF botnet C2 hub)

DETECTION FAILURE: No afterhours call volume alert was configured on the PBX`,
        [
            'Explain the IRSF (International Revenue Share Fraud) business model: who profits, how, and why FinTrust Corp bears the financial cost.',
            'Describe the exploit chain: default PBX voicemail password → voicemail callback feature → premium-rate call routing.',
            'Why was the attack timed for 02:00–05:30 AM on a Saturday?',
            'Recommend PBX hardening controls to prevent IRSF, focusing on both authentication and behavioral monitoring.',
        ],
        'IRSF works through a profit-sharing arrangement: an attacker controls (or rents access to) a premium-rate international number. Traffic routed to that number generates revenue — paid for by the victim company\'s phone bill. The attacker profits from the revenue while the victimized company pays the call charges.',
        'phishing',
        'VERDICT: IRSF (International Revenue Share Fraud) — PBX Compromise via Default Credentials.\nFinancial Impact: $42,990 excess bill. Attacker profit: ~$12,750.\n\nExploit Chain:\n1. Attacker discovered PBX voicemail extensions with default PIN "1234" (no brute-force needed).\n2. Accessed voicemail remotely via public PSTN dial-in (standard feature of most PBX systems).\n3. Used voicemail "callback" feature to dial out to attacker-controlled premium-rate numbers.\n4. 3,412 calls × 8.3 min × $0.45/min = $12,743 attacker revenue. FinTrust billed full rate.\n\nWhy 2 AM Saturday: Minimal IT/telecom staff, no real-time monitoring, maximum window before detection. IRSF attacks virtually always target overnight/weekend windows.\n\nPBX Hardening:\n1. IMMEDIATE: Force-reset all voicemail PINs — enforce minimum 6-digit non-default.\n2. Disable international dialing on voicemail callback feature.\n3. Configure afterhours call volume alert: >50 outbound international calls/hour = immediate alert.\n4. Block premium-rate number prefixes (+881, +882, +979) at PBX level unless explicitly required.'
    ),

    mkLab('Vishing - Conference Call Interception', 6,
        'During a sensitive FinTrust Corp M&A discussion on a dial-in conference bridge, the SOC identifies an unauthorized participant. The call was joined using the public conference ID found on externally visible calendar invites — and the intruder remained silent for 47 minutes.',
        `CONFERENCE CALL ARTIFACT:

Meeting ID: 8821-4455 (published in Outlook invite visible to external contacts)
Call Bridge: +1-888-555-0200 (public dial-in)
Scheduled attendees: 8 (Legal, Finance, 2 external M&A advisors)
Actual connected participants detected: 9

INTRUDER INDICATORS:
  Participant joined 3 minutes after call start
  Remained completely silent for 47 minutes
  Call dropped 2 minutes before scheduled end (before wrap-up where attendees named themselves)
  Originating number: +44-7700-900127 (UK mobile — not associated with any scheduled participant)
  Participant never announced themselves
  No one on the call noticed or asked who had joined

CALL CONTENT DISCUSSED (now potentially compromised):
  FinTrust Q1 acquisition target: TechCore Ltd (not yet public)
  Agreed valuation range: £28M–£34M
  Due diligence timeline and legal team assignments
  CFO travel schedule for London meetings`,
        [
            'Explain the attack vector: how did the intruder obtain the conference bridge credentials without hacking any system?',
            'Assess the business impact of this 47-minute intelligence interception — specifically the market and legal risk from each disclosed piece of information.',
            'Why is "remaining silent" an effective conference call reconnaissance tactic — what does it prevent?',
            'Recommend enterprise conference call security controls to prevent unauthorized participant access.',
        ],
        'Most enterprise conference bridges use a publicly dialable number + meeting ID — both of which are typically visible in Outlook calendar invites. External recipients (M&A advisors in this case) can view the calendar invite details. If the attacker compromised an advisor\'s email, or found the invite through phishing / calendar scraping, they obtained the dial-in credentials without any technical PBX exploit.',
        'phishing',
        'VERDICT: Conference Call Interception — Unauthorized Intelligence Gathering via Exposed Meeting Credentials.\nThreat: CRITICAL (M&A insider information potentially leaked).\n\nAttack Vector: Conference bridge ID + dial-in number visible in Outlook calendar invite → attacker joined as silent listener. Zero technical exploit required.\n\nInformation Disclosed (Market-Sensitive):\n1. TechCore Ltd acquisition intent — if leaked, triggers front-running (insider trading risk).\n2. Valuation range £28M–£34M — destroys negotiating position.\n3. Legal team assignments — enables targeted attacks on specific lawyers.\n4. CFO travel schedule — repeat war-dialing value + opportunity for impersonation.\n\nWhy Silent: Announcing presence would trigger immediate call termination. Silence = invisibility for 47 minutes.\n\nControls:\n1. Always: Require meeting password SEPARATE from the public meeting ID.\n2. Enterprise conferencing (Teams, Zoom with auth): require authenticated login — not anonymous dial-in.\n3. Call admission control: host reviews participant list before sensitive discussions begin.\n4. Never include dial-in credentials in calendar invites that go to external recipients.'
    ),

    mkLab('Vishing - Internal Vishing (Insider Threat)', 6,
        'A FinTrust Corp employee impersonates the IT Security team in internal calls to colleagues — collecting system credentials for the HR database under the pretext of an urgent ransomware containment exercise.',
        `INTERNAL CALL TRANSCRIPT:

CALLER (using internal ext. 5231 — a legitimate employee's desk phone while that employee is at lunch): 
"Hi, this is Mark from IT Security — we have an active ransomware containment alert. We're isolating systems in your department before it spreads. I need your HR database login credentials immediately to apply the security patch."

HR COORDINATOR: "Oh no — is it bad? My credentials are hr_coord and the password is —"

SOC INVESTIGATION REVEALED:
  The call originated from ext. 5231 (belonging to employee David Ramos — Finance dept.)
  David Ramos was at lunch (away from his desk) — call was made by an unauthorized individual using his deskphone
  Badge access log: An unauthorized person entered the finance floor via tailgating at 12:02 PM
  HR database credentials were used at 12:31 PM from an external IP (VPN: 195.181.44.12) — data exfiltration detected
  Target: Employee PII records (5,200 employee records accessed in 4-minute burst)`,
        [
            'Map the physical and digital attack chain: how did the attacker use a physical access failure (tailgating) to enable the vishing call and the subsequent data exfiltration?',
            'Explain why insider-origin calls are significantly more trusted by employees than external calls — and how this trust was exploited.',
            'Identify the "ransomware urgency" pretext: why does this specific pretext bypass critical thinking effectively?',
            'Recommend both physical and digital controls that would have broken this attack chain at 3 different points.',
        ],
        'The attack chain relies on physical-to-digital escalation: physical tailgating granted floor access → unused desk phone enabled internal call origination → internal Caller ID built complete trust → social engineering extracted credentials → external IP used the credentials. Breaking any single link in this chain would have stopped the attack.',
        'phishing',
        'VERDICT: Insider Social Engineering Attack — Physical + Digital Chain / 5,200 Employee Records Compromised.\nRisk: CRITICAL — GDPR notifiable breach.\n\nAttack Chain:\nStep 1: Tailgated into Finance floor (physical security failure)\nStep 2: Used David Ramos\'s unattended desk phone (ext. 5231)  \nStep 3: Internal Caller ID made the call appear fully legitimate to HR\nStep 4: "Ransomware containment" urgency bypassed credential sharing hesitation\nStep 5: Credentials used from external VPN within 29 minutes\nStep 6: 5,200 HR records exfiltrated in 4-minute burst\n\n3 Break Points:\n1. Physical: Man-trap / badge reader at floor entry (no tailgating) — attack never starts.\n2. Process: Policy that IT Security NEVER requests credentials verbally by phone — employee would have refused.\n3. Technical: Database access controls requiring MFA — stolen password alone insufficient.\n\nGDPR: 5,200 employee PII records = mandatory ICO notification within 72 hours.'
    ),

    mkLab('Vishing - Voice Biometric Bypass (Replay)', 6,
        'A bank using IVR voice biometrics for customer authentication receives fraudulent calls using a recording of the customer\'s voice — successfully authenticating as the victim and transferring $18,000 from their account.',
        `BANK IVR SYSTEM ARTIFACT:

Authentication method: Voice biometric passphrase — customer says "My voice is my password"
Bank IVR transcript (attacker session):
  SYSTEM: "Please say your passphrase to verify your identity."
  ATTACKER: [Plays pre-recorded audio clip] "My voice is my password."
  SYSTEM: "Voice verified. Welcome, James Harrington. Account ending 4821."

SOURCE OF RECORDING:
  James Harrington's voice was captured from a YouTube interview posted 18 months ago
  The phrase "My voice is my password" was engineered from audio editing (multiple word clips assembled)
  Total recording length needed: 6 seconds
  Recording quality required: sufficient for spectrogram match against stored voiceprint

POST-AUTHENTICATION:
  Attacker requested $18,000 wire transfer to international account
  Bank IVR completed request — no additional MFA triggered for transfer
  Real customer discovered the transfer 6 hours later`,
        [
            'Explain the voice biometric vulnerability being exploited: why can a recording bypass spectrographic matching in some commercial IVR implementations?',
            'Identify the OSINT (Open Source Intelligence) method used to capture the victim\'s voice sample — and what public sources make voice capture trivial.',
            'Assess the systemic risk: for how many individuals is their voice effectively "public" and therefore potentially vulnerable to replay attacks?',
            'Recommend layered authentication controls that would survive a recorded voice replay attack.',
        ],
        'Voice biometric systems compare the audio waveform/spectrogram of the spoken passphrase against a stored voiceprint. Simpler implementations match acoustic features rather than detecting "liveness." A high-quality recording of the victim\'s voice — assembled from public audio — can match the stored voiceprint if the IVR lacks liveness detection (anti-spoofing).',
        'phishing',
        'VERDICT: Voice Biometric Replay Attack — Biometric Authentication Bypass.\nFinancial Impact: $18,000 transferred.\n\nVulnerability: The IVR voice biometric lacked "liveness detection" (anti-spoofing) — it verified the acoustic pattern of the voice but not that the speaker was physically present and speaking in real-time. A high-quality recording passed the spectrographic match.\n\nVoice Capture via OSINT: YouTube, podcast interviews, conference talks, TikTok/Instagram videos, Zoom meeting recordings, earnings call recordings. Executives and high-net-worth individuals have extensive public voice samples. The shift to video calls (post-COVID) has dramatically increased exposure.\n\nSystemic Risk: Any individual with >10 seconds of publicly available voice audio is potentially vulnerable to replay attacks against systems lacking liveness detection.\n\nMitigations:\n1. Liveness detection (anti-spoofing): Modern voice biometric systems detect recorded vs live audio via micro-dynamics, breathing patterns, background noise analysis.\n2. Challenge-response: IVR asks caller to speak a random phrase (not a fixed passphrase) — makes pre-recorded replays impossible.\n3. Multi-factor: Voice biometric + SMS OTP for transactions above threshold.\n4. Never use voice biometrics as sole authentication for financial transactions.'
    ),

    mkLab('Vishing - Deepfake Voice Cloning (CEO Fraud)', 7,
        'A FinTrust Corp finance manager receives an urgent call from what appears to be the CEO\'s voice, requesting an emergency wire transfer of $85,000. The voice is a real-time AI-generated clone created from the CEO\'s public speaking recordings.',
        `CALL DETAILS:
  Caller ID: CEO's known mobile number (spoofed)
  Voice quality: Indistinguishable from the CEO (deepfake — real-time generation)
  
TRANSCRIPT:
"VICTOR": "Sarah, it's Victor. I'm at the Singapore conference and I need you to handle something urgently. I'm in a meeting with the acquisition target and we need to wire $85,000 to their escrow account today or we lose the deal. This is confidential — don't involve legal yet. Here are the wire details: [provides account number]."

SARAH: "Victor — this is very unusual. Should I call legal?"

"VICTOR": "No time. I'm going back into the meeting. Do this now and I'll explain everything tonight. I'm counting on you."

DEEPFAKE TECHNICAL ARTIFACT:
  CEO voice model trained on: 4 conference presentation recordings (total 67 minutes)
  Tools: Commercial voice cloning API (ElevenLabs-equivalent) — real-time synthesis
  Training time: ~2 hours
  Voice similarity score: 94.7% (exceeds human perception threshold of distinguishability)
  Call method: VoIP with real-time TTS synthesis driven by attacker's voice as input`,
        [
            'Explain how commercial AI voice cloning works: what source material is required and how quickly can a convincing voice model be trained?',
            'Identify the specific behavioral red flags in this call that should trigger suspicion regardless of the voice quality.',
            'Explain why the "confidentiality + no legal" instruction is deliberately engineered into this attack.',
            'Recommend enterprise policies and verification protocols specifically designed for deepfake-resistant approvals.',
        ],
        '94.7% voice similarity exceeds the human threshold of audio distinguishability — the human ear CANNOT reliably detect this deepfake. Defense cannot rely on voice recognition by the recipient. The defense must be systemic (verification process) not perceptual (listening more carefully).',
        'phishing',
        'VERDICT: AI-Generated Deepfake Voice CEO Fraud — Synthetic Executive Impersonation.\nRisk: CRITICAL — $85,000 wire fraud attempt. Deepfake voice is indistinguishable.\n\nHow Voice Cloning Works (2026):\n67 minutes of audio → 2-hour training → real-time voice synthesis. Commercial APIs generate synthetic speech indistinguishable from the target at a 94.7% similarity score. Cost: ~$50-200. This is within reach of any motivated attacker.\n\nBehavioral Red Flags (not voice-dependent):\n1. Urgency + no documentation ("do this now")\n2. Bypass of normal legal/finance approval process\n3. Secrecy instruction ("don\'t involve legal yet")\n4. Request originated from voice call only — no written record\n5. International wire to unknown escrow account\n6. "I\'ll explain later" deferral of verification\n\nDeepfake-Resistant Policy:\n1. All wire transfers >$10,000 require written email from executive + confirmation call to verified number in company directory (not the number that called you).\n2. "No-legal, keep secret" instruction on any financial request = mandatory escalation, not compliance.\n3. Video verification: for sensitive requests, require a live video call via corporate Teams/Zoom (harder to deepfake in real-time, though not impossible).\n4. Pre-arranged safe words between executives and finance staff for out-of-band verification.'
    ),

    mkLab('Vishing - Simulated Kidnapping (Virtual Kidnapping)', 7,
        'An employee\'s parent receives a call claiming their child (the FinTrust employee) has been kidnapped — with background screaming. The family is instructed to wire $25,000 immediately and tell no one or the child will be harmed. The employee is actually safe at their desk.',
        `CALLER: "We have your daughter. Do NOT hang up. Do NOT call police. If you contact anyone, we cut the call and she gets hurt."

[Loud crying and screaming sounds play in background]

PARENT: "My daughter?! Let me speak to her!"

CALLER: "She can\'t talk right now. You have 30 minutes. Wire $25,000 to this account or we hurt her. Don\'t you hear her crying? We\'re watching your house."

INVESTIGATION:
  Employee confirmed safe at FinTrust office — confirmed via desk check 10 minutes into the call
  Background audio: pre-recorded (same 47-second loop identified in prior FBI database of known virtual kidnapping calls — used in 14+ incidents)
  Caller location: Mexico (VoIP routing through multiple jurisdictions)
  Caller ID: Unknown / Blocked
  Emotional impact on parent: severe — required medical attention despite no actual crime`,
        [
            'Explain the "virtual kidnapping" attack structure: how does the attacker maintain control of the parent while ensuring they cannot verify the child is safe?',
            'The background audio was a pre-recorded 47-second loop. What does this suggest about the attacker\'s operational methodology and target volume?',
            'Why is "do not hang up" the most critical control element — and what breaks the attack if violated?',
            'Recommend enterprise crisis awareness measures for employee families and HR response protocols for this scenario.',
        ],
        'Virtual kidnapping works by maintaining continuous call pressure — as long as the parent stays on the phone and panicked, they cannot take the 30-second action that would expose the scam: calling their child on a separate phone line. "Don\'t hang up" is not just an instruction — it is the technical mechanism that makes the entire attack viable.',
        'phishing',
        'VERDICT: Virtual Kidnapping Vishing Scam — Psychological Shock Fraud.\nNo actual crime occurred. This is a psychological pressure attack designed to extort money via manufactured crisis.\n\nAttack Structure:\n1. Random target selection (often based on social media — employee\'s family identifiable from public profiles)\n2. Background audio creates emotional reality without real victim\n3. "Don\'t hang up" prevents the one verification action that breaks the attack immediately\n4. 30-minute window designed to force a decision before the panic subsides\n\nHow to Break the Attack (works in all virtual kidnapping cases):\nPut the attacker on hold (or ask them to call back in 5 minutes). Use a second phone to call the alleged victim directly. Reality confirmed in <30 seconds. The attacker cannot maintain the fiction once real-time verification is possible.\n\nEnterprise Response Protocol:\n1. HR awareness: Include virtual kidnapping in family security briefings for employees in senior/visible roles.\n2. Emergency contact protocol: Employee-family "safe phrase" system — a pre-agreed phrase that confirms safety without revealing location.\n3. SOC escalation: If employee reports family received kidnapping call, SOC confirms employee presence immediately and coaches family on the phone.'
    ),

    mkLab('Vishing - PBX / Voicemail Hacking', 6,
        'FinTrust Corp\'s PABX voicemail system was compromised through weak voicemail PINs — attackers accessed confidential voicemail messages for 3 executives, intercepted an MFA code, and modified outbound greeting of the CFO\'s voicemail to impersonate her.',
        `PBX ATTACK DOCUMENTATION:

ATTACK VECTOR 1 — Voicemail PIN Brute Force:
  Target: External voicemail access (dial +1-512-555-0200, enter extension + PIN)
  PINs tested: Default sequences (1234, 0000, 1111, birthday-based 4-digit)
  CEO extension: PIN = 2310 (CEO's birthday: Oct 23 → reversed = 2310) → COMPROMISED
  CFO extension: PIN = 0000 → COMPROMISED  
  Legal Director: PIN = 5678 → COMPROMISED

ATTACK RESULTS:
  CEO mailbox: 3 confidential M&A discussions accessed
  CFO mailbox: MFA verification code captured from bank voicemail notification → used to initiate $67,000 transfer
  CFO outbound greeting: Modified to redirect callers to attacker's number ("For urgent matters, call my mobile: +44-7700-900432")
  Legal Director mailbox: Settlement negotiation details accessed + counsel contact list built

DETECTION: IT team noticed CFO greeting anomaly during routine call → triggered investigation`,
        [
            'Explain the "birthday PIN" pattern and why common PIN derivation methods (birthdays, employee IDs, default sequences) represent a systemic authentication failure.',
            'Assess the MFA intercept via CFO voicemail: explain how a voicemail-delivered MFA code creates an authentication bypass vulnerability.',
            'The modified CFO voicemail greeting is a persistent access technique — explain its purpose and how long it could evade detection.',
            'Recommend a PBX voicemail security policy covering PIN requirements, remote access, and MFA code delivery.',
        ],
        'Many corporate PBX systems deliver voicemail notifications (including bank OTP codes sent to the corporate number) as voicemail messages — which can be accessed remotely via a PIN. If the PIN is weak, the voicemail (and any OTP codes left in it) is accessible to any external attacker who dials the voicemail system.',
        'phishing',
        'VERDICT: PBX Voicemail Compromise — Multi-Stage Executive Intelligence + Financial Fraud.\n\nPIN Derivation Risk: Birthday-based PINs (DOB reversed/formatted) are highly predictable. OSINT sources (LinkedIn, company bios) often reveal birth dates. Default PINs (0000, 1234) are tested in every automated attack.\n\nMFA Voicemail Intercept: Banks that deliver OTP codes as voice messages to corporate numbers create a voicemail-based authentication gap. If voicemail PIN is weak, the OTP code is accessible to attackers externally. This is a systemic vulnerability — any OTP delivered to voicemail is only as secure as the voicemail PIN.\n\nModified Greeting Persistence: The attacker changed the CFO\'s outbound greeting to redirect callers to their number. This creates: (a) ongoing intelligence collection from callers who leave sensitive voicemails, and (b) a social engineering channel where callers believe they\'re talking to the CFO\'s mobile.\n\nPolicy Requirements:\n1. Minimum 8-digit random PIN — no birthday, ID, or default patterns.\n2. PIN complexity enforcement + lockout after 5 failed attempts.\n3. Disable OTP code delivery to voicemail (use SMS to personal mobile instead).\n4. Quarterly audit of all executive voicemail greetings for unauthorized changes.'
    ),

    mkLab('Vishing - IVR Phishing', 6,
        'Customers of FinTrust Corp\'s partner bank receive WhatsApp messages instructing them to call a "security helpline" — which is a convincing fake IVR system designed to harvest card details and authorize fraudulent transactions via DTMF.',
        `FAKE IVR SYSTEM TRANSCRIPT:

[Caller dials +1-888-555-0177 (attacker-controlled VoIP number)]

"Thank you for calling National Premier Bank Security Services. We have detected unusual activity on your account. For the security of your funds, please have your debit card ready.

Please enter your 16-digit card number now."
[DTMF input collected: 4532-1234-5678-9012]

"Thank you. Please enter your card expiry date in MM/YY format."
[DTMF: 03/28]

"Please enter your 3-digit security code."
[DTMF: 412]

"For final verification, please enter your date of birth in DD/MM/YY format."
[DTMF: 150990]

"Thank you. Your account has been secured. A security code will be sent to your registered mobile. When you receive it, please enter it below to complete verification."
[DTMF: 847293] ← OTP captured

"Your account is now protected. Thank you for calling National Premier Bank. Goodbye."`,
        [
            'Explain the IVR phishing model: why is an automated voice system more effective than a human caller for harvesting financial credentials at scale?',
            'Map all 5 data points collected and what fraudulent actions each enables — individually and in combination.',
            'Why does the IVR end the call smoothly with "Your account is now protected"? What psychological purpose does this serve?',
            'Recommend consumer warning indicators and enterprise controls for detecting fake IVR phishing numbers.',
        ],
        'Fake IVR systems scale credential harvesting without requiring a human operator for each call. They sound authoritative (professional recordings mimic real bank IVR style), are available 24/7, process unlimited simultaneous callers, and eliminate the risk of human social engineering mistakes. A single fake IVR can process hundreds of victims per hour.',
        'phishing',
        'VERDICT: IVR Phishing — Automated Credential Harvesting at Scale.\n\nData Collected + Fraud Enablement:\n1. 16-digit card number → card-not-present online fraud\n2. Expiry date → completes CNP transaction fields\n3. CVV/CVC → completes CNP authentication\n4. Date of birth → identity verification bypass at banks + account takeover\n5. OTP → authorizes specific fraudulent transaction in real-time\n\nCombined: Complete card fraud capability + account takeover + OTP-authorized transaction. This is the full credential harvest in one automated call.\n\nSmooth Ending Psychology: "Your account is now protected" triggers relief — turns a frightening experience into a positive resolution. Victims feel helped, not robbed. This delays reporting for hours or days while attackers drain accounts.\n\nDetection Controls:\n1. Consumer: Banks publish their real helpline numbers on card backs — any "security" number from WhatsApp/SMS/email is suspect. Call the card-back number directly.\n2. Enterprise: Monitor for company name + "security" variations in telecom fraud databases.\n3. STIR/SHAKEN: Deploy call authentication framework to flag spoofed caller IDs.\n4. Bank policy: Never deliver an OTP via automated system without the customer INITIATING the authenticated session.'
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
    console.log(`\n✅ Done — ${LABS.length} vishing advanced labs upserted. Total: ${total}`);
    process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
