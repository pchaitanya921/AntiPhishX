import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, BookOpen, Zap, AlertTriangle, CheckCircle, Flag, Loader } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// ────────── QUESTION BANKS ──────────
const QUIZ_DATA = {
    q1: {
        id: 'q1', title: 'Phishing Detection Assessment', category: 'Phishing',
        difficulty: 'Intermediate', xp: 200, timeLimitSeconds: 900,
        questions: [
            { id: 1, question: 'Which of the following is the strongest indicator of a phishing email?', options: ['A personalised greeting with your name', 'A link where the domain mismatches the sender\'s organisation', 'A company logo in the email footer', 'An email with an unsubscribe link'], correct: 1, explanation: 'Attackers often use lookalike domains (e.g., paypa1.com) that visually resemble legitimate ones. Always hover over links to verify the actual destination URL.' },
            { id: 2, question: 'An email from "security-team@g00gle-support.net" asks you to verify your Google account. What should you do?', options: ['Click the link immediately to secure your account', 'Report it as phishing and delete it', 'Reply to the email asking for more details', 'Forward it to your team for advice'], correct: 1, explanation: 'The domain "g00gle-support.net" uses zero-for-O substitution (zero for the letter \'o\') — a common typosquatting technique. Legitimate Google emails always come from @google.com.' },
            { id: 3, question: 'Spear phishing differs from bulk phishing because it:', options: ['Uses SMS instead of email', 'Is targeted at a specific individual using personalised information', 'Relies on malware attachments only', 'Is sent in bulk to thousands of recipients'], correct: 1, explanation: 'Spear phishing attacks are highly targeted, often referencing the victim\'s name, job title, colleagues, or recent activities — making them significantly harder to detect.' },
            { id: 4, question: 'Which URL is MOST likely legitimate?', options: ['http://paypal.com.account-login.xyz/', 'https://www.paypal.com/login', 'https://paypal-secure.login.com/', 'http://secure-paypal.net/verify'], correct: 1, explanation: 'The only legitimate URL is https://www.paypal.com/login. The others are either missing HTTPS, have suspicious subdomains, or use lookalike domains to deceive users.' },
            { id: 5, question: 'What is a "pretexting" attack in the context of social engineering?', options: ['Sending bulk phishing emails', 'Creating a fabricated scenario to manipulate a victim into providing information', 'Installing malware via USB drives', 'Intercepting network traffic'], correct: 1, explanation: 'Pretexting involves fabricating a believable story (e.g., posing as IT support, a bank official, or an auditor) to trick victims into divulging sensitive information or granting access.' },
            { id: 6, question: 'An urgent email warns your account will be suspended in 24 hours unless you click a link. This is an example of:', options: ['A legitimate security notification', 'Authority and urgency manipulation tactics', 'A standard password reset flow', 'An automated compliance alert'], correct: 1, explanation: 'Creating artificial urgency is one of the most common social engineering tactics. Phishers use time pressure to prevent victims from thinking critically about the request.' },
            { id: 7, question: 'Which file attachment type is MOST commonly used to deliver malware in phishing emails?', options: ['.jpg image files', '.txt plain text files', '.docm Word files with macros enabled', '.mp4 video files'], correct: 2, explanation: 'Macro-enabled Office documents (.docm, .xlsm) are frequently weaponised by attackers. When opened, macros execute malicious code to download or install malware.' },
            { id: 8, question: 'What does the padlock icon (HTTPS) in a browser address bar guarantee?', options: ['The website is legitimate and safe', 'The connection between your browser and the server is encrypted', 'The site has been verified as phishing-free', 'Your personal data is protected from the website owner'], correct: 1, explanation: 'HTTPS only guarantees that the communication channel is encrypted. Phishing sites can and do obtain valid SSL certificates — the padlock does NOT mean the site is legitimate.' },
            { id: 9, question: 'Which action is BEST practice when receiving an unexpected invoice via email?', options: ['Pay it immediately to avoid late fees', 'Open the attachment to review the invoice details', 'Verify the invoice directly with the vendor using a known phone number', 'Forward to accounts payable without checking'], correct: 2, explanation: 'Business Email Compromise (BEC) often involves fraudulent invoice attachments. Always verify unexpected financial requests through an independent, verified communication channel.' },
            { id: 10, question: 'What is the primary goal of a phishing email?', options: ['To deliver software updates', 'To steal credentials, financial information, or install malware', 'To send marketing promotions', 'To test the organisation\'s spam filters'], correct: 1, explanation: 'Phishing attacks aim to steal sensitive information (passwords, credit cards, PII) or gain initial access to systems by tricking recipients into clicking malicious links or opening weaponised attachments.' },
        ]
    },
    q2: {
        id: 'q2', title: 'Vishing Countermeasures', category: 'Vishing',
        difficulty: 'Beginner', xp: 150, timeLimitSeconds: 600,
        questions: [
            { id: 1, question: 'What is "vishing"?', options: ['Phishing via email', 'Phishing via voice calls or VoIP', 'Phishing via SMS', 'Phishing via QR codes'], correct: 1, explanation: 'Vishing (Voice Phishing) uses phone calls or VoIP to deceive victims. Attackers often impersonate banks, government agencies, or tech support to extract sensitive information.' },
            { id: 2, question: 'You receive a call from "Microsoft Support" saying your computer has a virus. They ask for remote access. What should you do?', options: ['Grant them remote access immediately', 'Hang up — Microsoft never calls unsolicited about computer issues', 'Ask them to call back later', 'Give them your serial number to verify authenticity'], correct: 1, explanation: 'Microsoft, Apple, and other tech companies do NOT make unsolicited calls claiming your computer has a virus. This is a classic tech support scam designed to gain remote access or extract payment.' },
            { id: 3, question: 'A caller claims to be from your bank\'s fraud team and needs your OTP (One-Time Password) to "cancel a suspicious transaction." What should you do?', options: ['Provide the OTP to stop the fraud', 'Hang up and call your bank using the number on the back of your card', 'Ask them to send an email confirmation first', 'Give only the last 4 digits of the OTP'], correct: 1, explanation: 'Banks will NEVER ask for your OTP, PIN, or full card number over the phone. An OTP request from a "bank representative" is a definitive red flag for a social engineering attack.' },
            { id: 4, question: 'Which caller ID spoofing technique makes vishing attacks more convincing?', options: ['Using an unknown number', 'Displaying a legitimate organisation\'s real phone number', 'Calling from overseas numbers', 'Blocking the caller ID'], correct: 1, explanation: 'Caller ID spoofing allows attackers to display any phone number — including real numbers belonging to banks, government agencies, or companies. Never trust caller ID alone as proof of identity.' },
            { id: 5, question: 'What is "pretexting" in a vishing attack?', options: ['Recording the phone call', 'Creating a fabricated story (e.g., posing as an auditor) to manipulate the victim', 'Using automated robocalls', 'Spoofing the caller ID'], correct: 1, explanation: 'Pretexting involves crafting a believable scenario — such as posing as an IRS agent, IT support, or a compliance officer — to create a sense of authority and legitimacy that compels the victim to comply.' },
            { id: 6, question: 'A "government official" calls threatening arrest unless you pay via gift cards. What is this?', options: ['A legitimate government collection method', 'A vishing scam — government agencies never collect via gift cards', 'A standard debt recovery procedure', 'A bank verification call'], correct: 1, explanation: 'No government agency (IRS, police, customs) will ever demand payment via gift cards, cryptocurrency, or wire transfer as a condition to prevent arrest. This is always a scam.' },
            { id: 7, question: 'What should organisations do to reduce vishing risk at the corporate level?', options: ['Allow all incoming calls without screening', 'Train employees to verify callers via call-back to official numbers before sharing any information', 'Publish all employee phone numbers publicly', 'Route all calls through the CEO'], correct: 1, explanation: 'The most effective corporate countermeasure is employee training combined with verification protocols — always hang up and call back using the official number rather than any number provided by the caller.' },
        ]
    },
    q3: {
        id: 'q3', title: 'Advanced Payload Analysis', category: 'Technical',
        difficulty: 'Expert', xp: 350, timeLimitSeconds: 1800,
        questions: [
            { id: 1, question: 'In a multi-stage payload, what is the primary purpose of the "dropper" component?', options: ['Exfiltrate data to a C2 server', 'Execute the final ransomware payload directly', 'Download and install the actual malware payload while evading AV detection', 'Encrypt files on the victim machine'], correct: 2, explanation: 'A dropper is a lightweight initial delivery mechanism designed to bypass antivirus detection. It downloads or decodes the actual malicious payload (stage 2) from a remote C2 server after gaining initial access.' },
            { id: 2, question: 'Which obfuscation technique involves replacing readable code with equivalent but harder-to-analyse code to evade static analysis?', options: ['Polymorphism', 'Sandboxing', 'Whitelisting', 'Hashing'], correct: 0, explanation: 'Polymorphic malware changes its code structure (while preserving functionality) each time it replicates, making signature-based detection ineffective. Metamorphic malware goes further by completely rewriting itself.' },
            { id: 3, question: 'A phishing email contains a .lnk file. Why is this dangerous?', options: ['LNK files cannot be scanned by antivirus', 'LNK (Windows shortcut) files can execute arbitrary commands when opened, often used to download second-stage malware', 'LNK files always contain ransomware', 'LNK files disable Windows Defender automatically'], correct: 1, explanation: 'Windows .lnk shortcut files can be weaponised to run any command on the system (e.g., PowerShell, cmd.exe). Attackers often embed malicious commands that download and execute remote payloads when the shortcut is double-clicked.' },
            { id: 4, question: 'What is "living off the land" (LotL) in the context of cyberattacks?', options: ['Conducting attacks from rural IP addresses', 'Using legitimate system tools (e.g., PowerShell, WMI, certutil) to carry out malicious activities', 'Attacking agricultural infrastructure', 'Hiding malware in image metadata'], correct: 1, explanation: 'LotL attacks abuse built-in OS tools like PowerShell, WMI, BITS, certutil, and regsvr32 that are trusted by security software. This makes detection significantly harder since the tools themselves are legitimate.' },
            { id: 5, question: 'A macro in a Word document runs: "powershell -enc [Base64string]". What is this technique called?', options: ['SQL Injection', 'PowerShell encoded command execution for obfuscation', 'CSRF attack', 'Buffer overflow'], correct: 1, explanation: 'The -enc (or -EncodedCommand) flag in PowerShell accepts Base64-encoded commands, allowing attackers to obfuscate malicious script content from string-based detection and logging.' },
            { id: 6, question: 'What is a Command & Control (C2) server\'s primary function in a malware campaign?', options: ['Hosting phishing pages', 'Receiving stolen data and issuing commands to compromised machines (bots)', 'Scanning for open ports', 'Storing encryption keys for ransomware'], correct: 1, explanation: 'C2 servers act as the attacker\'s remote management infrastructure. Infected machines (bots) beacon out to the C2, receive commands (exfiltrate data, lateral move, deploy ransomware), and send back results.' },
            { id: 7, question: 'Which DNS technique do attackers use to exfiltrate data from air-gapped or heavily monitored networks?', options: ['DNS cache poisoning', 'DNS tunnelling — encoding data within DNS query strings', 'DNS hijacking', 'DNS amplification'], correct: 1, explanation: 'DNS tunnelling encodes exfiltrated data within DNS query hostnames (e.g., data.attacker.com). Since DNS traffic is often permitted through firewalls, this provides a covert exfiltration channel.' },
            { id: 8, question: 'When analysing a suspicious PDF, you find an embedded JavaScript that calls "/AcroForm". What is the risk?', options: ['The PDF contains a hidden watermark', 'The JavaScript can trigger automatic actions when the PDF opens, potentially exploiting PDF reader vulnerabilities', 'The PDF is encrypted', 'The PDF has a form that collects contact information'], correct: 1, explanation: 'Malicious PDFs often embed JavaScript that executes automatically on open. /AcroForm actions can trigger JavaScript to exploit unpatched PDF vulnerabilities, download payloads, or collect credentials silently.' },
        ]
    },
    q4: {
        id: 'q4', title: 'Social Engineering Defence', category: 'Social',
        difficulty: 'Intermediate', xp: 200, timeLimitSeconds: 900,
        questions: [
            { id: 1, question: 'What is "tailgating" in physical security?', options: ['Monitoring network traffic from a compromised router', 'Following an authorised person into a secure area without using your own credentials', 'Sending phishing SMS messages', 'Eavesdropping on phone calls'], correct: 1, explanation: 'Tailgating (or "piggybacking") is a physical social engineering technique where an attacker gains entry to a secured area by following closely behind an authorised employee, exploiting common courtesy.' },
            { id: 2, question: 'Which social engineering principle makes people comply because they believe others around them are also complying?', options: ['Authority', 'Social Proof (Conformity)', 'Scarcity', 'Reciprocity'], correct: 1, explanation: 'Social Proof exploits the human tendency to follow the crowd. Attackers say things like "everyone in your department has already verified their account" to make the target feel they should comply.' },
            { id: 3, question: 'An attacker leaves USB drives labelled "Confidential Salaries Q1" in a company car park. This is called:', options: ['Pretexting', 'Baiting', 'Vishing', 'Spear phishing'], correct: 1, explanation: 'Baiting uses physical or digital lures (malware-loaded USB drives, free downloads) to trigger curiosity. When an employee plugs in the USB, malware executes automatically.' },
            { id: 4, question: 'What does the Cialdini principle of "reciprocity" mean in social engineering?', options: ['Pretending to be a figure of authority', 'Creating urgency with a deadline', 'Making the target feel obligated to return a favour after receiving something of value', 'Building trust through repeated interaction'], correct: 2, explanation: 'Attackers exploit reciprocity by first giving something of value (e.g., free software, helpful information) to create a psychological obligation in the victim to return the favour by providing access or information.' },
            { id: 5, question: 'Which defensive training method best prepares employees for social engineering attacks?', options: ['Annual security policy readings', 'Simulated phishing/social engineering exercises with immediate feedback', 'Blocking all external email', 'Installing more firewalls'], correct: 1, explanation: 'Simulated exercises (phishing simulations, fake vishing calls) combined with immediate contextual feedback are proven to be significantly more effective than passive awareness training alone.' },
            { id: 6, question: 'An attacker calls an employee posing as "the new IT technician" and asks for their badge number to grant remote access. Which security principle does this violate?', options: ['Availability', 'Need-to-know and identity verification before disclosure', 'Data integrity', 'Redundancy'], correct: 1, explanation: 'This attack exploits the authority principle. The correct response is to never disclose credentials or grant access based on a phone request — always verify identity through official channels before sharing any information.' },
        ]
    },
    q5: {
        id: 'q5', title: 'QR Code & Quishing Attacks', category: 'QR Code',
        difficulty: 'Beginner', xp: 150, timeLimitSeconds: 600,
        questions: [
            { id: 1, question: 'What is "quishing"?', options: ['Phishing via email attachments', 'Phishing attacks that use malicious QR codes to redirect victims to fake websites', 'Phishing via SMS messages', 'Brute-force attacks on QR scanners'], correct: 1, explanation: 'Quishing (QR Code Phishing) embeds malicious URLs in QR codes. Because the URL is hidden inside the image, it bypasses most email URL scanners. Scanning redirects the victim to a credential-harvesting page or malware download.' },
            { id: 2, question: 'Why are QR code attacks particularly effective at bypassing corporate email security?', options: ['QR codes are encrypted by default', 'Email scanners analyse text and URLs but cannot easily decode and inspect URLs embedded inside QR code images', 'QR codes cannot be sent via email', 'Corporate firewalls block all QR code scanners'], correct: 1, explanation: 'Traditional email security gateways inspect links in the email body, but QR codes are image files. Most legacy scanners cannot extract and check the embedded URL, making quishing a highly effective bypass technique.' },
            { id: 3, question: 'A QR code on a restaurant table says "Scan to pay your bill." What should you verify before scanning?', options: ['The colour of the QR code', 'Whether the QR code is a physical sticker pasted over the original, and confirm the URL domain after scanning before proceeding', 'That the QR code has more than 100 modules (dots)', 'That the table has Wi-Fi'], correct: 1, explanation: 'Attackers physically place malicious QR stickers over legitimate ones in restaurants, car parks, and public spaces. Always check if a sticker has been placed over the original and verify the destination URL carefully after scanning.' },
            { id: 4, question: 'Which of the following is a strong sign that a scanned QR code is malicious?', options: ['The URL uses HTTPS', 'The URL redirects to a domain that mimics a known brand but uses a slightly different spelling or TLD', 'The QR code has error correction', 'The QR code was printed in black and white'], correct: 1, explanation: 'Lookalike domains (e.g., "paypa1.com", "amazon-pay.net") are the primary weapon in quishing attacks. Always verify the full URL before entering any credentials.' },
            { id: 5, question: 'An employee receives an email with a QR code claiming to be from HR asking them to re-verify benefits enrollment. What is the correct action?', options: ['Scan the QR code and enter credentials as requested', 'Report the email as suspicious and verify through the official HR portal directly', 'Forward to a colleague for a second opinion', 'Reply to the email asking for confirmation'], correct: 1, explanation: 'Any email requesting credential entry via a QR code should be treated as suspicious. Attackers impersonate HR and IT departments during high-engagement periods (open enrollment, tax season). Always verify through the official internal portal.' },
            { id: 6, question: 'What technical control can organisations deploy to detect quishing attempts in email?', options: ['Spam keyword filters', 'QR code scanning engines integrated into email security gateways that decode and analyse embedded URLs', 'Blocking all image attachments', 'Requiring email encryption'], correct: 1, explanation: 'Modern Secure Email Gateways (SEGs) increasingly include QR code decoders that extract embedded URLs and pass them through URL reputation engines, sandboxes, and phishing databases — the same analysis applied to plain-text URLs.' },
            { id: 7, question: 'Is it safe to scan a QR code from a PDF attachment in an email?', options: ['Yes, if the PDF is from a known sender', 'No — PDF attachments with QR codes are increasingly used to double-layer bypass email scanning, as the QR code is inside an attachment inside the email', 'Yes, PDFs are always screened by antivirus', 'Only if the PDF is signed digitally'], correct: 1, explanation: 'Embedding QR codes inside PDF attachments creates a double evasion layer. The email scanner doesn\'t check the attachment URL, and the PDF reader doesn\'t scan QR codes — making this an increasingly common quishing delivery method.' },
            { id: 8, question: 'Which best practice should individuals follow when using public QR codes (e.g., menus, parking meters)?', options: ['Scan and proceed immediately to save time', 'Use a QR scanner app that previews the URL before opening it, and manually verify the domain is correct', 'Never use QR codes', 'Only scan QR codes that have a logo on them'], correct: 1, explanation: 'QR scanner apps that show the embedded URL BEFORE opening it (preview mode) give you the opportunity to inspect the domain for typosquatting or suspicious paths before committing to navigate there.' },
        ]
    },
    q6: {
        id: 'q6', title: 'Malware Detection Fundamentals', category: 'Malware',
        difficulty: 'Intermediate', xp: 200, timeLimitSeconds: 900,
        questions: [
            { id: 1, question: 'What distinguishes a Trojan horse from a virus?', options: ['A Trojan replicates itself; a virus does not', 'A virus replicates itself; a Trojan disguises itself as legitimate software to trick users into installing it', 'A Trojan encrypts files; a virus deletes them', 'A virus spreads via USB; a Trojan spreads via email only'], correct: 1, explanation: 'A virus self-replicates and attaches to legitimate files. A Trojan does NOT self-replicate — it masquerades as useful software (games, utilities, installers) to trick users into voluntarily installing it, after which it performs malicious actions.' },
            { id: 2, question: 'What is the primary function of a keylogger?', options: ['Encrypt files for ransom', 'Record every keystroke to capture passwords, credit card numbers, and sensitive data', 'Disable antivirus software', 'Open a backdoor for remote access'], correct: 1, explanation: 'Keyloggers silently record everything typed on the keyboard and transmit logs to the attacker. They are commonly used in credential theft, banking fraud, and corporate espionage campaigns.' },
            { id: 3, question: 'Which type of malware remains hidden within legitimate processes, making it extremely difficult to detect?', options: ['Worm', 'Adware', 'Rootkit', 'Spyware'], correct: 2, explanation: 'Rootkits operate at the kernel or firmware level, hiding their presence from the OS and security tools. They intercept system calls to remove themselves from process lists and file directories, making conventional detection near-impossible.' },
            { id: 4, question: 'A file runs on a victim machine, encrypts all documents, and demands payment. What malware category is this?', options: ['Spyware', 'Adware', 'Ransomware', 'Worm'], correct: 2, explanation: 'Ransomware encrypts the victim\'s files (or entire drive) and demands payment (typically cryptocurrency) for the decryption key. Notable examples include WannaCry, Ryuk, LockBit, and REvil/Sodinokibi.' },
            { id: 5, question: 'What is "fileless malware"?', options: ['Malware stored in compressed archives', 'Malware that executes entirely in memory without writing files to disk, using legitimate OS tools for execution', 'Malware disguised as a PDF', 'Malware that deletes itself after execution'], correct: 1, explanation: 'Fileless malware lives in RAM and uses legitimate tools like PowerShell, WMI, or registry entries to execute. Since nothing is written to disk, file-based antivirus signatures fail. Detection requires memory forensics and behavioural analysis.' },
            { id: 6, question: 'Which behaviour is a strong indicator of a Command & Control (C2) beacon in network traffic?', options: ['HTTPS traffic to well-known CDN domains', 'Regular, periodic outbound connections to an unusual external IP on non-standard ports with consistent byte sizes', 'DNS queries for common websites', 'Large inbound file downloads'], correct: 1, explanation: 'C2 beaconing creates a distinctive periodic network pattern — infected hosts "phone home" at regular intervals (often with jitter to evade detection) to receive commands. Anomalous regularity in outbound connections is a key detection signal.' },
            { id: 7, question: 'What is the main purpose of sandboxing in malware analysis?', options: ['To encrypt suspicious files for safe storage', 'To execute suspicious files in an isolated virtual environment to observe behaviour without risking the real system', 'To delete suspicious processes automatically', 'To block all internet traffic from the suspicious file'], correct: 1, explanation: 'A sandbox is an isolated virtual environment where malware can be safely detonated. Analysts observe file system changes, registry modifications, network connections, and process creations to understand the malware\'s behaviour and capabilities.' },
            { id: 8, question: 'A worm differs from a virus primarily because:', options: ['A worm requires a host file; a virus does not', 'A worm self-propagates across networks autonomously without needing to attach to a host file', 'A worm only affects Linux systems', 'A worm encrypts files while a virus does not'], correct: 1, explanation: 'Worms are self-contained and self-replicating — they exploit network vulnerabilities (open ports, weak credentials) to spread automatically without any user interaction or host file attachment. WannaCry used the EternalBlue SMB exploit to spread as a worm.' },
            { id: 9, question: 'Which file extension combination is most often used to disguise malware in phishing emails?', options: ['.jpg and .png', '.docx and .exe hidden as "filename.pdf .exe" using right-to-left Unicode override', '.mp3 and .wav', '.html and .css'], correct: 1, explanation: 'Attackers use right-to-left Unicode override (U+202E) to reverse displayed filenames — "filename‮exe.pdf" appears as "filename.pdf" in Windows Explorer but is actually an executable. This is a classic double extension / RTLO trick.' },
            { id: 10, question: 'What does the MITRE ATT&CK framework provide for cybersecurity teams?', options: ['A list of all known malware hashes', 'A structured knowledge base of adversary tactics, techniques, and procedures (TTPs) based on real-world observations', 'A firewall rule set', 'A certified antivirus database'], correct: 1, explanation: 'MITRE ATT&CK catalogues real attacker behaviour into a matrix of Tactics (the "why" — initial access, execution, persistence) and Techniques (the "how" — spearphishing link, PowerShell, registry run keys), helping defenders detect and respond to threats.' },
        ]
    },
    q7: {
        id: 'q7', title: 'Password & Credential Security', category: 'Credentials',
        difficulty: 'Beginner', xp: 120, timeLimitSeconds: 600,
        questions: [
            { id: 1, question: 'Which of the following passwords is MOST secure?', options: ['Password123!', 'T#9kLm!2vQr$xW', 'p@ssw0rd', 'Admin2024'], correct: 1, explanation: 'T#9kLm!2vQr$xW is the strongest — it has 14 characters with uppercase, lowercase, numbers, and symbols, with no dictionary words or predictable patterns. Length and randomness are the primary factors in password strength.' },
            { id: 2, question: 'What is a "credential stuffing" attack?', options: ['Guessing passwords using a wordlist brute-force', 'Using username/password pairs leaked from one breach to attempt login on other services, exploiting password reuse', 'Installing a keylogger to capture credentials', 'Intercepting login forms using a man-in-the-middle proxy'], correct: 1, explanation: 'Credential stuffing automates the use of credentials leaked from one breach against hundreds of other sites. It\'s highly effective because ~65% of people reuse passwords. The defence is unique passwords per site, enforced by a password manager.' },
            { id: 3, question: 'What is the primary security benefit of Multi-Factor Authentication (MFA)?', options: ['It makes passwords longer', 'It requires a second verification factor (e.g., OTP, biometric) so a stolen password alone is insufficient to access the account', 'It encrypts stored passwords', 'It blocks all phishing attacks'], correct: 1, explanation: 'MFA adds a second authentication layer — even if an attacker obtains your password (via phishing, breach, or keylogger), they still cannot log in without the second factor (TOTP, push notification, hardware key). MFA blocks ~99.9% of automated credential attacks.' },
            { id: 4, question: 'Which MFA method is considered MOST secure against SIM-swapping attacks?', options: ['SMS OTP (one-time password via text message)', 'Hardware security keys (FIDO2/WebAuthn, e.g., YubiKey)', 'Email OTP', 'Software TOTP apps (e.g., Google Authenticator)'], correct: 1, explanation: 'Hardware security keys (FIDO2/WebAuthn) are phishing-resistant and immune to SIM-swapping — they use public key cryptography, domain-binding, and require physical presence. SMS OTP is the weakest MFA since SIM swaps can redirect messages to the attacker.' },
            { id: 5, question: 'Why should you use a different password for every website?', options: ['Websites require it by law', 'If one site is breached and your password is exposed, attackers cannot use it to access your other accounts (prevents credential stuffing)', 'It helps you remember passwords more easily', 'Websites share password databases with each other'], correct: 1, explanation: 'Password reuse amplifies the impact of any single breach. With unique passwords per site (managed by a password manager), a breach at site A reveals only that one password — your banking, email, and other accounts remain protected.' },
            { id: 6, question: 'What is a "pass-the-hash" attack in enterprise environments?', options: ['Cracking a hashed password offline using rainbow tables', 'Using a captured NTLM hash directly for authentication without needing to crack the plaintext password', 'Stealing a password by intercepting HTTPS traffic', 'Guessing passwords from a leaked database'], correct: 1, explanation: 'In Windows environments, NTLM hashes can be captured (via Mimikatz, Responder) and used directly for authentication — the attacker never needs to know the actual password. This is mitigated by Credential Guard, Protected Users group, and disabling NTLM.' },
            { id: 7, question: 'What is the recommended minimum password length according to modern security guidelines (NIST SP 800-63B)?', options: ['6 characters', '8 characters', '12+ characters', '20+ characters with mandatory symbols'], correct: 2, explanation: 'NIST SP 800-63B recommends a minimum of 8 characters for user-selected passwords, but strongly encourages longer passphrases (12+ characters). Critically, NIST no longer recommends mandatory complexity rules or frequent password rotation, as these encourage weaker, predictable passwords.' },
            { id: 8, question: 'A website stores your password as an unsalted MD5 hash. Why is this dangerous?', options: ['MD5 hashes are too long to store efficiently', 'Rainbow table attacks can instantly reverse unsalted MD5 hashes — a 6-character password can be cracked in milliseconds', 'MD5 has no known weaknesses', 'Unsalted hashes are encrypted], making them stronger'], correct: 1, explanation: 'Unsalted MD5 (and SHA-1) hashes are vulnerable to precomputed rainbow table attacks. A "salt" (random unique value per password) prevents rainbow tables and ensures identical passwords produce different hashes. Best practice is bcrypt, scrypt, or Argon2 for password storage.' },
        ]
    },
    q8: {
        id: 'q8', title: 'Ransomware Awareness & Response', category: 'Ransomware',
        difficulty: 'Expert', xp: 300, timeLimitSeconds: 1200,
        questions: [
            { id: 1, question: 'What is the typical first stage of a modern ransomware attack kill chain?', options: ['File encryption', 'Data exfiltration to the ransom group\'s servers', 'Initial access via phishing email, RDP exploit, or supply chain compromise', 'Deployment of the encryption payload'], correct: 2, explanation: 'Modern ransomware attacks follow the MITRE ATT&CK kill chain: Initial Access → Execution → Persistence → Privilege Escalation → Lateral Movement → Exfiltration → Impact (encryption). The attack often starts weeks before encryption begins.' },
            { id: 2, question: 'What is "double extortion" in ransomware attacks?', options: ['Encrypting both the primary and backup drives', 'Ransomware that demands two separate payments', 'Exfiltrating data before encrypting it, then threatening to publish it publicly if ransom is not paid', 'Using two different encryption algorithms'], correct: 2, explanation: 'Double extortion (pioneered by Maze ransomware in 2019) exfiltrates sensitive data before encryption. Even if victims restore from backups, they still face the threat of public data exposure — creating a second ransom leverage point.' },
            { id: 3, question: 'Your organisation\'s files have been encrypted by ransomware. What is the recommended FIRST action?', options: ['Pay the ransom to restore operations quickly', 'Disconnect affected systems from the network immediately to contain the spread', 'Reinstall Windows on all affected machines', 'Contact the ransomware operators to negotiate'], correct: 1, explanation: 'Network isolation is the critical first containment step. Ransomware spreads laterally once inside — disconnecting affected systems from the network (including VPN, shares, domain controllers) prevents further encryption of additional machines.' },
            { id: 4, question: 'Which backup strategy is MOST resistant to ransomware encryption?', options: ['Daily incremental backups stored on the same server', 'Offsite backups on an air-gapped (network-isolated) or immutable storage system', 'Backups stored on a mapped network drive', 'Weekly full backups stored in the same building'], correct: 1, explanation: 'Air-gapped backups (physically disconnected from the network) or immutable cloud backups (where data cannot be modified or deleted for a set period) are immune to ransomware — the malware cannot reach or encrypt them.' },
            { id: 5, question: 'Ransomware operators often disable or delete Windows Volume Shadow Copies (VSS). Why?', options: ['VSS wastes disk space', 'VSS files contain encryption keys', 'Shadow copies allow Windows users to restore previous file versions without paying, defeating the ransomware', 'VSS contains backup login credentials'], correct: 2, explanation: 'Windows VSS (Shadow Copies) automatically stores file snapshots that users can restore to previous versions. Ransomware systematically deletes VSS copies (often via "vssadmin delete shadows /all /quiet") to eliminate this free recovery option.' },
            { id: 6, question: 'Should organisations pay the ransomware ransom?', options: ['Yes — it guarantees file recovery', 'Generally no — payment funds criminal operations, does not guarantee recovery, may violate sanctions, and identifies the victim as willing to pay', 'Only if the data is worth more than the ransom amount', 'Yes, always — no backups work against ransomware'], correct: 1, explanation: 'FBI, CISA, and NCSC strongly advise against paying. Reasons: payment funds further attacks, ~40% of victims who pay don\'t fully recover files, paying criminals from sanctioned nations may be illegal, and paying signals willingness for repeat targeting.' },
            { id: 7, question: 'What is Ransomware-as-a-Service (RaaS)?', options: ['A government-run ransomware protection service', 'A criminal business model where ransomware developers lease their tools to affiliates who conduct attacks and split the ransom proceeds', 'A security training platform for ransomware response', 'Open-source ransomware tools for penetration testing'], correct: 1, explanation: 'RaaS mirrors legitimate SaaS — developers build and maintain the ransomware platform, affiliates conduct attacks, and proceeds are split (typically 70-80% to affiliates, 20-30% to developers). Major RaaS groups include LockBit, BlackCat (ALPHV), and Cl0p.' },
            { id: 8, question: 'Which security control is MOST effective at limiting ransomware\'s lateral movement within a network?', options: ['Antivirus on all endpoints', 'Network segmentation with least-privilege access controls between segments', 'Disabling all USB ports', 'Using only cloud applications'], correct: 1, explanation: 'Network segmentation divides the network into zones with controlled inter-segment traffic. Combined with least privilege (each system only has access to what it needs), ransomware is contained to the initial segment — preventing it from spreading to domain controllers, backup servers, and critical systems.' },
            { id: 9, question: 'The WannaCry ransomware spread rapidly worldwide using which technique?', options: ['Spear phishing emails to executives', 'The EternalBlue exploit targeting an SMBv1 vulnerability (MS17-010) to auto-spread without user interaction', 'Malicious USB drives distributed in car parks', 'Compromised software supply chain (like the SolarWinds attack)'], correct: 1, explanation: 'WannaCry used the NSA\'s EternalBlue exploit (patches available for 59 days before the attack) to exploit unpatched SMBv1 on Windows systems, self-propagating automatically across networks. It infected 200,000+ systems in 150 countries within days, causing ~$4 billion in damages.' },
        ]
    },
    q9: {
        id: 'q9', title: 'Network Security & Firewall Basics', category: 'Network',
        difficulty: 'Intermediate', xp: 200, timeLimitSeconds: 900,
        questions: [
            { id: 1, question: 'What is the primary purpose of a firewall?', options: ['To speed up network connections', 'To monitor, filter, and control incoming and outgoing network traffic based on predefined security rules', 'To encrypt network connections end-to-end', 'To store network logs permanently'], correct: 1, explanation: 'A firewall acts as a gatekeeper — it enforces an access control policy by inspecting packets and deciding whether to allow or block them based on rules (IP address, port, protocol, application). It creates a security boundary between trusted and untrusted networks.' },
            { id: 2, question: 'What is a "Man-in-the-Middle" (MitM) attack?', options: ['An insider threat from a disgruntled employee', 'An attack where an adversary secretly intercepts and potentially alters communications between two parties who believe they are communicating directly', 'A Distributed Denial of Service attack', 'A social engineering phone call attack'], correct: 1, explanation: 'In a MitM attack, the adversary positions themselves between the communicating parties, reading and potentially modifying traffic in real time. Defences include TLS/HTTPS with certificate pinning, HSTS, mutual TLS, and avoiding public Wi-Fi without a VPN.' },
            { id: 3, question: 'What does "port scanning" allow an attacker to discover?', options: ['The passwords used on a network', 'Which ports are open and listening on a target system, revealing potential attack surfaces and running services', 'The encryption keys used in network communications', 'The physical location of a server'], correct: 1, explanation: 'Port scanning (e.g., using Nmap) probes a target\'s ports to identify which are open and what services are listening. This is a reconnaissance technique — open ports (RDP:3389, SSH:22, SMB:445) reveal attack surface and often exploitable services.' },
            { id: 4, question: 'What is a "DMZ" (Demilitarised Zone) in network security?', options: ['A network segment with no security controls', 'A physically separate network zone that hosts public-facing services (web, email, DNS) isolated from the internal corporate network', 'A firewall manufacturer\'s configuration mode', 'A subnet used exclusively for VPN connections'], correct: 1, explanation: 'A DMZ places internet-facing servers (web, mail, DNS) in a semi-trusted network segment isolated from both the internet and the internal LAN. Even if a DMZ server is compromised, the attacker faces another firewall before reaching internal systems.' },
            { id: 5, question: 'A DNS Amplification attack is classified as which type of attack?', options: ['Phishing', 'Man-in-the-Middle', 'Distributed Denial of Service (DDoS) using DNS servers as amplifiers', 'Brute-force credential attack'], correct: 2, explanation: 'DNS Amplification exploits open DNS resolvers — the attacker sends small spoofed queries (with victim\'s IP as source) that return large responses, amplifying the traffic volume directed at the victim by up to 70x. This overwhelms the target\'s bandwidth without the attacker needing equivalent bandwidth.' },
            { id: 6, question: 'What does an Intrusion Detection System (IDS) do that a firewall does not?', options: ['Blocks malicious traffic at the network perimeter', 'Analyses traffic patterns and logs alerts for suspicious activity without blocking it', 'Encrypts all network communications', 'Assigns IP addresses to network devices'], correct: 1, explanation: 'A firewall blocks/allows based on rules; an IDS (Intrusion Detection System) analyses traffic patterns for known attack signatures and behavioural anomalies, generating alerts for security teams. An IPS (Intrusion Prevention System) can also actively block detected attacks.' },
            { id: 7, question: 'What is the key security difference between WPA2 and WPA3 Wi-Fi security protocols?', options: ['WPA3 uses shorter encryption keys', 'WPA3 introduces Simultaneous Authentication of Equals (SAE), which prevents offline dictionary attacks against captured handshakes', 'WPA2 requires certificate-based authentication', 'WPA3 only works on 5GHz bands'], correct: 1, explanation: 'WPA2\'s 4-way handshake is vulnerable to offline dictionary attacks if captured (PMKID attack). WPA3\'s SAE handshake provides forward secrecy — each session uses unique keys, so captured handshakes cannot be cracked offline even with powerful hardware.' },
            { id: 8, question: 'What is "network segmentation" and why is it important for security?', options: ['Splitting the network cable to increase bandwidth', 'Dividing a network into isolated zones so that a breach in one segment cannot directly spread to other segments', 'Encrypting all network traffic between devices', 'Assigning static IP addresses to all devices'], correct: 1, explanation: 'Network segmentation (using VLANs, subnets, firewalls between zones) is a defence-in-depth control. It limits lateral movement — ransomware or an attacker who compromises a workstation in the user segment cannot directly reach the server segment, OT/ICS systems, or backup infrastructure.' },
        ]
    },
};


