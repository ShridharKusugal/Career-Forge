import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    const [themeName, setThemeName] = useState(() => {
        return localStorage.getItem('theme-name') || 'ocean';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const body = window.document.body;
        if (darkMode) {
            root.classList.add('dark');
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        const root = window.document.documentElement;
        // Remove existing theme classes
        const classes = Array.from(root.classList);
        classes.forEach(c => {
            if (c.startsWith('theme-')) {
                root.classList.remove(c);
            }
        });
        root.classList.add(`theme-${themeName}`);
        localStorage.setItem('theme-name', themeName);
    }, [themeName]);

    const toggleTheme = () => setDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme, themeName, setThemeName }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
