const CURRICULUM = {
    phishing: {
        beginner: [
            "Identify spoofed sender domain",
            "Detect display-name impersonation",
            "Compare visible link vs actual URL",
            "Spot urgency language",
            "Detect generic greeting",
            "Basic email header inspection",
            "External email warning interpretation",
            "Grammar & formatting red flags",
            "Attachment extension risk check",
            "Full email classification (basic)"
        ],
        intermediate: [
            "SPF result analysis",
            "DKIM signature verification",
            "DMARC policy evaluation",
            "Reply-To mismatch detection",
            "Look-alike domain analysis",
            "HTML vs plaintext email comparison",
            "Image-based phishing detection",
            "Credential-harvesting page indicators",
            "Email thread hijacking detection",
            "Full email verdict with justification"
        ],
        advanced: [
            "Multi-stage phishing flow analysis",
            "Brand impersonation techniques",
            "Email gateway bypass indicators",
            "Header chain anomaly detection",
            "Malicious attachment sandbox reasoning",
            "Embedded tracking pixel detection",
            "OAuth phishing detection",
            "Email redirect chain analysis",
            "Phishing kit fingerprinting",
            "Incident response decision making"
        ],
        expert: [
            "Executive impersonation analysis",
            "Business Email Compromise (BEC) triage",
            "Vendor invoice fraud detection",
            "Domain reputation intelligence usage",
            "Cross-mailbox phishing correlation",
            "Phishing campaign clustering",
            "SOC escalation workflow decision",
            "Legal & compliance response choice",
            "Post-incident reporting task",
            "Enterprise phishing mitigation planning"
        ]
    },
    smishing: {
        beginner: [
            "Identify suspicious SMS sender",
            "Detect shortened URL risks",
            "Spot prize & lottery scams",
            "Fake delivery notification detection",
            "OTP scam identification",
            "SMS grammar anomalies",
            "Urgency language in SMS",
            "Banking alert spoofing",
            "SMS link preview analysis",
            "SMS classification decision"
        ],
        intermediate: [
            "Sender ID spoofing detection",
            "URL redirection tracing",
            "Mobile OS permission abuse indicators",
            "Fake app install scam detection",
            "Financial fraud SMS patterns",
            "Telecom impersonation analysis",
            "QR-linked SMS inspection",
            "Smishing campaign correlation",
            "SMS reporting workflow",
            "Smishing mitigation decision"
        ],
        advanced: [
            "SIM swap attack indicators",
            "Malware-delivering SMS analysis",
            "AI-generated SMS detection",
            "Multi-language smishing detection",
            "Mobile browser exploit clues",
            "Smishing infrastructure analysis",
            "Carrier abuse identification",
            "Incident response actions",
            "Threat intel correlation",
            "Enterprise mobile defense decision"
        ],
        expert: [
            "Telecom signaling abuse reasoning",
            "Mass smishing campaign detection",
            "Nation-state smishing patterns",
            "Cross-channel attack correlation",
            "Fraud loss estimation",
            "Legal escalation decision",
            "Mobile forensics triage",
            "Executive SMS targeting analysis",
            "Long-term mitigation planning",
            "Organizational SMS policy design"
        ]
    },
    vishing: {
        beginner: [
            "Identify suspicious call script",
            "Detect authority impersonation",
            "Urgency & fear cues",
            "Caller ID spoof awareness",
            "Fake support call detection",
            "Banking fraud call patterns",
            "Verification request red flags",
            "Call flow inconsistency detection",
            "Proper call termination decision",
            "Vishing classification"
        ],
        intermediate: [
            "Social pressure analysis",
            "Multi-step call manipulation",
            "Script reuse detection",
            "Accent & language anomalies",
            "Callback scam detection",
            "Call recording analysis",
            "Organizational impersonation",
            "Fraud escalation handling",
            "Evidence documentation task",
            "Vishing mitigation steps"
        ],
        advanced: [
            "Deepfake voice indicators",
            "AI-assisted vishing detection",
            "Executive impersonation analysis",
            "Multi-channel vishing correlation",
            "Call center fraud models",
            "Voice biometric weaknesses",
            "Insider information abuse",
            "SOC response decision",
            "Incident reporting",
            "Forensic call analysis"
        ],
        expert: [
            "Nation-state vishing patterns",
            "Long-term manipulation campaigns",
            "High-value target analysis",
            "Legal response decision",
            "Voice threat intelligence usage",
            "Organizational policy evaluation",
            "Employee training gap analysis",
            "Risk scoring methodology",
            "Executive briefing preparation",
            "Enterprise vishing defense design"
        ]
    },
    qr_code: {
        beginner: [
            "Identify suspicious QR placement",
            "URL preview analysis",
            "Fake payment QR detection",
            "Public QR risk evaluation",
            "Branding mismatch detection",
            "QR redirection awareness",
            "Mobile scanning safety",
            "QR phishing classification",
            "User behavior assessment",
            "Safe handling decision"
        ],
        intermediate: [
            "Redirect chain tracing",
            "QR-embedded URL obfuscation",
            "Credential harvesting detection",
            "Payment fraud analysis",
            "QR code tampering indicators",
            "Corporate QR misuse detection",
            "Short-link QR analysis",
            "Threat reporting workflow",
            "Incident containment",
            "QR mitigation decision"
        ],
        advanced: [
            "Multi-stage QR attacks",
            "Malware delivery via QR",
            "QR + social engineering analysis",
            "QR phishing campaign correlation",
            "Infrastructure attribution",
            "QR payload fingerprinting",
            "Incident response planning",
            "Threat intel usage",
            "User impact analysis",
            "Advanced QR verdict"
        ],
        expert: [
            "Supply-chain QR compromise",
            "Large-scale QR campaigns",
            "Nation-state QR usage",
            "Regulatory impact analysis",
            "Enterprise QR policy design",
            "Risk modeling",
            "Public space QR defense",
            "Executive advisory task",
            "Long-term mitigation planning",
            "Organization-wide QR strategy"
        ]
    },
    social_engineering: {
        beginner: [
            "Trust exploitation detection",
            "Authority manipulation spotting",
            "Sympathy-based scams",
            "Fear-based tactics",
            "Pretext identification",
            "Unexpected request handling",
            "Information disclosure risk",
            "Social media oversharing",
            "Behavioral red flags",
            "Classification decision"
        ],
        intermediate: [
            "Pretext building analysis",
            "Tailgating scenarios",
            "Physical security awareness",
            "Emotional manipulation detection",
            "Insider influence indicators",
            "Multi-channel manipulation",
            "OSINT misuse detection",
            "Reporting workflow",
            "Mitigation planning",
            "Social attack verdict"
        ],
        advanced: [
            "Long-term manipulation campaigns",
            "Insider threat psychology",
            "Executive manipulation attempts",
            "Reconnaissance profiling",
            "Behavioral anomaly detection",
            "Campaign attribution",
            "Incident response actions",
            "Organizational impact analysis",
            "Counter-manipulation strategy",
            "Advanced verdict"
        ],
        expert: [
            "Human firewall design",
            "Organizational psychology risks",
            "Red team simulation analysis",
            "Corporate espionage scenarios",
            "Legal & HR escalation",
            "Policy gap identification",
            "Training effectiveness evaluation",
            "Executive awareness strategy",
            "Risk governance planning",
            "Enterprise social-engineering defense"
        ]
    },
    advanced_threats: {
        beginner: [
            "Recognize APT indicators",
            "Suspicious persistence signs",
            "Lateral movement basics",
            "Credential reuse detection",
            "Command-and-control awareness",
            "Basic IOC identification",
            "Endpoint alert interpretation",
            "Network anomaly spotting",
            "Threat classification",
            "Initial response decision"
        ],
        intermediate: [
            "Kill-chain mapping",
            "Beaconing traffic detection",
            "Privilege escalation clues",
            "Malware family recognition",
            "Log correlation basics",
            "Lateral movement detection",
            "Data exfiltration indicators",
            "Incident documentation",
            "Containment strategy",
            "Threat verdict"
        ],
        advanced: [
            "Zero-day exploitation reasoning",
            "Living-off-the-land techniques",
            "Memory-resident malware detection",
            "Cross-system correlation",
            "Threat actor profiling",
            "Infrastructure takedown decision",
            "Legal implications",
            "Recovery planning",
            "Post-incident analysis",
            "Advanced response decision"
        ],
        expert: [
            "Nation-state campaign analysis",
            "Long-term intrusion detection",
            "Attribution complexity reasoning",
            "Executive risk briefing",
            "Regulatory reporting decision",
            "Enterprise defense architecture",
            "Threat hunting strategy",
            "SOC maturity assessment",
            "Strategic mitigation planning",
            "Organization-wide APT defense"
        ]
    },
    malware_detection: {
        beginner: [
            "Suspicious file extension detection",
            "Fake installer identification",
            "Email attachment risk analysis",
            "Download source verification",
            "Basic malware indicators",
            "Hash reputation check",
            "User behavior red flags",
            "Safe handling decision",
            "Endpoint alert review",
            "Classification verdict"
        ],
        intermediate: [
            "Macro-based malware detection",
            "Script malware analysis",
            "Dropper behavior detection",
            "Persistence mechanism awareness",
            "Network connection analysis",
            "Sandbox report interpretation",
            "File obfuscation clues",
            "Incident reporting",
            "Containment decision",
            "Malware verdict"
        ],
        advanced: [
            "Ransomware behavior analysis",
            "Fileless malware detection",
            "Living-off-the-land abuse",
            "Payload staging analysis",
            "C2 communication detection",
            "Malware family classification",
            "Threat intel correlation",
            "Recovery planning",
            "Forensic artifact review",
            "Advanced verdict"
        ],
        expert: [
            "Custom malware profiling",
            "Nation-state malware analysis",
            "Memory forensics reasoning",
            "Reverse-engineering decision points",
            "Legal escalation planning",
            "Enterprise malware defense design",
            "SOC response optimization",
            "Threat hunting strategy",
            "Long-term remediation planning",
            "Organizational malware resilience"
        ]
    }
};

module.exports = CURRICULUM;
