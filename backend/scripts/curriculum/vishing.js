const vishing = {
    "beginner": [
        {
            "title": "Tech Support Scam",
            "id": "vishing-beginner-1",
            "topic": "vishing",
            "level": "beginner",
            "briefing": "You receive a call from 'Microsoft Windows Support' claiming your computer has a virus.",
            "task": "Identify the classic tech support fraud indicators.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Number",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Operator",
                            "text": "Hello, I am calling from Windows Service Center."
                        },
                        {
                            "time": 6,
                            "speaker": "Caller",
                            "text": "Your IP address is sending error messages."
                        },
                        {
                            "time": 9,
                            "speaker": "Caller",
                            "text": "We need to connect to your PC to fix it."
                        }
                    ],
                    "duration": 14,
                    "audioUrl": "/uploads/audio/vishing/vishing-beginner-1.mp3"
                }
            },
            "question": "Does Microsoft/Apple proactively call customers to fix computer viruses?",
            "options": [
                "Yes, for premium members.",
                "No. Tech companies never make unsolicited calls to fix personal devices.",
                "Only if you have a warranty.",
                "Yes, if the virus is dangerous."
            ],
            "correctAnswer": "No. Tech companies never make unsolicited calls to fix personal devices.",
            "explanation": "This is a standard scam. Legitimate tech companies rely on user-initiated support tickets; they do not monitor individual consumer PCs for viruses."
        },
        {
            "title": "IRS / Tax Authority Threat",
            "id": "vishing-beginner-2",
            "topic": "vishing",
            "level": "beginner",
            "briefing": "A robotic voice mail says you owe taxes and will be arrested.",
            "task": "Analyze the threat tactic.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Caller",
                            "text": "This is the IRS."
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "We are filing a lawsuit against you for tax fraud."
                        },
                        {
                            "time": 9,
                            "speaker": "Caller",
                            "text": "An arrest warrant has been issued."
                        },
                        {
                            "time": 12,
                            "speaker": "Caller",
                            "text": "Call back immediately to pay."
                        }
                    ],
                    "duration": 17,
                    "audioUrl": "/uploads/audio/vishing/vishing-beginner-2.mp3"
                }
            },
            "question": "What is the primary psychological trigger used here?",
            "options": [
                "Greed.",
                "Fear (Urgency/Threat of Arrest).",
                "Curiosity.",
                "Helpfulness."
            ],
            "correctAnswer": "Fear (Urgency/Threat of Arrest).",
            "explanation": "Vishing attacks often use extreme fear (arrest, lawsuit, deportation) to bypass critical thinking and force immediate compliance."
        },
        {
            "title": "Grandparent Scam",
            "id": "vishing-beginner-3",
            "topic": "vishing",
            "level": "beginner",
            "briefing": "A caller claims to be your grandson 'Mikey' who is in jail.",
            "task": "Verify the caller's identity.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Caller",
                            "text": "Grandma?"
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "It's me."
                        },
                        {
                            "time": 8,
                            "speaker": "Caller",
                            "text": "I'm in trouble."
                        },
                        {
                            "time": 11,
                            "speaker": "Caller",
                            "text": "I got arrested in Mexico."
                        },
                        {
                            "time": 14,
                            "speaker": "Caller",
                            "text": "Please don't tell mom."
                        },
                        {
                            "time": 17,
                            "speaker": "Caller",
                            "text": "I need bail money wired now."
                        }
                    ],
                    "duration": 22,
                    "audioUrl": "/uploads/audio/vishing/vishing-beginner-3.mp3"
                }
            },
            "question": "If you receive a distressing call from a 'relative', what should you do?",
            "options": [
                "Wire the money immediately.",
                "Ask 'Is that really you?'.",
                "Hang up and call the relative's known, real phone number to verify.",
                "Keep them on the line."
            ],
            "correctAnswer": "Hang up and call the relative's known, real phone number to verify.",
            "explanation": "Scammers often pose as distressed relatives. Calling the person back on their saved number invalidates the scam immediately."
        },
        {
            "title": "Bank Account Breach Alert",
            "id": "vishing-beginner-4",
            "topic": "vishing",
            "level": "beginner",
            "briefing": "Your bank calls: 'We blocked a $2,000 transaction. Verify your PIN to cancel it.'",
            "task": "Identify the data request red flag.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Bank Bot",
                            "text": "Fraud detected."
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "To cancel the charge of $2,000 at BestBuy, please enter your 4-digit card PIN now."
                        }
                    ],
                    "duration": 13,
                    "audioUrl": "/uploads/audio/vishing/vishing-beginner-4.mp3"
                }
            },
            "question": "Will a bank ever ask for your PIN or Password over the phone?",
            "options": [
                "Yes, to verify identity.",
                "No, never.",
                "Only if you are traveling.",
                "Yes, if you forgot it."
            ],
            "correctAnswer": "No, never.",
            "explanation": "Banks have no reason to ask for your PIN/Password. They use security questions or OTPs. Asking for credentials is a guaranteed scam."
        },
        {
            "title": "Amazon Order Confirmation",
            "id": "vishing-beginner-5",
            "topic": "vishing",
            "level": "beginner",
            "briefing": "A recorded call says you purchased an iPhone for $999.",
            "task": "Decide how to check the order status.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Amazon",
                            "text": "Your order for iPhone 15 Pro is confirmed."
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "$999 will be charged."
                        },
                        {
                            "time": 8,
                            "speaker": "Caller",
                            "text": "To cancel, press 1 to speak with support."
                        }
                    ],
                    "duration": 13,
                    "audioUrl": "/uploads/audio/vishing/vishing-beginner-5.mp3"
                }
            },
            "question": "What is the goal of the 'Press 1 to cancel' prompt?",
            "options": [
                "To help you return the item.",
                "To connect you to a scammer who will ask for your credit card to 'refund' the transaction.",
                "To automate the refund.",
                "To cancel the order."
            ],
            "correctAnswer": "To connect you to a scammer who will ask for your credit card to 'refund' the transaction.",
            "explanation": "The order is fake. The goal is to get you on the phone with a human operator who will steal your financial info under the guise of processing a refund."
        },
        {
            "title": "Lottery Winner Fee",
            "id": "vishing-beginner-6",
            "topic": "vishing",
            "level": "beginner",
            "briefing": "You won the Mega Millions! But you need to pay taxes first.",
            "task": "Analyze the 'Advance Fee' scheme.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Caller",
                            "text": "You won $5 Million!"
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "Congratulations!"
                        },
                        {
                            "time": 8,
                            "speaker": "Caller",
                            "text": "To release the funds, effectively immediately, you just need to pay the $500 processing fee via Western Union."
                        }
                    ],
                    "duration": 18,
                    "audioUrl": "/uploads/audio/vishing/vishing-beginner-6.mp3"
                }
            },
            "question": "Do legitimate lotteries require you to pay a fee to collect winnings?",
            "options": [
                "Yes, for taxes.",
                "No. Taxes are deducted from the winnings; they never ask you to pay upfront.",
                "Yes, for processing.",
                "Depends on the state."
            ],
            "correctAnswer": "No. Taxes are deducted from the winnings; they never ask you to pay upfront.",
            "explanation": "In an 'Advance Fee Fraud', the scammer promises a large reward but requires a small payment first. Once paid, the reward never materializes."
        },
        {
            "title": "Fake Police / Jury Duty Scam",
            "id": "vishing-beginner-7",
            "topic": "vishing",
            "level": "beginner",
            "briefing": "The Sheriff's office calls: You missed jury duty and have a fine.",
            "task": "Recognize the payment method red flag.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Officer",
                            "text": "You have a warrant for missing jury duty."
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "You can pay the $500 fine now to avoid arrest."
                        },
                        {
                            "time": 9,
                            "speaker": "Caller",
                            "text": "We accept Gift Cards or Bitcoin."
                        }
                    ],
                    "duration": 14,
                    "audioUrl": "/uploads/audio/vishing/vishing-beginner-7.mp3"
                }
            },
            "question": "Does law enforcement accept Gift Cards or Bitcoin for fines?",
            "options": [
                "Yes, they are modernizing.",
                "No. Government agencies never accept gift cards or crypto.",
                "Only for parking tickets.",
                "Yes, if the court is closed."
            ],
            "correctAnswer": "No. Government agencies never accept gift cards or crypto.",
            "explanation": "Demanding payment via untraceable methods (Gift Cards, Crypto, Wire Transfer) is the hallmark of a scam. Police do not operate this way."
        },
        {
            "title": "Health Insurance 'verification'",
            "id": "vishing-beginner-8",
            "topic": "vishing",
            "level": "beginner",
            "briefing": "A caller wants to send you a new medical card.",
            "task": "Protect your PII.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Caller",
                            "text": "We are upgrading your Medicare/Insurance card."
                        },
                        {
                            "time": 6,
                            "speaker": "Caller",
                            "text": "Verify your Social Security Number so we can mail the new one."
                        }
                    ],
                    "duration": 13,
                    "audioUrl": "/uploads/audio/vishing/vishing-beginner-8.mp3"
                }
            },
            "question": "Why does the caller want your SSN?",
            "options": [
                "To print it on the card.",
                "To commit Medical Identity Theft (billing fake procedures to your insurance).",
                "To check your age.",
                "To help you."
            ],
            "correctAnswer": "To commit Medical Identity Theft (billing fake procedures to your insurance).",
            "explanation": "Scammers use medical data to file fraudulent claims or sell the identity. Official agencies already have your data and won't call to ask for it."
        },
        {
            "title": "Can you hear me? (Yes/No)",
            "id": "vishing-beginner-9",
            "topic": "vishing",
            "level": "beginner",
            "briefing": "A caller asks 'Can you hear me?' repeatedly.",
            "task": "Understand the risk of voice recording.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Caller",
                            "text": "(Static) Hello?"
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "I'm having headset trouble."
                        },
                        {
                            "time": 8,
                            "speaker": "Caller",
                            "text": "Can you hear me?"
                        },
                        {
                            "time": 11,
                            "speaker": "Caller",
                            "text": "Hello?"
                        }
                    ],
                    "duration": 16,
                    "audioUrl": "/uploads/audio/vishing/vishing-beginner-9.mp3"
                }
            },
            "question": "Why should you avoid saying 'Yes' to unknown callers?",
            "options": [
                "It is rude.",
                "They might record your 'Yes' to authorize fraudulent charges or agreements verbally.",
                "It uses more battery.",
                "They are boring."
            ],
            "correctAnswer": "They might record your 'Yes' to authorize fraudulent charges or agreements verbally.",
            "explanation": "While less common now, scammers historically recorded victims saying 'Yes' to claim they agreed to a service or charge."
        },
        {
            "title": "Utility Shutoff Threate",
            "id": "vishing-beginner-10",
            "topic": "vishing",
            "level": "beginner",
            "briefing": "The power company says your electricity will be cut off in 30 mins.",
            "task": "Verify the claim.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "PowerCo",
                            "text": "We are dispatching a technician to disconnect your power."
                        },
                        {
                            "time": 6,
                            "speaker": "Caller",
                            "text": "Your bill is overdue."
                        },
                        {
                            "time": 9,
                            "speaker": "Caller",
                            "text": "Pay immediately to stop the order."
                        }
                    ],
                    "duration": 14,
                    "audioUrl": "/uploads/audio/vishing/vishing-beginner-10.mp3"
                }
            },
            "question": "How do utility companies actually handle overdue bills?",
            "options": [
                "They cut power instantly with a phone warning.",
                "They send multiple written notices (mail/email) over weeks before disconnection.",
                "They come to your door.",
                "They don't care."
            ],
            "correctAnswer": "They send multiple written notices (mail/email) over weeks before disconnection.",
            "explanation": "Utility disconnection is a long legal process involving mail. Immediate shutoff threats via phone are always scams."
        }
    ],
    "intermediate": [
        {
            "title": "Caller ID Spoofing Analysis",
            "id": "vishing-intermediate-1",
            "topic": "vishing",
            "level": "intermediate",
            "briefing": "You receive a call from your own phone number.",
            "task": "Explain the technical phenomenon.",
            "artifacts": {
                "context": "You answer, and it's a robocall.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Your Own Number",
                    "transcript": [
                        {
                            "time": 0,
                            "speaker": "Robocall",
                            "text": "This is an automated message regarding your vehicle's extended warranty."
                        },
                        {
                            "time": 4,
                            "speaker": "Robocall",
                            "text": "We have been trying to reach you."
                        },
                        {
                            "time": 7,
                            "speaker": "Robocall",
                            "text": "This is your final notice."
                        },
                        {
                            "time": 10,
                            "speaker": "Robocall",
                            "text": "Press 1 now to speak with an agent before your file is closed."
                        }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-intermediate-1.mp3",
                    "duration": 14
                }
            },
            "question": "How can a scammer call you FROM your number?",
            "options": [
                "They hacked your phone.",
                "They used VoIP software to spoof the Caller ID field with the target's number.",
                "It's a glitch.",
                "They are in your house."
            ],
            "correctAnswer": "They used VoIP software to spoof the Caller ID field with the target's number.",
            "explanation": "Caller ID is not authenticated. VoIP tools allow anyone to display any number they want. Calling from your own number bypasses blocking filters."
        },
        {
            "title": "Pig Butchering (Romance/Invsetment) Voice",
            "id": "vishing-intermediate-2",
            "topic": "vishing",
            "level": "intermediate",
            "briefing": "A 'wrong number' caller strikes up a conversation.",
            "task": "Identify the grooming phase.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Caller",
                            "text": "Oh, is this not the gym?"
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "You sound nice though."
                        },
                        {
                            "time": 8,
                            "speaker": "Caller",
                            "text": "I'm Anna."
                        },
                        {
                            "time": 11,
                            "speaker": "Caller",
                            "text": "Do you live in the city?"
                        },
                        {
                            "time": 14,
                            "speaker": "Caller",
                            "text": "We should connect."
                        }
                    ],
                    "duration": 19,
                    "audioUrl": "/uploads/audio/vishing/vishing-intermediate-2.mp3"
                }
            },
            "question": "What is the long-term goal of this friendly 'wrong number'?",
            "options": [
                "To make friends.",
                "To eventually introduce a fake crypto investment platform (Pig Butchering).",
                "To sell a gym membership.",
                "To practice English."
            ],
            "correctAnswer": "To eventually introduce a fake crypto investment platform (Pig Butchering).",
            "explanation": "They build a relationship over weeks (voice/text) before pivoting to investment advice, leading to massive financial loss."
        },
        {
            "title": "MFA Code Social Engineering",
            "id": "vishing-intermediate-3",
            "topic": "vishing",
            "level": "intermediate",
            "briefing": "A caller claims they sent a verification code by mistake.",
            "task": "Protect your account security.",
            "artifacts": {
                "sms_received": "Your Google Verification Code is 992-111.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Caller",
                            "text": "I'm trying to log into my account but put your number in by accident."
                        },
                        {
                            "time": 7,
                            "speaker": "Caller",
                            "text": "Can you read me the code you just got?"
                        }
                    ],
                    "duration": 12,
                    "audioUrl": "/uploads/audio/vishing/vishing-intermediate-3.mp3"
                }
            },
            "question": "What happens if you give them the code?",
            "options": [
                "They fix their mistake.",
                "They takeover YOUR account. They triggered the login, not you.",
                "Nothing.",
                "You get a reward."
            ],
            "correctAnswer": "They takeover YOUR account. They triggered the login, not you.",
            "explanation": "The caller is logging into YOUR account (password reset or new device). The code allows them to bypass 2FA."
        },
        {
            "title": "Fake Employee (Help Desk) Tactic",
            "id": "vishing-intermediate-4",
            "topic": "vishing",
            "level": "intermediate",
            "briefing": "You are an employee. 'IT' calls asking for your password to 'run an update'.",
            "task": "Verify the internal caller.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Internal Extension 404",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "IT",
                            "text": "Hey, this is Steve from IT."
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "We're pushing an update and your account is stuck."
                        },
                        {
                            "time": 9,
                            "speaker": "Caller",
                            "text": "What's your password so I can force it through?"
                        }
                    ],
                    "duration": 15,
                    "audioUrl": "/uploads/audio/vishing/vishing-intermediate-4.mp3"
                }
            },
            "question": "What is the standard procedure for IT needing access?",
            "options": [
                "They ask for your password.",
                "They use remote administration tools/privileged accounts, never asking for your password.",
                "They come to your desk.",
                "They guess it."
            ],
            "correctAnswer": "They use remote administration tools/privileged accounts, never asking for your password.",
            "explanation": "IT admins have their own admin rights. They never need a user's password to perform maintenance."
        },
        {
            "title": "Google Voice Scam",
            "id": "vishing-intermediate-5",
            "topic": "vishing",
            "level": "intermediate",
            "briefing": "You are selling an item on Craigslist. A buyer calls.",
            "task": "Protect your phone number reputation.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Buyer",
                            "text": "I want to buy your couch."
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "I need to know you're real."
                        },
                        {
                            "time": 8,
                            "speaker": "Caller",
                            "text": "I'll send you a Google code."
                        },
                        {
                            "time": 11,
                            "speaker": "Caller",
                            "text": "Read it to me to prove you're human."
                        }
                    ],
                    "duration": 16,
                    "audioUrl": "/uploads/audio/vishing/vishing-intermediate-5.mp3"
                }
            },
            "question": "What is the attacker doing with the Google Voice code?",
            "options": [
                "Verifying you are human.",
                "Creating a Google Voice account linked to YOUR phone number to scam others anonymously.",
                "Paying you.",
                "Tracking you."
            ],
            "correctAnswer": "Creating a Google Voice account linked to YOUR phone number to scam others anonymously.",
            "explanation": "They are setting up a Google Voice account. Google requires a real phone to forward to. By giving the code, you let them use your number as the 'real' backing for their scam number."
        },
        {
            "title": "Bank Impersonation (Number Spoof)",
            "id": "vishing-intermediate-6",
            "topic": "vishing",
            "level": "intermediate",
            "briefing": "Caller ID matches your Bank's official number perfectly.",
            "task": "Determine if the call is real.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "1-800-CHASE (Verified)",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Bank",
                            "text": "We detected fraud."
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "Provide your username to verify identity."
                        }
                    ],
                    "duration": 10,
                    "audioUrl": "/uploads/audio/vishing/vishing-intermediate-6.mp3"
                }
            },
            "question": "If Caller ID matches the back of your card, is it safe?",
            "options": [
                "Yes, absolutely.",
                "No. Numbers can be easily spoofed. Hang up and dial the number on your card yourself.",
                "Yes, if they sound professional.",
                "Only on landlines."
            ],
            "correctAnswer": "No. Numbers can be easily spoofed. Hang up and dial the number on your card yourself.",
            "explanation": "Incoming Caller ID is untrustworthy. Only OUTGOING calls you initiate to a known number are secure."
        },
        {
            "title": "Remote Access Scam (AnyDesk)",
            "id": "vishing-intermediate-7",
            "topic": "vishing",
            "level": "intermediate",
            "briefing": "Caller asks you to download 'AnyDesk' or 'TeamViewer' to fix a refund.",
            "task": "Analyze the tool usage.",
            "artifacts": {
                "request": "Please go to the app store and download AnyDesk. Read me the 9-digit address code.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Support",
                            "text": "Hello, to process your refund, we need to correct your request on our secure server."
                        },
                        {
                            "time": 6,
                            "speaker": "Support",
                            "text": "Please go to the app store and download AnyDesk right now."
                        },
                        {
                            "time": 10,
                            "speaker": "Support",
                            "text": "Once opened, read me the 9-digit address code so I can help."
                        }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-intermediate-7.mp3",
                    "duration": 15
                }
            },
            "question": "What does AnyDesk/TeamViewer allow the caller to do?",
            "options": [
                "See your screen.",
                "Take full remote control of your device (mouse/keyboard).",
                "Only fix the issue.",
                "Video chat."
            ],
            "correctAnswer": "Take full remote control of your device (mouse/keyboard).",
            "explanation": "RATs (Remote Access Trojans) or valid tools like AnyDesk give full control. Scammers use this to make screen turns black and transfer money from your bank while you watch."
        },
        {
            "title": "Fake Charity after Disaster",
            "id": "vishing-intermediate-8",
            "topic": "vishing",
            "level": "intermediate",
            "briefing": "After a hurricane, a charity calls for donations.",
            "task": "Verify the 501(c)(3) status.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Charity",
                            "text": "We are collecting for the victims."
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "Can we count on your credit card donation?"
                        }
                    ],
                    "duration": 10,
                    "audioUrl": "/uploads/audio/vishing/vishing-intermediate-8.mp3"
                }
            },
            "question": "How should you donate to disaster relief?",
            "options": [
                "Give the card over the phone.",
                "Go to the official website of known charities (Red Cross, etc.) directly.",
                "Send cash.",
                "Trust the caller."
            ],
            "correctAnswer": "Go to the official website of known charities (Red Cross, etc.) directly.",
            "explanation": "Scammers follow the news. Disaster relief scams spike after events. Always initiate the donation yourself."
        },
        {
            "title": "Student Loan Forgiveness Scam",
            "id": "vishing-intermediate-9",
            "topic": "vishing",
            "level": "intermediate",
            "briefing": "Caller says you qualify for complete loan forgiveness.",
            "task": "Identify the fee trigger.",
            "artifacts": {
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Agent",
                            "text": "Your loans can be wiped."
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "We just need your FSA ID and a $200 filing fee."
                        }
                    ],
                    "duration": 11,
                    "audioUrl": "/uploads/audio/vishing/vishing-intermediate-9.mp3"
                }
            },
            "question": "Is there a fee for federal student loan forgiveness programs?",
            "options": [
                "Yes, always.",
                "No. Federal programs are free to apply for via StudentAid.gov.",
                "Yes, for faster service.",
                "Sometimes."
            ],
            "correctAnswer": "No. Federal programs are free to apply for via StudentAid.gov.",
            "explanation": "Charging a fee for a free government service is a scam. Asking for the FSA ID also allows them to hijack your account."
        },
        {
            "title": "Callback Phishing (Hybrid)",
            "id": "vishing-intermediate-10",
            "topic": "vishing",
            "level": "intermediate",
            "briefing": "You received an email invoice for $500 with a phone number to 'dispute'.",
            "task": "Analyze the workflow.",
            "artifacts": {
                "email": "GeekSquad: Subscription Renewed. $499 charged. If this is error, call +1-888-FAKE-NUM.",
                "action": "You call the number.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 0,
                            "speaker": "Agent",
                            "text": "Geek Squad Support, this is Alex. How can I help you?"
                        },
                        {
                            "time": 4,
                            "speaker": "Victim",
                            "text": "I got an email about a charge I didn't make."
                        },
                        {
                            "time": 7,
                            "speaker": "Agent",
                            "text": "Oh, that is a mistake. No problem."
                        },
                        {
                            "time": 10,
                            "speaker": "Agent",
                            "text": "To refund it, I just need to verify your card number."
                        }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-intermediate-10.mp3",
                    "duration": 14
                }
            },
            "question": "Why do attackers want you to call THEM?",
            "options": [
                "It bypasses email filters (no malicious link in email) and puts you in a high-pressure voice environment.",
                "They prefer talking.",
                "It is cheaper.",
                "Email is broken."
            ],
            "correctAnswer": "It bypasses email filters (no malicious link in email) and puts you in a high-pressure voice environment.",
            "explanation": "Callback Phishing (e.g., BazarCall) uses benign emails to get the victim on the phone, where the vishing scam (install malware/steal info) takes place."
        }
    ],
    "advanced": [
        {
            "title": "Deepfake Voice Cloning (CEO Fraud)",
            "id": "vishing-advanced-1",
            "topic": "vishing",
            "level": "advanced",
            "briefing": "You (Finance Director) receive a call from the CEO requesting a wire transfer.",
            "task": "Analyze the audio anomalies.",
            "artifacts": {
                "audio_analysis": "Slight robotic artifacts. Lack of emotional variance. Background noise loops.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "CEO",
                            "text": "'Hey, I need this wire sent ASAP for the merger."
                        },
                        {
                            "time": 6,
                            "speaker": "Caller",
                            "text": "Don't mention it on email."
                        }
                    ],
                    "duration": 11,
                    "audioUrl": "/uploads/audio/vishing/vishing-advanced-1.mp3"
                }
            },
            "question": "How much audio is needed to clone a voice today?",
            "options": [
                "Hours of studio recording.",
                "Just a few seconds of samples (e.g., from a YouTube interview or voicemail).",
                "Impossible.",
                "A DNA sample."
            ],
            "correctAnswer": "Just a few seconds of samples (e.g., from a YouTube interview or voicemail).",
            "explanation": "AI Voice Cloning (VALL-E, ElevenLabs) can replicate a voice with 3 seconds of audio. Verification via alternative channel is mandatory for finance."
        },
        {
            "title": "Simulated Kidnapping (Virtual Kidnapping)",
            "id": "vishing-advanced-2",
            "topic": "vishing",
            "level": "advanced",
            "briefing": "You hear a child screaming in the background. Caller demands ransom.",
            "task": "Assess the probability.",
            "artifacts": {
                "context": "Your daughter is at school.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "Caller",
                            "text": "We have your daughter."
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "Wire $5,000 or she gets hurt."
                        },
                        {
                            "time": 8,
                            "speaker": "Caller",
                            "text": "(Screaming sound clips)."
                        }
                    ],
                    "duration": 13,
                    "audioUrl": "/uploads/audio/vishing/vishing-advanced-2.mp3"
                }
            },
            "question": "How do virtual kidnappers make this convincing?",
            "options": [
                "They actually have the person.",
                "They use social media to find names/locations and play generic screaming audio to induce panic.",
                "They guess.",
                "Magic."
            ],
            "correctAnswer": "They use social media to find names/locations and play generic screaming audio to induce panic.",
            "explanation": "This is a terror tactic. The victim is usually safe. The scammer keeps you on the phone so you can't verify their safety."
        },
        {
            "title": "PBX / Voicemail Hacking",
            "id": "vishing-advanced-3",
            "topic": "vishing",
            "level": "advanced",
            "briefing": "Your company's outgoing voicemail was changed to a scam line.",
            "task": "Identify the vulnerability.",
            "artifacts": {
                "log": "External access to Voicemail System detected. Default PIN '1234' used.",
                "impact": "Customers calling your business are told to dial a premium rate number.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "System", "text": "Access granted. Administrative menu." },
                        { "time": 3, "speaker": "Hacker", "text": "Okay, I'm in the voicemail settings." },
                        { "time": 6, "speaker": "Hacker", "text": "Changing forwarding rule to premium line... Done." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-advanced-3.mp3",
                    "duration": 60
                }
            },
            "question": "What is the primary defense against PBX Fraud?",
            "options": [
                "Unplugging the phones.",
                "Changing default PINs and disabling external forwarding/management features.",
                "Buying new phones.",
                "Caller ID."
            ],
            "correctAnswer": "Changing default PINs and disabling external forwarding/management features.",
            "explanation": "Attackers brute force default voicemail PINs to hijack the system for toll fraud or redirecting business calls."
        },
        {
            "title": "IVR Phishing",
            "id": "vishing-advanced-4",
            "topic": "vishing",
            "level": "advanced",
            "briefing": "You dial your bank's number, but the menu is slightly different.",
            "task": "Analyze the call routing.",
            "artifacts": {
                "context": "You searched 'Bank Support' on Google and clicked the first 'Ad' link on mobile (Click-to-Call).",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        {
                            "time": 2,
                            "speaker": "IVR",
                            "text": "Welcome."
                        },
                        {
                            "time": 5,
                            "speaker": "Caller",
                            "text": "Please enter your 16-digit card number and PIN to proceed."
                        }
                    ],
                    "duration": 11,
                    "audioUrl": "/uploads/audio/vishing/vishing-advanced-4.mp3"
                }
            },
            "question": "How did you reach a fake IVR?",
            "options": [
                "The bank changed it.",
                "Malicious Search Ad (Malvertising) replaced the real number with a scam number in the search results.",
                "The phone is broken.",
                "The network is hacked."
            ],
            "correctAnswer": "Malicious Search Ad (Malvertising) replaced the real number with a scam number in the search results.",
            "explanation": "Scammers buy ads for 'Bank Support'. Mobile users tap 'Call' without checking the number, reaching a fake IVR that harvests credentials."
        },
        {
            "title": "Two-Pronged Vishing (The Setup)",
            "id": "vishing-advanced-5",
            "topic": "vishing",
            "level": "advanced",
            "briefing": "Caller 1 warns of a hack. Caller 2 claims to be the solution.",
            "task": "Identify the tag-team tactic.",
            "artifacts": {
                "call_1": "Automated: Your internet is compromised. We are disconnecting you.",
                "call_2": "(5 mins later) Technician: I see a disconnect order. I can fix it if you install this certificate.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "audioUrl": "/uploads/audio/vishing/vishing-advanced-5.mp3",
                    "duration": 60
                }
            },
            "question": "Why use two calls?",
            "options": [
                "Coincidence.",
                "To validate the threat. The second caller offers 'salvation' from the problem the first caller 'announced'.",
                "Double the money.",
                "Network lag."
            ],
            "correctAnswer": "To validate the threat. The second caller offers 'salvation' from the problem the first caller 'announced'.",
            "explanation": "Priming the victim with a threat makes them relieved to hear from the 'savior' (the second scammer), lowering their defenses."
        },
        {
            "title": "War Dialing / War Walking",
            "id": "vishing-advanced-6",
            "topic": "vishing",
            "level": "advanced",
            "briefing": "Logs show thousands of short calls to your company's block.",
            "task": "Analyze the reconnaissance.",
            "artifacts": {
                "activity": "Sequential dialing (555-0000, 555-0001...). Duration 2s.",
                "result": "Identifying modems or fax tones.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "System", "text": "*Dial Tone* ... *Keypad Tones*" },
                        { "time": 2, "speaker": "System", "text": "*Ringing* ... No Answer." },
                        { "time": 4, "speaker": "System", "text": "*Dial Tone* ... *Keypad Tones*" },
                        { "time": 6, "speaker": "System", "text": "*Modem Handshake Screeching*" },
                        { "time": 8, "speaker": "Hacker", "text": "Target acquired. Modem found." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-advanced-6.mp3",
                    "duration": 10
                }
            },
            "question": "What is the goal of War Dialing?",
            "options": [
                "To annoy employees.",
                "To map the network and find unprotected modems/lines for backdoor entry.",
                "To sell stuff.",
                "To check the time."
            ],
            "correctAnswer": "To map the network and find unprotected modems/lines for backdoor entry.",
            "explanation": "An old but valid technique. Attackers scan phone blocks to find legacy modems or remote management interfaces connected to the phone network."
        },
        {
            "title": "Toll Fraud (IRSF)",
            "id": "vishing-advanced-7",
            "topic": "vishing",
            "level": "advanced",
            "briefing": "Attackers hacked your PBX and are making calls.",
            "task": "Identify the financial impact.",
            "artifacts": {
                "logs": "20 concurrent calls to Sierra Leone (+232) premium lines. Duration: 6 hours.",
                "cost": "$50,000",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "Security Bot", "text": "Alert: Unusual outbound call volume detected." },
                        { "time": 3, "speaker": "Security Bot", "text": "Destination: Sierra Leone. Count: 20 simultaneous calls." },
                        { "time": 6, "speaker": "Admin", "text": "This must be toll fraud. Blocking the trunk now." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-advanced-7.mp3",
                    "duration": 10
                }
            },
            "question": "What is International Revenue Share Fraud (IRSF)?",
            "options": [
                "Getting cheap calls.",
                "Attackers generating traffic to high-cost destinations they own, splitting the revenue with the carrier.",
                "A discount plan.",
                "A tax."
            ],
            "correctAnswer": "Attackers generating traffic to high-cost destinations they own, splitting the revenue with the carrier.",
            "explanation": "If attackers access a phone system, they pump calls to premium numbers they profit from, causing massive bills for the victim company."
        },
        {
            "title": "Conference Call Interception",
            "id": "vishing-advanced-8",
            "topic": "vishing",
            "level": "advanced",
            "briefing": "An uninvited participant is silently listening to the board meeting.",
            "task": "Detect the eavesdropper.",
            "artifacts": {
                "participants": "CEO, CFO, Investor, +1-555-Unknown",
                "method": "Brute forced the simple 4-digit PIN.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "audioUrl": "/uploads/audio/vishing/vishing-advanced-8.mp3",
                    "duration": 60
                }
            },
            "question": "How do you secure sensitive conference calls?",
            "options": [
                "Speak quietly.",
                "Use unique, long PINs per meeting and the 'Roll Call' feature to announce entrants.",
                "Use a landline.",
                "Don't have meetings."
            ],
            "correctAnswer": "Use unique, long PINs per meeting and the 'Roll Call' feature to announce entrants.",
            "explanation": "Static PINs are easily guessed or shared. Corporate espionage often occurs via unmonitored conference lines."
        },
        {
            "title": "Internal Vishing (Insider Threat)",
            "id": "vishing-advanced-9",
            "topic": "vishing",
            "level": "advanced",
            "briefing": "A call comes from an internal extension asking for PII.",
            "task": "Validate the internal actor.",
            "artifacts": {
                "caller": "Extension 202 (HR Dept)",
                "request": "I need to confirm your bank details for direct deposit.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "Caller", "text": "Hi, this is Sarah from HR, extension 202." },
                        { "time": 4, "speaker": "Victim", "text": "Hi Sarah, what's up?" },
                        { "time": 6, "speaker": "Caller", "text": "We had a glitch with payroll direct deposits." },
                        { "time": 9, "speaker": "Caller", "text": "I need to verify your account number manually to ensure you get paid this Friday." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-advanced-9.mp3",
                    "duration": 15
                }
            },
            "question": "Can internal extensions be spoofed?",
            "options": [
                "No.",
                "Yes, if the attacker is on the internal network or compromises the VoIP controller.",
                "Only by the CEO.",
                "Only on Tuesdays."
            ],
            "correctAnswer": "Yes, if the attacker is on the internal network or compromises the VoIP controller.",
            "explanation": "Calls from internal extensions are trusted. Attackers inside the network (or via compromised VPN) can spoof internal caller IDs to trick colleagues."
        },
        {
            "title": "Voice Biometric Bypass (Replay)",
            "id": "vishing-advanced-10",
            "topic": "vishing",
            "level": "advanced",
            "briefing": "An attacker accesses an account secured by 'Voice Print'.",
            "task": "Identify the bypass method.",
            "artifacts": {
                "method": "Recorded the victim saying 'My voice is my password' during a fake survey call.",
                "attack": "Played the recording to the bank's authentication system.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "System", "text": "Please speak your passphrase to authenticate." },
                        { "time": 3, "speaker": "Attacker", "text": "(Playing Recording) My voice is my password." },
                        { "time": 6, "speaker": "System", "text": "Voice print confirmed. Access granted." },
                        { "time": 9, "speaker": "Attacker", "text": "Too easy." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-advanced-10.mp3",
                    "duration": 12
                }
            },
            "question": "Is Voice Biometric authentication unhackable?",
            "options": [
                "Yes, voices are unique snowflakes.",
                "No. High-quality recordings (Replay Attacks) or Deepfakes can defeat it.",
                "Yes, mostly.",
                "No, but it's cheap."
            ],
            "correctAnswer": "No. High-quality recordings (Replay Attacks) or Deepfakes can defeat it.",
            "explanation": "Biometrics are usernames, not passwords. They are public. Recordings can bypass systems that lack 'Liveness Detection'."
        }
    ],
    "expert": [
        {
            "title": "Real-time Deepfake Negotiation",
            "id": "vishing-expert-1",
            "topic": "vishing",
            "level": "expert",
            "briefing": "A video call from the CEO. The face and voice look real.",
            "task": "Detect the real-time deepfake.",
            "artifacts": {
                "video_call": "CEO asks to transfer funds. Video glitches when he turns his head.",
                "audio": "Audio sync is slightly off (latency).",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "audioUrl": "/uploads/audio/vishing/vishing-expert-1.mp3",
                    "duration": 60
                }
            },
            "question": "What is a tell-tale sign of a real-time video deepfake?",
            "options": [
                "The eyes never blink.",
                "Artifacts/glitching around the edges of the face or when an object (hand) passes in front of the face.",
                "Perfect video quality.",
                "Asking for money."
            ],
            "correctAnswer": "Artifacts/glitching around the edges of the face or when an object (hand) passes in front of the face.",
            "explanation": "Real-time rendering struggles with occlusion. If the person waves a hand in front of their face, the mask often breaks or flickers."
        },
        {
            "title": "Swatting (Emergency Service Spoofing)",
            "id": "vishing-expert-2",
            "topic": "vishing",
            "level": "expert",
            "briefing": "Police arrive at your house due to a hostage report you didn't make.",
            "task": "Analyze the 911 TDoS (Telephony Denial of Service).",
            "artifacts": {
                "call_origin": "Spoofed number appearing to be YOUR home line.",
                "report": "Caller claimed to be you, stating you shot someone.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "911 Operator", "text": "911, what is your emergency?" },
                        { "time": 3, "speaker": "Attacker (Spoofed)", "text": "I just shot my dad. I'm holding my mom hostage." },
                        { "time": 6, "speaker": "911 Operator", "text": "What is your address?" },
                        { "time": 9, "speaker": "Attacker (Spoofed)", "text": "123 Main St. Send police now or I shoot her too." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-expert-2.mp3",
                    "duration": 15
                }
            },
            "question": "What makes Swatting possible?",
            "options": [
                "Police incompetence.",
                "The inability of 911 systems to definitively authenticate the location of VoIP calls, relying on spoofable Caller ID information.",
                "It is a prank.",
                "High taxes."
            ],
            "correctAnswer": "The inability of 911 systems to definitively authenticate the location of VoIP calls, relying on spoofable Caller ID information.",
            "explanation": "Attackers use VoIP to spoof the victim's number when calling 911. Emergency services must respond to the 'verified' address linked to that number."
        },
        {
            "title": "SS7 Intercept & Redirect",
            "id": "vishing-expert-3",
            "topic": "vishing",
            "level": "expert",
            "briefing": "You are not receiving calls. Your bank is calling the attacker.",
            "task": "Diagnose the network level attack.",
            "artifacts": {
                "ss7_log": "UpdateLocation request sent from foreign carrier.",
                "result": "All incoming calls routed to the attacker's HLR (Home Location Register).",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "Bank Fraud Dept", "text": "Hello, this is Bank Fraud Protection." },
                        { "time": 3, "speaker": "Attacker", "text": "Yes, this is [Victim Name]." },
                        { "time": 6, "speaker": "Bank Fraud Dept", "text": "We need to verify a transaction. Please read the code sent to your phone." },
                        { "time": 10, "speaker": "Attacker", "text": "Okay, I see it. 4-4-9-2." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-expert-3.mp3",
                    "duration": 12
                }
            },
            "question": "How does SS7 redirection differ from simple forwarding?",
            "options": [
                "It doesn't.",
                "It happens at the global carrier backbone level, undetectable by the user (phone still shows bars), effectively hijacking the number globally.",
                "It is cheaper.",
                "It uses an app."
            ],
            "correctAnswer": "It happens at the global carrier backbone level, undetectable by the user (phone still shows bars), effectively hijacking the number globally.",
            "explanation": "SS7 vulnerabilities allow attackers to tell the global network 'I am this phone now', receiving all calls/SMS meant for the victim."
        },
        {
            "title": "Call Center 'Customer Support' Mole",
            "id": "vishing-expert-4",
            "topic": "vishing",
            "level": "expert",
            "briefing": "Attackers are bypassing security questions 100% of the time.",
            "task": "Identify the insider.",
            "artifacts": {
                "logs": "Agent #4422 accesses account. 5 mins later, fraud occurs. Pattern repeats 50 times.",
                "audio": "No call was recorded for these access events.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "Customer", "text": "I lost my password and key fob." },
                        { "time": 3, "speaker": "Mole Agent", "text": "No problem. I can reset that for you without the security question since you're verified in our system." },
                        { "time": 7, "speaker": "Mole Agent", "text": "Use temporary password 'Admin123'." },
                        { "time": 10, "speaker": "Customer", "text": "Thanks." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-expert-4.mp3",
                    "duration": 12
                }
            },
            "question": "What is an increasingly common tactic for organized crime?",
            "options": [
                "Hacking the mainframe.",
                "Planting or bribing employees in call centers to bypass verification procedures (Insider Threat).",
                "Guessing.",
                "Magic."
            ],
            "correctAnswer": "Planting or bribing employees in call centers to bypass verification procedures (Insider Threat).",
            "explanation": "Criminal gangs recruit call center agents to simply act as the verifier or hand over account access, bypassing all technical controls."
        },
        {
            "title": "Reverse Vishing with SEO Poisoning",
            "id": "vishing-expert-5",
            "topic": "vishing",
            "level": "expert",
            "briefing": "Victims are calling the attacker to give up passwords.",
            "task": "Trace the entry point.",
            "artifacts": {
                "search_result": "Top result for 'Airline Refund' is a fake site with the attacker's number.",
                "victim_action": "Victim dials the number believing it's the airline.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "Victim", "text": "Hi, I'm calling about the refund email." },
                        { "time": 3, "speaker": "Attacker", "text": "Thank you for calling Airline Support. My name is David." },
                        { "time": 6, "speaker": "Attacker", "text": "To process that refund, please go to www.fake-support.com and click 'Join'." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-expert-5.mp3",
                    "duration": 12
                }
            },
            "question": "Why is Reverse Vishing so effective?",
            "options": [
                "It isn't.",
                "The victim initiates the call, so their guard is down. They trust the person they called.",
                "It saves money.",
                "It's faster."
            ],
            "correctAnswer": "The victim initiates the call, so their guard is down. They trust the person they called.",
            "explanation": "Trust is high when the user initiates. By poisoning search results, attackers become the 'Help Desk' the victim affirmatively seeks out."
        },
        {
            "title": "Audio Steganography in Voicemail",
            "id": "vishing-expert-6",
            "topic": "vishing",
            "level": "expert",
            "briefing": "A voicemail contains only static.",
            "task": "Analyze the audio spectrum.",
            "artifacts": {
                "audio": "White noise.",
                "spectrogram": "Visual analysis reveals a hidden QR code or command string encoded in the high frequencies.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "Voicemail", "text": "You have one new message." },
                        { "time": 2, "speaker": "Audio", "text": "*Static Hissing Noise*" },
                        { "time": 8, "speaker": "Audio", "text": "*High-pitched Data Chirp*" },
                        { "time": 10, "speaker": "Voicemail", "text": "End of message." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-expert-6.mp3",
                    "duration": 12
                }
            },
            "question": "Can audio transmit data?",
            "options": [
                "No.",
                "Yes (e.g., dial-up modems). High-frequency commands can trigger voice assistants (Siri/Alexa) or be decoded by malware.",
                "Only music.",
                "Only loud noises."
            ],
            "correctAnswer": "Yes (e.g., dial-up modems). High-frequency commands can trigger voice assistants (Siri/Alexa) or be decoded by malware.",
            "explanation": "Audio can carry hidden commands (Dolphin Attack) that are inaudible to humans but recognized by smart speakers or decoding software."
        },
        {
            "title": "Multi-Stage Helpline Fraud",
            "id": "vishing-expert-7",
            "topic": "vishing",
            "level": "expert",
            "briefing": "Attackers transfer the victim between 'Departments'.",
            "task": "Analyze the theater.",
            "artifacts": {
                "transfer_log": "Level 1 (Script reader) -> Level 2 (Closer/Senior Technician) -> Level 3 (Billing).",
                "purpose": "Each transfer adds legitimacy.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "audioUrl": "/uploads/audio/vishing/vishing-expert-7.mp3",
                    "duration": 60
                }
            },
            "question": "Why do scam call centers use the 'Let me transfer you to my manager' tactic?",
            "options": [
                "They are busy.",
                "To simulate a professional hierarchy, increasing trust and authority.",
                "To confuse you.",
                "To track time."
            ],
            "correctAnswer": "To simulate a professional hierarchy, increasing trust and authority.",
            "explanation": "Professional organizations transfer calls. Scammers mimic this structure to appear large and legitimate, wearing down the victim's skepticism."
        },
        {
            "title": "Exploiting Voice Assistants (Laser/Light)",
            "id": "vishing-expert-8",
            "topic": "vishing",
            "level": "expert",
            "briefing": "A smart speaker placed near a window unlocks the smart door.",
            "task": "Investigate the non-audio trigger.",
            "artifacts": {
                "method": "Modulated laser pointer aimed at the microphone diaphragm.",
                "result": "Simulates sound waves, injecting voice commands silently from outside.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "Smart Speaker", "text": "Unlocking the front door." },
                        { "time": 3, "speaker": "Owner", "text": "I didn't say that!" },
                        { "time": 6, "speaker": "Smart Speaker", "text": "Front door unlocked." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-expert-8.mp3",
                    "duration": 8
                }
            },
            "question": "What is this physical vulnerability?",
            "options": [
                "Magic.",
                "Light Command / Laser Injection.",
                "Wi-Fi hacking.",
                "Vishing."
            ],
            "correctAnswer": "Light Command / Laser Injection.",
            "explanation": "Microphones (MEMS) respond to light variations as if they were sound. A laser can 'speak' to a device from hundreds of feet away."
        },
        {
            "title": "Synthetic Identity Vishing",
            "id": "vishing-expert-9",
            "topic": "vishing",
            "level": "expert",
            "briefing": "A caller applies for a loan using a mix of real and fake data.",
            "task": "Detect the Synthetic Identity.",
            "artifacts": {
                "ssn": "Real (Child's SSN)",
                "name": "Fake Name",
                "credit_history": "Built up over 2 years.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "Bank Agent", "text": "I need to verify your identity. What is your SSN?" },
                        { "time": 3, "speaker": "Attacker", "text": "999-00-1234." },
                        { "time": 6, "speaker": "Bank Agent", "text": "And your date of birth?" },
                        { "time": 8, "speaker": "Attacker", "text": "01/01/1980." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-expert-9.mp3",
                    "duration": 10
                }
            },
            "question": "Why is Synthetic Identity fraud hard to detect on a call?",
            "options": [
                "The data looks real.",
                "There is no single victim to complain (SSN holder is often a child or inactive). The profile passes credit checks.",
                "Banks don't care.",
                "It's fast."
            ],
            "correctAnswer": "There is no single victim to complain (SSN holder is often a child or inactive). The profile passes credit checks.",
            "explanation": "The identity exists only on paper. The caller answers all questions correctly because they created the history. There is no 'real' person to contradict them."
        },
        {
            "title": "Social Engineering the Telecom Provider",
            "id": "vishing-expert-10",
            "topic": "vishing",
            "level": "expert",
            "briefing": "Attackers call the Carrier Support to port a number.",
            "task": "Analyze the social engineering script.",
            "artifacts": {
                "script": "Caller claims to be the victim, acting distressed about a lost phone, possessing the SSN and address, demanding a SIM swap.",
                "call": {
                    "caller": "Unknown Caller",
                    "callerId": "Unknown",
                    "transcript": [
                        { "time": 0, "speaker": "Attacker", "text": "(Crying) Please, I lost my phone and my baby is sick!" },
                        { "time": 4, "speaker": "Telco Agent", "text": "Ma'am, I need the PIN to swap the SIM." },
                        { "time": 7, "speaker": "Attacker", "text": "I don't know it! My husband handles that! Please just help me!" },
                        { "time": 10, "speaker": "Telco Agent", "text": "Okay, I'll bypass it this one time." }
                    ],
                    "audioUrl": "/uploads/audio/vishing/vishing-expert-10.mp3",
                    "duration": 14
                }
            },
            "question": "The 'Human Factor' is the weakest link. True or False?",
            "options": [
                "True. A sympathetic support agent can override security protocols if emotionally manipulated.",
                "False. Systems are perfect.",
                "False. Encryption solves this.",
                "True, but rare."
            ],
            "correctAnswer": "True. A sympathetic support agent can override security protocols if emotionally manipulated.",
            "explanation": "Vishing the Telco is the primary method for SIM Swapping. If the agent feels sorry for the 'distressed' caller, they often bypass non-critical checks."
        }
    ]
};

module.exports = vishing;