const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../frontend/public/assets/courses');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Neon color palette from the reference
// Social Eng: Pink/Purple
// Phishing: Cyan/Blue
// Vishing: Pink/Purple
// Smishing: Blue
// QR: White/Cyan

const courses = [
    {
        filename: 'phishing.svg',
        color: '#00D4FF', // Cyan
        // Custom path for Hooked Email (Phishing)
        customPath: `
            <g transform="scale(2.2) translate(-50, -50)">
                <!-- Fishing Hook -->
                <path d="M 50 0 L 50 25 M 50 25 Q 50 55 25 45" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                <path d="M 25 45 L 20 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                
                <!-- Envelope being hooked -->
                <g transform="rotate(-15, 50, 50) translate(0, 10)">
                    <rect x="20" y="30" width="60" height="40" rx="3" fill="none" stroke="currentColor" stroke-width="3"/>
                    <path d="M 20 30 L 50 55 L 80 30" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
                    <!-- Warning Exclamation -->
                    <text x="50" y="65" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="24" fill="currentColor">!</text>
                </g>
            </g>
        `
    },
    {
        filename: 'smishing.svg',
        color: '#7000FF', // Purple Blue
        icon: '💬'
    },
    {
        filename: 'vishing.svg',
        color: '#FF00AA', // Pink
        icon: '📞'
    },
    {
        filename: 'qr-code.svg',
        color: '#FFFFFF', // White
        // Custom path for a stylized QR code pattern
        customPath: `
            <g transform="translate(-60, -60) scale(1.5)">
                <!-- Top Left Finder -->
                <rect x="10" y="10" width="30" height="30" fill="none" stroke="currentColor" stroke-width="4"/>
                <rect x="18" y="18" width="14" height="14" fill="currentColor"/>
                
                <!-- Top Right Finder -->
                <rect x="60" y="10" width="30" height="30" fill="none" stroke="currentColor" stroke-width="4"/>
                <rect x="68" y="18" width="14" height="14" fill="currentColor"/>
                
                <!-- Bottom Left Finder -->
                <rect x="10" y="60" width="30" height="30" fill="none" stroke="currentColor" stroke-width="4"/>
                <rect x="18" y="68" width="14" height="14" fill="currentColor"/>
                
                <!-- Random Data Blocks -->
                <rect x="55" y="55" width="10" height="10" fill="currentColor"/>
                <rect x="70" y="55" width="10" height="10" fill="currentColor"/>
                <rect x="55" y="70" width="10" height="10" fill="currentColor"/>
                <rect x="70" y="70" width="10" height="10" fill="currentColor"/>
                <rect x="55" y="18" width="10" height="10" fill="currentColor" opacity="0.5"/>
                <rect x="18" y="55" width="10" height="10" fill="currentColor" opacity="0.5"/>
            </g>
        `
    },
    {
        filename: 'social-engineering.svg',
        color: '#FF0055', // Red/Pink
        icon: '🧠'
    }
];

const generateSVG = (course) => {
    // 16:9 aspect ratio roughly 800x450
    // Using a radial gradient background that mimics deep space
    // Adding a strong glow filter for the icon

    // Determine the main graphic: either text icon or custom path
    // For custom path, we center it using translation. The path itself is drawn relative to 0,0
    const mainGraphic = course.customPath
        ? `<g fill="${course.color}" transform="translate(400, 240)">${course.customPath}</g>`
        : `<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI Emoji, Arial, sans-serif" font-size="180" fill="${course.color}">${course.icon}</text>`;


    return `<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
    <defs>
        <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
            <!-- Shadow offset -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="thicken" />
            <feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />
            <feFlood flood-color="${course.color}" result="glowColor" />
            <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
            <feMerge>
                <feMergeNode in="softGlow_colored"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    
    <!-- Transparent Background (No Rect) -->

    <!-- Centered Glowing Graphic (Icon or Custom Path) -->
    <g filter="url(#glow)">
        ${mainGraphic}
    </g>
    
</svg>`;
};

courses.forEach(course => {
    const svgContent = generateSVG(course);
    fs.writeFileSync(path.join(outputDir, course.filename), svgContent);
    console.log(`Generated ${course.filename}`);
});
