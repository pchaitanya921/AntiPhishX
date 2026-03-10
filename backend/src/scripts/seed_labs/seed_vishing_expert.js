'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// Expert: 500 XP | 30 min | Difficulty 8-9/10 | 0 hints
// Titles (lines 161-170): reversed order for 1→10

const mkLab = (title, difficulty, scenario, transcript, tasks, answer, explanation) => ({
    title, topic: 'vishing', level: 'expert', type: 'vishing',
    difficulty, points: 500, timeLimit: 1800, published: true,
    description: `Expert vishing simulation: ${title.replace('Vishing - ', '')}. Enterprise SOC-grade analysis — no hints provided.`,
    scenario,
    content: { callTranscript: transcript, callerID: 'Unknown / Spoofed / N/A', callDuration: '10-30 minutes', artifacts: [] },
    steps: tasks,
    hints: [],
    correctAnswer: answer,
    explanation,
});

const LABS = [

    mkLab('Vishing - Real-time Deepfake Negotiation', 9,
        'During a high-stakes $2.3M merger negotiation call, FinTrust Corp\'s M&A legal team realizes mid-call that the "CEO of the acquisition target" they are negotiating with may be a real-time AI-generated voice deepfake. The call has been ongoing for 18 minutes and significant confidential term sheet details have already been disclosed.',
        `NEGOTIATION CALL CONTEXT:
Participants (FinTrust): Legal Director, CFO, M&A Advisor
Participant claimed: CEO of TechCore Ltd (acquisition target)

TRANSCRIPT EXCERPT (minutes 12-18):
"TECHCORE CEO": "Regarding the valuation — we won\'t accept a penny below £32M. Our EBITDA for Q4 was £4.1M and you know what the multiples are right now."

LEGAL DIRECTOR: "Let me check something — Jonathan, we spoke at the Edinburgh Summit in October. Do you remember which table we sat at?"

"TECHCORE CEO": [2.3 second delay] "The — the main conference room. It was a long day."

LEGAL DIRECTOR: [covers mic, whispers to CFO] "The Edinburgh Summit had no tables. We didn't have a conference. Jonathan was the one who told me that location last month."

TECHNICAL ARTIFACTS REVIEWED DURING CALL:
- Caller joined via external dial-in (not corporate video call) — cannot verify face
- Background audio: consistent low-frequency hum (server room ambient? or audio processing artifact?)
- Two instances of 1.8-2.4 second response delays on unexpected questions
- Voice spectral analysis (run on a 30-second recording snippet) shows unusual frequency band smoothing in 2-4 kHz range — consistent with neural TTS artifacts
- TechCore's real CEO confirmed by his PA (called separately) to be in Tokyo — no scheduled calls today`,
        [
            'Identify all indicators from the call artifacts that suggest real-time AI voice synthesis — distinguish between behavioral, acoustic, and metadata indicators.',
            'Explain the "liveness test" the Legal Director used (Edinburgh Summit question) and why this technique is effective against AI-generated voice impersonation.',
            'Assess the information already disclosed in 18 minutes of negotiation — and the competitive/legal risk if this call was indeed with an attacker.',
            'Design an enterprise real-time deepfake verification protocol for high-stakes remote negotiations — covering both detection and verification steps.',
        ],
        'phishing',
        'VERDICT: High-Confidence Real-Time Deepfake Vishing — Active M&A Intelligence Interception.\nRisk: CRITICAL — potential material insider information and negotiation leverage compromised.\n\nDeepfake Indicators (Multi-Category):\nBehavioral: 1.8–2.4 second delays on contextual/personal history questions — TTS system requires additional generation time for unexpected prompts outside the pre-planned script.\nAcoustic: Frequency smoothing in 2–4 kHz range — neural TTS systems produce characteristic spectral signatures distinguishable from natural human speech under analysis.\nMetadata: Call via external dial-in (prevents video verification). Background ambient noise consistency (may be audio synthesis artifact or deliberately neutral recording environment).\nContextual: PA confirms CEO in Tokyo — zero scheduled calls today.\n\nLiveness Test Effectiveness: The Edinburgh Summit question was excellent — it referenced a personal, verifiable memory (a real event the real CEO would know) framed as a casual question. AI systems operating from a persona brief cannot reliably answer specific personal history questions. The 2.3-second delay + incorrect answer confirmed the response was synthesized, not recalled.\n\nInformation Disclosed (18 minutes):\n- FinTrust valuation walk (confirmed £32M floor)\n- Internal EBITDA acceptance of Q4 figures\n- Legal team composition (named individuals on the call)\n- CFO presence confirming deal stage\n- Timing/urgency signals exploitable in real negotiation or short-selling\n\nEnterprise Protocol:\n1. All high-value negotiations via verified video call (Teams/Zoom with authenticated identity) — never dial-in only.\n2. Pre-agreed personal liveness questions: topics only the real counterpart would know.\n3. Audio recording + spectral analysis: route through real-time deepfake detection tools (e.g., Pindrop Pulse).\n4. CEO confirmation: before sensitive calls, confirm counterpart availability via their PA on a known number.\n5. If deepfake suspected mid-call: pause call, claim technical difficulty, end session, escalate to CISO immediately.'
    ),

    mkLab('Vishing - Swatting (Emergency Service Spoofing)', 9,
        'A FinTrust Corp executive\'s home address (obtained via OSINT from public property records) is targeted in a swatting attack — a false emergency call to police claiming an armed hostage situation. Armed police respond. The executive is unharmed but the incident causes significant disruption and reveals physical security vulnerabilities.',
        `INCIDENT DOCUMENTATION:

9:47 PM — Police receive emergency call: "There's a man with a gun holding his family hostage at [Executive's home address]. He's saying he'll shoot if police approach."

9:52 PM — Armed Response Unit dispatched to executive's address
9:58 PM — Executive answers door to armed officers; no threat present
10:15 PM — Situation de-escalated; executive and family deeply distressed

TECHNICAL ANALYSIS OF THE SWATTING CALL:
  Caller ID: 911 (spoofed — caller appeared to be calling from within emergency system)
  Call origin: VoIP routed through 7 international jurisdictions
  Audio: Background sounds of distress (pre-recorded — same file used in 3 prior swatting incidents in FBI database)
  Caller's voice: Disguised + potentially AI-modified  
  Script: Contained specific floor plan details suggesting OSINT research of home

OSINT TRAIL IDENTIFIED:
  Executive's home address: Extracted from county property records (public)
  Floor plan layout: Inferred from building permit application (public record)
  Executive's schedule (home on Friday evenings): Identified from Instagram posts showing family dinners`,
        [
            'Explain the swatting threat model: how does a false emergency call weaponize the police response system, and what is the attacker\'s objective?',
            'Trace the OSINT chain used to target this specific executive — identifying each public data source and what information it provided.',
            'Assess the systemic emergency infrastructure vulnerability that makes swatting possible despite caller ID spoofing detection improvements.',
            'Recommend both personal OSINT hardening measures for executives and enterprise-level protective controls.',
        ],
        'phishing',
        'VERDICT: Swatting — Weaponization of Emergency Services via False Report.\nThis is a criminal offense (filing false emergency reports). Risk: Physical safety of executive and family + operational disruption.\n\nThreat Model: Swatting uses the police response system as an attack weapon. The attacker bears no physical risk. The goal may be: (a) intimidation/harassment, (b) causing the executive physical harm during the chaotic armed response, (c) disrupting operations, or (d) retaliation.\n\nOSINT Chain:\n- County property records (public) → home address\n- Building permit applications (public) → floor plan details\n- Instagram family dinner posts → executive home on Friday evenings (schedule intelligence)\nTotal research time: ~2 hours. All from public records.\n\nEmergency Infrastructure Vulnerability: 911 systems have improved STIR/SHAKEN caller authentication for regular calls, but emergency dispatch systems have inherent trust requirements — dispatchers must respond to reported emergencies even with imperfect caller verification, since false negatives (ignoring real emergencies) are unacceptable.\n\nExec OSINT Hardening:\n1. Property records: File for address confidentiality program (available in many US states for threatened individuals).\n2. Social media operational security: No home location, routine schedule, or family member face posts.\n3. Voter registration: Use PO box or law firm address.\n4. Building permits: Challenge public listing of floor plan details post-construction.\n\nEnterprise Controls:\n1. Pre-register executives with local police as potential swatting targets (many departments accept these registrations).\n2. Executive protection assessment: Identify all public OSINT trails for C-suite.\n3. Incident response: Have local police non-emergency number saved — report swatting threat immediately upon learning of call.'
    ),

    mkLab('Vishing - SS7 Intercept & Redirect', 9,
        'FinTrust Corp\'s security team investigates a case where an executive\'s SMS-based MFA codes were intercepted by an attacker who exploited SS7 (Signaling System 7) protocol vulnerabilities — allowing them to reroute the executive\'s SMS traffic and access corporate banking accounts.',
        `INCIDENT RECONSTRUCTION:

DAY 1: Attacker purchases SS7 network access from a grey-market telecom broker (cost: ~$500 for a 48-hour access session).

DAY 2 09:00 — Attacker has executive's mobile number (from public LinkedIn).
DAY 2 09:15 — SS7 SendRoutingInfoForSM message sent to home SS7 network (HLR query) to locate executive's current MSC/VLR.
DAY 2 09:18 — SS7 RegisterSS (supplementary service registration) used to silently activate unconditional call/SMS forwarding to attacker-controlled number.
DAY 2 09:23 — All incoming SMS to executive's number now forwarded to attacker WITHOUT delivery to executive's phone.
DAY 2 09:25 — Attacker initiates "Forgot Password" on corporate banking portal using executive's known email.
DAY 2 09:26 — Bank sends SMS OTP to executive's number → diverted to attacker → used.
DAY 2 09:27 — Banking portal password reset completed.
DAY 2 09:28 — Attacker logged in to corporate banking → $340,000 wire transfer initiated.

DETECTION: CFO receives email notification of password change (to real email) → calls bank → transfer intercepted with $340,000 partially cleared ($195,000 lost).`,
        [
            'Explain the SS7 protocol vulnerability being exploited: why does a 1970s telephone signaling protocol lack authentication that would prevent this attack?',
            'Trace the technical steps from SS7 HLR query to SMS forward activation — confirming which SS7 messages are used at each step.',
            'Assess why SMS-based MFA is specifically vulnerable to SS7 interception — and compare this to TOTP (app-based) and FIDO2 (hardware key) MFA alternatives.',
            'Recommend the organizational response to SS7 attack detection and the technical MFA migration path for high-risk accounts.',
        ],
        'phishing',
        'VERDICT: SS7 Protocol Exploitation — Telecom-Level MFA Bypass and Account Takeover. Financial Loss: $195,000.\n\nSS7 Vulnerability Root Cause: SS7 was designed in 1975 for trusted telephone network operators — all SS7 nodes were assumed to be legitimate telecoms. No cryptographic authentication exists between SS7 nodes. By 2026, grey-market SS7 access is purchasable, allowing non-telecom actors to send arbitrary SS7 messages. The protocol cannot distinguish a legitimate carrier from an attacker.\n\nTechnical SS7 Attack Sequence:\n1. SendRoutingInfoForSM (HLR query): Locates victim\'s current serving network and MSC address\n2. RegisterSS (Unconditional Call Forwarding / CFU + Unconditional SMS Forward): Activates silent forwarding to attacker number\n3. All subsequent SMS now delivered to attacker before (and instead of) victim\n4. OTP interception enables any SMS-dependent authentication bypass\n\nMFA Vulnerability Comparison:\n- SMS OTP: Vulnerable to SS7 intercept, SIM swap, and real-time relay. AVOID for high-security accounts.\n- TOTP (Google Authenticator): Not SS7-vulnerable (no network dependency) — but vulnerable to real-time phishing relay (AiTM attacks).\n- FIDO2/WebAuthn (hardware key or passkey): Not network-dependent, domain-bound — immune to SS7 intercept AND AiTM phishing. RECOMMENDED for all high-value accounts.\n\nMigration Priority:\n1. Immediate: All corporate banking accounts → FIDO2 hardware keys (YubiKey) for CFO, treasury, finance staff.\n2. 30 days: Migrate all executive corporate accounts from SMS MFA to TOTP or FIDO2.\n3. Contact telecoms provider: Request SS7 anomaly monitoring on executive numbers.\n4. Report to FCA and law enforcement — $195,000 wire fraud is notifiable.'
    ),

    mkLab('Vishing - Call Center \'Customer Support\' Mole', 8,
        'A FinTrust Corp partner bank\'s call center has an insider (a "mole") who is leaking live customer call data to a criminal ring in real-time — providing account balances, authentication answers, and customer SSNs during calls, which the ring uses immediately to drain accounts.',
        `INVESTIGATION ARTIFACT:

Incident Trigger: 47 customer fraud complaints in 72 hours, all with a common pattern — accounts drained within 30-120 minutes of a legitimate customer service call with the bank.

FORENSIC ANALYSIS:
- All 47 affected customers called the bank\'s legitimate helpline
- All 47 spoke with agents on Shift 2 (Tuesday/Wednesday/Thursday 2-8 PM)
- Phone tracking metadata: An unauthorized Bluetooth device (detected by office security system) was active on Shift 2 on all affected days
- 3 agents share Shift 2: Agents A, B, C
- After querying screen activity logs: Agent B accessed customer "sensitive data override" screen on all 47 accounts within 5 minutes of their call (normal workflow = only accessed when customer requests account number masking — a rare event)
- Agent B's personal phone matched the Bluetooth device MAC address

MOLE METHODOLOGY:
  During each call → covertly accessed full account details (SSN, balance, security Q&A)
  Transmitted via encrypted messaging app on personal phone (Bluetooth tethering)
  Criminal ring received data → initiated concurrent account drains via online banking → completed before customer hung up`,
        [
            'Explain the "concurrent attack window" — why is the gap between the customer service call and the actual account drain so short, and how does the mole\'s real-time data transmission enable this?',
            'Identify the 3 behavioral and technical indicators that correctly attributed this to Agent B rather than the other Shift 2 agents.',
            'Assess the systemic call center vulnerability: what access controls and monitoring would need to fail simultaneously for this insider attack to succeed?',
            'Design an insider threat program for call centers handling sensitive financial data — addressing access controls, behavioral monitoring, and investigation protocols.',
        ],
        'phishing',
        'VERDICT: Insider Threat — Call Center Data Exfiltration Mole. Financial Loss (estimated): £340,000+ across 47 accounts.\n\nConcurrent Attack Window: The criminal ring received account credentials in real-time via encrypted messaging during the customer\'s call. They initiated account drains WHILE the customer was still speaking with Agent B — within 10-15 minutes. By the time the customer hung up and received a fraud alert, the transfer was already processing. Short window = maximum success before detection.\n\nAttribution Evidence (3 Indicators):\n1. Temporal: All 47 accounts drained on Agent B\'s shifts — not Agent A or C shifts\n2. Screen activity: Agent B accessed "sensitive data override" on all 47 accounts (abnormal workflow pattern — flagged by screen logging)\n3. Physical: Agent B\'s personal phone Bluetooth MAC matched unauthorized device detected by office security system on all affected shift days\n\nAccess Control Failures That Were Exploited:\n1. "Sensitive data override" not restricted by roles or transaction limits\n2. No real-time alerting on unusual access pattern frequency (47 override accesses in 72 hours from single agent)\n3. Personal mobile phones permitted near agent workstations\n4. No Bluetooth device detection/blocking policy at agent workstations\n\nInsider Threat Program:\n1. Role-based access: "Sensitive data override" requires supervisor co-authorization for every use.\n2. Behavioral analytics: Real-time alert if single agent accesses sensitive override >3x per shift.\n3. Device policy: No personal mobile phones at agent workstations — secured in locker area.\n4. DLP: Monitor for encrypted messaging app data transfers on corporate network.\n5. Regular rotation of agents across different customer account segments.'
    ),

    mkLab('Vishing - Reverse Vishing with SEO Poisoning', 9,
        'Attackers poisoned search engine results for "FinTrust Corp customer service number" — causing victims to call an attacker-controlled helpline instead of the real bank. The victim initiates the call, bypassing all inbound call screening defenses.',
        `SIX-STEP ATTACK CHAIN:

STEP 1 — SEO POISONING:
  Attackers created 14 websites with URLs: "fintrust-bank-helpline.com," "fintrust-customer-support.net," etc.
  Each page: Full FinTrust Corp branding (scraped), "official" helpline number (+1-855-555-0192 — attacker-controlled)
  SEO optimization: Purchased backlinks + keyword stuffing → within 4 days, page 1 of Google for "FinTrust customer service number"

STEP 2 — VICTIM SELF-INITIATES CALL:
  Customer googles "FinTrust customer service" → clicks first result → calls attacker number
  Customer believes they called the real bank (they dialed first — no inbound call screening suspicion)

STEP 3 — PROFESSIONAL IVR MIMICRY:
  Attacker IVR perfectly mimics FinTrust\'s real IVR system (recorded from real calls, replicated)
  Customer navigates "press 2 for account queries" → "press 1 for fraud reports"

STEP 4 — LIVE AGENT (SOCIAL ENGINEERING):
  Human operator with scripted FinTrust customer service persona collects full account details

STEP 5 — REAL-TIME ACCOUNT DRAIN:
  Collected credentials used immediately while customer believes issue is resolved

STEP 6 — DEFENSES BYPASSED:
  Inbound call spoofing detection: N/A (victim dialed out — no spoofed number)\n  Call center authentication: N/A (attacker, not the bank, is receiving the call)\n  Employee awareness training: N/A (victim is a customer, not employee)`,
        [
            'Explain why reverse vishing (victim calls attacker) defeats all inbound-call-focused security defenses — list every conventional defense that this technique bypasses.',
            'Analyze the SEO poisoning attack: why does a 4-day brand-new website rank on page 1 for brand-name search queries, and what does this reveal about search engine trust models?',
            'Assess the IVR replication step: what does the attacker need to build a convincing fake IVR, and why does this increase victim compliance significantly?',
            'Recommend multi-layer controls: brand monitoring, search engine response, customer awareness, and technical measures that address the reverse vishing vector.',
        ],
        'phishing',
        'VERDICT: Reverse Vishing via SEO Poisoning — Victim-Initiated Call to Attacker-Controlled Infrastructure.\nRisk: ENTERPRISE-WIDE customer financial fraud.\n\nDefenses Bypassed:\n1. Inbound call spoofing detection (STIR/SHAKEN): Victim made an outbound call — no incoming spoofed number exists\n2. Caller ID verification: Attacker receives the call — they see the victim\'s real number\n3. Enterprise employee training: Targets customers, not employees\n4. Email/web filtering: Attack happens via phone call — no URL clicked post-search\n5. Bank fraud alerts: Customer calls "bank" → believes fraud is being handled → no independent fraud report filed\n\nSEO Poisoning Mechanics: Google\'s PageRank weights recency, content relevance, and backlink authority. Purchased backlinks + exact-match keyword content in the page title rapidly achieves high ranking for long-tail brand searches ("FinTrust customer service number"), especially if the real brand\'s own support pages aren\'t optimized for these specific queries.\n\nIVR Replication: Requires only: (1) a call to the real IVR system to record the menu audio, (2) a VoIP provider with IVR capability, (3) ~2 hours to configure. Convincing replication dramatically increases victim compliance — the familiar IVR structure matches memory.\n\nMulti-Layer Defense:\n1. Brand monitoring: Monitor Google/Bing for unauthorized pages displaying company phone numbers (BrandShield, MarkMonitor).\n2. Google Search Console takedown: Flag and request removal of brand-spoofing URLs — Google\'s TOS prohibits impersonation.\n3. Official number prominence: Ensure the bank\'s own web pages rank above third-party results for "bank name + customer service number" via SEO investment.\n4. Customer warning: "Our number will never appear on a site other than [official-domain.com]" messaging in account statements.\n5. Phone number validation: Publish official number prominently with Google Knowledge Panel registration.'
    ),

    mkLab('Vishing - Audio Steganography in Voicemail', 8,
        'A threat intelligence team identifies that an attacker group is using a compromised corporate voicemail system to transmit command-and-control (C2) instructions to agents inside targeted organizations — encoding commands as inaudible signals within normal-sounding voicemail messages.',
        `THREAT INTELLIGENCE BRIEF:

DISCOVERY METHOD:
  SOC analyst noticed an unusual voicemail from "unknown caller" had been accessed 14 times by a FinTrust employee — unusual for a voicemail containing only 18 seconds of ambient music.
  Forensic team extracted the audio file and ran spectral analysis.

STEGANOGRAPHIC ANALYSIS:
  Tool used: Sonic Visualizer + DeepSound
  Findings: Inaudible ultrasonic payload embedded at 19.2 kHz (above normal human hearing range of ~18 kHz max)
  Payload: 384 bytes of binary data — decoded to Base64-encoded string
  Decoded message: "EXFIL_READY: /finance/payroll/Q1_2026 | TARGET: sftp.anonymousbox.io:22 | PASS: [redacted]"

ATTACKER MODEL:
  The voicemail system is used as a covert asynchronous communication channel
  The "music voicemail" provides plausible deniability — sounds like a wrong number
  14 access events suggest the insider (or another agent) retrieves the message multiple times to decode different encoded segments
  The message instructs an insider to exfiltrate specific payroll data to an attacker-controlled SFTP server`,
        [
            'Explain audio steganography: how can binary data be encoded into an audio file in a way that is inaudible to human listeners but extractable via software analysis?',
            'Assess the operational security advantages of using a corporate voicemail system as a C2 channel — compare to conventional C2 methods (HTTP, DNS, social media).',
            'Identify the insider threat indicators: what behaviors in the voicemail access log suggest an insider cooperating with the attacker?',
            'Design SOC detection rules for audio steganography C2 communications — covering both network/file monitoring and behavioral indicators.',
        ],
        'phishing',
        'VERDICT: Audio Steganography C2 Channel — Advanced Persistent Threat (APT) Insider Communication.\nRisk: CRITICAL — active data exfiltration in progress.\n\nAudio Steganography Mechanism: Digital audio files contain thousands of samples per second (CD quality = 44,100 samples/sec). The Least Significant Bits (LSBs) of audio samples — which contribute only ~1/256th of the sample value — can be replaced with payload bits without audible distortion. Alternatively, ultrasonic frequencies (>18 kHz) can carry encoded payloads entirely outside human perception range. The 384-byte payload at 19.2 kHz is inaudible but extractable via spectrogram analysis.\n\nC2 Channel Advantages vs Conventional Methods:\n- HTTP/HTTPS C2: Detected by proxy inspection, DLP, and URL reputation checks\n- DNS C2: Flagged by DNS analytics (unusual query patterns)\n- Social media C2: Platform moderation + API monitoring\n- Voicemail audio C2: Passes through corporate firewall as legitimate audio data (PSTN voicemail is not subject to internet DLP). Asynchronous delivery. Plausible deniability (wrong number call). Ultra-low bandwidth requirement (fits in seconds of audio).\n\nInsider Indicators: 14 access events for an 18-second ambient music voicemail is statistically anomalous. Normal wrong-number voicemail = 1 listen, then deletion. Repeat access suggests message retrieval/decoding attempts.\n\nSOC Detection Rules:\n1. Voicemail access anomaly: Alert on >3 access events for a single voicemail from an unknown caller.\n2. Audio file analysis: Run all corporate voicemail audio through steganographic analysis tool in detection pipeline.\n3. Network: Monitor for SFTP connections to non-approved destinations (anonymousbox.io domain class).\n4. Ultrasonic content detection: Flag audio files with significant energy above 18 kHz.'
    ),

    mkLab('Vishing - Multi-Stage Helpline Fraud', 8,
        'A sophisticated 3-stage telephony attack unfolds over 20 minutes: IVR data harvesting → human agent credential confirmation → OTP relay. Analyze the complete chain, identify each manipulation layer, and map the escalation of trust exploitation.',
        `STAGE 1 — IVR CREDENTIAL HARVEST (00:00–03:40):
[Fake bank IVR: "Please enter your 16-digit card number, expiry, and select your security word from our menu."]
Victim complies — card data + security word category captured via DTMF.

STAGE 2 — HUMAN AGENT SOCIAL ENGINEERING (03:40–16:20):
"AGENT SARAH": "Thank you for your patience. I can see your account. To complete the fraud block, I need to read you some information and confirm you can hear me. Your card ends in 4821, expires 03/28, and you selected 'pet name' as your security word. Is that correct?"
[Victim confirms] "Yes."
"AGENT SARAH": "Perfect. Now — one final step. The fraud team requires your current online banking password to process the emergency freeze. This is deleted immediately after verification."

VICTIM: "I\'m not comfortable giving my password..."
"AGENT SARAH": "I completely understand. Let me transfer you to our Fraud Director who can authorize an alternative process."

STAGE 3 — AUTHORITY ESCALATION + OTP RELAY (16:20–20:00):
"FRAUD DIRECTOR JAMES": "This is Director James Harrison. I see you have concerns about the password. Instead, we\'ll use a one-time authorization code. We\'re sending it to your phone right now. Please enter it into the keypad."
[Victim receives OTP — reads it to "Director James" who relays it to attacker completing a live transaction]`,
        [
            'Map the layered trust-building strategy across all 3 stages: what specifically does each stage add that makes the next stage more convincing?',
            'Explain the "authority escalation" technique in Stage 3: why does introducing a more senior-sounding individual increase OTP compliance after the victim resisted in Stage 2?',
            'Identify the social proof technique used at the start of Stage 2 — "I can see your card ends in 4821" — and explain how this data was used to manufacture trust using the victim\'s own data.',
            'Recommend a financial institution\'s call protocol design to interrupt this attack chain at each of the 3 stages.',
        ],
        'phishing',
        'VERDICT: Three-Stage Social Engineering Campaign — IVR Harvest + Human Social Proof + Authority Escalation OTP Relay.\nRisk: CRITICAL — real-time transaction authorization bypassed.\n\nLayered Trust Architecture:\nStage 1 (IVR): Collects card data + security word category using authoritative automation (IVR feels like a system, not a person — lower suspicion).\nStage 2 (Human): Uses Stage 1 data ("I can see your card ending 4821") as false evidence of legitimacy — data collected 3 minutes ago is played back as proof the "bank has access to your account." Classic social proof using victim-supplied data.\nStage 3 (Authority): When victim resists, "escalating to a Director" resets the social dynamic. A more authoritative voice + different framing (OTP instead of password) removes the specific objection while achieving the same outcome.\n\nSocial Proof Manipulation: "Your card ends in 4821" sounds like the bank knows your account details. But the attacker collected "4821" from the victim 3 minutes earlier in Stage 1. This is data recycling — using the victim\'s own information against them as a trust signal.\n\nInstitution Protocol Design:\nStage 1 Interrupt: Real banks never collect full card number, expiry, AND security details in a single IVR session — one factor at a time with session timeout. Flag IVR sessions collecting >2 credential types.\nStage 2 Interrupt: Bank agents NEVER ask for the full online banking password — period. This is written policy. Any agent request for the full password is a guarantee of fraud.\nStage 3 Interrupt: OTP codes sent by the real bank are for transactions that the CUSTOMER initiated. The bank asking you to enter an OTP they sent is inverted from the real flow. Real OTP = you enter on bank\'s website. Fake OTP = attacker has you enter via phone keypad to authorize their transaction.'
    ),

    mkLab('Vishing - Exploiting Voice Assistants (Laser/Light)', 8,
        'A physical security researcher demonstrates that an employee\'s smart home voice assistant (connected to corporate Slack, calendar, and email via OAuth) can be silently commanded using a directed laser or light pulse — without any vishing call, from outside the building.',
        `RESEARCH DEMONSTRATION ARTIFACT:

TARGET: Employee\'s home office setup — Alexa device connected to:
  - Corporate Slack (OAuth scope: channels:write, files:upload)
  - Work calendar (OAuth scope: calendar.events.write)
  - Corporate email (OAuth scope: mail.send)

ATTACK SETUP:
  Tool: 5mW laser pointer + audio modulator (converts voice commands to light frequency modulations)
  Range: Successfully demonstrated at 110 meters distance (attacker in car outside home)
  Point of entry: Kitchen window facing street — Alexa MEMS microphone responds to light-induced vibrations

COMMANDS ISSUED (no voice — laser only, silently):
  1. "Alexa, open Slack" → "Alexa, send a message to #general: Meeting moved to 4 PM tomorrow"
  2. "Alexa, open calendar" → "Alexa, add an event: \'Site visit\' Friday 9 AM at [attacker\'s location]"
  3. "Alexa, send email" → "Alexa, email the CEO: Forwarding the attached Q1 report" [social engineering message]

EMPLOYEE AWARENESS: None. No audio command issued. Device\'s LED showed brief activity but was not in view.
DETECTION: Alexa activity log showed unusual command history — identified during routine audit.`,
        [
            'Explain the physical mechanism: how does a laser or light pulse manipulate a MEMS microphone in a voice assistant without generating audible sound?',
            'Assess the enterprise risk model: smart home devices connected to corporate resources via OAuth create a physical attack vector against digital corporate systems — map the full attack surface.',
            'Identify all actions the attacker successfully performed and their corporate impact — including the social engineering message sent as the employee.',
            'Recommend enterprise remote worker security policy for IoT/voice assistant devices in home offices that access corporate systems.',
        ],
        'phishing',
        'VERDICT: Light-Induced Voice Command Injection — Physical IoT Attack Against Corporate Digital Systems.\nRisk: HIGH — physical proximity required but corporate systems fully compromised via home IoT bridge.\n\nPhysical Mechanism: MEMS (Micro-Electro-Mechanical Systems) microphones are light-sensitive. When a laser modulates at audio frequencies (e.g., 440 Hz for "A" note), it induces physical vibrations in the MEMS membrane that are electrically indistinguishable from sound waves. The voice assistant\'s processing pipeline treats these electrical signals as voice commands. First demonstrated by researchers at University of Michigan (2019 "Light Commands" paper). Effective through glass windows at >100 meters.\n\nEnterprise Attack Surface (Smart Home + Corporate OAuth):\nPhysical device (Alexa) → responds to laser without human interaction → talks to Alexa cloud API → Alexa\'s OAuth-authorized apps → Slack, corporate email, calendar → enterprise blast radius without any network compromise.\n\nCorporate Impact of Executed Commands:\n1. Slack message to #general: Misinformation distributed company-wide under employee\'s identity\n2. Calendar invite: Social engineering trap set (employee scheduled to visit attacker\'s location)\n3. CEO email: Social engineering attack launched using employee\'s authoritative email identity\n\nEnterprise Remote Worker Policy:\n1. Corporate OAuth policy: Smart home assistants (Alexa, Google Home, Siri) are PROHIBITED from connecting to corporate OAuth scopes (Slack, email, calendar).\n2. Physical placement: Work-adjacent IoT devices should not face windows/exterior walls.\n3. Device audit: Quarterly review of all OAuth authorizations granted by corporate accounts — revoke unauthorized consumer app connections.\n4. Acceptable: Using corporate devices in a dedicated home office space away from consumer IoT devices.'
    ),

    mkLab('Vishing - Synthetic Identity Vishing', 9,
        'An attacker uses a "synthetic identity" — a blended real + fabricated persona combining a real SSN (from a child\'s record), fabricated personal details, and AI-generated voice — to pass bank verbal identity verification and open accounts used for money laundering.',
        `SYNTHETIC IDENTITY PROFILE USED:

Real Component: SSN 298-**-**** (belonging to a 9-year-old child — no credit history = clean record)
Fabricated Components:
  Name: "Mark Alan Preston" (does not exist)
  Date of Birth: June 14, 1988 (plausible adult birthday mapped to SSN)
  Address: Mail forwarding service (legitimate-looking address)
  Employment: Self-employed consultant (unverifiable)
  Phone: VoIP number (controllable)

PRE-CALL CREDIT BUILDING (18 months):
  Applied for secured credit card using synthetic identity → small purchases → paid monthly
  After 18 months: 680 credit score established for "Mark Alan Preston"

THE VISHING ELEMENT — BANK CALL:
  Bank requests verbal confirmation call before approving $50,000 credit line
  "Mark Alan Preston" (AI voice clone of non-existent person) speaks to bank agent
  Knowledge-based authentication questions (KBA): All answered correctly (fabricated data is known to attacker)
  Result: $50,000 credit line approved → funds withdrawn → defaults → bank absorbs loss

SCALE: Synthetic identity fraud estimated to cost US financial institutions $6–20 billion annually`,
        [
            'Explain the synthetic identity construction methodology: why is a child\'s SSN specifically targeted, and how does 18 months of credit building create a "clean" fraudulent identity?',
            'Describe how Knowledge-Based Authentication (KBA) questions are defeated by synthetic identities — when every "personal" detail in the database was created by the attacker.',
            'Assess what makes AI voice synthesis specifically valuable in the bank call step — what does it add beyond a human actor impersonating "Mark Preston"?',
            'Recommend identity verification controls that are specifically designed to detect synthetic identities — addressing both the pre-application credit building phase and the verbal verification call.',
        ],
        'phishing',
        'VERDICT: Synthetic Identity Fraud — Blended Real/Fabricated Persona + AI Voice Authentication Bypass.\nEstimated Loss: $50,000 (this account). Industry-wide: $6–20B annually.\n\nChild SSN Targeting: Children have no credit history and are unlikely to check their credit reports for years — often until they apply for their first credit card at 18. This gives attackers a multi-year window to build credit on the child\'s SSN under a fake name without discovery. The SSN is real (passes validation), the person attached to it is fabricated.\n\n18-Month Credit Building: Fraudsters build synthetic identity credit profiles by starting with a secured card (minimal verification), paying on time for 12–18 months to build a legitimate credit score, then "bust out" — rapidly maxing all available credit and disappearing. By the time fraud is detected, the "person" no longer responds.\n\nKBA Vulnerability: KBA questions ("What was your first car?", "What street did you live on at age 12?") verify identity by testing memory of real life events. Since the attacker CREATED all the synthetic identity data, they know every answer perfectly — they have 100% KBA accuracy on entirely fabricated facts. KBA fails completely against synthetic identities.\n\nAI Voice Adds: Consistency (same voice every call), zero gender/accent mismatch with claimed identity, eliminates human actor risk (the attacker is never personally on the call).\n\nDetection Controls:\n1. SSN→DOB linkage verification: Bureaus can flag when SSN issue date (SSNs issued at birth) is inconsistent with claimed DOB (a 1988-issued SSN should not belong to someone claiming a 1988 birthday — may have been issued older).\n2. SSN thin file: Child\'s SSN has credit first accessed at their age 9 — flag adult credit applications on SSNs with no prior activity.\n3. Device/behavioral biometrics: Detect AI voice synthesis during verbal verification calls (liveness detection).\n4. Identity graph analysis: Flag identities where associated phone, address, and email have no pre-existing relationship (synthetic identities have "too clean" digital footprints).'
    ),

    mkLab('Vishing - Social Engineering the Telecom Provider', 9,
        'An attacker social engineers FinTrust Corp\'s corporate mobile carrier into porting the CEO\'s mobile number to a SIM card controlled by the attacker — a "SIM swap attack" at the corporate carrier level — gaining full control of the CEO\'s SMS, MFA, and voice communications.',
        `SIM SWAP ATTACK RECONSTRUCTION:

TARGET: CEO\'s corporate mobile number (used for banking MFA, Microsoft Authenticator backup, and executive communications)

ATTACKER PREPARATION (OSINT — 3 days):
  CEO name + mobile number: Company website leadership page
  Last 4 digits of SSN: Obtained from a dark web breach dump ($12)
  Account PIN/passcode: Guessed from CEO\'s known public anniversary date (Instagram) = 0914
  Carrier: Identified from SIM type indicator in public phone metadata

SOCIAL ENGINEERING CALL TO CARRIER:
  "My name is James [CEO name]. I\'m the account holder. My phone was stolen this morning in Singapore — I\'m calling from a hotel phone. I need to transfer my number to a new SIM immediately."
  Carrier agent: "Can you provide your account PIN?"
  ATTACKER: "It\'s 0914."
  Carrier agent: "And the last 4 digits of your SSN for verification?"
  ATTACKER: "XXXX."
  Carrier agent: "I\'ll initiate the SIM transfer now — you\'ll receive a new SIM within 2-4 hours at the address on file."
  [Attacker intercepts new SIM at mail forwarding address]

RESULT (next 6 hours):
  All CEO SMS → attacker device
  Microsoft Authenticator backup codes → via SMS → attacker
  Bank MFA codes → attacker
  $890,000 transferred from corporate treasury before IT detected
  CEO received no alerts (his phone showed "No SIM" — he attributed it to roaming issues)`,
        [
            'Explain how the attacker assembled the carrier authentication requirements from OSINT sources alone — mapping each data point to its public source.',
            'Corporate telecom accounts typically have stronger verification than personal accounts. Identify what social pretext (stolen phone in Singapore) specifically exploits to lower the carrier agent\'s caution.',
            'Map the downstream cascade: once SIM control was gained, how did the attacker escalate to $890,000 of corporate treasury access step by step?',
            'Recommend corporate telecom account controls, MFA migration, and detection capabilities that would have prevented or detected this SIM swap earlier.',
        ],
        'phishing',
        'VERDICT: Corporate-Level SIM Swap Attack — Telecom Social Engineering → Full Executive Communications Compromise. Financial Loss: $890,000.\n\nOSINT Assembly:\n- CEO name + number: Company leadership page (public)\n- Carrier: Phone metadata / SIM identifier (researchable from public carrier lookup tools)\n- Account PIN (0914): Instagram anniversary post showing September 14 → CEO anniversary date used as PIN\n- SSN last 4: Dark web breach database ($12) — demonstrates that stolen PII from unrelated breaches is weaponized months/years later\n\nSingapore Pretext Effectiveness: "Phone stolen while traveling internationally" leverages: (a) customer empathy (carrier agents are trained to help distressed customers), (b) urgency (traveling with no phone is a real emergency), (c) explanation for calling from a different number (hotel phone), (d) explanation for why receiving SMS to the old number is impossible (phone stolen). This pretext answers every carrier challenge before it\'s asked.\n\nCascade from SIM Control:\n1. All CEO SMS diverted (iPhone shows "No SIM" — CEO assumes roaming)\n2. Microsoft Authenticator "account recovery" SMS bypass → attacker ties CEO\'s Microsoft account to attacker\'s Authenticator app\n3. Corporate banking: "Forgot password" → reset via CEO email (already compromised via Microsoft takeover) → MFA via SMS (captured)\n4. Treasury wire transfer: $890,000 initiated and completed before SIM anomaly detected (6 hours)\n\nPreventation Controls:\n1. Carrier account: Add port freeze / SIM lock — requires in-person ID verification at carrier store to transfer SIM. Many carriers offer this free on request.\n2. Carrier account: Register separate executive-only port authorization passcode — different from account PIN.\n3. MFA migration: CEO account → FIDO2 hardware key (no SMS backup). SIM swap becomes irrelevant.\n4. Detection: Mobile number carrier monitoring alert (HLR change notification) — notify IT security of any SIM swap event within minutes.\n5. Personal data hygiene: Remove personal anniversary dates, birth dates, and contact numbers from all public profiles.'
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
    console.log(`\n✅ Done — ${LABS.length} vishing expert labs upserted. Total: ${total}`);
    process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
