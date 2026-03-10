const phishing = {
    beginner: [
        {
            title: "Identify spoofed sender domain",
            id: "phishing-beginner-1",
            topic: "phishing",
            level: "beginner",
            briefing: "You are a SOC analyst at TechCorp. An employee reported a suspicious email claiming to be from 'IT Support' regarding a mandatory security update.",
            task: "Inspect the specific sender domain to determine if it matches the official TechCorp domain (techcorp.com).",
            artifacts: {
                email: {
                    sender: "IT Support <support@techcorp-security-update.com>",
                    subject: "Action Required: Mandatory Security Update",
                    body: "Dear User,\n\nPlease install the attached security patch immediately to avoid account lockout.\n\nRegards,\nIT Support",
                    to: "employee@techcorp.com",
                    date: "2024-03-15T09:30:00Z"
                }
            },
            question: "What is the primary indicator that this email is spoofed?",
            options: [
                "The email mentions a 'security patch'.",
                "The sender domain 'techcorp-security-update.com' does not match the official 'techcorp.com'.",
                "The email was sent at 9:30 AM.",
                "The subject line contains 'Action Required'."
            ],
            correctAnswer: "The sender domain 'techcorp-security-update.com' does not match the official 'techcorp.com'.",
            explanation: "Attackers often register look-alike domains (typosquatting or appending words) to trick users. Always verify the domain matches the official organization exactly."
        },
        {
            title: "Detect display-name impersonation",
            id: "phishing-beginner-2",
            topic: "phishing",
            level: "beginner",
            briefing: "The CFO, Sarah Jenkins, seemingly sent an email to the finance team requesting an urgent invoice payment to a new vendor.",
            task: "Analyze the sender's display name versus the actual email address.",
            artifacts: {
                email: {
                    sender: "Sarah Jenkins (CFO) <sarah.jenkins.personal.finance@gmail.com>",
                    subject: "Urgent: Vendor Payment 4421",
                    body: "Hi Team,\n\nPlease process this invoice immediately. I'm in a meeting and can't access the portal.\n\nThanks,\nSarah",
                    to: "accounts@techcorp.com",
                    date: "2024-03-16T14:15:00Z"
                }
            },
            question: "Why is this email considered suspicious despite the display name saying 'Sarah Jenkins (CFO)'?",
            options: [
                "The email content is too short.",
                "The sender is using a public Gmail address instead of a corporate account.",
                "The invoice number 4421 is invalid.",
                "The email was sent in the afternoon."
            ],
            correctAnswer: "The sender is using a public Gmail address instead of a corporate account.",
            explanation: "Display Name Spoofing is a common tactic where attackers change their visible name to a trusted executive, hoping the recipient ignores the actual email address (e.g., @gmail.com)."
        },
        {
            title: "Compare visible link vs actual URL",
            id: "phishing-beginner-3",
            topic: "phishing",
            level: "beginner",
            briefing: "A user received an email stating their password has expired. The email contains a link labeled 'Reset Password'.",
            task: "Hover over the link to reveal its actual destination.",
            artifacts: {
                email: {
                    sender: "Identity Services <no-reply@techcorp.com>",
                    subject: "Password Expiry Notification",
                    body: "Your password has expired. Click below to reset it.",
                    linkText: "Reset Password",
                    linkUrl: "http://bit.ly/3x89sA (redirects to: standard-bank-login.fake-site.net)",
                    to: "user@techcorp.com",
                    date: "2024-03-17T08:00:00Z"
                }
            },
            question: "Where does the 'Reset Password' link actually lead?",
            options: [
                "The official TechCorp password reset page.",
                "A shortened bit.ly link masking a suspicious domain.",
                "Microsoft Office 365 login.",
                "An internal intranet page."
            ],
            correctAnswer: "A shortened bit.ly link masking a suspicious domain.",
            explanation: "Phishers use HTML formatting to make links look legitimate (e.g., 'Click Here' or 'secure.microsoft.com') while the underlying href attribute points to a malicious site."
        },
        {
            title: "Spot urgency language",
            id: "phishing-beginner-4",
            topic: "phishing",
            level: "beginner",
            briefing: "You are reviewing an email that prompted a user to panic and almost share their credentials.",
            task: "Identify the psychological trigger used in the email content.",
            artifacts: {
                email: {
                    sender: "System Administrator <admin@techcorp.com>",
                    subject: "FINAL NOTICE: Account Deletion in 1 Hour",
                    body: "We have detected inactivity. Your account will be PERMANENTLY DELETED in 1 hour unless you verify your profile immediately. DO NOT IGNORE.",
                    to: "employee@techcorp.com",
                    date: "2024-03-18T10:00:00Z"
                }
            },
            question: "What social engineering tactic is primarily used in this email?",
            options: [
                "Authority (pretending to be CEO).",
                "Scarcity/Urgency (threatening account deletion).",
                "Likability (being friendly).",
                "Reciprocity (offering a gift)."
            ],
            correctAnswer: "Scarcity/Urgency (threatening account deletion).",
            explanation: "Urgency (e.g., 'Immediate action required', 'Final Notice') is designed to bypass critical thinking and force a quick, emotional reaction."
        },
        {
            title: "Detect generic greeting",
            id: "phishing-beginner-5",
            topic: "phishing",
            level: "beginner",
            briefing: "A marketing employee received a business proposal from an unknown sender.",
            task: "Evaluate the greeting and tone of the email for impersonal indicators.",
            artifacts: {
                email: {
                    sender: "Business Partner <partner@biz-growth.com>",
                    subject: "Proposal for you",
                    body: "Dear Customer,\n\nWe have a great offer for your company. Please open the document.\n\nSincerely,\nSales Team",
                    to: "marketing@techcorp.com",
                    date: "2024-03-19T11:20:00Z"
                }
            },
            question: "Which element suggests this is a mass-market phishing attempt rather than legitimate targeted correspondence?",
            options: [
                "The subject line is 'Proposal for you'.",
                "The generic greeting 'Dear Customer' instead of the employee's name.",
                "The sender is from 'biz-growth.com'.",
                "The email is short."
            ],
            correctAnswer: "The generic greeting 'Dear Customer' instead of the employee's name.",
            explanation: "Legitimate organizations usually address you by name (e.g., 'Dear John'). Generic greetings like 'Dear Customer' or 'Dear Employee' often indicate a blast campaign."
        },
        {
            title: "Basic email header inspection",
            id: "phishing-beginner-6",
            topic: "phishing",
            level: "beginner",
            briefing: "An email claiming to be from 'TechCorp HR' was flagged. You have access to the headers.",
            task: "Analyze the 'Return-Path' header versus the 'From' header.",
            artifacts: {
                email: {
                    sender: "TechCorp HR <hr@techcorp.com>",
                    subject: "Policy Update",
                    headers: [
                        "From: TechCorp HR <hr@techcorp.com>",
                        "To: user@techcorp.com",
                        "Return-Path: <bounce-handler@mass-marketing-spam-service.net>",
                        "Date: Mon, 20 Mar 2024 14:00:00 -0500"
                    ]
                }
            },
            question: "What discrepancy indicates this email might not have originated from TechCorp's internal servers?",
            options: [
                "The Date header is in the past.",
                "The Return-Path domain does not match the From domain.",
                "The To address is valid.",
                "The subject is 'Policy Update'."
            ],
            correctAnswer: "The Return-Path domain does not match the From domain.",
            explanation: "The Return-Path (envelope sender) shows where bounce messages go. If it points to an unrelated marketing or spam service while the From header says 'HR', it's likely spoofed."
        },
        {
            title: "External email warning interpretation",
            id: "phishing-beginner-7",
            topic: "phishing",
            level: "beginner",
            briefing: "The Secure Email Gateway added a banner to an incoming email.",
            task: "Determine the significance of the '[EXTERNAL]' warning in this context.",
            artifacts: {
                email: {
                    sender: "TechCorp Service Desk <service@techcorp-support-portal.com>",
                    subject: "Ticket #9921 updated",
                    body: "[EXTERNAL EMAIL] - This email originated outside of TechCorp. Do not click links or open attachments unless you recognize the sender.\n\nYour ticket has been updated. Click here to view.",
                    to: "user@techcorp.com"
                }
            },
            question: "Why is the [EXTERNAL] banner critical evidence here?",
            options: [
                "It proves the email contains a virus.",
                "It contradicts the sender's claim to be the internal 'TechCorp Service Desk'.",
                "It means the email was encrypted.",
                "It indicates the email is low priority."
            ],
            correctAnswer: "It contradicts the sender's claim to be the internal 'TechCorp Service Desk'.",
            explanation: "If an email claims to be from an internal department (Service Desk) but carries an [EXTERNAL] tag, it is almost certainly an impersonation attack."
        },
        {
            title: "Grammar & formatting red flags",
            id: "phishing-beginner-8",
            topic: "phishing",
            level: "beginner",
            briefing: "A user reported a suspicious email from a known vendor, 'CloudStorage Co'.",
            task: "Review the email body for linguistic anomalies.",
            artifacts: {
                email: {
                    sender: "CloudStorage Support <support@cloudstorage.com>",
                    subject: "Account Alert",
                    body: "Dear Valued User,\n\nWe has notice suspicious active on your account. Kindly please to verify your credential immediately. Failure to doing so result in suspension.\n\nRegard,\nSupport",
                    to: "user@techcorp.com"
                }
            },
            question: "What is the most obvious indicator of illegitimacy in this email?",
            options: [
                "The sender address looks correct.",
                "Poor grammar and awkward phrasing (e.g., 'We has notice', 'Kindly please to verify').",
                "The subject is 'Account Alert'.",
                "The email uses a standard font."
            ],
            correctAnswer: "Poor grammar and awkward phrasing (e.g., 'We has notice', 'Kindly please to verify').",
            explanation: "Professional organizations have editorial standards. Significant grammar errors and awkward phrasing are strong indicators of a phishing attempt, often from non-native speakers."
        },
        {
            title: "Attachment extension risk check",
            id: "phishing-beginner-9",
            topic: "phishing",
            level: "beginner",
            briefing: "An email arrived with an invoice attached. The user asks if it's safe to open.",
            task: "Inspect the file extension of the attachment.",
            artifacts: {
                email: {
                    sender: "Vendor Billing <billing@trusted-vendor.com>",
                    subject: "Invoice INV-2024-001",
                    body: "Please find attached the invoice for March services.",
                    attachment: "Invoice_March_2024.pdf.exe",
                    to: "finance@techcorp.com"
                }
            },
            question: "What is dangerous about the file 'Invoice_March_2024.pdf.exe'?",
            options: [
                "It is a PDF file.",
                "It is an executable file (.exe) disguised with a double extension.",
                "The filename is too long.",
                "It contains the word 'Invoice'."
            ],
            correctAnswer: "It is an executable file (.exe) disguised with a double extension.",
            explanation: "Attackers use double extensions (e.g., .pdf.exe) to trick users into thinking a file is a document when it is actually a malicious executable program. Windows often hides the final extension by default."
        },
        {
            title: "Full email classification (basic)",
            id: "phishing-beginner-10",
            topic: "phishing",
            level: "beginner",
            briefing: "You have analyzed 9 separate indicators. Now apply your knowledge to a new sample.",
            task: "Review the email and make a final classification decision.",
            artifacts: {
                email: {
                    sender: "Netflix Support <support@netflix-account-verify.com>",
                    subject: "Payment Failed",
                    body: "We could not process your payment. Click here to update your card.",
                    linkUrl: "http://netflix-secure-update.com",
                    headers: ["Return-Path: <bounce@netflix-account-verify.com>"],
                    to: "user@gmail.com"
                }
            },
            question: "Based on the sender domain and link, how should you classify this email?",
            options: [
                "Legitimate - It's from Netflix Support.",
                "Phishing - The domain 'netflix-account-verify.com' is not the official 'netflix.com'.",
                "Spam - It's just an advertisement.",
                "Unknown - Need more information."
            ],
            correctAnswer: "Phishing - The domain 'netflix-account-verify.com' is not the official 'netflix.com'.",
            explanation: "This is a classic phishing attack. The sender uses a look-alike domain that includes the brand name ('netflix') but is not the official domain. The urgency (payment failed) is the hook."
        }
    ],
    intermediate: [
        {
            title: "SPF result analysis",
            id: "phishing-intermediate-1",
            topic: "phishing",
            level: "intermediate",
            briefing: "An email claiming to be from 'Google Support' was flagged by the spam filter. You need to analyze the Sender Policy Framework (SPF) results.",
            task: "Examine the 'Received-SPF' header to determine if the sending server is authorized.",
            artifacts: {
                email: {
                    sender: "Google Support <support@google.com>",
                    subject: "Account Recovery",
                    headers: [
                        "Received-SPF: softfail (google.com: domain of transition does not designate 192.168.1.55 as permitted sender)",
                        "From: Google Support <support@google.com>"
                    ]
                }
            },
            question: "What does the SPF 'softfail' status indicate in this context?",
            options: [
                "The email is definitely legitimate.",
                "The sending IP (192.168.1.55) is NOT an authorized sender for google.com.",
                "The email was encrypted.",
                "The sender's domain uses DMARC."
            ],
            correctAnswer: "The sending IP (192.168.1.55) is NOT an authorized sender for google.com.",
            explanation: "SPF checks if the sending IP is listed in the domain's DNS records. A 'fail' or 'softfail' means the IP is not authorized, strongly suggesting spoofing."
        },
        {
            title: "DKIM signature verification",
            id: "phishing-intermediate-2",
            topic: "phishing",
            level: "intermediate",
            briefing: "A banking alert email appears to have been modified in transit.",
            task: "Check the DKIM-Signature header for integrity validation.",
            artifacts: {
                email: {
                    sender: "Chase Bank <alerts@chase.com>",
                    subject: "Suspicious Transaction",
                    headers: [
                        "DKIM-Signature: v=1; a=rsa-sha256; d=chase.com; ... bh=...; b=...",
                        "Authentication-Results: dkim=fail (body hash did not verify)"
                    ]
                }
            },
            question: "What does 'dkim=fail (body hash did not verify)' imply?",
            options: [
                "The email encryption key is expired.",
                "The email content (body) was altered after it was signed by the sender.",
                "The sender forgot to sign the email.",
                "The receiver's server is offline."
            ],
            correctAnswer: "The email content (body) was altered after it was signed by the sender.",
            explanation: "DKIM ensures message integrity. If the body hash doesn't verify, it means the email content has been tampered with or corrupted after leaving the signing server."
        },
        {
            title: "DMARC policy evaluation",
            id: "phishing-intermediate-3",
            topic: "phishing",
            level: "intermediate",
            briefing: "You are investigating why a spoofed email was NOT blocked by the gateway.",
            task: "Analyze the domain's DMARC policy in the DNS records.",
            artifacts: {
                dns: {
                    domain: "company-partners.com",
                    record_type: "TXT",
                    value: "v=DMARC1; p=none; rua=mailto:dmarc@company-partners.com"
                },
                email_status: "SPF=fail, DKIM=fail, DMARC=fail, Action=Delivered"
            },
            question: "Why was this phishing email delivered despite failing SPF and DKIM checks?",
            options: [
                "The DMARC policy is set to 'p=none' (monitoring only).",
                "The firewall was disabled.",
                "The email was whitelisted.",
                "The attacker used a magical exploit."
            ],
            correctAnswer: "The DMARC policy is set to 'p=none' (monitoring only).",
            explanation: "DMARC tells the receiver what to do if SPF/DKIM fail. A policy of 'p=none' means 'take no action, just report it'. For protection, it should be 'p=quarantine' or 'p=reject'."
        },
        {
            title: "Reply-To mismatch detection",
            id: "phishing-intermediate-4",
            topic: "phishing",
            level: "intermediate",
            briefing: "A CEO fraud attempt relies on the recipient hitting 'Reply'.",
            task: "Compare the 'From' address with the 'Reply-To' address.",
            artifacts: {
                email: {
                    sender: "Elon Musk <elon@tesla.com>",
                    subject: "Project Omega",
                    replyTo: "elon.private.investments@protonmail.com",
                    body: "Reply directly to this thread with the confidential roadmap."
                }
            },
            question: "Where will your response go if you click Reply?",
            options: [
                "elon@tesla.com (The sender)",
                "elon.private.investments@protonmail.com (The attacker)",
                "The Tesla IT department",
                "Nowhere."
            ],
            correctAnswer: "elon.private.investments@protonmail.com (The attacker)",
            explanation: "The 'Reply-To' header overrides the 'From' header for responses. Attackers spoof the From address to look legit but set Reply-To to their own inbox to capture the victim's response."
        },
        {
            title: "Look-alike domain analysis",
            id: "phishing-intermediate-5",
            topic: "phishing",
            level: "intermediate",
            briefing: "An account limit warning was sent from 'PayPal Support'.",
            task: "Identify the subtle difference in the sender domain.",
            artifacts: {
                email: {
                    sender: "PayPal Security <service@paypaI.com>",
                    subject: "Account Limited",
                    note: "Look closely at the domain 'paypaI.com' (Capital 'i' instead of 'l')."
                }
            },
            question: "What technique is used in the domain 'paypaI.com'?",
            options: [
                "Subdomain takeover.",
                "Homograph attack / Typosquatting (using distinct chars that look identical).",
                "DNS Cache Poisoning.",
                "Domain hijacking."
            ],
            correctAnswer: "Homograph attack / Typosquatting (using distinct chars that look identical).",
            explanation: "Attackers replace characters (like 'l' with 'I' or 'rn' with 'm') to create domains that are visually indistinguishable from the target brand."
        },
        {
            title: "HTML vs plaintext email comparison",
            id: "phishing-intermediate-6",
            topic: "phishing",
            level: "intermediate",
            briefing: "An email looks totally different when viewed as raw source code.",
            task: "Compare the rendered view with the source code.",
            artifacts: {
                rendered: "Click here to unsubscribe.",
                source: "<a href='http://malware-site.com/loader.exe'>Click here to unsubscribe</a>"
            },
            question: "What is the hidden danger in the source code?",
            options: [
                "The link extracts cookies.",
                "The text says 'unsubscribe' but leads to an .exe download.",
                "The text is white on a white background.",
                "There is a tracking pixel."
            ],
            correctAnswer: "The text says 'unsubscribe' but leads to an .exe download.",
            explanation: "Mismatched context is a key indicator. A user expects 'unsubscribe' to lead to a web form, not a file download."
        },
        {
            title: "Image-based phishing detection",
            id: "phishing-intermediate-7",
            topic: "phishing",
            level: "intermediate",
            briefing: "An email contains no text, only a single large image.",
            task: "Analyze the email structure.",
            artifacts: {
                email: {
                    body: "[IMAGE: 'Your invoice is ready. Click to view.']",
                    link: "Linked to http://phishing-site.com",
                    text_content: "NULL"
                }
            },
            question: "Why do attackers use image-only emails?",
            options: [
                "It looks more professional.",
                "To evade text-based keyword filters (Bayesian analysis).",
                "It loads faster.",
                "To hide their IP address."
            ],
            correctAnswer: "To evade text-based keyword filters (Bayesian analysis).",
            explanation: "Spam filters analyze text for words like 'Viagra' or 'Urgent'. By putting text inside an image, attackers bypass these lexical filters."
        },
        {
            title: "Credential-harvesting page indicators",
            id: "phishing-intermediate-8",
            topic: "phishing",
            level: "intermediate",
            briefing: "A user clicked a link and landed on a Microsoft 365 login page.",
            task: "Inspect the page artifacts.",
            artifacts: {
                url: "https://login-microsoft-online-secure-auth.web.app",
                page_title: "Sign in to your account",
                favicon: "Microsoft Logo",
                ssl_cert: "Issued to 'Google Trust Services' (for web.app)"
            },
            question: "What confirms this is a phishing page despite the padlock icon?",
            options: [
                "The page title is 'Sign in to your account'.",
                "The domain is hosted on 'web.app' (Firebase free hosting) not microsoft.com.",
                "The SSL certificate is valid.",
                "The favicon is blue."
            ],
            correctAnswer: "The domain is hosted on 'web.app' (Firebase free hosting) not microsoft.com.",
            explanation: "Attackers often use free hosting (Firebase, Azure Apps, Vercel) to host phishing pages. These sites have valid SSL certs (padlock), misleading users."
        },
        {
            title: "Email thread hijacking detection",
            id: "phishing-intermediate-9",
            topic: "phishing",
            level: "intermediate",
            briefing: "You received a reply to an actual old conversation thread.",
            task: "Determine why this 'reply' is malicious.",
            artifacts: {
                email: {
                    subject: "Re: Project Launch (Meeting Notes)",
                    sender: "Vendor Contact <compromised-account@vendor.com>",
                    body: "Hi,\n\nI forgot to attach the updated schedule in our last thread. See attached.\n\n> On Mon, Jan 10, 2024...",
                    attachment: "Schedule_Update.zip"
                }
            },
            question: "What makes thread hijacking (conversation hijacking) so effective?",
            options: [
                "It exploits the existing trust context of a real conversation.",
                "The subject line is blank.",
                "The attachment is small.",
                "It uses a Gmail address."
            ],
            correctAnswer: "It exploits the existing trust context of a real conversation.",
            explanation: "By replying to a real stolen email thread, the attacker bypasses the victim's initial skepticism because the context (previous messages) is legitimate. This usually implies the sender's account was compromised."
        },
        {
            title: "Full email verdict with justification",
            id: "phishing-intermediate-10",
            topic: "phishing",
            level: "intermediate",
            briefing: "Perform a comprehensive analysis of the suspect email.",
            task: "Review headers, sender, and content to render a verdict.",
            artifacts: {
                email: {
                    sender: "Amazon Service <orders@amazon-shipping-update.net>",
                    subject: "Delivery Update: Order #112-334",
                    headers: ["SPF=softfail", "DKIM=none"],
                    link: "http://track-my-package.xyz"
                }
            },
            question: "Select the most accurate classification.",
            options: [
                "Legitimate - SPF softfail is common.",
                "Phishing - Mismatched domain, failed auth, suspicious TLD (.xyz).",
                "Marketing Spam.",
                "Internal Test."
            ],
            correctAnswer: "Phishing - Mismatched domain, failed auth, suspicious TLD (.xyz).",
            explanation: "The combination of a look-alike domain, weak authentication (SPF softfail/no DKIM), and a suspicious link TLD confirms this is a phishing attack."
        }
    ],
    advanced: [
        {
            title: "Multi-stage phishing flow analysis",
            id: "phishing-advanced-1",
            topic: "phishing",
            level: "advanced",
            briefing: "A user reported a suspicious email that links to a file sharing site. The initial link seems safe.",
            task: "Trace the attack chain from email to payload.",
            artifacts: {
                email: {
                    sender: "SharePoint Services <notifications@sharepoint-online-secure.com>",
                    body: "You have a new shared document. Click to view.",
                    link: "https://onedrive.live.com/view?id=...",
                    destination_analysis: "The OneDrive link hosts a PDF. The PDF contains a link to a fake login page."
                }
            },
            question: "Why do attackers use legitimate services like OneDrive or Google Drive in the first stage?",
            options: [
                "To save hosting costs.",
                "To bypass Secure Email Gateways (SEGs) that whitelist reputable domains.",
                "It is easier to set up.",
                "To make the email file size smaller."
            ],
            correctAnswer: "To bypass Secure Email Gateways (SEGs) that whitelist reputable domains.",
            explanation: "Legitimate file-hosting links (OneDrive, Google Drive) often pass email filters. The malicious payload (link or malware) is hidden inside the hosted file, creating a multi-stage attack."
        },
        {
            title: "Brand impersonation techniques",
            id: "phishing-advanced-2",
            topic: "phishing",
            level: "advanced",
            briefing: "An email looks exactly like a standard Microsoft security alert.",
            task: "Analyze the HTML and CSS for impersonation indicators.",
            artifacts: {
                source_code: {
                    css: "font-family: 'Segoe UI'; color: #0078D4;",
                    images: "<img src='https://microsoft.com/assets/logo.png'>",
                    link: "<a href='http://login-microsoft.com'>Verify Activity</a>"
                }
            },
            question: "Does linking to official images (hotlinking) make an email legitimate?",
            options: [
                "Yes, it proves the sender is Microsoft.",
                "No, anyone can link to a public image resource in their HTML.",
                "Yes, because the image loads from microsoft.com.",
                "No, because the image is broken."
            ],
            correctAnswer: "No, anyone can link to a public image resource in their HTML.",
            explanation: "Phishers hotlink to official assets to make the email render perfectly. This does not validate the sender; check the href (link destination) instead."
        },
        {
            title: "Email gateway bypass indicators",
            id: "phishing-advanced-3",
            topic: "phishing",
            level: "advanced",
            briefing: "An email managed to bypass the text-based spam filter.",
            task: "Inspect the raw text for obfuscation techniques.",
            artifacts: {
                raw_text: "Y.our P.ass.word h.as ex.pir.ed. C.lick h.ere.",
                hidden_chars: "Zero-width spaces detected between letters."
            },
            question: "What is the purpose of inserting zero-width spaces or random dots?",
            options: [
                "To make it look artistic.",
                "To confuse the recipient.",
                "To break keyword matching signatures in the email gateway.",
                "To increase file size."
            ],
            correctAnswer: "To break keyword matching signatures in the email gateway.",
            explanation: "Obfuscation breaks string matching. A filter looking for 'Password' won't match 'P.ass.word', but a human can still read it."
        },
        {
            title: "Header chain anomaly detection",
            id: "phishing-advanced-4",
            topic: "phishing",
            level: "advanced",
            briefing: "Verify the path this email took to reach the inbox.",
            task: "Analyze the 'Received' headers for suspicious hops.",
            artifacts: {
                headers: [
                    "Received: from mail.evil-server.ru (85.x.x.x)",
                    "Received: by mx.google.com ...",
                    "X-Original-To: victim@company.com"
                ]
            },
            question: "Why is a 'Received' header from a .ru server suspicious for a purported US-based bank email?",
            options: [
                "It isn't; banks have global servers.",
                "It indicates the email originated from high-risk infrastructure not aligning with the brand.",
                "It means the email was delayed.",
                "It indicates a VPN usage."
            ],
            correctAnswer: "It indicates the email originated from high-risk infrastructure not aligning with the brand.",
            explanation: "Geo-location and reputation of the originating server (the bottom-most Received header) provide clues. a US bank sending from a residential IP in Russia is highly suspect."
        },
        {
            title: "Malicious attachment sandbox reasoning",
            id: "phishing-advanced-5",
            topic: "phishing",
            level: "advanced",
            briefing: "An automated sandbox failed to detect the malware in an attachment.",
            task: "Analyze the malware behavior report.",
            artifacts: {
                attachment: "Resume.docm",
                behavior: "The macro only executes if the mouse moves (User Interaction).",
                sandbox_status: "Clean (No malicious activity observed)"
            },
            question: "Why did the sandbox mark this file as clean?",
            options: [
                "The malware is broken.",
                "The malware detects the sandbox environment (which lacks mouse movement) and behaves passively.",
                "The sandbox is offline.",
                "Macros are always safe."
            ],
            correctAnswer: "The malware detects the sandbox environment (which lacks mouse movement) and behaves passively.",
            explanation: "Evasion techniques include checking for human interaction (mouse clicks, movement). Automated sandboxes often lack this, so the malware stays dormant to avoid detection."
        },
        {
            title: "Embedded tracking pixel detection",
            id: "phishing-advanced-6",
            topic: "phishing",
            level: "advanced",
            briefing: "An email contains a 1x1 transparent image.",
            task: "Determine the function of this hidden artifact.",
            artifacts: {
                html: "<img src='http://tracker.marketing-tool.com/open?id=user123' width='1' height='1' />"
            },
            question: "What information does the attacker gain if you simply open (preview) this email?",
            options: [
                "Your password.",
                "Your file system contents.",
                "Confirmation that your email address is valid and active.",
                "Nothing."
            ],
            correctAnswer: "Confirmation that your email address is valid and active.",
            explanation: "Tracking pixels load from a remote server when the email is opened. This validates the email address for future attacks and reveals the user's IP/location."
        },
        {
            title: "OAuth phishing detection",
            id: "phishing-advanced-7",
            topic: "phishing",
            level: "advanced",
            briefing: "A user received a link to 'Authorize App'. It leads to a legitimate Microsoft login page.",
            task: "Inspect the permissions requested by the app '0ffice_Management_Tool'.",
            artifacts: {
                url: "login.microsoftonline.com",
                app_name: "0ffice_Management_Tool (Unverified Publisher)",
                permissions: "Read your emails, Read your contacts, Sign in as you."
            },
            question: "Why is this dangerous even though the login page is real?",
            options: [
                "It isn't dangerous.",
                "If the user consents, the attacker gains persistent access to their data without needing a password.",
                "The app name has a typo.",
                "Microsoft doesn't allow third-party apps."
            ],
            correctAnswer: "If the user consents, the attacker gains persistent access to their data without needing a password.",
            explanation: "OAuth phishing (Illicit Consent Grant) tricks users into granting an attacker's app access to their data. The attacker gets an OAuth token, bypassing MFA and password changes."
        },
        {
            title: "Email redirect chain analysis",
            id: "phishing-advanced-8",
            topic: "phishing",
            level: "advanced",
            briefing: "A link in an email goes through multiple hops.",
            task: "Trace the redirection path.",
            artifacts: {
                link: "http://t.co/xyz",
                hop1: "http://bit.ly/abc",
                hop2: "http://open-redirect.com/?url=http://phishing.com",
                final: "http://phishing.com"
            },
            question: "What is an 'Open Redirect' vulnerability used here?",
            options: [
                "A broken link.",
                "A legitimate site that allows attackers to bounce users to a malicious site via a URL parameter.",
                "A DNS error.",
                "A browser feature."
            ],
            correctAnswer: "A legitimate site that allows attackers to bounce users to a malicious site via a URL parameter.",
            explanation: "Attackers use trusted sites with Open Redirects to bypass filters. The email link points to 'trusted.com', which then silently redirects the user to 'phishing.com'."
        },
        {
            title: "Phishing kit fingerprinting",
            id: "phishing-advanced-9",
            topic: "phishing",
            level: "advanced",
            briefing: "You have obtained the source code of the phishing landing page.",
            task: "Find the author's signature or comments.",
            artifacts: {
                source: "<!-- 16Shop Phishing Kit v2.1 -->\n<!-- Coded by Devil -->"
            },
            question: "What is a Phishing Kit?",
            options: [
                "A tutorial video.",
                "A pre-packaged archive of phishing pages and scripts sold to attackers.",
                "A list of emails.",
                "A defensive tool."
            ],
            correctAnswer: "A pre-packaged archive of phishing pages and scripts sold to attackers.",
            explanation: "Phishing kits allow low-skill attackers to deploy sophisticated campaigns. They often contain comments or signatures identifying the creator."
        },
        {
            title: "Incident response decision making",
            id: "phishing-advanced-10",
            topic: "phishing",
            level: "advanced",
            briefing: "A phishing campaign has reached 50 users. 2 likely clicked.",
            task: "Select the immediate containment step.",
            artifacts: {
                impact: "50 delivered, 2 clicked, 0 reports.",
                threat: "Credential harvester."
            },
            question: "What is the highest priority action?",
            options: [
                "Email the entire company a warning.",
                "Reset passwords for the 2 clickers and purge the email from all 50 inboxes.",
                "Call the police.",
                "Update the firewall."
            ],
            correctAnswer: "Reset passwords for the 2 clickers and purge the email from all 50 inboxes.",
            explanation: "Containment requires stopping the bleeding. Securing compromised accounts and removing the threat from others to prevent further clicks is the standard first response."
        }
    ],
    expert: [
        {
            title: "Executive impersonation analysis",
            id: "phishing-expert-1",
            topic: "phishing",
            level: "expert",
            briefing: "The CFO received an email from the CEO asking for a 'private favor'. No links, no attachments.",
            task: "Analyze the linguistics and context of this Whaling attack.",
            artifacts: {
                email: {
                    sender: "John Doe <ceo-private-consulting@gmail.com>",
                    subject: "Confidential Request",
                    body: "Sarah, are you at your desk? I need you to handle a discrete transfer for an acquisition. Wires only. Reply when you get this."
                }
            },
            question: "Why is this type of BEC (Business Email Compromise) so hard to detect?",
            options: [
                "It uses a Gmail address.",
                "It lacks technical payloads (links/attachments) and relies entirely on social engineering and authority.",
                "The English is perfect.",
                "It was sent at night."
            ],
            correctAnswer: "It lacks technical payloads (links/attachments) and relies entirely on social engineering and authority.",
            explanation: "Standard filters look for bad links or malware. BEC relies on pure conversation and manipulation of high-value targets (Whaling)."
        },
        {
            title: "Business Email Compromise (BEC) triage",
            id: "phishing-expert-2",
            topic: "phishing",
            level: "expert",
            briefing: "A vendor messaged stating their bank account has changed.",
            task: "Verify the authenticity of the change request.",
            artifacts: {
                email: {
                    sender: "Vendor Accounts <billing@valid-vendor.com> (Actual valid account)",
                    body: "Please update our payment details to the following account for the new invoice..."
                },
                context: "The sender address is legitimate (not spoofed)."
            },
            question: "If the sender address is real, what has likely happened?",
            options: [
                "The vendor's email account has been compromised (Account Takeover).",
                "It's a system error.",
                "The vendor is playing a prank.",
                "It is a spoof."
            ],
            correctAnswer: "The vendor's email account has been compromised (Account Takeover).",
            explanation: "In BEC, attackers often compromise a partner's email account to send authntic-looking fraud requests. This is 'Vendor Email Compromise' (VEC). Verification via phone call is required."
        },
        {
            title: "Vendor invoice fraud detection",
            id: "phishing-expert-3",
            topic: "phishing",
            level: "expert",
            briefing: "You detected a fake invoice that perfectly mimics a standard template.",
            task: "Find the single discrepancy in the banking details.",
            artifacts: {
                invoice_details: {
                    vendor: "Global Logistics",
                    amount: "$45,000",
                    bank_name: "Swift Bank (Legit)",
                    account_number: "Changed from last month",
                    contact_email: "support@globallogistics-billing.com"
                }
            },
            question: "Which mechanism protects against this specific fraud?",
            options: [
                "Anti-virus software.",
                "Out-of-band verification (calling the vendor/internal approval process).",
                "Spam filters.",
                "SSL Certificates."
            ],
            correctAnswer: "Out-of-band verification (calling the vendor/internal approval process).",
            explanation: "Technical controls often fail against valid-looking social engineering. Process controls (finance procedures) are the primary defense."
        },
        {
            title: "Domain reputation intelligence usage",
            id: "phishing-expert-4",
            topic: "phishing",
            level: "expert",
            briefing: "An email arrived from a domain created 2 hours ago.",
            task: "Assess the risk based on domain age.",
            artifacts: {
                domain: "legal-support-services.net",
                whois_data: "Created Date: 2024-03-20 (Today)",
                registrar: "CheapNames LLC"
            },
            question: "Why do security systems flag 'Newly Registered Domains' (NRDs)?",
            options: [
                "They are unstable.",
                "Legitimate businesses rarely use brand new domains for immediate critical communication.",
                "They are expensive.",
                "They lack SSL."
            ],
            correctAnswer: "Legitimate businesses rarely use brand new domains for immediate critical communication.",
            explanation: "Attackers register domains and use them immediately (churn and burn). A domain less than 30 days old sending business email is highly suspicious."
        },
        {
            title: "Cross-mailbox phishing correlation",
            id: "phishing-expert-5",
            topic: "phishing",
            level: "expert",
            briefing: "10 users reported different emails, but they share a hidden link.",
            task: "Identify the campaign indicator.",
            artifacts: {
                report_1: "Subject: Invoice, Link: bit.ly/123",
                report_2: "Subject: Voicemail, Link: bit.ly/123",
                report_3: "Subject: Fax, Link: bit.ly/123"
            },
            question: "What does this pattern indicate?",
            options: [
                "Coincidence.",
                "A Polymorphic Phishing Campaign.",
                "System error.",
                "User error."
            ],
            correctAnswer: "A Polymorphic Phishing Campaign.",
            explanation: "The attacker varies the subject and body (polymorphism) to evade signature detection, but reuses the payload/infrastructure."
        },
        {
            title: "Phishing campaign clustering",
            id: "phishing-expert-6",
            topic: "phishing",
            level: "expert",
            briefing: "You have 3 separate phishing incidents from the last month.",
            task: "Link them to the same Threat Actor.",
            artifacts: {
                incident_A: "Sender IP: 1.2.3.4",
                incident_B: "Sender IP: 5.6.7.8 (Different)",
                incident_C: "Sender IP: 9.10.11.12 (Different)",
                commonality: "All used the same unique phrase 'Kindly revert back immediately' and hosted on 'files.000webhost.com'."
            },
            question: "What is this analysis called?",
            options: [
                "Attribution / Clustering.",
                "Reverse Engineering.",
                "Penetration Testing.",
                "Auditing."
            ],
            correctAnswer: "Attribution / Clustering.",
            explanation: "Identifying TTPs (Tactics, Techniques, and Procedures) allows SOCs to link separate events to a single campaign or actor."
        },
        {
            title: "SOC escalation workflow decision",
            id: "phishing-expert-7",
            topic: "phishing",
            level: "expert",
            briefing: "A phishing email was clicked by a Domain Admin.",
            task: "Determine the severity and escalation path.",
            artifacts: {
                user_role: "Domain Administrator",
                action: "Entered credentials on phishing site",
                mfa_status: "MFA prompt approved by user"
            },
            question: "What is the severity of this incident?",
            options: [
                "Low - Just a phishing link.",
                "Medium - One user affected.",
                "Critical - Potential full domain compromise.",
                "High - Admin account."
            ],
            correctAnswer: "Critical - Potential full domain compromise.",
            explanation: "A Domain Admin account compromise can lead to total network takeover. This is a top-priority (Critical) emergency."
        },
        {
            title: "Legal & compliance response choice",
            id: "phishing-expert-8",
            topic: "phishing",
            level: "expert",
            briefing: "A phishing attack succeeded and customer data was exfiltrated.",
            task: "Decide the mandatory reporting action.",
            artifacts: {
                data_type: "PII (Social Security Numbers)",
                location: "California, USA",
                regulation: "CCPA / GPDR"
            },
            question: "What is often legally required after a data breach?",
            options: [
                "Firing the employee.",
                "Notifying affected individuals and regulators within a specific timeframe (e.g., 72 hours).",
                "Shutting down the company.",
                "Hacking back."
            ],
            correctAnswer: "Notifying affected individuals and regulators within a specific timeframe (e.g., 72 hours).",
            explanation: "Privacy laws (GDPR, CCPA, HIPAA) mandate breach notification within strict timelines."
        },
        {
            title: "Post-incident reporting task",
            id: "phishing-expert-9",
            topic: "phishing",
            level: "expert",
            briefing: "The incident is closed. You must write the 'Lessons Learned'.",
            task: "Select the most valuable strategic recommendation.",
            artifacts: {
                root_cause: "User clicked link.",
                failure: "Gateway missed it.",
                impact: "Ransomware installed."
            },
            question: "Which recommendation improves long-term resilience?",
            options: [
                "Tell users to be more careful.",
                "Implement FIDO2 hardware keys (resistant to phishing) and tighten gateway policies.",
                "Fire the CISO.",
                "Buy insurance."
            ],
            correctAnswer: "Implement FIDO2 hardware keys (resistant to phishing) and tighten gateway policies.",
            explanation: "Systemic fixes (Hardware MFA, better technical controls) are more effective than purely blaming user behavior."
        },
        {
            title: "Enterprise phishing mitigation planning",
            id: "phishing-expert-10",
            topic: "phishing",
            level: "expert",
            briefing: "You are designing a defense-in-depth strategy for phishing.",
            task: "Order the controls from Pre-delivery to Post-delivery.",
            artifacts: {
                controls: ["User Training", "Secure Email Gateway", "Endpoint Detection Response (EDR)"]
            },
            question: "What is the logical order of defense?",
            options: [
                "EDR -> Gateway -> Training",
                "Gateway (Filter) -> Training (Human check) -> EDR (Safety net if clicked).",
                "Training -> EDR -> Gateway",
                "All at once."
            ],
            correctAnswer: "Gateway (Filter) -> Training (Human check) -> EDR (Safety net if clicked).",
            explanation: "Filter first (stop it reaching the user), then Human awareness (don't click if it proceeds), then Endpoint protection (stop execution if clicked)."
        }
    ]
};

module.exports = phishing;
