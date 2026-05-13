import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        if (theme === 'light') {
            root.classList.remove('dark');
            root.classList.add('light');
            // CSS variable overrides for light mode
            root.style.setProperty('--bg-primary', '#f0f4ff');
            root.style.setProperty('--bg-secondary', '#e8eeff');
            root.style.setProperty('--bg-card', 'rgba(255,255,255,0.75)');
            root.style.setProperty('--text-primary', '#0d1117');
            root.style.setProperty('--text-secondary', 'rgba(13,17,23,0.7)');
            root.style.setProperty('--border-color', 'rgba(124,58,237,0.18)');
            body.style.background = '#f0f4ff';
            body.style.color = '#0d1117';
        } else {
            root.classList.remove('light');
            root.classList.add('dark');
            root.style.setProperty('--bg-primary', '#030014');
            root.style.setProperty('--bg-secondary', '#0d1117');
            root.style.setProperty('--bg-card', 'rgba(255,255,255,0.04)');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', 'rgba(255,255,255,0.6)');
            root.style.setProperty('--border-color', 'rgba(255,255,255,0.1)');
            body.style.background = '#030014';
            body.style.color = '#ffffff';
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

