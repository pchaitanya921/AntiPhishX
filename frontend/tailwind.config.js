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
                // Graphite & Emerald AI Palette
                cyber: {
                    black: '#0A0A0A',
                    dark: '#111111',
                    emerald: '#10B981',
                    lime: '#A3E635',
                    gray: '#2A2A2A',
                    text: '#F3F4F6',
                    // Keep legacy keys for compatibility but map to new colors
                    purple: '#10B981', 
                    cyan: '#A3E635',
                },
                graphite: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                    950: '#0A0A0A',
                }
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
                'cyber-glow': '0 0 30px rgba(16, 185, 129, 0.25)',
                'cyber-glow-lime': '0 0 30px rgba(163, 230, 53, 0.20)',
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
