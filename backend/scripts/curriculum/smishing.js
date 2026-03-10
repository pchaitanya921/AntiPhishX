const smishing = {
    beginner: [
        {
            title: "Identify urgent delivery scam",
            id: "smishing-beginner-1",
            topic: "smishing",
            level: "beginner",
            briefing: "You received an SMS claiming a package is withheld.",
            task: "Analyze the message for urgency and link safety.",
            artifacts: {
                sms: {
                    sender: "+15550192834",
                    message: "USP-S: Your package US-9912 is on hold due to unpaid shipping fee of $1.99. Pay now to avoid return: http://usps-fees-collect.com",
                    timestamp: "10:05 AM"
                }
            },
            question: "What is the primary red flag in this message?",
            options: [
                "The fee is too small.",
                "The link domain 'usps-fees-collect.com' is not the official 'usps.com'.",
                "The sender is a local number.",
                "The timestamp is in the morning."
            ],
            correctAnswer: "The link domain 'usps-fees-collect.com' is not the official 'usps.com'.",
            explanation: "Attackers commonly use look-alike domains for well-known services (USPS, FedEx, DHL) to trick users into entering credit card details."
        },
        {
            title: "Fake bank fraud alert",
            id: "smishing-beginner-2",
            topic: "smishing",
            level: "beginner",
            briefing: "An SMS alerts you to a 'suspicious transaction' of $500.",
            task: "Determine if the contact method is legitimate.",
            artifacts: {
                sms: {
                    sender: "888-555-0199 (Unknown)",
                    message: "BANK ALERT: Did you spend $500 at Apple Store? Reply YES or NO. If not you, click here to reverse: http://chase-security-verify.net",
                    context: "Your bank is Chase."
                }
            },
            question: "Banks often use SMS short codes (e.g., 20707). Why is a full phone number suspicious?",
            options: [
                "It costs more to send.",
                "Full 10-digit numbers are easily obtained by scammers via VoIP, whereas 5-6 digit short codes require vetting.",
                "It looks ugly.",
                "Banks never use phones."
            ],
            correctAnswer: "Full 10-digit numbers are easily obtained by scammers via VoIP, whereas 5-6 digit short codes require vetting.",
            explanation: "While not absolute, official automated banking alerts usually come from registered short codes. A random 10-digit number prompting a link click is high risk."
        },
        {
            title: "Gift card CEO scam",
            id: "smishing-beginner-3",
            topic: "smishing",
            level: "beginner",
            briefing: "You received a text purportedly from your CEO, John Doe.",
            task: "Verify the sender and the request.",
            artifacts: {
                sms: {
                    sender: "+1 (404) 555-0122",
                    message: "Hi, it's John (CEO). I'm in a meeting and can't talk. I need you to buy 5 Apple gift cards for a client presentation. Urgent. Will reimburse.",
                    context: "You have verified the CEO's actual number is 212-555-0100."
                }
            },
            question: "This 'Urgent Gift Card' request is a classic example of what?",
            options: [
                "Tech Support Fraud.",
                "Impersonation / Executive Fraud.",
                "Ransomware.",
                "Man-in-the-Middle."
            ],
            correctAnswer: "Impersonation / Executive Fraud.",
            explanation: "Scammers impersonate authority figures (CEO) and create fake urgency (in a meeting) to pressure employees into untraceable financial transfers (gift cards)."
        },
        {
            title: "Tax refund lure",
            id: "smishing-beginner-4",
            topic: "smishing",
            level: "beginner",
            briefing: "It is tax season. You receive an SMS about a pending refund.",
            task: "Inspect the URL for legitimacy.",
            artifacts: {
                sms: {
                    sender: "IRS-Gov",
                    message: "You have a pending tax refund of $1,450. Claim it immediately by verifying your profile: https://irs-gov-refund-claim.org",
                    timestamp: "Now"
                }
            },
            question: "How does the IRS typically contact taxpayers about refunds?",
            options: [
                "Via SMS with a link.",
                "Via WhatsApp.",
                "Via physical mail (USPS).",
                "Via Facebook Messenger."
            ],
            correctAnswer: "Via physical mail (USPS).",
            explanation: "The IRS does NOT initiate contact via text or email to request personal info or pin codes. This is always a scam."
        },
        {
            title: "MFA code interception",
            id: "smishing-beginner-5",
            topic: "smishing",
            level: "beginner",
            briefing: "You received a verification code you didn't request, followed by a text.",
            task: "Identify the social engineering tactic.",
            artifacts: {
                sms_1: "Your Google verification code is 123456.",
                sms_2: "Hi, this is Google Support. We detected a hack. Please reply with the code sent to your phone to lock your account."
            },
            question: "What should you do with the code?",
            options: [
                "Give it to the 'Support' agent.",
                "Ignore it and change your password immediately.",
                "Post it online.",
                "Reply 'STOP'."
            ],
            correctAnswer: "Ignore it and change your password immediately.",
            explanation: "The attacker triggered the code (password reset) and is trying to trick you into giving it to them. Never share OTP codes with anyone."
        },
        {
            title: "Winning a prize scam",
            id: "smishing-beginner-6",
            topic: "smishing",
            level: "beginner",
            briefing: "You won an iPhone 15 Pro Max!",
            task: "Analyze the 'too good to be true' offer.",
            artifacts: {
                sms: {
                    sender: "Promo-Alert",
                    message: "CONGRATS! You won an iPhone 15. Click to claim shipping: http://bit.ly/claim-prize-now",
                    context: "You did not enter any contest."
                }
            },
            question: "If you didn't enter a contest, what is the likelihood of winning?",
            options: [
                "High.",
                "Zero. It is a scam.",
                "Maybe someone entered for me.",
                "Apple gives away phones randomly."
            ],
            correctAnswer: "Zero. It is a scam.",
            explanation: "Unsolicited prize notifications are a lure to get credit card info for 'shipping fees' or install malware."
        },
        {
            title: "Netflix payment declined",
            id: "smishing-beginner-7",
            topic: "smishing",
            level: "beginner",
            briefing: "Your streaming service says your account is suspended.",
            task: "Verify the link before clicking.",
            artifacts: {
                sms: {
                    sender: "+1-800-555-0101",
                    message: "Netflix: Your payment failed. Account suspended. Update payment info: https://netflix-secure-billing.com/update",
                    real_domain: "netflix.com"
                }
            },
            question: "How can you safely verify this claim?",
            options: [
                "Click the link.",
                "Call the police.",
                "Log in to the official Netflix app or website directly (do not use the link).",
                "Reply to the text."
            ],
            correctAnswer: "Log in to the official Netflix app or website directly (do not use the link).",
            explanation: "Always navigate to the service manually. If there is a real issue, the official app/site will notify you there."
        },
        {
            title: "Job offer recruiter scam",
            id: "smishing-beginner-8",
            topic: "smishing",
            level: "beginner",
            briefing: "A recruiter offers a high-paying remote job via WhatsApp/SMS.",
            task: "Identify the indicators of a job scam.",
            artifacts: {
                sms: {
                    sender: "Alice (Recruiter)",
                    message: "Hi! We saw your resume. We have a part-time remote job paying $500/day. No experience needed. WhatsApp me: wa.me/12345"
                }
            },
            question: "What is a common sign of a job scam?",
            options: [
                "Unrealistically high pay for little work.",
                "Asking for an interview.",
                "Checking references.",
                "Using LinkedIn."
            ],
            correctAnswer: "Unrealistically high pay for little work.",
            explanation: "Scammers use 'easy money' offers to lure victims into money laundering (money mule) or fake check scams."
        },
        {
            title: "Wrong number pretexting",
            id: "smishing-beginner-9",
            topic: "smishing",
            level: "beginner",
            briefing: "You received a text: 'Hey Sarah, are we still meeting for yoga?'",
            task: "Decide how to respond.",
            artifacts: {
                sms: {
                    sender: "Unknown Number",
                    message: "Hey Sarah, are we still meeting for yoga today? - Emily"
                }
            },
            question: "What happens if you reply 'Wrong number'?",
            options: [
                "Nothing.",
                "The sender thanks you and leaves.",
                "It validates your number is active, leading to more spam/scams (Pig Butchering precursor).",
                "You get free yoga."
            ],
            correctAnswer: "It validates your number is active, leading to more spam/scams (Pig Butchering precursor).",
            explanation: "Seemingly innocent wrong number texts are often the start of long-con 'Pig Butchering' crypto scams. It's best to block and ignore."
        },
        {
            title: "Fake verification URL",
            id: "smishing-beginner-10",
            topic: "smishing",
            level: "beginner",
            briefing: "A message asks you to verify your identity.",
            task: "Spot the typo in the URL.",
            artifacts: {
                sms: {
                    message: "Faceb00k: Click to verify login attempt: http://faceb00k.com/login"
                }
            },
            question: "Which character is spoofed in the URL?",
            options: [
                "The 'f'.",
                "The 'o' is replaced with '0' (zero).",
                "The 'k'.",
                "Nothing."
            ],
            correctAnswer: "The 'o' is replaced with '0' (zero).",
            explanation: "Typosquatting or character substitution (homoglyphs) is common. 'faceb00k' visually resembles 'facebook' but is a different domain."
        }
    ],
    intermediate: [
        {
            title: "Alphanumeric Sender ID Spoofing",
            id: "smishing-intermediate-1",
            topic: "smishing",
            level: "intermediate",
            briefing: "You received a text from 'AppleSupport'. You cannot block the number.",
            task: "Analyze why the sender appears as a name.",
            artifacts: {
                sms: {
                    sender: "AppleSupport",
                    message: "Your Apple ID has been locked due to suspicious activity. Verify identity: http://apple-id-recover.com"
                }
            },
            question: "What is an Alphanumeric Sender ID?",
            options: [
                "A contacts list entry.",
                "A feature allowing businesses to replace their number with a name (11 chars max). It is often one-way (no reply).",
                "A hack.",
                "A new 5G feature."
            ],
            correctAnswer: "A feature allowing businesses to replace their number with a name (11 chars max). It is often one-way (no reply).",
            explanation: "Attackers use SMS gateways that support Alphanumeric Sender IDs to impersonate brands. Since there is no number, victims often trust the name implicitly."
        },
        {
            title: "URL Shortener Analysis",
            id: "smishing-intermediate-2",
            topic: "smishing",
            level: "intermediate",
            briefing: "A text contains a 'bit.ly' link for a package delivery.",
            task: "Determine the final destination of the short link.",
            artifacts: {
                sms: {
                    message: "Your package is waiting. Track here: http://bit.ly/3xYg7",
                    tool_output: "bit.ly/3xYg7 -> redirects to -> http://malicious-site.RU/download.apk"
                }
            },
            question: "Why do attackers use URL shorteners in SMS?",
            options: [
                "To save characters (SMS limit) and hide the malicious domain.",
                "To track clicks.",
                "To look professional.",
                "All of the above."
            ],
            correctAnswer: "To save characters (SMS limit) and hide the malicious domain.",
            explanation: "SMS has a character limit (160), making shorteners practical, but attackers abuse them to mask the true destination (e.g., a .ru or .xyz domain)."
        },
        {
            title: "Smishing Kit Recognition",
            id: "smishing-intermediate-3",
            topic: "smishing",
            level: "intermediate",
            briefing: "You clicked a link in a text and landed on a generic bank login.",
            task: "Identify the indicators of a mass-market phishing kit.",
            artifacts: {
                url: "http://secure-banking-login.com/chase",
                page_source: "Title: 'Login Page' (Generic). Favicon is missing. Copyright year is 2019."
            },
            question: "What does the outdated copyright year suggest?",
            options: [
                "The bank is lazy.",
                "It is a deployed Phishing Kit that hasn't been updated.",
                "It's a legacy system.",
                "The browser is old."
            ],
            correctAnswer: "It is a deployed Phishing Kit that hasn't been updated.",
            explanation: "Phishing kits are often reused for years. An old copyright date on a major bank's login page is a strong indicator of a fake site."
        },
        {
            title: "Punnycode / Homograph Attack",
            id: "smishing-intermediate-4",
            topic: "smishing",
            level: "intermediate",
            briefing: "A text from 'support' leads to 'apple.com', but the browser warns you.",
            task: "Analyze the URL for non-ASCII characters.",
            artifacts: {
                apparent_url: "apple.com",
                actual_punycode: "xn--pple-43d.com",
                unicode: "àpple.com"
            },
            question: "What is a Homograph Attack?",
            options: [
                "Using words that sound the same.",
                "Using characters from different scripts (e.g., Cyrillic 'a') that look identical to Latin characters to spoof a domain.",
                "A denial of service.",
                "A typo."
            ],
            correctAnswer: "Using characters from different scripts (e.g., Cyrillic 'a') that look identical to Latin characters to spoof a domain.",
            explanation: "International Domain Names (IDN) allow non-English characters. Attackers use look-alike characters to register 'apple.com' (with a Cyrillic 'a'), deceiving users."
        },
        {
            title: "Area Code Spoofing",
            id: "smishing-intermediate-5",
            topic: "smishing",
            level: "intermediate",
            briefing: "You received a text from a number with your exact local area code.",
            task: "Assess the trust level of 'neighbor' numbers.",
            artifacts: {
                your_number: "512-555-0100",
                sender_number: "512-555-0199",
                message: "Hey neighbor, did you see the police on our street?"
            },
            question: "Why do scammers spoof your local area code?",
            options: [
                "It is cheaper.",
                "To increase the likelihood of you answering/replying (Neighbor Spoofing).",
                "They are actually your neighbors.",
                "It is a network requirement."
            ],
            correctAnswer: "To increase the likelihood of you answering/replying (Neighbor Spoofing).",
            explanation: "People are more likely to trust numbers that look local. Attackers spoof the first 6 digits to mimic a neighbor or local business."
        },
        {
            title: "Calendar Injection via SMS",
            id: "smishing-intermediate-6",
            topic: "smishing",
            level: "intermediate",
            briefing: "You received a text with a link that added an event to your calendar.",
            task: "Analyze the risk of .ics files.",
            artifacts: {
                sms: "Meeting confirmed. Add to calendar: http://cal-invite.com/meeting.ics",
                calendar_event: "Title: 'VIRUS DETECTED - CLICK TO REMOVE', Description: 'http://malware-link.com'",
                alert: "Your phone notifies you of the event 10 minutes before."
            },
            question: "How does Calendar Injection bypass SMS filters?",
            options: [
                "It doesn't.",
                "The text itself is benign (.ics link), but the payload (the spam/link) is inside the calendar event, which notifies you later.",
                "It uses magic.",
                "It exploits a bug."
            ],
            correctAnswer: "The text itself is benign (.ics link), but the payload (the spam/link) is inside the calendar event, which notifies you later.",
            explanation: "The initial SMS is just an invite. The actual spam content is in the calendar event description, which the phone system (Calendar app) often displays as a trusted notification."
        },
        {
            title: "Fake 2FA request",
            id: "smishing-intermediate-7",
            topic: "smishing",
            level: "intermediate",
            briefing: "You received a text: 'Use code 1234 to authorize payment of $2000'. You didn't buy anything.",
            task: "Determine the attacker's goal.",
            artifacts: {
                sms: "BankUSA: Use code 998811 to authorize payment of $2,400.00 to BESTBUY. If this wasn't you, call 800-555-0199 immediately."
            },
            question: "What is the trap in this message?",
            options: [
                "The code is fake.",
                "The phone number (800-555-0199) is fake. They want you to panic and call them.",
                "You actually spent the money.",
                "The bank is hacking you."
            ],
            correctAnswer: "The phone number (800-555-0199) is fake. They want you to panic and call them.",
            explanation: "This is a 'Reverse Vishing' lure. The payment alerts are fake to panic you into calling a bogus support number, where they will extract your real data."
        },
        {
            title: "Credential Harvesting via Google Form",
            id: "smishing-intermediate-8",
            topic: "smishing",
            level: "intermediate",
            briefing: "A text asks you to fill out a survey for a gift card.",
            task: "Inspect the hosting platform.",
            artifacts: {
                sms: "Fill out this survey to win $100: https://docs.google.com/forms/d/e/123...",
                form_content: "Question 1: What is your mother's maiden name? Question 2: What is your credit card number?"
            },
            question: "Why do attackers use Google Forms?",
            options: [
                "It is professional.",
                "It is free, trusted by SSL, and hard to blacklist since it's a legitimate Google domain.",
                "It has good design.",
                "Google pays them."
            ],
            correctAnswer: "It is free, trusted by SSL, and hard to blacklist since it's a legitimate Google domain.",
            explanation: "Abusing legitimate free infrastructure (Google Forms, Microsoft Forms) allows attackers to host phishing pages on trusted domains, bypassing reputation filters."
        },
        {
            title: "Simulated subscription bomb",
            id: "smishing-intermediate-9",
            topic: "smishing",
            level: "intermediate",
            briefing: "You received 50 texts in one minute confirming subscriptions to random newsletters.",
            task: "Diagnose the attack type.",
            artifacts: {
                inbox: "50+ unread messages from differents services (Uber, Facebook, Twitter, etc.) containing OTPs.",
                hidden_email: "One important email from your bank is buried in the spam."
            },
            question: "What is the purpose of SMS Bombing / Flooding?",
            options: [
                "To annoy you.",
                "To drain your battery.",
                "To distract you (Distraction Warfare) so you miss a real security alert (like a bank transfer notification).",
                "To test the network."
            ],
            correctAnswer: "To distract you (Distraction Warfare) so you miss a real security alert (like a bank transfer notification).",
            explanation: "Attackers flood your phone to hide a specific alert (e.g., 'Your password was changed' or 'Money transferred'). You are too busy muting notifications to notice the real breach."
        },
        {
            title: "Roaming network request scam",
            id: "smishing-intermediate-10",
            topic: "smishing",
            level: "intermediate",
            briefing: "While traveling, you get a text: 'Welcome to RoamCell. Click to update settings'.",
            task: "Analyze the configuration profile request.",
            artifacts: {
                sms: "Network settings outdated. Install new profile: http://config-update.net/profile.mobileconfig",
                risk: "Installing untrusted .mobileconfig profiles."
            },
            question: "What can a malicious configuration profile do to an iPhone/Android?",
            options: [
                "Nothing.",
                "Reroute all web traffic (Proxy/VPN) through the attacker's server, enabling interception.",
                "Break the screen.",
                "Make calls for free."
            ],
            correctAnswer: "Reroute all web traffic (Proxy/VPN) through the attacker's server, enabling interception.",
            explanation: "Malicious profiles can configure VPNs, install root certs, or change APN settings, effectively Man-in-the-Middle (MitM) attacking the device's traffic."
        }
    ],
    advanced: [
        {
            title: "Malicious APK delivery (FluBot)",
            id: "smishing-advanced-1",
            topic: "smishing",
            level: "advanced",
            briefing: "You received a text: 'You have a voicemail. Download app to listen.'",
            task: "Analyze the download link payload.",
            artifacts: {
                sms: "New Voicemail (2min). Click to listen: http://voicemail-carrier-service.com/player.apk",
                file_analysis: "File is 'player.apk'. Permissions: Read Contacts, Send SMS, Overlay Screen."
            },
            question: "What is the primary function of banking trojans like FluBot distributed via SMS?",
            options: [
                "To play voicemails.",
                "To steal contacts and auto-reply to them (Wormable) while stealing banking credentials via overlay attacks.",
                "To mine crypto.",
                "To improved signal."
            ],
            correctAnswer: "To steal contacts and auto-reply to them (Wormable) while stealing banking credentials via overlay attacks.",
            explanation: "Android banking trojans spread by SMS. Once installed, they steal the contact list and SMS everyone the same link, creating a viral botnet."
        },
        {
            title: "SIM Swap precursor detection",
            id: "smishing-advanced-2",
            topic: "smishing",
            level: "advanced",
            briefing: "Your phone has no signal. You received a text 30 mins ago.",
            task: "Correlate the signal loss with the text.",
            artifacts: {
                sms: "Carrier Info: We are migrating your SIM to a new device as requested. If this wasn't you, reply NO.",
                status: "No Service (SOS Only)."
            },
            question: "Why did you lose signal?",
            options: [
                "The tower is down.",
                "Your number was successfully ported (SIM Swapped) to the attacker's SIM card.",
                "You ran out of data.",
                "Sunspots."
            ],
            correctAnswer: "Your number was successfully ported (SIM Swapped) to the attacker's SIM card.",
            explanation: "In a SIM Swap, the carrier moves your number to the attacker's SIM. Your old SIM stops working immediately. The attacker now receives all your SMS OTPs."
        },
        {
            title: "Fake crypto wallet connect",
            id: "smishing-advanced-3",
            topic: "smishing",
            level: "advanced",
            briefing: "A text says your MetaMask wallet is compromised.",
            task: "Inspect the recovery procedure.",
            artifacts: {
                sms: "MetaMask: Critical vulnerability detected. Connect wallet to update security: http://wallet-connect-fix.com",
                site_behavior: "Asks for your 12-word Seed Phrase."
            },
            question: "What happens if you enter your Seed Phrase?",
            options: [
                "The wallet is secured.",
                "The attacker permanently takes control of all funds in the wallet.",
                "Nothing, it's just words.",
                "You get a refund."
            ],
            correctAnswer: "The attacker permanently takes control of all funds in the wallet.",
            explanation: "The Seed Phrase (Recovery Phrase) is the master key. Legitimate support will NEVER ask for it. If shared, the wallet is drained instantly."
        },
        {
            title: "Whatsapp verification code hijacking",
            id: "smishing-advanced-4",
            topic: "smishing",
            level: "advanced",
            briefing: "A friend messages you: 'I accidentally sent my code to you. Can you tell me what it is?'",
            task: "Identify the account takeover tactic.",
            artifacts: {
                sms: "Your WhatsApp code: 123-456. Don't share this code with anyone.",
                message_from_friend: "Hey, I'm locked out. Did you get a code? Send it to me pls."
            },
            question: "What is the attacker doing?",
            options: [
                "Your friend is confused.",
                "The attacker is trying to log into YOUR WhatsApp account on their device. They triggered the code to your phone.",
                "It is a prank.",
                "It is a bug."
            ],
            correctAnswer: "The attacker is trying to log into YOUR WhatsApp account on their device. They triggered the code to your phone.",
            explanation: "Attackers often compromise one friend, then message their contacts pretending to be them, asking for 'sent codes' to take over more accounts."
        },
        {
            title: "E-Sim fraud attempt",
            id: "smishing-advanced-5",
            topic: "smishing",
            level: "advanced",
            briefing: "You received a QR code via text to 'activate your new service'.",
            task: "Analyze the QR payload.",
            artifacts: {
                sms: "Carrier: Here is your eSIM activation QR code. Scan in Settings.",
                qr_content: "LPA:1$rsp.truphone.com$ABC... (Legitimate-looking eSIM profile)"
            },
            question: "If you scan an unknown eSIM profile, what functionality do you hand over?",
            options: [
                "None.",
                "The attacker can use your data plan.",
                "The attacker becomes the owner of your number (if porting involved) or you essentially add a 'burner' line billed to you.",
                "Your screen brightness."
            ],
            correctAnswer: "The attacker becomes the owner of your number (if porting involved) or you essentially add a 'burner' line billed to you.",
            explanation: "Scanning a malicious eSIM QR code adds a cellular plan to your device, potentially for an account the attacker controls or billing fraud."
        },
        {
            title: "Internal employee survey smish",
            id: "smishing-advanced-6",
            topic: "smishing",
            level: "advanced",
            briefing: "A text from 'HR' links to a survey.",
            task: "Verify the domain against internal standards.",
            artifacts: {
                sms: "HR: All employees must complete the satisfaction survey. http://company-hr-survey.net",
                company_domain: "company.com"
            },
            question: "Why is a lookup of 'company-hr-survey.net' important?",
            options: [
                "To see if it's hosted on company infrastructure.",
                "To check the colors.",
                "To check the weather.",
                "It isn't."
            ],
            correctAnswer: "To see if it's hosted on company infrastructure.",
            explanation: "Attackers register domains containing the company name. If the WHOIS shows it's registered to 'Private Proxy' instead of the company, it's likely a scan."
        },
        {
            title: "Fake courier customs fee",
            id: "smishing-advanced-7",
            topic: "smishing",
            level: "advanced",
            briefing: "A text says your international package is held at customs.",
            task: "Identify the payment method red flag.",
            artifacts: {
                sms: "Customs: Package #889 held. Pay $2.00 duty fee to release. Link: http://dhl-customs-pay.com",
                payment_page: "Accepts Credit Card. Also asks for SSN and Date of Birth 'for verification'."
            },
            question: "Does paying a $2 customs fee require your SSN?",
            options: [
                "Yes, always.",
                "No. Asking for SSN/DOB plus Credit Card is a clear sign of Identity Theft, not just a fee scam.",
                "Maybe.",
                "Depends on the day."
            ],
            correctAnswer: "No. Asking for SSN/DOB plus Credit Card is a clear sign of Identity Theft, not just a fee scam.",
            explanation: "The small fee is just the hook. The goal is gathering a 'Fullz' (full identity profile: Name, CC, SSN, DOB) to sell on the dark web."
        },
        {
            title: "Targeted 'Pig Butchering' initiation",
            id: "smishing-advanced-8",
            topic: "smishing",
            level: "advanced",
            briefing: "A stranger has been texting you politely for weeks about stocks/crypto.",
            task: "Recognize the grooming phase.",
            artifacts: {
                history: "Day 1: Wrong number. Day 3: 'Nice to meet you'. Day 7: 'I make 20% profit daily'. Day 14: 'You should try this platform'.",
                platform: "http://crypto-elite-trade.com (Newly registered)"
            },
            question: "Why do these scammers wait weeks before asking for money?",
            options: [
                "They are shy.",
                "To build trust and emotional connection (Grooming) so the victim invests a massive amount (Life Savings) later.",
                "They forgot.",
                "Slow internet."
            ],
            correctAnswer: "To build trust and emotional connection (Grooming) so the victim invests a massive amount (Life Savings) later.",
            explanation: "Pig Butchering scams involve 'fattening' the victim with friendship/romance and small fake profits before the 'slaughter' (stealing the large investment)."
        },
        {
            title: "Apple Pay / Google Pay provision alert",
            id: "smishing-advanced-9",
            topic: "smishing",
            level: "advanced",
            briefing: "Your bank texts: 'Verification code for Apple Pay'. You didn't request this.",
            task: "Determine the severity.",
            artifacts: {
                sms: "Bank: Your OTP for Apple Pay provisioning is 559922. Do not share.",
                implication: "Someone has your credit card details and is adding it to THEIR phone tap-to-pay."
            },
            question: "If the attacker succeeds, what can they do?",
            options: [
                "Nothing.",
                "Use your card at physical stores without the physical card (Card Not Present becomes Card Present transaction).",
                "See your photos.",
                "Call you."
            ],
            correctAnswer: "Use your card at physical stores without the physical card (Card Not Present becomes Card Present transaction).",
            explanation: "Adding a stolen card to a generic digital wallet allows the fraudster to bypass chip/pin protections at physical terminals."
        },
        {
            title: "Political donation scam",
            id: "smishing-advanced-10",
            topic: "smishing",
            level: "advanced",
            briefing: "It's election season. A text asks for a donation to a candidate.",
            task: "Verify the PAC (Political Action Committee).",
            artifacts: {
                sms: "Support Candidate X! 3x match on donations today only. Donate: http://secure-pac-freedom.com",
                real_site: "candidate-x.com"
            },
            question: "What is a common indicator of political smishing?",
            options: [
                "Asking for money.",
                "High-pressure 'Match' offers with generic domains not linked from the official campaign site.",
                "Using emojis.",
                "Texting at night."
            ],
            correctAnswer: "High-pressure 'Match' offers with generic domains not linked from the official campaign site.",
            explanation: "Scammers exploit political passion. Always go to the official campaign website to donate; never trust a random text link."
        }
    ],
    expert: [
        {
            title: "Zero-Click exploit indicators (Pegasus)",
            id: "smishing-expert-1",
            topic: "smishing",
            level: "expert",
            briefing: "Your device rebooted randomly. Battery is draining fast. You suspect a zero-click infection.",
            task: "Analyze system logs for zero-click artifacts.",
            artifacts: {
                sms: "No suspicious SMS found (Message was likely self-deleted by exploit).",
                logs: "Process 'core_services' crashed due to memory overflow processing a GIF file in iMessage."
            },
            question: "How does a Zero-Click exploit via iMessage/SMS work?",
            options: [
                "You have to click a link.",
                "The parsing engine (e.g., ImageIO) executes malicious code appearing as a media file (GIF/PDF) simply by receiving/previewing it.",
                "You have to call the attacker.",
                "It requires physical access."
            ],
            correctAnswer: "The parsing engine (e.g., ImageIO) executes malicious code appearing as a media file (GIF/PDF) simply by receiving/previewing it.",
            explanation: "Zero-click exploits (like NSO Group's Pegasus) target vulnerabilities in code that parses incoming data (images which render in preview) requiring no user interaction."
        },
        {
            title: "SS7 Network Interception",
            id: "smishing-expert-2",
            topic: "smishing",
            level: "expert",
            briefing: "You are receiving SMS OTPs, but the attacker is also logging in successfully.",
            task: "Diagnose how the attacker gets the OTP without SIM swapping you.",
            artifacts: {
                status: "Your phone still has signal (Not a SIM Swap).",
                network: "SS7 Signaling reports show call forwarding/SMS redirection enabled at the network level."
            },
            question: "What is the SS7 vulnerability?",
            options: [
                "A weakness in the global telecom signaling network allowing interception of SMS/Calls across borders.",
                "A Wi-Fi bug.",
                "A Bluetooth bug.",
                "A phone virus."
            ],
            correctAnswer: "A weakness in the global telecom signaling network allowing interception of SMS/Calls across borders.",
            explanation: "SS7 (Signaling System 7) is the protocol for telecom routing. Flaws allow sophisticated attackers to redirect SMS to their device without the victim losing service."
        },
        {
            title: "Spear-Smishing (Whaling)",
            id: "smishing-expert-3",
            topic: "smishing",
            level: "expert",
            briefing: "A C-Level executive received a text referencing a private board meeting.",
            task: "Identify the source of the leak.",
            artifacts: {
                sms: "Hi [Name], reviewing the agenda for the merger meeting tomorrow. Please review the attached minutes: http://secure-board-cloud.com",
                context: "The merger is confidential."
            },
            question: "How did the attacker know about the confidential merger?",
            options: [
                "Lucky guess.",
                "Monitoring public social media.",
                "Prior compromise of email or calendar system (Business Email Compromise leading to Smishing).",
                "Psychic abilities."
            ],
            correctAnswer: "Prior compromise of email or calendar system (Business Email Compromise leading to Smishing).",
            explanation: "Highly specific contexts usually come from internal recon. The attacker likely compromised an email account first, saw the calendar invite, and sent a targeted text to bypass email filters."
        },
        {
            title: "Silent SMS (Type 0) Ping",
            id: "smishing-expert-4",
            topic: "smishing",
            level: "expert",
            briefing: "You suspect you were tracked, but received no messages.",
            task: "Analyze baseband logs for Silent SMS.",
            artifacts: {
                logs: "Received SMS-DELIVER PDU. TP-PID = 64 (Type 0). No notification displayed to user."
            },
            question: "What is the purpose of a Silent SMS (Type 0)?",
            options: [
                "To annoy the user.",
                "To force the device to acknowledge the tower, revealing its precise location to the carrier/interceptor.",
                "To deliver a payload.",
                "To test the screen."
            ],
            correctAnswer: "To force the device to acknowledge the tower, revealing its precise location to the carrier/interceptor.",
            explanation: "Law enforcement and attackers use Silent SMS to ping a phone. The phone responds to the network (updating location) without alerting the user."
        },
        {
            title: "RCS (Rich Communication Services) Phishing",
            id: "smishing-expert-5",
            topic: "smishing",
            level: "expert",
            briefing: "You received a 'Verified Business' message with a logo.",
            task: "Determine if the 'Verified' badge is real.",
            artifacts: {
                protocol: "RCS (Android Messages)",
                sender: "Bank of America (Verified Checkmark)",
                content: "Click here to authorize: http://fake-bank.com"
            },
            question: "Can RCS Verified Senders be spoofed?",
            options: [
                "No, never.",
                "Yes, if the attacker compromises a verified brand's API key or registers a look-alike brand successfully.",
                "RCS is not secure.",
                "Only on iPhone."
            ],
            correctAnswer: "Yes, if the attacker compromises a verified brand's API key or registers a look-alike brand successfully.",
            explanation: "While harder than SMS spoofing, RCS verified agents can be compromised or fraudulently registered, making the checkmark dangerous if trusted blindly."
        },
        {
            title: "SMS Pumping Fraud Analysis",
            id: "smishing-expert-6",
            topic: "smishing",
            level: "expert",
            briefing: "Your company's SMS bill spiked by $10,000.",
            task: "Analyze the traffic pattern.",
            artifacts: {
                traffic: "10,000 OTP requests sent to a block of sequential numbers in Indonesia (+62 8...)",
                cost: "$0.10 per SMS."
            },
            question: "Who profits from this 'SMS Pumping' (Toll Fraud)?",
            options: [
                "The victim users.",
                "The rogue telecom provider (revenue share) and the attacker generating the traffic.",
                "The government.",
                "No one."
            ],
            correctAnswer: "The rogue telecom provider (revenue share) and the attacker generating the traffic.",
            explanation: "Attackers trigger OTPs to numbers they control/partner with. The enterprise pays the bill, and the 'telco' splits the revenue with the attacker."
        },
        {
            title: "Advanced MFA Bypass with OTP Bot",
            id: "smishing-expert-7",
            topic: "smishing",
            level: "expert",
            briefing: "A user gave their OTP to a 'bot' that called them immediately after a text.",
            task: "Deconstruct the OTP Bot workflow.",
            artifacts: {
                sequence: "1. Attacker triggers login. 2. User gets OTP text. 3. Automated Bot calls user: 'This is security. Please enter the code sent to your text to block the hack'."
            },
            question: "Why creates the highest success rate for OTP Bots?",
            options: [
                "A polite voice.",
                "Timing. The call connects immediately after the text arrives, creating panic and legitimacy context.",
                "The phone number.",
                "The script."
            ],
            correctAnswer: "Timing. The call connects immediately after the text arrives, creating panic and legitimacy context.",
            explanation: "Automated scripts (OTP Bots) excel at speed. They trigger the OTP and call the victim simultaneously, making the request seem like a synchronized security feature."
        },
        {
            title: "Dark Pattern SMS Unsubscribe",
            id: "smishing-expert-8",
            topic: "smishing",
            level: "expert",
            briefing: "You replied 'STOP' to a spam message.",
            task: "Analyze the result.",
            artifacts: {
                response: "You have unsubscribed. To confirm removal, please verify your identity here: http://remove-me-secure.com"
            },
            question: "What is this tactic?",
            options: [
                "Legal compliance.",
                "A confirmation lure. The 'unsubscribe' confirmation is actually a phishing link.",
                "A database error.",
                "Two-factor unsubscription."
            ],
            correctAnswer: "A confirmation lure. The 'unsubscribe' confirmation is actually a phishing link.",
            explanation: "Attackers exploit the desire to unsubscribe. The 'success' message contains the actual phishing link."
        },
        {
            title: "Satellite link spoofing (Theoretical)",
            id: "smishing-expert-9",
            topic: "smishing",
            level: "expert",
            briefing: "An emergency alert via Satellite SOS.",
            task: "Verify the integrity of a satellite text.",
            artifacts: {
                message: "Emergency SOS: Rescue team deployed. Confirm coordinates: http://SOS-loc.com",
                context: "Using iPhone Satellite connection."
            },
            question: "Why is this vector (Satellite) dangerous?",
            options: [
                "Space is scary.",
                "Users assume satellite comms are for life-safety only and inherently trusted/unspoofable.",
                "It causes cancer.",
                "It is slow."
            ],
            correctAnswer: "Users assume satellite comms are for life-safety only and inherently trusted/unspoofable.",
            explanation: "As satellite messaging becomes consumer-grade, attackers will explore spoofing emergency scenarios where panic overrides critical thinking."
        },
        {
            title: "Analyzing a Smishing Forensic Image",
            id: "smishing-expert-10",
            topic: "smishing",
            level: "expert",
            briefing: "You have a forensic image of a phone targeted by smishing.",
            task: "Locate the persistence mechanism.",
            artifacts: {
                browser_history: "Visited 'update-chrome.apk' download.",
                app_list: "System Update (v1.0) - Installed from Unknown Sources.",
                permissions: "Accessibility Services enabled for 'System Update'."
            },
            question: "Why do Android malware types abuse 'Accessibility Services'?",
            options: [
                "To help blind users.",
                "To read screen content (2FA codes) and click buttons (grant permissions) without user consent.",
                "To make the font bigger.",
                "To save battery."
            ],
            correctAnswer: "To read screen content (2FA codes) and click buttons (grant permissions) without user consent.",
            explanation: "Accessibility privileges give the malware full control over the UI, allowing it to harvest data and click 'Allow' on other permission prompts automatically."
        }
    ]
};

module.exports = smishing;
