import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { GamificationProvider } from './src/contexts/GamificationContext';
import { SoundProvider } from './src/contexts/SoundContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
    return (
        <AuthProvider>
            <SoundProvider>
                <GamificationProvider>
                    <AppNavigator />
                    <StatusBar style="auto" />
                </GamificationProvider>
            </SoundProvider>
        </AuthProvider>
    );
}
