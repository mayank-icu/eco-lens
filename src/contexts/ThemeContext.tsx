import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as lightColors, darkColors } from '../constants/theme';
import { useAccessibility } from './AccessibilityContext';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeType;
    isDarkMode: boolean;
    colors: typeof lightColors;
    setTheme: (theme: ThemeType) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const { highContrast } = useAccessibility();
    const [theme, setThemeState] = useState<ThemeType>('light');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        loadTheme();
    }, []);

    useEffect(() => {
        updateIsDarkMode();
    }, [theme, systemScheme]);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('@theme');
            if (savedTheme) {
                setThemeState(savedTheme as ThemeType);
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        }
    };

    const updateIsDarkMode = () => {
        if (theme === 'system') {
            setIsDarkMode(systemScheme === 'dark');
        } else {
            setIsDarkMode(theme === 'dark');
        }
    };

    const setTheme = async (newTheme: ThemeType) => {
        setThemeState(newTheme);
        try {
            await AsyncStorage.setItem('@theme', newTheme);
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    const toggleTheme = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setTheme(newTheme);
    };

    const activeColors = useMemo(() => {
        let currentColors = isDarkMode ? darkColors : lightColors;

        if (highContrast) {
            return {
                ...currentColors,
                primary: isDarkMode ? '#4CC9F0' : '#004D40',
                textPrimary: isDarkMode ? '#FFFFFF' : '#000000',
                textSecondary: isDarkMode ? '#E0E0E0' : '#212121',
                background: isDarkMode ? '#000000' : '#FFFFFF',
                card: isDarkMode ? '#121212' : '#FFFFFF',
                // Add more high contrast overrides as needed
            };
        }

        return currentColors;
    }, [isDarkMode, highContrast]);

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, colors: activeColors, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
