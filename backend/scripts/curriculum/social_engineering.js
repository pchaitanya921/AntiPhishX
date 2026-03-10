const social_engineering = {
    beginner: [
        {
            title: "Tailgating (Piggybacking) Awareness",
            id: "se-beginner-1",
            topic: "social_engineering",
            level: "beginner",
            briefing: "A delivery driver with full hands asks you to hold the secure door open.",
            task: "Decide the correct physical security action.",
            artifacts: {
                context: "Secure Server Room Entry.",
                request: "Hey, can you grab that? My hands are full of boxes."
            },
            question: "What should you do?",
            options: [
                "Hold the door to be polite.",
                "Apologize, but insist they badge in themselves or call the recipient to escort them.",
                "Let them in if they look like a delivery driver.",
                "Help them carry the boxes."
            ],
            correctAnswer: "Apologize, but insist they badge in themselves or call the recipient to escort them.",
            explanation: "Tailgating exploits politeness. Attackers use props (boxes, coffee, crutches) to guilt employees into bypassing physical access controls."
        },
        {
            title: "USB Drop (Baiting)",
            id: "se-beginner-2",
            topic: "social_engineering",
            level: "beginner",
            briefing: "You find a USB drive labeled 'Executive Salaries 2024' in the parking lot.",
            task: "Handle the found media.",
            artifacts: {
                item: "16GB Flash Drive.",
                location: "Company Entrance."
            },
            question: "What is the safe way to identify the owner?",
            options: [
                "Plug it into your work PC to check the files.",
                "Plug it into your home PC.",
                "Turn it in to IT Security / Physical Security without plugging it in.",
                "Throw it away."
            ],
            correctAnswer: "Turn it in to IT Security / Physical Security without plugging it in.",
            explanation: "Baiting relies on curiosity. The drive likely has a Human Interface Device (HID) script or malware that executes immediately upon connection."
        },
        {
            title: "Fake LinkedIn Recruiter",
            id: "se-beginner-3",
            topic: "social_engineering",
            level: "beginner",
            briefing: "A recruiter for a 'Stealth Startup' wants your internal project details.",
            task: "Analyze the connection request.",
            artifacts: {
                profile: "Generic stock photo. No mutual connections.",
                message: "We need someone with your exact skills on Project X. Can you send me the confidential specs so I can see if you match?"
            },
            question: "Is it safe to share internal project specs for a job interview?",
            options: [
                "Yes, if it's a better salary.",
                "No. Revealing confidential company data is a breach of contract and a common industrial espionage tactic.",
                "Only if they sign an NDA.",
                "Yes, via private email."
            ],
            correctAnswer: "No. Revealing confidential company data is a breach of contract and a common industrial espionage tactic.",
            explanation: "Attackers pose as recruiters to extract trade secrets from employees looking for new jobs."
        },
        {
            title: "The 'Urgent' CEO Email (Whaling)",
            id: "se-beginner-4",
            topic: "social_engineering",
            level: "beginner",
            briefing: "You get an email from the CEO asking for gift cards for a party.",
            task: "Identify the pretext.",
            artifacts: {
                sender: "ceo-office-private@gmail.com (Display Name: CEO)",
                request: "I'm in a meeting. Buy 10x $100 iTunes cards and text me the codes. Urgent."
            },
            question: "Why would a CEO use a Gmail address for urgent business?",
            options: [
                "Servers are down.",
                "They wouldn't. This is a clear indicator of impersonation.",
                "They are undercover.",
                "To save money."
            ],
            correctAnswer: "They wouldn't. This is a clear indicator of impersonation.",
            explanation: "Executives use corporate channels. The 'Emergency + Personal Email + Gift Cards' trifecta is the most common Business Email Compromise (BEC) script."
        },
        {
            title: "Dumpster Diving Defense",
            id: "se-beginner-5",
            topic: "social_engineering",
            level: "beginner",
            briefing: "You are throwing away drafts of a financial report.",
            task: "Dispose of sensitive data.",
            artifacts: {
                document: "Q3 Earnings Draft (Confidential).",
                destination: "Blue Recycle Bin (Unlocked)."
            },
            question: "What is the risk of un-shredded recycling?",
            options: [
                "It's messy.",
                "Dumpster Divers can legally retrieve trash from public curbs to find client data, passwords, or network diagrams.",
                "Recycling costs money.",
                "Paper cuts."
            ],
            correctAnswer: "Dumpster Divers can legally retrieve trash from public curbs to find client data, passwords, or network diagrams.",
            explanation: "Once trash hits the curb, it's often public domain. Sensitive documents must be cross-cut shredded or placed in locked consoles."
        },
        {
            title: "Shoulder Surfing",
            id: "se-beginner-6",
            topic: "social_engineering",
            level: "beginner",
            briefing: "You are working on a spreadsheet in a coffee shop.",
            task: "Assess the environment.",
            artifacts: {
                screen: "Customer List with PII.",
                environment: "Crowded cafe. Person behind you is on their phone, camera facing you."
            },
            question: "How do you protect data in public?",
            options: [
                "Turn the brightness down.",
                "Use a Privacy Screen Filter and sit with your back to a wall.",
                "Work faster.",
                "Cover it with your hand."
            ],
            correctAnswer: "Use a Privacy Screen Filter and sit with your back to a wall.",
            explanation: "Visual hacking is easy. High-resolution cameras can capture screen contents from 20 feet away."
        },
        {
            title: "Pretexting: The 'New Hire'",
            id: "se-beginner-7",
            topic: "social_engineering",
            level: "beginner",
            briefing: "A confused person wanders into your area claiming to be new.",
            task: "Verify their status.",
            artifacts: {
                person: "No badge. Wearing a suit.",
                statement: "I started today. Where is the server room? I need to check the inventory."
            },
            question: "What is the proper response?",
            options: [
                "Give them directions.",
                "Escort them to the Front Desk/Security for badging and verification.",
                "Ignore them.",
                "Give them your badge."
            ],
            correctAnswer: "Escort them to the Front Desk/Security for badging and verification.",
            explanation: "Attackers play on sympathy. 'New hires' should have an escort or a badge. Never assume."
        },
        {
            title: "Watering Hole Attack Awareness",
            id: "se-beginner-8",
            topic: "social_engineering",
            level: "beginner",
            briefing: "Everyone in your department visits a specific industry news site.",
            task: "Identify the targeted compromise.",
            artifacts: {
                site: "Daily-Engineering-News.com",
                alert: "Browser exploits attempted upon visit."
            },
            question: "What is a Watering Hole attack?",
            options: [
                "Poisoning the water cooler.",
                "Compromising a legitimate site known to be visited by the target group to infect them via drive-by download.",
                "Phishing via email.",
                "DDoS."
            ],
            correctAnswer: "Compromising a legitimate site known to be visited by the target group to infect them via drive-by download.",
            explanation: "Instead of attacking the hard target (the company), attackers infect a site the employees trust and frequent."
        },
        {
            title: "Quid Pro Quo (Survey for Chocolate)",
            id: "se-beginner-9",
            topic: "social_engineering",
            level: "beginner",
            briefing: "A researcher offers a free chocolate bar for your password structure.",
            task: "Evaluate the trade.",
            artifacts: {
                offer: "Tell us your password complexity requirements (e.g., length, special chars) and get a Godiva bar.",
                data: "Security Policy."
            },
            question: "Why is revealing policy dangerous?",
            options: [
                "It isn't.",
                "It helps attackers optimize their brute-force dictionaries (e.g., knowing you require 'Capital + Number' reduces the search space).",
                "Chocolate is unhealthy.",
                "It violates NDA."
            ],
            correctAnswer: "It helps attackers optimize their brute-force dictionaries (e.g., knowing you require 'Capital + Number' reduces the search space).",
            explanation: "Quid Pro Quo is 'something for something'. Small gifts often lower defenses against sharing 'minor' details."
        },
        {
            title: "Fake Wi-Fi Portal (Evil Twin)",
            id: "se-beginner-10",
            topic: "social_engineering",
            level: "beginner",
            briefing: "You see two Wi-Fi networks: 'Starbucks_WiFi' and 'Starbucks_Free_VIP'.",
            task: "choose the connection.",
            artifacts: {
                portal: "The VIP one asks for your email and password to login.",
                legit: "The real one just has an 'Accept' button."
            },
            question: "How do attackers use fake portals?",
            options: [
                "To give better internet.",
                "To harvest credentials by mimicking the look of legitimate captive portals.",
                "To test speed.",
                "To mine crypto."
            ],
            correctAnswer: "To harvest credentials by mimicking the look of legitimate captive portals.",
            explanation: "Users are trained to type emails into Wi-Fi portals. Attackers exploit this habit to steal credentials via rogue access points."
        }
    ],
    intermediate: [
        {
            title: "Vendor Email Compromise (VEC)",
            id: "se-intermediate-1",
            topic: "social_engineering",
            level: "intermediate",
            briefing: "A prompt invoice arrives from a known vendor, but the bank account changed.",
            task: "Verify the payment details.",
            artifacts: {
                sender: "billing@trusted-vendor.com (Real Address - Hacked)",
                body: "Please update our ACH info to this new account starting today.",
                invoice: "Matches previous formats."
            },
            question: "If a known vendor emails a change in banking info, what do you do?",
            options: [
                "Update it.",
                "Call the vendor on a known, trusted number (not the one in the email) to verbally confirm the change.",
                "Reply to ask if it's real.",
                "Wait 30 days."
            ],
            correctAnswer: "Call the vendor on a known, trusted number (not the one in the email) to verbally confirm the change.",
            explanation: "VEC is deadly because the email comes from a real, trusted account. Out-of-band verification (phone call) is the ONLY defense."
        },
        {
            title: "Deepfake Video Conference",
            id: "se-intermediate-2",
            topic: "social_engineering",
            level: "intermediate",
            briefing: "You join a Zoom call. The CFO's video loops slightly.",
            task: "Detect the visual anomaly.",
            artifacts: {
                observation: "The CFO blinks at regular 5-second intervals. The background doesn't shift when they move.",
                audio: "Generic 'Yes, go ahead' phrases."
            },
            question: "What should you do if a video participant looks 'off'?",
            options: [
                "Ignore it.",
                "Ask them to perform a specific, non-generic interaction (e.g., 'Can you wave your hand in front of your face/turn your head?').",
                "Disconnect.",
                "Record it."
            ],
            correctAnswer: "Ask them to perform a specific, non-generic interaction (e.g., 'Can you wave your hand in front of your face/turn your head?').",
            explanation: "Deepfakes struggle with complex, real-time geometry (occlusion). Asking for a physical check can reveal the mask."
        },
        {
            title: "Badge Cloning (RFID Skimming)",
            id: "se-intermediate-3",
            topic: "social_engineering",
            level: "intermediate",
            briefing: "Someone bumps into you in the elevator, pressing a bag against your hip.",
            task: "Analyze the proximity attack.",
            artifacts: {
                device: "Proxmark3 in a laptop bag.",
                target: "Your HID prox card."
            },
            question: "How can you protect legacy LF (125kHz) badges?",
            options: [
                "Hold them tight.",
                "Use an RFID-blocking sleeve/wallet.",
                "Put them in aluminum foil.",
                "None of these."
            ],
            correctAnswer: "Use an RFID-blocking sleeve/wallet.",
            explanation: "Low-frequency cards transmit their ID constantly. Skimmers can read them from inches away. Shielding blocks the signal."
        },
        {
            title: "Reverse Social Engineering",
            id: "se-intermediate-4",
            topic: "social_engineering",
            level: "intermediate",
            briefing: "The attacker sabotages a system, then advertises themselves as the only one who can fix it.",
            task: "Identify the setup.",
            artifacts: {
                event: "Network goes down. Error: 'Contact Support at 555-0199'.",
                action: "User calls the number."
            },
            question: "Why is the user so compliant in this scenario?",
            options: [
                "They are nice.",
                "They are desperate for a fix and initiated the call, so they trust the 'technician' implicitly.",
                "They are ignorant.",
                "It is late."
            ],
            correctAnswer: "They are desperate for a fix and initiated the call, so they trust the 'technician' implicitly.",
            explanation: "By creating the problem, the attacker positions themselves as the savior. The victim begs for the malware/fix."
        },
        {
            title: "Eavesdropping via MEMS (Gyroscope)",
            id: "se-intermediate-5",
            topic: "social_engineering",
            level: "intermediate",
            briefing: "A phone on the conference table is recording, but the mic is off.",
            task: "Identify the side-channel.",
            artifacts: {
                sensor: "Gyroscope/Accelerometer.",
                principle: "Vibrations from speech usually vibrate the table/phone slightly."
            },
            question: "Can non-microphone sensors record speech?",
            options: [
                "No.",
                "Yes (Gyrophone attack). Sensitive motion sensors can pick up sound vibrations from surfaces, recovering rough speech.",
                "Only loud noises.",
                "Only music."
            ],
            correctAnswer: "Yes (Gyrophone attack). Sensitive motion sensors can pick up sound vibrations from surfaces, recovering rough speech.",
            explanation: "Mobile sensors are often unpermissioned (apps don't need mic access to read the gyro). This allows covert listening."
        },
        {
            title: "The 'Honey Trap' (Romance Scam)",
            id: "se-intermediate-6",
            topic: "social_engineering",
            level: "intermediate",
            briefing: "A competitor's employee matches with you on Tinder.",
            task: "Analyze the conversation flow.",
            artifacts: {
                user: "Attractive profile.",
                questions: "Asks about your work hours, morale, and specific project code names."
            },
            question: "What is the goal of a Honey Trap?",
            options: [
                "Love.",
                "To compromise the target via blackmail or emotional manipulation to extract intelligence.",
                "Marriage.",
                "Networking."
            ],
            correctAnswer: "To compromise the target via blackmail or emotional manipulation to extract intelligence.",
            explanation: "MICE (Money, Ideology, Coercion, Ego). Honey traps leverage Ego and Coercion (blackmail) effectively."
        },
        {
            title: "Tech Support Pop-up (Browser Locker)",
            id: "se-intermediate-7",
            topic: "social_engineering",
            level: "intermediate",
            briefing: "Your browser freezes with a loud siren and 'Microsoft Critical Alert'.",
            task: "Choose the exit strategy.",
            artifacts: {
                screen: "Full screen loop. 'Call 1-800-MICROSOFT to unlock'.",
                control: "Mouse is disabled."
            },
            question: "How do you clear a browser locker?",
            options: [
                "Call the number.",
                "Task Manager (Ctrl+Shift+Esc) -> End Task on the browser.",
                "Pay the fee.",
                "Reinstall Windows."
            ],
            correctAnswer: "Task Manager (Ctrl+Shift+Esc) -> End Task on the browser.",
            explanation: "It's just a javascript loop (alert). It's not a virus. Killing the browser process breaks the loop."
        },
        {
            title: "Technical Pretexting (Fake IT)",
            id: "se-intermediate-8",
            topic: "social_engineering",
            level: "intermediate",
            briefing: "Caller claims to be from the Network Operations Center (NOC).",
            task: "Verify the technical jargon.",
            artifacts: {
                script: "We are seeing high latency on your subnet. Open cmd and type 'net view'. Read me the output."
            },
            question: "Why do attackers ask you to run harmless commands?",
            options: [
                "To fix the internet.",
                "To establish authority and compliance before escalating to a malicious command.",
                "They are bored.",
                "To check time."
            ],
            correctAnswer: "To establish authority and compliance before escalating to a malicious command.",
            explanation: "Compliance is a slippery slope. By getting you to say 'Yes' to small tasks, they groom you for the big ask (installing a RAT)."
        },
        {
            title: "Clean Desk Policy Violation",
            id: "se-intermediate-9",
            topic: "social_engineering",
            level: "intermediate",
            briefing: "You walk past an empty cubicle.",
            task: "Spot the leaks.",
            artifacts: {
                sticky_note: "Password: Winter2024!",
                whiteboard: "Network Topology Drawing.",
                drawer: "Keys left in lock."
            },
            question: "Why is a Clean Desk Policy critical?",
            options: [
                "It looks professional.",
                "It prevents janitorial staff, visitors, or insider threats from harvesting opportunistic intelligence.",
                "The cleaners need space.",
                "Feng Shui."
            ],
            correctAnswer: "It prevents janitorial staff, visitors, or insider threats from harvesting opportunistic intelligence.",
            explanation: "Physical access is total access. Passwords on sticky notes are the #1 physical vulnerability."
        },
        {
            title: "Social Media Mining (OSINT)",
            id: "se-intermediate-10",
            topic: "social_engineering",
            level: "intermediate",
            briefing: "Attackers built a profile on you using only public data.",
            task: "Identify the sources.",
            artifacts: {
                badge_photo: "Instagram (reveals ID layout).",
                pet_name: "Facebook (reveals potential password/security question).",
                job_title: "LinkedIn (reveals value)."
            },
            question: "What is the best defense against OSINT profiling?",
            options: [
                "Delete the internet.",
                "Setting profiles to Private and practicing data minimization (not posting badges/work screens).",
                "Posting fake info.",
                "Using VPN."
            ],
            correctAnswer: "Setting profiles to Private and practicing data minimization (not posting badges/work screens).",
            explanation: "Anything you post is ammo. Attackers use it to craft custom phishing/vishing scripts."
        }
    ],
    advanced: [
        {
            title: "Gait Analysis (Surveillance)",
            id: "se-advanced-1",
            topic: "social_engineering",
            level: "advanced",
            briefing: "A camera records you walking from a distance.",
            task: "Understand biometric limits.",
            artifacts: {
                data: "Stride length, cadence, hip rotation.",
                match: "99% Identity Confidence."
            },
            question: "Can you be identified without your face?",
            options: [
                "No.",
                "Yes. Gait analysis is a behavioral biometric that is unique enough to identify individuals from behind or at a distance.",
                "Only by mothers.",
                "Only if running."
            ],
            correctAnswer: "Yes. Gait analysis is a behavioral biometric that is unique enough to identify individuals from behind or at a distance.",
            explanation: "Modern surveillance uses whole-body metrics. Masking your face does not defeat gait recognition."
        },
        {
            title: "Keystroke Inference (Audio)",
            id: "se-advanced-2",
            topic: "social_engineering",
            level: "advanced",
            briefing: "You are typing on a Zoom call with your mic unmuted.",
            task: "Analyze the audio leak.",
            artifacts: {
                audio: "Click-clack sounds of a mechanical keyboard.",
                analysis: "AI model reconstructs the text based on minute timing and sound differences between keys."
            },
            question: "What is the accuracy of acoustic keystroke inference?",
            options: [
                "0%.",
                "Over 90% with high-quality microphones (like those in smartphones/laptops).",
                "50%.",
                "10%."
            ],
            correctAnswer: "Over 90% with high-quality microphones (like those in smartphones/laptops).",
            explanation: "Each key on a keyboard sounds slightly different due to plate resonance. Mute your mic when typing passwords!"
        },
        {
            title: "Cold Boot Attack",
            id: "se-advanced-3",
            topic: "social_engineering",
            level: "advanced",
            briefing: "Security seizes a laptop that was asleep (not off).",
            task: "Recover the encryption keys.",
            artifacts: {
                method: "Spray RAM with forced air duster (freeze it).",
                result: "Remanence effect allows reading RAM contents (including BitLocker keys) for minutes after power cut."
            },
            question: "Does Full Disk Encryption (FDE) protect a running/sleeping computer?",
            options: [
                "Yes, always.",
                "No. FDE only protects data at rest (powered off). If RAM is powered, the keys are present in memory.",
                "Yes, if it's a Mac.",
                "Yes, if locked."
            ],
            correctAnswer: "No. FDE only protects data at rest (powered off). If RAM is powered, the keys are present in memory.",
            explanation: "Physical access to a powered/sleeping machine allows memory attacks. Always power down completely in high-risk zones."
        },
        {
            title: "Van Eck Phreaking (Tempest)",
            id: "se-advanced-4",
            topic: "social_engineering",
            level: "advanced",
            briefing: "An antenna in a van outside reconstructs your monitor image.",
            task: "Identify the emission source.",
            artifacts: {
                cable: "Cheap VGA/HDMI cable without ferrite cores.",
                signal: "Electromagnetic radiation leaking video/data."
            },
            question: "How do secure facilities (SCIFs) prevent this?",
            options: [
                "Curtains.",
                "Faraday cages and TEMPEST-shielded hardware.",
                "Loud music.",
                "Dark rooms."
            ],
            correctAnswer: "Faraday cages and TEMPEST-shielded hardware.",
            explanation: "Electronics emit RF. Without proper shielding, these emanations can be intercepted and reconstructed."
        },
        {
            title: "Thermodynamic Side Channels",
            id: "se-advanced-5",
            topic: "social_engineering",
            level: "advanced",
            briefing: "Attackers determine your password using a thermal camera.",
            task: "Analyze the keypad.",
            artifacts: {
                image: "Thermal residue on keys 1, 5, 9, #.",
                timing: "Keys pressed last are warmer."
            },
            question: "How long does thermal heat signature last on a keypad?",
            options: [
                "Seconds.",
                "Up to a minute, allowing an attacker immediately following you to guess the PIN code order based on heat decay.",
                "Hours.",
                "Days."
            ],
            correctAnswer: "Up to a minute, allowing an attacker immediately following you to guess the PIN code order based on heat decay.",
            explanation: "Thermal attacks allow 'tailgaters' to see exactly which buttons were pressed and in what probable order."
        },
        {
            title: "Laser Microphone Surveillance",
            id: "se-advanced-6",
            topic: "social_engineering",
            level: "advanced",
            briefing: "A conversation in a glass-walled office is intercepted.",
            task: "Identify the vector.",
            artifacts: {
                tool: "Infrared Laser aimed at the window glass.",
                principle: "Glass vibrates with speech. The laser reflection measures the vibration."
            },
            question: "How do you defeat laser mics?",
            options: [
                "Close the blinds.",
                "Sound masking (White Noise generators) or heavy curtains attached to the glass.",
                "Speak softly.",
                "Turn off lights."
            ],
            correctAnswer: "Sound masking (White Noise generators) or heavy curtains attached to the glass.",
            explanation: "Vibrations transfer easily to glass. Physical dampening or noise injection prevents accurate reading."
        },
        {
            title: "Ultrasonic Tracking (Cross-Device)",
            id: "se-advanced-7",
            topic: "social_engineering",
            level: "advanced",
            briefing: "You visited a website on your PC. Now your Phone shows ads for it.",
            task: "Find the link.",
            artifacts: {
                beacon: "PC played an inaudible ultrasonic tone (19kHz).",
                receiver: "App on Phone (with mic permission) heard the tone and linked the devices."
            },
            question: "What is Ultrasonic Cross-Device Tracking (uXDT)?",
            options: [
                "Bluetooth syncing.",
                "Using high-frequency audio beacons to bridge the air gap between devices for ad tracking or de-anonymization.",
                "Wi-Fi sharing.",
                "Magic."
            ],
            correctAnswer: "Using high-frequency audio beacons to bridge the air gap between devices for ad tracking or de-anonymization.",
            explanation: "Advertisers (and attackers) use sound to link identities across unlinked devices."
        },
        {
            title: "Evil Maid Attack",
            id: "se-advanced-8",
            topic: "social_engineering",
            level: "advanced",
            briefing: "You left your laptop in the hotel room. It looks untouched.",
            task: "Check for tamper-evidence.",
            artifacts: {
                boot: "Bootloader has been modified to log your decryption password.",
                screws: "Scratches on the case screws."
            },
            question: "Who is the 'Evil Maid'?",
            options: [
                "A ghost.",
                "Any person with physical access to your unattended device (maid, customs, thief) who installs a hardware/software logger.",
                "A virus.",
                "Room service."
            ],
            correctAnswer: "Any person with physical access to your unattended device (maid, customs, thief) who installs a hardware/software logger.",
            explanation: "Unattended devices are compromised devices. 'Glitter polish' on screws creates a tamper seal to detect opening."
        },
        {
            title: "Juice Jacking (Public Charger)",
            id: "se-advanced-9",
            topic: "social_engineering",
            level: "advanced",
            briefing: "You plug into a free airport USB charging kiosk.",
            task: "Detect the data flow.",
            artifacts: {
                cable: "USB Data pins are active.",
                action: "Phone prompts 'Trust this Computer?'."
            },
            question: "What does a USB data blocker ('USB Condom') do?",
            options: [
                "Blocks electricity.",
                "Physically disconnects the Data pins, allowing only power to pass through, preventing data theft.",
                "Speeds up charging.",
                "Cleans the port."
            ],
            correctAnswer: "Physically disconnects the Data pins, allowing only power to pass through, preventing data theft.",
            explanation: "Public USB ports can be modified to steal data. Always use a power-only adapter or your own brick."
        },
        {
            title: "Wi-Fi Deauthentication (Deauth)",
            id: "se-advanced-10",
            topic: "social_engineering",
            level: "advanced",
            briefing: "Your Wi-Fi keeps disconnecting. Then a 'Firmware Update' page appears.",
            task: "Analyze the sequence.",
            artifacts: {
                packet: "802.11 Deauth Frames flood your device.",
                goal: "Force you to connect to the attacker's Evil Twin AP."
            },
            question: "Can anyone disconnect you from Wi-Fi?",
            options: [
                "No, it's encrypted.",
                "Yes. Identifying specific management frames (Deauth) are typically unencrypted, allowing anyone to kick devices off a network.",
                "Only the admin.",
                "Only if they know the password."
            ],
            correctAnswer: "Yes. Identifying specific management frames (Deauth) are typically unencrypted, allowing anyone to kick devices off a network.",
            explanation: "WPA3 creates protections (PMF), but most networks are vulnerable to deauth attacks that force users onto rogue APs."
        }
    ],
    expert: [
        {
            title: "NLP-Based Spear Phishing Generation",
            id: "se-expert-1",
            topic: "social_engineering",
            level: "expert",
            briefing: "You receive an email written in your own writing style.",
            task: "Identify the AI mimicry.",
            artifacts: {
                source: "Attacker trained a LLM on your public tweets/blogs.",
                result: "Hyper-personalized pretext using your slang and sentence structure."
            },
            question: "How does AI change social engineering?",
            options: [
                "It makes it slower.",
                "Scale and Quality. Attackers can now generate infinite, unique, high-context lures that bypass traditional 'bad grammar' filters.",
                "It adds robots.",
                "It costs more."
            ],
            correctAnswer: "Scale and Quality. Attackers can now generate infinite, unique, high-context lures that bypass traditional 'bad grammar' filters.",
            explanation: "Automated Social Engineering is the new frontier. Detection must rely on intent analysis, not syntax."
        },
        {
            title: "Psychological Profiling via Metadata",
            id: "se-expert-2",
            topic: "social_engineering",
            level: "expert",
            briefing: "Attackers target you based on your 'Big 5' personality traits.",
            task: "Reverse the profile.",
            artifacts: {
                analysis: "High Conscientiousness, High Neuroticism.",
                lure: "A fake alert about a 'Compliance Violation' (Targets fear of error)."
            },
            question: "Why target personality traits?",
            options: [
                "Just for fun.",
                "Different personalities respond to different triggers (Fear vs. Greed vs. Helpfulness). Matching the lure boosts success rates.",
                "It is random.",
                "Astrology."
            ],
            correctAnswer: "Different personalities respond to different triggers (Fear vs. Greed vs. Helpfulness). Matching the lure boosts success rates.",
            explanation: "Sophisticated campaigns segment targets. 'Helpful' people get charity scams; 'Neurotic' people get security warnings."
        },
        {
            title: "Simulated Internal DNS Poisoning",
            id: "se-expert-3",
            topic: "social_engineering",
            level: "expert",
            briefing: "Typing 'portal.intranet' leads to a look-alike login page.",
            task: "Identify the redirection.",
            artifacts: {
                dns_cache: "portal.intranet -> 192.168.1.55 (Attacker)",
                method: "LLMNR/NBT-NS Poisoning (Responder tool)."
            },
            question: "What is LLMNR Poisoning?",
            options: [
                "Food poisoning.",
                "When a computer asks 'Who is X?', and the DNS fails, it shouts to the local network. The attacker replies 'I am X!', capturing the credential hash.",
                "DNS hacking.",
                " ARP spoofing."
            ],
            correctAnswer: "When a computer asks 'Who is X?', and the DNS fails, it shouts to the local network. The attacker replies 'I am X!', capturing the credential hash.",
            explanation: "Internal networks are noisy. Responder intercepts these multicast requests to harvest NTLM hashes."
        },
        {
            title: "Physical Access Control System (PACS) Cloning",
            id: "se-expert-4",
            topic: "social_engineering",
            level: "expert",
            briefing: "Attacker replays a Wiegand signal to open a door.",
            task: "Analyze the backend wiring.",
            artifacts: {
                tool: "ESPKey implanted behind the card reader.",
                action: "Captures card data from the wires and replays it on command via Wi-Fi."
            },
            question: "Is the card encrypted?",
            options: [
                "Yes.",
                "The card might be, but the Wiegand protocol data on the wires behind the reader is often unencrypted plaintext.",
                "No.",
                "Sort of."
            ],
            correctAnswer: "The card might be, but the Wiegand protocol data on the wires behind the reader is often unencrypted plaintext.",
            explanation: "The 'Last Inch' problem. Even high-security cards often send plain data from the reader to the controller. Implants exploit this."
        },
        {
            title: "Social Engineering the Help Desk (MFA Reset)",
            id: "se-expert-5",
            topic: "social_engineering",
            level: "expert",
            briefing: "Attacker convinces Help Desk to add a new MFA token.",
            task: "Critique the verification policy.",
            artifacts: {
                method: "claimed 'phone broken', provided SSN (stolen) and Employee ID (public).",
                result: "Help Desk registered attacker's device."
            },
            question: "What is the only robust verification for remote resets?",
            options: [
                "SSN.",
                "Manager approval via a separate channel or Video Verification with physical ID.",
                "Employee ID.",
                "Mother's maiden name."
            ],
            correctAnswer: "Manager approval via a separate channel or Video Verification with physical ID.",
            explanation: "Knowledge-based authentication (KBA) creates a single point of failure. If the attacker knows the answers, they become the user."
        },
        {
            title: "Visual Data Exfiltration via LED",
            id: "se-expert-6",
            topic: "social_engineering",
            level: "expert",
            briefing: "The HDD light on a server is blinking in a pattern.",
            task: "Decode the signal.",
            artifacts: {
                pattern: "Morse code/Binary.",
                receiver: "Drone outside recording the rack."
            },
            question: "How fast can an LED exfiltrate data?",
            options: [
                "1 bit per year.",
                "Surprisingly fast (up to 4 kbps with high-speed cameras).",
                "It can't.",
                "Only red ones work."
            ],
            correctAnswer: "Surprisingly fast (up to 4 kbps with high-speed cameras).",
            explanation: "Hard drive LEDs are controlled by software. Malware can modulate them to transmit secrets to optical receivers."
        },
        {
            title: "Acoustic Cryptanalysis (RSA Key Extraction)",
            id: "se-expert-7",
            topic: "social_engineering",
            level: "expert",
            briefing: "A microphone near a laptop records CPU whine during decryption.",
            task: "Correlate sound to math.",
            artifacts: {
                audio: "High-pitched coil whine from capacitors.",
                result: "4096-bit RSA Key extracted."
            },
            question: "How does CPU sound reveal keys?",
            options: [
                "CPUs sing.",
                "Power consumption changes based on the operation (0 vs 1). This causes capacitor vibration changes (whine) that leak the bit being processed.",
                "Fans modulate.",
                "Speakers play it."
            ],
            correctAnswer: "Power consumption changes based on the operation (0 vs 1). This causes capacitor vibration changes (whine) that leak the bit being processed.",
            explanation: "Side channel attacks use physical byproducts (sound, heat, power) to infer internal state."
        },
        {
            title: "Strategic Default (Paperclip Attack)",
            id: "se-expert-8",
            topic: "social_engineering",
            level: "expert",
            briefing: "Attacker resets the admin password using physical access.",
            task: "Secure the hardware.",
            artifacts: {
                method: "Paperclip used on the 'Reset' button of the router/server.",
                prevention: "Epoxy/Locks."
            },
            question: "Why do we lock server racks?",
            options: [
                "To keep them warm.",
                "To prevent physical factory resets or drive swaps.",
                "Dust protection.",
                "Aesthetics."
            ],
            correctAnswer: "To prevent physical factory resets or drive swaps.",
            explanation: "Most hardware has a physical 'God Mode' reset mechanism. If you can touch it, you own it."
        },
        {
            title: "Supply Chain Interdiction",
            id: "se-expert-9",
            topic: "social_engineering",
            level: "expert",
            briefing: "A new server arrives with a hardware implant pre-installed.",
            task: "Verify chain of custody.",
            artifacts: {
                box: "Tape looked resealed.",
                component: "Extra chip on the motherboard."
            },
            question: "When does interdiction happen?",
            options: [
                "At the factory.",
                "During shipping (by intelligence agencies or criminals) before it reaches the customer.",
                "In the store.",
                "Usually never."
            ],
            correctAnswer: "During shipping (by intelligence agencies or criminals) before it reaches the customer.",
            explanation: "Intercepting a package in transit to modify it is a high-end attack (NSA style), but increasingly common for industrial espionage."
        },
        {
            title: "Human Hacking (NLP Manipulation)",
            id: "se-expert-10",
            topic: "social_engineering",
            level: "expert",
            briefing: "Attacker uses Neuro-Linguistic Programming (NLP) to force compliance.",
            task: "Analyze the speech patterns.",
            artifacts: {
                technique: "Embedded commands and mirroring.",
                result: "Victim felt compelled to help without knowing why."
            },
            question: "What is 'Mirroring' in social engineering?",
            options: [
                "Checking hair.",
                "Subtly mimicking the target's body language/speech rate to build subconscious rapport and trust.",
                "Recording video.",
                "Using a mirror."
            ],
            correctAnswer: "Subtly mimicking the target's body language/speech rate to build subconscious rapport and trust.",
            explanation: "Rapport is the mechanism of trust. Once established, the victim drops defensive barriers."
        }
    ]
};

module.exports = social_engineering;
