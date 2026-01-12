import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface AccessibilityContextType {
    dyslexiaFont: boolean;
    setDyslexiaFont: (enabled: boolean) => void;
    colorBlindMode: ColorBlindMode;
    setColorBlindMode: (mode: ColorBlindMode) => void;
    highContrast: boolean;
    setHighContrast: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
    dyslexiaFont: false,
    setDyslexiaFont: () => { },
    colorBlindMode: 'none',
    setColorBlindMode: () => { },
    highContrast: false,
    setHighContrast: () => { },
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dyslexiaFont, setDyslexiaFontState] = useState(false);
    const [colorBlindMode, setColorBlindModeState] = useState<ColorBlindMode>('none');
    const [highContrast, setHighContrastState] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const storedDyslexia = await AsyncStorage.getItem('dyslexiaFont');
            const storedColorBlind = await AsyncStorage.getItem('colorBlindMode');
            const storedContrast = await AsyncStorage.getItem('highContrast');

            if (storedDyslexia) setDyslexiaFontState(storedDyslexia === 'true');
            if (storedColorBlind) setColorBlindModeState(storedColorBlind as ColorBlindMode);
            if (storedContrast) setHighContrastState(storedContrast === 'true');
        } catch (error) {
            console.error('Failed to load accessibility settings', error);
        }
    };

    const setDyslexiaFont = async (enabled: boolean) => {
        setDyslexiaFontState(enabled);
        await AsyncStorage.setItem('dyslexiaFont', String(enabled));
    };

    const setColorBlindMode = async (mode: ColorBlindMode) => {
        setColorBlindModeState(mode);
        await AsyncStorage.setItem('colorBlindMode', mode);
    };

    const setHighContrast = async (enabled: boolean) => {
        setHighContrastState(enabled);
        await AsyncStorage.setItem('highContrast', String(enabled));
    };

    return (
        <AccessibilityContext.Provider
            value={{
                dyslexiaFont,
                setDyslexiaFont,
                colorBlindMode,
                setColorBlindMode,
                highContrast,
                setHighContrast,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => useContext(AccessibilityContext);
