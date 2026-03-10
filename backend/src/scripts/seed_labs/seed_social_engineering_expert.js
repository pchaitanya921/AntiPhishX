'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// Social Engineering – Expert: 500 XP | 30 min | 0 hints | Difficulty 8-9/10

const mkLab = (title, difficulty, scenario, artifact, indicators, socAnalysis, impact, answer, explanation) => ({
    title,
    topic: 'social_engineering',
    level: 'expert',
    type: 'social_engineering',
    difficulty,
    points: 500,
    timeLimit: 1800,
    published: true,
    description: `Expert Social Engineering lab: ${title.replace('SocEng Exp - ', '')}. Nation-state/APT-grade analysis required: reconstruct full attack chain, attribute actor TTPs, produce board-level risk report and regulatory compliance response.`,
    scenario,
    content: {
        artifact,
        indicators,
        socAnalysis,
        impact,
        artifacts: [],
    },
    steps: socAnalysis.tasks,
    hints: [],
    correctAnswer: answer,
    explanation,
});

const LABS = [
    mkLab(
        'SocEng Exp - Nation-State Persona: 18-Month LinkedIn Ghost',
        9,
        'A suspected nation-state actor built a convincing identity — "Ananya Krishnan, Senior Cybersecurity Researcher at IIT Bombay" — over 18 months. The profile accumulated real conference co-authorship credits (by contributing small sections to papers via legitimate researcher collaborations), published genuine LinkedIn articles on threat intelligence, obtained a verified LinkedIn badge through a corporate email at a shell company, and cultivated C-CISO-level connections at 7 Indian financial institutions. The persona then requested "collaborative threat intelligence sharing" — systemically harvesting zero-day intelligence, unpatched CVE schedules, and IR playbooks from 7 CISOs. Detection occurred only when a real IIT researcher flagged the identity discrepancy.',
        {
            type: 'osint_persona_forensic',
            personaDetails: {
                name: 'Ananya Krishnan',
                claimed: 'Senior Cybersecurity Researcher — IIT Bombay, Computer Science Department',
                profileAge: '18 months',
                connections: 2847,
                followers: 1943,
                publications: '3 IEEE conference papers (co-authored — contributed 2 paragraphs each via legitimate collaboration requests)',
                verifiedBadge: 'LinkedIn verified via shell company corporate email (Infosec Research India Pvt Ltd — dormant company)',
                linkedInFollowing: '7 CISOs of Indian financial institutions',
            },
            informationHarvested: {
                zeroDayIntel: 'Unpatched CVE schedules for 4 institutions (patch windows exposed)',
                irPlaybooks: 'Incident response playbooks shared "for peer review" by 2 CISOs',
                vendorStack: 'Complete security vendor stack for all 7 institutions',
                teamStructure: 'SOC team sizes, shift schedules, tool names',
                upcomingAudits: 'RBI inspection schedules for 3 institutions',
            },
            detectionEvent: 'Real IIT researcher Googled the name → found duplicate IIT email domain usage → flagged to CERT-IN',
        },
        [
            '18-month investment: nation-state patience — builds irreversible social credibility over time',
            'Real co-authorship: contributed minimal content to real papers → appears in IEEE author list → digitally verifiable',
            'LinkedIn verified badge: obtained via shell company — LinkedIn corporate email verification does not validate employment',
            '7 CISO targets: financial institution leadership — maximum intelligence value targets',
            'IR playbook sharing: normalised as "peer review" — CISOs shared operational artifacts under academic pretext',
            'RBI inspection schedules: national security intelligence — attacker knows regulatory blind spots',
            'Detection via human OSINT: technical tools did not detect — only human recognition of identity discrepancy',
        ],
        {
            attackType: 'Nation-State Long-Duration Persona — Strategic CISO Intelligence Harvest',
            threatLevel: 'Critical',
            tasks: [
                'Map the 18-month investment to the specific intelligence payoff for a nation-state actor: for each category of harvested intelligence (zero-day schedules, IR playbooks, audit timing), describe the operational capability it enables against India\'s financial system.',
                'Design a CISO-level external collaboration vetting protocol — specifically for academic and threat intelligence sharing requests — that would have detected this persona in stage 1 (months 1-3).',
                'LinkedIn verified badge was obtained via a shell company. Propose a technical verification enhancement LinkedIn should implement for researcher badges in sensitive professional sectors, and assess its feasibility.',
                'CERT-IN received the flag from the real IIT researcher. Write the nation-state attribution assessment (3 paragraphs) that CERT-IN\'s threat intelligence team would produce, citing the specific TTPs that distinguish nation-state from cybercriminal persona operations.',
                'Under the DPDP Act 2023 and RBI Cybersecurity Framework, enumerate the disclosure obligations for each of the 7 institutions whose intelligence was shared — and assess whether "voluntary information sharing" constitutes a data breach.',
            ],
        },
        {
            strategicIntelligence: 'Complete financial sector attack surface map: patch windows, IR procedures, audit schedules, vendor stack',
            operationalCapability: '7-institution zero-day exploitation window known; IR responses predictable; RBI audit blind spots exposed',
            nationalSecurityRisk: 'Intelligence package enables coordinated attack on Indian financial infrastructure during known regulatory gap',
        },
        'phishing',
        'VERDICT: Nation-State 18-Month Persona — Strategic Intelligence Harvest Across 7 Financial Institutions. National Security Incident. CRITICAL.\n\nTTP Attribution: 18-month build time, real academic co-authorship, shell company verification, CISO-level targeting = Tier 1 nation-state actor (not cybercriminal — ROI too long for financial crime).\n\nImmediate Actions:\n(1) CERT-IN notification — national security incident protocol.\n(2) All 7 CISOs: rotate all disclosed information (patch windows, IR playbooks — assume adversary has operational copy).\n(3) LinkedIn: report persona + all connected accounts for platform investigation.\n(4) RBI: classified briefing on disclosed inspection schedules — adjust timing.\n(5) Intelligence sharing vetting: immediate moratorium on external IR playbook sharing pending new vetting framework.\n\nSystem Control: Zero-trust external collaboration — all threat intelligence sharing requires bilateral NDA + CISO personal verification via out-of-band video call with institutional IT confirmation.'
    ),

    mkLab(
        'SocEng Exp - Cognitive Warfare: Manufactured Crisis to Extract Emergency Access',
        9,
        'An APT actor manufactures a multi-source crisis perception targeting a bank\'s CISO: (1) Plants fake media articles on a cloned financial news site reporting a "FinTrust data breach" that is circulating on Twitter/X via bot amplification. (2) Sends spoofed regulatory emails from a fake CERT-IN address demanding "emergency audit access." (3) Has an insider (previously recruited low-level employee) confirm the "breach" via internal messaging. Under 90-minute crisis pressure, the CISO grants temporary emergency RDP access to who he believes is a CERT-IN examiner — actually the attacker. The "breach" was entirely fabricated.',
        {
            type: 'cognitive_warfare_composite_artifact',
            attackChain: [
                { phase: 1, action: 'Fake news: cloned site moneycontrol-in[.]co publishes "FinTrust Corp Breach: 2M Customer Records Exposed" at 09:15' },
                { phase: 2, action: 'Twitter bot army: 847 bot accounts retweet the fake article — trending in FinServ community by 09:45' },
                { phase: 3, action: 'Spoofed CERT-IN email: incident-response@cert-in[.]org[.]in (real: cert-in.org.in) demands "emergency system access within 60 minutes or regulatory action"' },
                { phase: 4, action: 'Insider (recruited IT support staff) sends internal Slack: "Sir, I am also getting calls from reporters — is this real?" (validates crisis perception)' },
                { phase: 5, action: 'CISO, under 90-minute perceived crisis, grants RDP access to attacker ("CERT-IN examiner") on production monitoring server' },
                { phase: 6, action: 'Attacker uses RDP session: pivots from monitoring server to production database network' },
                { phase: 7, action: 'Real CERT-IN contacted by FinTrust legal (unrelated) — confirms no open incident → crisis discovered as fabricated at T+3h' },
            ],
            fabricatedCrisisElements: {
                fakeDomain: 'moneycontrol-in.co (real: moneycontrol.com) — cloned layout, believable URL at speed',
                certInSpoof: 'cert-in.org.in (real CERT-IN) vs cert-in[.]org[.]in (attacker) — invisible typosquatting in email client display',
                botAmplification: '847 accounts — fabricated social proof: 23K impressions in 90 minutes',
                insiderRole: 'Low-level IT support recruited 6 weeks prior — confirms false reality from inside',
            },
            rdpSessionActions: 'Monitoring server → lateral movement to DB network segment — 47-minute active session before discovery',
        },
        [
            'Manufactured crisis: three independent-appearing confirmation sources (media, regulator, internal colleague) = multiple-source validation of false reality',
            'Cognitive overload: 90-minute deadline + perceived public breach + regulatory threat = rational decision-making suppressed',
            'Domain typosquatting: cert-in[.]org[.]in vs cert-in.org.in — identical display in most email clients at scan speed',
            'Insider confirmation: low-level recruited employee validates from inside — most trusted confirmation type',
            'Bot amplification: 847 accounts → trending perception — social proof manufactured at scale',
            'CISO granted emergency access: bypasses all access controls under crisis pretext — highest-trust decision maker targeted',
            'Discovery via orthogonal contact: legal team contacting CERT-IN for unrelated matter exposed fabrication',
        ],
        {
            attackType: 'Cognitive Warfare — Manufactured Multi-Source Crisis for Emergency Access Extraction',
            threatLevel: 'Critical',
            tasks: [
                'Analyze the cognitive warfare architecture: map the three manufactured confirmation sources to the psychological principle of "multiple independent verification" — why does simultaneous multi-source confirmation suppress critical evaluation even in security-trained executives?',
                'Design a "crisis authentication protocol" for CISOs that prevents emergency access grants to any party, regardless of perceived urgency — the protocol must function even when the CISO believes a real breach is in progress.',
                'The insider was recruited 6 weeks before the attack. Design an insider threat behavioral detection program that would identify a low-privilege IT support employee showing pre-attack behavioral anomalies before recruitment completes.',
                'Twitter bot amplification created a trending perception. Assess what technical signals a corporate threat intelligence function could use to distinguish bot-amplified fabricated news from genuine breach reporting within the first 15 minutes.',
                'Write the post-incident cognitive warfare attribution report: what distinguishes this attack from opportunistic social engineering and indicates nation-state or APT-level capability?',
            ],
        },
        {
            productionAccess: '47-minute RDP session: lateral movement to DB network — full scope of access unknown pending forensics',
            cognitiveVulnerability: 'CISO decision-making bypassed under manufactured cognitive load — institutional access control defeated by perception manipulation',
            insiderThreat: 'Recruited low-level employee remains inside organization — full debrief and investigation required',
        },
        'phishing',
        'VERDICT: Cognitive Warfare APT — Fabricated Multi-Source Crisis. CISO-Level Emergency Access Granted to Attacker. CRITICAL.\n\nNation-State Indicators: (1) Pre-recruited insider. (2) Bot infrastructure for social proof amplification. (3) Domain typosquatting of government regulator. (4) Coordinated multi-phase 90-minute execution — requires operational planning, not opportunistic.\n\nCrisis Authentication Protocol: (1) Any emergency access request: 10-minute pause mandatory — no exceptions. (2) Regulator contact: call CERT-IN on verified landline from CERT-IN website (not from email content). (3) Internal validation: second CISO-level officer must co-authorize emergency access. (4) Insider identification: identify and immediately isolate the confirming internal employee (svc_insider) pending investigation.\n\nRegulatory: CERT-IN 6-hour notification. RBI breach report. FIR for fabricated crisis + wire fraud (insider recruitment).'
    ),

    mkLab(
        'SocEng Exp - Supply Chain Identity Compromise: Trusted Vendor Engineer Replacement',
        8,
        'An APT compromises the email account of a senior support engineer at FinTrust Corp\'s core banking software vendor (Finacle). Using the legitimate vendor engineer\'s email identity, the attacker schedules a routine "quarterly update session" over 3 weeks. During the session, the attacker (impersonating the engineer) installs a "performance patch" that contains a backdoor. The real engineer is unreachable (on medical leave) during the window. The backdoor persists for 47 days before detection via anomalous outbound connection.',
        {
            type: 'vendor_session_forensic',
            vendorCompromise: {
                vendor: 'Infosys Finacle — core banking platform for FinTrust Corp',
                compromisedAccount: 'Pradeep.Sharma@finacle-support.com (legitimate Finacle support engineer)',
                compromiseMethod: 'Spear phished via targeted LinkedIn message 3 weeks prior — credential harvested',
                realEngineerStatus: 'Medical leave — Feb 3 to March 1, 2026 — attacker knew from LinkedIn OOO post',
            },
            scheduledSession: {
                requestSentDate: 'Feb 3 (day 1 of real engineer\'s leave)',
                sessionDate: 'Feb 21, 2026 — 10:00 AM',
                sessionType: '"Quarterly core banking performance review + security patch application"',
                approvedBy: 'FinTrust IT Infrastructure Manager (approved without additional vendor contact verification)',
            },
            patchInstalled: {
                fileName: 'finacle_perf_patch_v2.3.1.exe',
                fileSignature: 'Signed with Finacle code signing certificate (stolen from vendor environment)',
                backdoorBehavior: 'HTTPS C2 beacon to 45.129.14.22:443 every 4h — mimics legitimate Finacle telemetry traffic',
                detectionDate: 'April 9, 2026 (47 days post-install)',
                detectionMethod: 'Network anomaly: C2 IP in threat intelligence feed — beacon pattern analysis',
            },
            realPradeepStatus: 'Real Pradeep Sharma was unaware of the scheduled session — returned from leave March 1 but session occurred Feb 21',
        },
        [
            'Vendor email compromise: legitimate @finacle-support.com domain — identity fully authentic to FinTrust IT team',
            'Medical leave exploitation: attacker knew engineer was unavailable — scheduled session during leave window',
            'Stolen code signing certificate: patch bypasses AV/EDR (Finacle-signed binary) — treats as legitimate vendor file',
            'IT manager approved without verification: vendor session approved based on known email identity only',
            '47-day dwell: 4-hour HTTPS C2 beacon mimics telemetry — below alert threshold in volume',
            'Threat intel detection: C2 IP appeared in commercial threat feed — triggered network alert',
            'Core banking backdoor: persistent access to central financial processing system — systemic risk',
        ],
        {
            attackType: 'Supply Chain Identity Compromise — Core Banking Backdoor via Vendor Engineer Impersonation',
            threatLevel: 'Critical',
            tasks: [
                'The attacker used a stolen Finacle code signing certificate to sign the malicious patch. Explain the specific EDR and code signing validation gap that allows a stolen (not forged) certificate to bypass behavioral analysis, and what additional controls detect signed-but-malicious software.',
                'Design a vendor session verification protocol for core banking software updates that would have detected the impersonation — accounting for the fact that the vendor email account itself was legitimate.',
                'The backdoor beaconed every 4 hours on HTTPS port 443. Design the network behavioral detection model (not IP reputation) that would identify this C2 pattern within 7 days of installation — before it appeared in commercial threat feeds.',
                'Core banking systems have RBI-mandated change management requirements. Assess whether the unauthorized patch installation constitutes a change management violation and the regulatory reporting obligations under RBI IT Framework 2021.',
                'Write the supply chain security incident playbook for a vendor-installed backdoor in a core banking system — including: isolation strategy that preserves banking operations, forensic scope, vendor notification, and RBI incident timeline.',
            ],
        },
        {
            backdoorAccess: '47 days — attacker had persistent access to core banking system for 6.7 weeks',
            transactionRisk: 'Core banking backdoor: transaction monitoring, modification capability, and fund routing access during dwell period',
            systemicFinancialRisk: 'Finacle is multi-tenant — same backdoor may exist in other banking clients of Infosys Finacle',
        },
        'phishing',
        'VERDICT: Supply Chain Identity Compromise — 47-Day Core Banking Backdoor. Signed Malware via Stolen Certificate. CRITICAL.\n\nDwell Period: 47 days of access to core financial processing — all transactions during this window require audit review.\n\nSystemic Risk: Report to Infosys Finacle immediately — same technique may target other Finacle clients.\n\nRBI Reporting: IT Framework 2021, Para 7.5 — cyber incident affecting core banking = immediate RBI notification (within 2-6 hours).\n\nVendor Session Controls: All core banking patches must be: (1) Approved via change advisory board (CAB) — no ad-hoc sessions. (2) Verified by calling vendor\'s NOC on registered number. (3) Attended by FinTrust IT + security officer throughout. (4) Hash-verified against vendor-published checksum before execution.'
    ),

    mkLab(
        'SocEng Exp - Deepfake Disinformation: Synthetic CISO Press Release',
        8,
        'An APT generates a synthetic video "press release" featuring a deepfake of FinTrust Corp\'s CISO stating that the company is voluntarily disclosing a data breach of 4 million customer records. The video is professionally produced, distributed via PR wire spoofing, and picked up by 3 financial journalists before FinTrust\'s communications team discovers it. The fabricated breach causes a 14% stock price drop in 2 hours, enables short sellers positioned in advance, and triggers 847 customer account closures.',
        {
            type: 'synthetic_media_and_market_impact',
            deepfakeVideo: {
                duration: '2 minutes 43 seconds',
                subject: 'CISO — Vikram Nair (public appearances: 3 conference keynotes, 1 CNBC interview)',
                productionQuality: 'Professional background, FinTrust Corp set branding, scripted teleprompter delivery',
                distribution: {
                    prWire: 'BusinessWire India account (spoofed from compromised PR agency credentials) — press release + video link',
                    journalistsPicked: 3,
                    firstPublication: 'ET Markets — "FinTrust CISO Confirms 4M Customer Data Breach"',
                    twitterAmplification: '14,200 impressions in 90 minutes',
                },
                deepfakeArtifacts: [
                    'Specular reflection inconsistency in glasses — visible only on 4K frame-by-frame',
                    'Micro-expression mismatch: blink onset 22ms faster than baseline video',
                    'Voice formant frequency: F2 resonance 3.7% deviation from CNBC interview baseline',
                    'Background: static pixel analysis shows virtual background composite edge artifacts',
                ],
            },
            marketImpact: {
                stockDrop: '14% in 2 hours (NSE: FNTRUST)',
                shortPositions: 'Abnormal short interest spike 72 hours pre-video: ₹23 crore in PUT options — SEBI investigation triggered',
                customerChurn: '847 account closure requests within 6 hours of video publication',
                regulatoryPressure: 'RBI queried FinTrust on breach — 3-hour executive response required',
            },
            videoForensicVerdict: 'CERT-IN deepfake forensics team confirmed synthetic: spectral analysis + liveness failure.',
        },
        [
            'PR wire spoofing: compromised PR agency credentials → BusinessWire India used as legitimate distribution channel',
            'CISO public footage: 3 conferences + 1 CNBC interview → sufficient voice + face training data for deepfake',
            'Professional production: FinTrust branded set replicable from office tour photos / conference backdrop images',
            'Journalist amplification: 3 publications without deepfake verification — media latency before correction enables market impact',
            'Short position pre-positioning: ₹23 crore PUT options 72h prior → market manipulation with foreknowledge of disinformation release',
            'Customer churn: 847 closures → real financial loss from fabricated breach',
            '14% stock drop: market impact from synthetic content — reputational attack achieving financial damage without real breach',
        ],
        {
            attackType: 'Deepfake Disinformation — Synthetic CISO Press Release for Market Manipulation',
            threatLevel: 'Critical',
            tasks: [
                'The 14% stock drop was enabled by ₹23 crore in PUT options pre-positioned 72 hours before the video release. Map the full market manipulation scheme: what information would the attacker need about FinTrust\'s market characteristics to size the short position, and how does SEBI\'s market surveillance system typically identify this pattern?',
                'Three financial journalists published the story without deepfake verification. Design a "synthetic media verification protocol" for financial journalists covering listed company disclosures — what technical and process checks should precede publication of any executive statement video?',
                'CERT-IN deepfake forensics identified 4 artifacts. Explain the technical forensic methodology behind spectral/liveness analysis for voice deepfakes and video frame analysis for face deepfakes — at a level suitable for training non-technical management on detection capability.',
                'The real CISO\'s video footage was harvested from 3 conferences and 1 CNBC interview. Propose a "CISO appearance protocol" that limits training data availability while not unreasonably restricting professional representation.',
                'Write the crisis communication playbook for the first 90 minutes after a deepfake press release is discovered — including: regulatory contacts, media retraction request procedure, stock exchange communication, and customer messaging.',
            ],
        },
        {
            marketManipulation: '₹23 crore short position + 14% stock drop = market manipulation proceeds — SEBI investigation and potential criminal liability',
            reputationalDamage: '3 major publication pickup + 14K social impressions — retraction reaches 30% of original audience on average',
            customerLoss: '847 account closures — ₹X crore AUM reduction + CASA balance loss',
        },
        'phishing',
        'VERDICT: Deepfake Disinformation + Market Manipulation — Synthetic CISO Video. 14% Stock Drop. ₹23 Crore Short Position. CRITICAL.\n\nCriminal Exposure: Market manipulation via synthetic disinformation — SEBI Securities Fraud, IPC Section 420, IT Act 2000 Section 66D.\n\nImmediate Crisis Playbook:\n(1) t+0: Issue official denial on company website + NSE/BSE exchange notice.\n(2) t+15: Contact BusinessWire India to withdraw press release.\n(3) t+15: Request urgent retraction from ET Markets, and other publishers.\n(4) t+30: CERT-IN deepfake forensics report to SEBI as evidence.\n(5) t+60: Customer communication via verified SMS/email from registered sender.\n(6) t+6h: RBI response with official breach status (no breach confirmed).\n\nPrevention: Executive deepfake insurance (emerging product). C-suite appearance database with biometric baselines for rapid forensic comparison. SEBI disclosure: register official press release channels — any other channel is unauthorized.'
    ),

    mkLab(
        'SocEng Exp - APT Recruitment via Compromised Professional Network',
        9,
        'An APT systematically identifies and recruits 3 employees across FinTrust Corp\'s IT, Finance, and Risk functions using a compromised professional headhunting firm (Korn Ferry India partner account). Over 5 months, the three recruits — believing they are negotiating genuine job offers — share internal org charts, technology roadmaps, and live screenshots of internal dashboards. When one recruit is offered a ₹42 lakh package and asked to "demonstrate commitment" by exporting the customer database, the scope of the operation is discovered.',
        {
            type: 'recruitment_operation_forensic',
            headhunterCompromise: {
                firm: 'Korn Ferry India — legitimate executive search firm',
                compromisedAccount: 'Partner-level recruiter account — credentials obtained via spear phishing attack on the firm',
                emailDomain: 'kornferry.com (LEGITIMATE — not spoofed)',
            },
            recruitedEmployees: [
                {
                    name: 'Employee A — IT Infrastructure Lead',
                    informationShared: 'Network topology diagram (shared as "evidence of scope and scale of current role"), firewall vendor names, VPN architecture',
                    over: '7 weeks of communication',
                },
                {
                    name: 'Employee B — Finance Operations Manager',
                    informationShared: 'Q4 financial projections (shared as "context for level of responsibilities"), SWIFT system access confirmation, treasury management vendor',
                    over: '9 weeks of communication',
                },
                {
                    name: 'Employee C — Risk Analyst',
                    informationShared: 'RBI audit response documents ("shared for discussion of regulatory experience"), pending risk items, upcoming penetration test schedule',
                    over: '11 weeks',
                },
            ],
            triggerEvent: 'Employee C offered ₹42 lakh CTC + asks for "sample customer data export" as proof of database access → Employee C escalates to CISO instead of complying → investigation begins',
            durationBeforeDiscovery: '5 months',
        },
        [
            'Legitimate headhunting firm account: emails from kornferry.com with real recruiter display name — indistinguishable from genuine process',
            'Normalized information sharing: job applicants routinely share role context — attackers exploit the "demonstrate your experience" norm',
            'Three-function coverage: IT + Finance + Risk = complete organizational intelligence across all critical control functions',
            'Network topology: shared by Employee A as "scope evidence" — attack surface map for subsequent intrusion',
            'RBI audit documents: shared by Employee C — regulatory compliance posture fully exposed',
            '5-month operation: patient, multi-target, multi-function — nation-state or sophisticated APT dwell',
            'Discovery via escalation: Employee C escalated rather than complying — single escalation decision stopped the operation',
        ],
        {
            attackType: 'APT Recruitment Operation — Compromised Headhunter for Multi-Function Organizational Intelligence Harvest',
            threatLevel: 'Critical',
            tasks: [
                'Map the intelligence harvested from all three employees to the specific attack capabilities it enables: for each data category (network topology, SWIFT access, RBI audit docs), describe the targeted attack it directly enables against FinTrust Corp.',
                'Job recruitment is a social norm that makes information sharing feel appropriate. Design a "recruitment security policy" that employees must follow for sharing any work-related information during job search processes — without making the policy so restrictive it prevents legitimate job searching.',
                'The operation ran for 5 months across 3 employees without detection. Design an insider threat behavioral analytics (UEBA) model that would detect information sharing across multiple employees in advance of the trigger event — what signals would the model correlate?',
                'Employee C\'s escalation stopped the operation. Design a security culture program specifically targeting the "escalation instinct" — how do you build a culture where Employee C\'s response (escalate rather than comply) is the default?',
                'The headhunting firm\'s partner account was compromised. What is FinTrust Corp\'s vendor security obligation regarding the security posture of executive search firms that interact with sensitive employee populations?',
            ],
        },
        {
            strategicIntelligence: 'Network architecture + SWIFT access + RBI audit posture = complete attack enablement package for infrastructure intrusion',
            regulatoryExposure: 'RBI audit documents shared externally — pending regulatory items exposed to adversary',
            operationalRisk: 'Upcoming penetration test schedule known (Employee C) — attacker can time operations to avoid detection',
        },
        'phishing',
        'VERDICT: APT Recruitment Operation — 5 Months. 3 Functions. Complete Organizational Intelligence. CRITICAL.\n\nIntelligence Package: Network topology + SWIFT confirmation + RBI audit posture = sufficient for targeted infrastructure attack.\n\nNation-State Indicators: Multi-function targeting of IT/Finance/Risk simultaneously + 5-month patience + legitimate firm account compromise = sophisticated APT (not opportunistic).\n\nImmediate: (1) Rotate all disclosed technical intelligence (VPN architecture, firewall vendor, network topology — update where feasible). (2) Move upcoming penetration test schedule to undisclosed window. (3) Notify Korn Ferry India of account compromise. (4) CERT-IN APT notification. (5) Brief all 3 employees — assess scope beyond disclosed information.\n\nRecruitment Policy: Employees in sensitive roles (IT/Finance/Risk/CISO) must notify security team of any active job search and all external information sharing requests — not as surveillance but as security partnership.'
    ),

    mkLab(
        'SocEng Exp - SIM Swap + Account Takeover: Coordinated Financial Infrastructure Attack',
        8,
        'An APT conducts simultaneous SIM swaps on 4 FinTrust Corp executives (CFO, CTO, CISO, IT Director) by compromising 4 different carrier customer service representatives through separate social engineering channels. Within a 22-minute window, all 4 SIM swaps complete, 4 banking portal 2FAs are defeated, administrative access to critical infrastructure is obtained, and ₹3.2 crore is transferred before the coordinated attack is detected. The coordination of 4 simultaneous carrier compromises indicates nation-state infrastructure.',
        {
            type: 'coordinated_sim_swap_carrier_log',
            attackTimeline: [
                { time: '14:00', action: '4 carrier calls initiated in parallel — 4 different attacker operators calling 4 different carrier regional offices' },
                { time: '14:11', action: 'Airtel SIM swap: CFO number — KBA passed (DOB + last 4 account digits)' },
                { time: '14:14', action: 'Jio SIM swap: CTO number — KBA passed (mother\'s maiden name + city of birth)' },
                { time: '14:17', action: 'BSNL SIM swap: CISO number — KBA passed (DOB + first school name)' },
                { time: '14:22', action: 'Vodafone SIM swap: IT Director — KBA passed (account security question: "pet name")' },
                { time: '14:23', action: 'Banking portal: CFO 2FA defeated → ₹3.2 crore initiated to 3 new payees' },
                { time: '14:25', action: 'Infrastructure access: CISO mobile used for IT system 2FA → cloud management console accessed' },
                { time: '14:29', action: 'CTO mobile: GitHub enterprise 2FA → developer environment accessed' },
                { time: '14:38', action: 'IT Director: VPN 2FA → internal network access established' },
                { time: '14:42', action: 'SOC correlation: 4 executives simultaneously offline + 4 banking/IT alerts → incident declared' },
                { time: '14:51', action: '₹2.1 crore of ₹3.2 crore held by bank. ₹1.1 crore transferred to mule accounts.' },
            ],
            coordinationEvidence: {
                simultaneousSwaps: '4 carriers × 4 regional offices × 4 operator teams in 22 minutes = coordinated parallel operation',
                kbaSourcesPerPerson: 'Each executive\'s KBA answers sourced from distinct combination: LinkedIn, genealogy sites, breach databases, social media',
            },
        },
        [
            '4-carrier parallel operation: requires 4 simultaneous operator teams — nation-state resource level',
            '22-minute window: attacker exploited the 20-30 minute delay before victims notice signal loss',
            'Different carriers, different KBA systems: attacker had pre-researched KBA answers for all four executives on all four carriers',
            'Banking + infrastructure + dev + network: 4 executives = 4 different system access vectors attacked in parallel',
            'SOC correlation: signal saving factor — 4 simultaneous executive offline events triggered correlation alert',
            '₹1.1 crore irrecoverable: even with fast detection, 12-minute dwell sufficient for partial fund transfer',
            'Nation-state resource: 4 parallel carrier social engineering teams + multi-week OSINT per executive = significant investment',
        ],
        {
            attackType: 'Coordinated Nation-State SIM Swap — Simultaneous 4-Executive Carrier Compromise',
            threatLevel: 'Critical',
            tasks: [
                'Attribute this attack to a nation-state actor vs. organized cybercriminal group: what specific operational characteristics (team size requirement, OSINT depth, target selection rationale) distinguish nation-state from financially motivated actors in this scenario?',
                'The coordinated 22-minute window exploits the gap between SIM swap completion and victim notification. Design a carrier-level SIM swap fraud prevention control that closes this window to under 2 minutes for enterprise customers.',
                'SMS 2FA for banking, cloud consoles, enterprise VPN, and developer environments was simultaneously defeated. Write a board-level memo recommending migration from SMS 2FA to FIDO2 hardware keys, including: risk quantification, implementation timeline, and cost justification.',
                'SOC correlation of 4 simultaneous executive offline events triggered the alert. Formalize this as a SIEM detection rule: define the exact event sources, thresholds, time window, and automated response actions.',
                'Design a "Continuity of Security Operations" plan for the scenario where CISO + CTO + CFO + IT Director are simultaneously unreachable — who assumes decision-making authority for security incidents, and via what pre-established protocol?',
            ],
        },
        {
            simultaneousAccess: '4 system domains accessed in 22 minutes: banking, cloud infrastructure, developer environment, internal network',
            financialLoss: '₹1.1 crore transferred — ₹2.1 crore held',
            infrastructureAccess: 'Cloud management console + GitHub enterprise + VPN = infrastructure, code, and network access simultaneously',
        },
        'phishing',
        'VERDICT: Nation-State Coordinated SIM Swap — 4 Executives, 4 Carriers, 22 Minutes. Infrastructure + Financial Systems Accessed. CRITICAL.\n\nNation-State Attribution: 4 parallel teams with per-executive OSINT packages across multiple carriers + coordinated 22-minute execution = Tier 1 nation-state (cybercriminal ROI insufficient for this investment).\n\nImmediate: (1) Force FIDO2/YubiKey for all C-suite authentication — no SMS 2FA. (2) Rotate all credentials accessed via compromised 2FA. (3) Review all transactions and system changes in 22-minute window. (4) CERT-IN APT notification + RBI cyber incident report. (5) Carrier notification: register PORT-OUT PIN on all C-suite numbers.\n\nBoard Action: Enterprise FIDO2 migration for all privileged users (C-suite + IT admin) — 30-day implementation target. Estimated cost: ₹12 lakh for hardware keys vs. ₹1.1 crore loss + remediation cost.'
    ),

    mkLab(
        'SocEng Exp - Long-Term Mole: IT Admin Recruited by Foreign Intelligence',
        9,
        'A FinTrust Corp network administrator is recruited at an academic conference in Singapore by an individual presenting as a think tank researcher. Over 24 months, the administrator — believing he is a paid "cybersecurity consultant" for a legitimate research organization — provides periodic intelligence updates: network diagrams, patch schedules, active directory structure, and ultimately, emergency access credentials created at the attacker\'s request. The operation is discovered during a routine CI (counter-intelligence) interview as part of a security clearance renewal.',
        {
            type: 'counter_intelligence_investigation_report',
            recruitmentTimeline: [
                { month: 0, event: 'Singapore conference: "think tank researcher" approaches admin at networking dinner — common interest in network resilience research' },
                { month: 2, event: 'First payment: ₹85,000 via Singapore bank transfer for "network architecture consultation paper"' },
                { month: 4, event: 'Gradually escalating requests: network diagrams shared as "anonymized case studies"' },
                { month: 8, event: 'Admin informed by recruiter that the "research has commercial value" — payments increase to ₹1.5L/quarter' },
                { month: 14, event: 'Admin asked to provide FinTrust\'s active directory domain structure — delivers via encrypted email' },
                { month: 19, event: 'Request to create "dormant emergency access account" for "disaster recovery research" — admin creates svc_drbackup02 with domain admin rights' },
                { month: 24, event: 'Security clearance renewal CI interview: investigator notes unexplained income, foreign bank transfers — admin interviewed' },
            ],
            adminProfile: {
                yearsAtFinTrust: 9,
                clearanceLevel: 'Internal sensitive — network infrastructure access',
                financialProfile: 'No prior financial stress indicators before month 0 — lifestyle inflation beginning month 6',
                psychologicalProfile: 'High intellectual curiosity, underappreciated by management, interest in academic collaboration',
            },
            operationalDamage: {
                networkDiagrams: '7 progressive network architecture exports over 24 months',
                adStructure: 'Full active directory domain structure with OU hierarchy',
                emergencyAccount: 'svc_drbackup02: domain admin, never used by FinTrust, presumably used by handler — no login audit performed',
                patchSchedules: '8 quarterly patch schedules — 24 months of patch history and scheduling',
            },
        },
        [
            '24-month operation: longest social engineering campaign in this curriculum — extreme patience indicates state-level objective',
            'Conference recruitment: low-pressure, intellectual context — admin felt valued and intellectually engaged',
            'Gradual escalation: small tasks → research paper → network diagrams → AD structure → emergency account (boiling frog)',
            'Foreign bank transfer: financial signature in banking records — CI interview key detection mechanism',
            'Emergency account svc_drbackup02: created by insider — persistent domain admin access at attacker\'s direction',
            'Lifestyle inflation: month 6 lifestyle change visible in financial profiling — early detection indicator missed',
            '"Underappreciated" profile: attacker identified management recognition gap — filled with intellectual flattery and financial compensation',
        ],
        {
            attackType: 'Foreign Intelligence Mole Recruitment — 24-Month Network Administrator Intelligence Operation',
            threatLevel: 'Critical',
            tasks: [
                'The admin was recruited due to psychological vulnerabilities: intellectual curiosity + underappreciation + financial receptivity. Design a "personnel security psychological profiling program" for employees in privileged technical roles that identifies and mitigates these vulnerabilities before recruitment — without creating a surveillance culture.',
                'The admin created svc_drbackup02 (domain admin) at handler\'s request at month 19. Design the privileged account governance control that would have detected: (a) account creation without a CAB ticket, (b) a domain admin account that has never logged in, (c) an account created by a non-IAM administrator.',
                'Financial intelligence is the key detection mechanism here (foreign bank transfers). Design a proportionate financial monitoring program for privileged employees that is legally compliant under Indian labor law — what can be monitored, and with what consent framework?',
                'The 24-month operation produced 7 network diagrams progressively. How would a "data minimization + classification" program have limited the intelligence value of each deliverable — if the admin only had access to what he needed for his current task, what would he have been unable to share?',
                'Write the counter-intelligence incident response playbook: what happens in the 72 hours after the CI interview discovers the mole — including the admin\'s access status, forensic scope, law enforcement coordination, and organizational communication strategy.',
            ],
        },
        {
            persistentAccess: 'svc_drbackup02: domain admin — may have been used by handler for 5 months (months 19-24). Full scope unknown.',
            intelligencePackage: '24 months of progressive network intelligence — attacker has complete historical picture of infrastructure evolution',
            nationalSecurityRisk: 'Foreign intelligence operation against financial institution — RAW/IB notification required',
        },
        'phishing',
        'VERDICT: Foreign Intelligence Mole — 24-Month Privileged Admin Operation. Domain Admin Account Created for Handler. CRITICAL + NATIONAL SECURITY.\n\nLaw Enforcement: Immediate IB (Intelligence Bureau) + CBI notification — foreign intelligence operation against financial infrastructure.\n\nImmediate Security: (1) Revoke admin\'s all access — escorted removal. (2) Disable svc_drbackup02 + complete audit of all logins + actions. (3) Rotate all network infrastructure credentials. (4) Assume handler has had domain admin access for 5 months — full AD forensics.\n\nOrganizational: This is a national security incident, not a corporate IT incident. Engage under national security protocol. Legal counsel + government affairs involvement required.\n\nPersonnel Security Controls: (1) CI interviews every 2 years for privileged roles — with financial disclosure requirements. (2) Unexplained income reporting as condition of employment for sensitive roles. (3) Peer reporting culture: colleagues should report sudden lifestyle changes without stigma.'
    ),

    mkLab(
        'SocEng Exp - AI-Powered Spear Phishing at Scale: LLM-Generated Targeted Campaign',
        8,
        'An APT uses a fine-tuned LLM to generate 312 hyper-personalized spear phishing emails targeting every employee at FinTrust Corp. Each email is unique — referencing the recipient\'s recent LinkedIn posts, correct manager names, specific project names obtained from GitHub/public repositories, and local cultural context (regional language, festival references). The campaign achieves a 34% click rate (vs. 3% industry average for generic phishing). The LLM also dynamically generates follow-up emails based on each recipient\'s response pattern.',
        {
            type: 'ai_phishing_campaign_forensic',
            campaignStats: {
                totalSent: 312,
                clickRate: '34% (106 employees)',
                credentialsCaptured: 67,
                malwareInstalled: 23,
                industryBenchmark: '3% click rate for template phishing, 14% for manual spear phishing',
            },
            aiGenerationIndicators: {
                personalizationSources: ['LinkedIn posts (scraped)', 'GitHub commit messages (project names, code context)', 'Twitter/X activity', 'Company blog author credits', 'Regional news (local festival Ganesh Chaturthi referenced for Maharashtra employees)'],
                uniqueness: '312 unique email bodies — no two identical, defeating signature-based detection',
                followUpAdaptation: 'For recipients who clicked but did not submit credentials: AI generated follow-up "technical issue" email 48h later',
                languageVariants: '3 emails in Marathi, 7 in Tamil with English hybrid — matching employee regional background from LinkedIn',
            },
            emailExamples: [
                {
                    recipient: 'Suresh (Finance, Pune)',
                    subject: 'Quick Q on the Q4 variance report — from Anand sir',
                    body: 'Suresh, Anand sir asked me to follow up on the Q4 variance item you flagged last week. The FY26 review link seems to be expiring — can you re-authenticate here? [phishing link]',
                },
                {
                    recipient: 'Priya (DevOps, Chennai)',
                    subject: 'GitHub action failed on the fintech-api-gateway pipeline',
                    body: 'Hi Priya, the CD pipeline for fintech-api-gateway is failing post your recent commit. Jenkins token needs re-auth — [phishing link]. Happy Pongal week! 🙏',
                },
            ],
            detectionChallenge: 'Each email unique — no template match. Context accurate — not flagged as suspicious by SEG. Only detectable by link analysis or behavioral anomaly.',
        },
        [
            'LLM generation: 312 unique emails — defeats all signature and template-matching email security',
            '34% click rate: 11x industry benchmark for generic phishing, 2.4x for manual spear phishing',
            'GitHub scraping: commit messages + repo names used as context — developers\' most trusted channel weaponized',
            'Regional language + festival context: Tamil/Marathi hybrid + "Happy Pongal" = maximum regional authenticity',
            'Follow-up adaptation: AI monitors response and generates follow-up based on victim behavior — adaptive attack',
            '67 credentials captured: high-value access across Finance, DevOps, HR, Risk functions',
            'Detection challenge: URL analysis is the only viable SEG control — all contextual signals are accurate',
        ],
        {
            attackType: 'AI-Powered LLM Spear Phishing at Scale — 34% Click Rate Campaign',
            threatLevel: 'Critical',
            tasks: [
                'Compare the detection challenge of AI-generated personalized phishing vs. template phishing: for each SEG control category (signature matching, heuristic scoring, sandbox, link analysis, behavioral UEBA), assess whether and how it detects AI-generated phishing, and what residual detection gap remains.',
                'GitHub public repository scraping was used to personalize emails for developers. Design a "developer OPSEC" policy that limits publicly accessible project intelligence without restricting legitimate open-source participation.',
                'The campaign achieved 34% click rate with LLM personalization vs. 3% baseline. Quantify the organizational risk amplification: if 3% click rate generates X incidents per year, what does 34% imply, and what security control investment is justified to close this gap?',
                'Design a real-time AI phishing detection model that can identify LLM-generated phishing without relying on signature matching — what linguistic, metadata, or behavioral signals would the model use, and what is the expected false positive rate?',
                'Write the post-campaign incident response procedure for 67 credential captures across multiple organizational functions — including prioritization framework (which accounts to remediate first), credential reset sequencing, and business continuity during the remediation window.',
            ],
        },
        {
            credentialCaptures: '67 credentials across Finance, DevOps, HR, Risk — high-privilege functions',
            malwareInstalls: '23 endpoints compromised — C2 beacons established',
            feedbackLoop: 'AI adaptive follow-up: ongoing campaign until credentials submitted or link expires',
        },
        'phishing',
        'VERDICT: AI LLM Phishing Campaign — 312 Unique Emails. 34% Click Rate. 67 Credentials Captured. 23 Malware Installs. CRITICAL.\n\nNew Threat Paradigm: AI eliminates the scaling limit of spear phishing — 312 manual spear phishing emails would require ~400 hours of attacker work. LLM generates them in <2 hours.\n\nImmediate: (1) Force password reset for all 67 captured credentials. (2) Isolate 23 endpoints + EDR forensics. (3) MFA: migrate all accounts to TOTP/FIDO2 — credential alone insufficient after reset.\n\nStrategic Controls:\n(1) Simulated AI phishing: run quarterly AI-generated phishing simulation — train employees to suspect highly personalized emails.\n(2) GitHub OPSEC policy: internal project names in commit messages flagged for review.\n(3) SEG: link analysis + UEBA behavioral detection (sudden credential submission pattern).\n(4) Employee training: "the more personal the email, the more suspicious you should be" — invert the trust heuristic.'
    ),

    mkLab(
        'SocEng Exp - Physical Penetration: APT Red Team vs. Tier-1 Data Center',
        8,
        'A nation-state-linked red team (later identified as APT) achieves physical access to FinTrust Corp\'s Tier-1 co-location data center through a 4-phase physical social engineering operation: (1) Conference OSINT to identify the data center facility manager. (2) LinkedIn pretext with the manager over 6 weeks. (3) Physical impersonation at the facility using a corporate badge replica and forged letterhead. (4) Tailgating through the inner mantrap using social grace. The team spends 4 hours undetected and plants 3 persistent devices before departure.',
        {
            type: 'physical_apt_red_team_forensic',
            phases: [
                {
                    phase: 1,
                    name: 'OSINT',
                    actions: 'Conference speaker list + LinkedIn: identified facility operations manager Rajan Pillai. Mapped his LinkedIn connections for warm introduction angle. Found his professional interests (cricket, AWS certifications).',
                },
                {
                    phase: 2,
                    name: '6-Week LinkedIn Pretext',
                    actions: '"Cloud infrastructure enthusiast" persona connected with Rajan. Discussed AWS, shared useful links, built rapport. Obtained: data center layout hints ("we have 8 rows of Tier-3 racks"), security vendor name (Genetec CCTV), badge system (HID Origo), maintenance window preference (Saturday mornings).',
                },
                {
                    phase: 3,
                    name: 'Physical Approach',
                    actions: 'Saturday 09:30: team of 2 arrives with: (a) Badge replica using HID Origo cloning (card skimmer placed near turnstile 3 weeks prior). (b) Forged letterhead from FinTrust Corp IT (CISO signature extracted from public PDF). (c) Equipment case labeled "Cisco TAC — On-Site Maintenance". Security: verified letterhead, called IT manager (voicemail — Saturday), issued visitor badge.',
                },
                {
                    phase: 4,
                    name: 'Mantrap Bypass',
                    actions: '2nd security checkpoint (mantrap): security guard saw only 1 person on monitor but 2 entered. Attacker ahead waited inside → held door with social smile. Guard did not challenge.',
                },
            ],
            devicesImplanted: [
                'Raspberry Pi 4 (covert AP): Rack 3 — Finance segment network tap',
                'USB HID keylogger: Server room KVM switch keyboard port',
                'Cellular LTE implant: concealed in ceiling tile above server row 7 — exfil via 4G, no WiFi dependency',
            ],
            detectionEvent: 'Security Operations review of Saturday CCTV 3 days later: 2 individuals in mantrap photo vs. 1 on badge log',
        },
        [
            '4-phase long-chain attack: OSINT → rapport → impersonation → physical bypass — each phase enables the next',
            'HID Origo cloning: card skimmer planted 3 weeks prior — persistence placement from earlier reconnaissance',
            'Saturday morning preference: elicited from LinkedIn conversation — optimal gap in security coverage',
            'IT manager voicemail: Saturday → no verification possible — social engineering of security guard\'s uncertainty',
            'Mantrap social bypass: "held the door with a smile" — human social grace defeats physical access control',
            'Cellular LTE implant: exfil via 4G — no internal network dependency, invisible to internal network monitoring',
            '3-day detection lag: CCTV review not real-time — 3 days of device activity before discovery',
        ],
        {
            attackType: 'APT Physical Penetration — 4-Phase Data Center Social Engineering Operation',
            threatLevel: 'Critical',
            tasks: [
                'Map all 4 phases of the attack to the physical security controls that could interrupt each phase — for each phase, identify: the specific control, its failure mode in this scenario, and the enhanced control that would have succeeded.',
                'The HID Origo card skimmer was planted 3 weeks before the attack. Design a "physical device sweep" program for a data center environment that would detect a card skimmer within 72 hours of placement.',
                'The cellular LTE implant is in a ceiling tile — no WiFi, no internal network connection. Design the RF detection capability that would identify this device within the data center environment — what equipment, frequency sweep range, and operational procedure?',
                'The mantrap was bypassed by social grace — the guard did not challenge tailgating. Write the physical security training protocol for security guards at high-security data centers: specifically, how to handle "held-door" situations without creating confrontational scenarios.',
                'Write the APT physical penetration attribution report (4 paragraphs) for this operation — assessing actor tier, resource investment, strategic objective, and recommended national-level response to the incident.',
            ],
        },
        {
            physicalImplants: '3 persistent devices: network tap (Finance segment) + KVM keylogger + LTE exfil — all operational until discovered',
            financialDataExfil: 'Finance segment network tap: all Finance floor traffic captured — SWIFT, treasury, banking portal traffic in scope',
            keylogCapture: 'KVM keyboard keylogger: server room admin keystrokes captured — potential admin credential harvest',
        },
        'phishing',
        'VERDICT: APT Physical Penetration — 4-Phase Operation. 3 Persistent Devices Implanted. Finance Segment Compromised. CRITICAL + NATIONAL SECURITY.\n\nAPT Indicators: HID Origo cloner planted 3 weeks prior (prior access or recon visit), cellular LTE exfil (avoids network monitoring), 4-phase operation with 6-week OSINT — beyond criminal capability.\n\nImmediate:\n(1) Locate and remove all 3 devices (RF sweep + physical inspection).\n(2) Assume all Finance segment traffic captured — treat as compromised. Rotate all credentials used in Finance server room.\n(3) KVM keylogger: assume all admin credentials typed on affected KVM captured — immediate rotation of all server admin passwords.\n(4) Saturday coverage: review all Saturday visitor logs for card skimmer placement visit.\n(5) CERT-IN APT notification + Data Center physical security audit.\n\nPhysical Security Upgrades: (1) Mantrap: weight-based anti-tailgating sensor (detects 2 people in 1-person space). (2) Weekend coverage: dedicated security supervisor + 30-min physical patrol of all rows. (3) IT manager backup: all access verifications have a backup contact reachable on weekends.'
    ),

    mkLab(
        'SocEng Exp - Full-Spectrum APT: Combined Digital + Physical + Insider Operation',
        9,
        'A nation-state APT executes a full-spectrum coordinated attack against FinTrust Corp over 8 months: (1) Recruits a Finance operations employee via LinkedIn (month 1). (2) Uses the insider to obtain a legitimate IT change request approval window. (3) Conducts a targeted SIM swap on the CISO during the change window. (4) Uses the CISO\'s 2FA to access the cloud management console. (5) Deploys a rogue cloud instance with backdoor inside the production VPC. (6) The insider submits a fake "approved change request" covering the malicious deployment. The backdoor is active for 94 days before detection.',
        {
            type: 'full_spectrum_apt_case_study',
            attackPhases: [
                {
                    month: 1,
                    phase: 'Recruit',
                    action: 'Insider recruited: Finance Ops employee contacted via LinkedIn "research opportunity" → ₹2.5L/year payments begin',
                },
                {
                    month: 3,
                    phase: 'Intelligence',
                    action: 'Insider provides: IT change management schedule, CISO mobile number, cloud account IDs, change window dates (when scrutiny is lowest)',
                },
                {
                    month: 5,
                    phase: 'SIM Swap',
                    action: 'CISO SIM swap: Thursday 23:45 (late-night during planned change window) — CISO\'s Airtel number compromised. CISO asleep — signal loss unnoticed.',
                },
                {
                    month: 5,
                    phase: 'Cloud Access',
                    action: '00:10: CISO 2FA via stolen SIM → AWS management console → production VPC accessed. Rogue t3.medium EC2 instance deployed: ami-0backdoor-prod, SG rule: allow 0.0.0.0/0:4444',
                },
                {
                    month: 5,
                    phase: 'Cover',
                    action: '00:35: Insider submits CAB ticket CHG-4892: "Approved performance monitoring instance deployment" — retroactively covers the rogue EC2 with plausible change record',
                },
                {
                    month: 8,
                    phase: 'Detection',
                    action: 'Routine AWS cost anomaly alert: $847/month unrecognized EC2 instance → security review → rogue VPC instance found → 94-day dwell confirmed',
                },
            ],
            instanceForensics: {
                amiId: 'ami-0e2b7d1a4c5f6a2b8 (custom — not from AWS Marketplace)',
                securityGroup: 'sg-backdoor: TCP 4444 open to 0.0.0.0/0',
                outboundConnections: 'Beaconing to 198.51.100.47:4444 every 6 hours — established 94-day C2 channel',
                dataExfiltrated: 'CloudTrail logs, S3 bucket contents (Financial reports, HR data), RDS snapshot (customer PII) — all downloaded via EC2 to C2',
            },
            cabRecord: 'CHG-4892 — insider submitted fraudulent change record at 00:35 providing cover for rogue instance',
        },
        [
            '8-month operation: full spectrum — insider + SIM swap + cloud access + cover story = multiple failsafe layers',
            'Change window timing: insider provided schedule — attack timed to lowest monitoring scrutiny (Thursday midnight)',
            'SIM swap at 23:45: CISO asleep — 00:10 detection window = zero effective alert',
            'Rogue EC2 in production VPC: same VPC as production = flat network access to all production resources',
            'CAB ticket cover: insider created retroactive change record — passes first-line audit without forensic scrutiny',
            'Security group 0.0.0.0/0:4444: critical misconfiguration indicator — production SG should never allow internet-accessible custom port',
            'Cost anomaly detection: $847/month → saved by financial monitoring when security controls failed',
        ],
        {
            attackType: 'Full-Spectrum APT — 8-Month Combined Insider + SIM Swap + Cloud Backdoor Operation',
            threatLevel: 'Critical',
            tasks: [
                'Map all 6 attack phases to the defensive control that SHOULD have interrupted each phase — for each, explain the specific control failure and the enhanced control design. Present as a structured kill chain disruption analysis.',
                'The rogue EC2 was deployed inside the production VPC with security group TCP 4444:0.0.0.0/0. Design the AWS Security Hub + CloudTrail detection rules that would have triggered within 60 minutes of the rogue instance deployment.',
                'The CAB ticket CHG-4892 was submitted retroactively by the insider. Design a change management integrity control that makes retroactive change record creation detectable — including the audit trail, time-stamp validation, and approval verification controls.',
                'The 94-day dwell was detected by cost anomaly, not security controls. Conduct a gap analysis of FinTrust Corp\'s cloud security posture: what was missing from Cloud Security Posture Management (CSPM), CWPP, and CIEM that allowed 94-day undetected dwell in production VPC?',
                'This is the highest-complexity social engineering scenario in the curriculum. Write the board-level risk report (5 paragraphs): summarize the 8-month operation, assess national security implications, quantify data loss scope, and recommend the 3 highest-priority strategic security investments to prevent recurrence.',
            ],
        },
        {
            cloudDwell: '94 days — full production VPC access: RDS snapshots, S3 financials, CloudTrail (covered tracks)',
            dataExfiltrated: 'Customer PII (RDS snapshot), financial reports (S3), HR data (S3) — complete data estate exposure',
            coverAction: 'Fraudulent CAB record — any audit during 94-day window would have found a "valid" change record',
        },
        'phishing',
        'VERDICT: Full-Spectrum APT — 8-Month Operation. 94-Day Cloud Backdoor. Complete Data Estate Exfiltrated. CRITICAL + NATIONAL SECURITY.\n\nComplexity Peak: This scenario combines every attack category in the Social Engineering curriculum — insider, SIM swap, deepfake-equivalent (voice), cloud CIEM, change management fraud — into a single coordinated operation. No single control defeats it; defense-in-depth across all layers required.\n\nImmediate:\n(1) Terminate rogue EC2 + revoke all IAM permissions used during 94-day window.\n(2) RDS snapshot: assume customer PII compromised → DPDP Act breach notification.\n(3) Rotate CISO + all cloud admin credentials + SIM swap prevention (port-out PIN).\n(4) Insider: immediately revoke access + begin legal process + full interview.\n(5) CERT-IN + RBI + SEBI notification (financial data breach + potentially MNPI in S3).\n\nStrategic Investments:\n(1) Cloud detection: real-time CSPM + security group anomaly rules (any new 0.0.0.0/0 rule = immediate SOC alert).\n(2) UEBA: insider behavioral monitoring normalized for Finance Ops role.\n(3) FIDO2: eliminate SMS 2FA for all cloud admin access — SIM swap defeated at root.\n(4) Change management integrity: time-stamped CAB with manager out-of-band confirmation for all production changes.\n(5) Purple team: full-spectrum APT simulation annually — test all 6 kill chain phases simultaneously.'
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
        console.log(`  ✔ [EXP ${lab.difficulty}/10] ${lab.title}`);
    }

    const total = await Lab.countDocuments();
    console.log(`\n✅ Done — ${LABS.length} Social Engineering Expert labs upserted.`);
    console.log(`   🗄️  Total labs in DB: ${total}`);
    process.exit(0);
}

seed().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
