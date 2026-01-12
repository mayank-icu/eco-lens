import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { GamificationProvider } from './src/contexts/GamificationContext';
import { SoundProvider } from './src/contexts/SoundContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/components/SplashScreen';
import { ToastProvider } from './src/contexts/ToastContext';
import { AccessibilityProvider } from './src/contexts/AccessibilityContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
    // Only show splash screen on web, skip on mobile
    const [showSplash, setShowSplash] = useState(Platform.OS === 'web');

    useEffect(() => {
        // Only run splash timer on web
        if (Platform.OS === 'web') {
            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, []);

    if (showSplash) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    return (
        <AuthProvider>
            <ToastProvider>
                <AccessibilityProvider>
                    <SoundProvider>
                        <GamificationProvider>
                            <ThemeProvider>
                                <AppNavigator />
                                <StatusBar style="auto" />
                            </ThemeProvider>
                        </GamificationProvider>
                    </SoundProvider>
                </AccessibilityProvider>
            </ToastProvider>
        </AuthProvider>
    );
}
