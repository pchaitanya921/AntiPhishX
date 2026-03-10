/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Cyber Enterprise Color Palette
                cyber: {
                    black: '#0B0F1A',
                    dark: '#111827',
                    purple: '#7C3AED',
                    cyan: '#22D3EE',
                    gray: '#9CA3AF',
                    text: '#E5E7EB',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'cyber-grid': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40 L40 40 L40 0 M0 0 L0 40 L40 40' fill='none' stroke='%23ffffff05' stroke-width='1'/%3E%3C/svg%3E\")",
                'glow-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
            },
            boxShadow: {
                'cyber-glow': '0 0 30px rgba(124, 58, 237, 0.25)',
                'cyber-glow-cyan': '0 0 30px rgba(34, 211, 238, 0.20)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
}