export default function QuizPlayerPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const quiz = QUIZ_DATA[quizId] || QUIZ_DATA['q1'];
    const questions = quiz.questions;

    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(quiz.timeLimitSeconds);
    const [quizStarted, setQuizStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [flagged, setFlagged] = useState(new Set());
    const startTimeRef = useRef(null);

    // Record start time for time-taken calculation
    const handleStart = () => {
        startTimeRef.current = Date.now();
        setQuizStarted(true);
    };

    // Timer countdown
    useEffect(() => {
        if (!quizStarted || submitted) return;
        if (timeLeft <= 0) { handleSubmit(true); return; }
        const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
        return () => clearInterval(t);
    }, [quizStarted, timeLeft, submitted]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const pct = Math.round((Object.keys(answers).length / questions.length) * 100);

    const handleSelect = (optionIdx) => {
        setAnswers(prev => ({ ...prev, [currentQ]: optionIdx }));
    };

    const handleSubmit = useCallback(async (autoSubmit = false) => {
        if (submitted || submitting) return;
        setSubmitting(true);
        setSubmitted(true);

        const score = questions.reduce((acc, q, idx) =>
            acc + (answers[idx] === q.correct ? 1 : 0), 0);
        const finalAnswers = { ...answers };
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 70;
        const xpEarned = passed ? quiz.xp : Math.floor(quiz.xp * 0.25);
        const timeTakenSeconds = startTimeRef.current
            ? Math.round((Date.now() - startTimeRef.current) / 1000)
            : 0;

        // ── Persist to backend ──────────────────────────────────────────
        let submissionId = null;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/quizzes/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify({
                    quizId: quiz.id,
                    quizTitle: quiz.title,
                    category: quiz.category,
                    difficulty: quiz.difficulty,
                    answers: finalAnswers,
                    score,
                    total: questions.length,
                    xpEarned,
                    timeTakenSeconds,
                    autoSubmitted: autoSubmit
                })
            });
            if (res.ok) {
                const data = await res.json();
                submissionId = data.data?._id;
            }
        } catch (err) {
            // Non-critical — result page still works from local state
            console.warn('[Quiz] Backend submission failed (offline?):', err.message);
        }
        // ────────────────────────────────────────────────────────────────

        setSubmitting(false);
        navigate('/quiz-result', {
            state: { quiz, questions, answers: finalAnswers, score, autoSubmit, xpEarned, submissionId }
        });
    }, [answers, quiz, questions, navigate, submitted, submitting]);

    if (!quizStarted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full"
                >
                    <Card className="p-10 text-center space-y-8">
                        <div className="w-20 h-20 rounded-3xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center mx-auto">
                            <BookOpen className="text-yellow-400 w-10 h-10" />
                        </div>

                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-yellow-500/80 mb-2">{quiz.category}</div>
                            <h1 className={`text-3xl font-black italic uppercase tracking-tighter mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>{quiz.title}</h1>
                            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Answer all questions carefully. Read each one before selecting your answer.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: BookOpen, label: 'Questions', value: questions.length },
                                { icon: Clock, label: 'Time Limit', value: formatTime(quiz.timeLimitSeconds) },
                                { icon: Zap, label: 'XP Reward', value: `${quiz.xp} XP` },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                                    <Icon size={18} className="text-yellow-500 mx-auto mb-2" />
                                    <div className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-800'}`}>{value}</div>
                                    <div className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/20 text-left space-y-2">
                            {['Timer starts when you click Begin', 'You can navigate between questions freely', 'Flagged questions are highlighted for review', 'Quiz auto-submits when time expires'].map(rule => (
                                <div key={rule} className={`flex items-center gap-3 text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                                    <CheckCircle size={12} className="text-yellow-500 shrink-0" />
                                    {rule}
                                </div>
                            ))}
                        </div>

                        <Button
                            variant="primary"
                            className="w-full h-14 text-sm font-black uppercase tracking-widest bg-yellow-400 hover:bg-yellow-300 text-black"
                            onClick={handleStart}
                        >
                            Begin Quiz →
                        </Button>
                    </Card>
                </motion.div>
            </div>
        );
    }

    const q = questions[currentQ];
    const answered = Object.keys(answers).length;
    const isLowTime = timeLeft < 60;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
            {/* Header Bar */}
            <div className="flex items-center justify-between">
                <div>
                    <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{quiz.title}</div>
                    <div className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                        {answered} of {questions.length} answered
                    </div>
                </div>

                {/* Timer */}
                <motion.div
                    animate={isLowTime ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl border font-mono text-2xl font-black ${isLowTime
                        ? 'bg-red-500/10 border-red-500/30 text-red-500'
                        : isDark
                            ? 'bg-white/[0.03] border-white/10 text-cyber-cyan'
                            : 'bg-gray-100 border-gray-200 text-cyan-600'
                        }`}
                >
                    <Clock size={20} />
                    {formatTime(timeLeft)}
                </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}>
                    <motion.div
                        animate={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                    />
                </div>
                <div className={`flex justify-between text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                    <span>Progress {pct}%</span>
                    <span>Q{currentQ + 1} / {questions.length}</span>
                </div>
            </div>

            {/* Question Navigation Dots */}
            <div className="flex flex-wrap gap-2">
                {questions.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentQ(idx)}
                        className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${idx === currentQ
                            ? 'bg-yellow-400 text-black scale-110'
                            : answers[idx] !== undefined
                                ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                                : flagged.has(idx)
                                    ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                                    : isDark
                                        ? 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
                                        : 'bg-gray-100 text-gray-500 border border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>

            {/* Palette colour legend */}
            <div className={`flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-400 inline-block" />Current</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500/40 border border-green-500/50 inline-block" />Answered</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-500/40 border border-orange-500/50 inline-block" />Flagged</div>
                <div className={`flex items-center gap-1.5`}><span className={`w-3 h-3 rounded border inline-block ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-300'}`} />Unanswered</div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card className="p-8 space-y-8">
                        {/* Question */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-yellow-500/80 mb-3">
                                    Question {currentQ + 1} of {questions.length}
                                </div>
                                <h2 className={`text-xl font-bold leading-relaxed ${isDark ? 'text-white' : 'text-gray-800'}`}>{q.question}</h2>
                            </div>
                            <button
                                onClick={() => setFlagged(prev => {
                                    const n = new Set(prev);
                                    n.has(currentQ) ? n.delete(currentQ) : n.add(currentQ);
                                    return n;
                                })}
                                className={`p-2.5 rounded-xl border transition-all ${flagged.has(currentQ)
                                    ? 'bg-orange-500/20 border-orange-500/40 text-orange-500'
                                    : isDark
                                        ? 'bg-white/5 border-white/10 text-white/30 hover:text-orange-400'
                                        : 'bg-gray-100 border-gray-200 text-gray-400 hover:text-orange-500'
                                    }`}
                                title="Flag for review"
                            >
                                <Flag size={16} />
                            </button>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {q.options.map((option, idx) => {
                                const selected = answers[currentQ] === idx;
                                return (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => handleSelect(idx)}
                                        className={`w-full p-5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-200 ${selected
                                                ? isDark
                                                    ? 'bg-yellow-400/15 border-yellow-400/50 text-white'
                                                    : 'bg-yellow-400/20 border-yellow-500/60 text-gray-800'
                                                : isDark
                                                    ? 'bg-white/[0.02] border-white/8 text-white/70 hover:bg-white/[0.05] hover:border-white/20 hover:text-white'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-yellow-50 hover:border-yellow-300 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-all ${selected
                                                ? 'bg-yellow-400 text-black'
                                                : isDark
                                                    ? 'bg-white/5 text-white/40'
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {['A', 'B', 'C', 'D'][idx]}
                                        </div>
                                        <span className="font-medium leading-relaxed">{option}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    className="gap-2 h-12 px-6"
                    onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                    disabled={currentQ === 0}
                >
                    <ChevronLeft size={16} /> Previous
                </Button>

                <div className="flex items-center gap-3">
                    {flagged.size > 0 && (
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-400">
                            <Flag size={12} /> {flagged.size} flagged
                        </div>
                    )}
                    {answered < questions.length && (
                        <div className="flex items-center gap-2 text-[10px] text-white/30">
                            <AlertTriangle size={12} /> {questions.length - answered} unanswered
                        </div>
                    )}
                </div>

                {currentQ < questions.length - 1 ? (
                    <Button
                        variant="primary"
                        className="gap-2 h-12 px-6 bg-white/10 text-white hover:bg-white/20"
                        onClick={() => setCurrentQ(q => q + 1)}
                    >
                        Next <ChevronRight size={16} />
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        className="gap-2 h-12 px-8 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase tracking-widest text-[10px] disabled:opacity-60"
                        onClick={() => handleSubmit(false)}
                        disabled={submitting}
                    >
                        {submitting
                            ? <><Loader size={16} className="animate-spin" /> Saving...</>
                            : <>Submit Quiz <CheckCircle size={16} /></>}
                    </Button>
                )}
            </div>
        </div>
    );
}
