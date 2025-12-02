import React, { createContext, useContext, useState, useEffect } from 'react';
// import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SoundContextType {
    soundEnabled: boolean;
    toggleSound: () => void;
    playSound: (name: 'success' | 'levelUp' | 'click') => Promise<void>;
}

export const SoundContext = createContext<SoundContextType>({
    soundEnabled: true,
    toggleSound: () => { },
    playSound: async () => { },
});

export const useSound = () => useContext(SoundContext);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        // Load preference
        AsyncStorage.getItem('soundEnabled').then((val) => {
            if (val !== null) setSoundEnabled(val === 'true');
        });
    }, []);

    const toggleSound = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        AsyncStorage.setItem('soundEnabled', String(newValue));
    };

    const playSound = async (name: 'success' | 'levelUp' | 'click') => {
        if (!soundEnabled) return;

        console.log(`Playing sound: ${name} (Sound disabled pending expo-audio migration)`);

        /*
        let soundFile;
        // Uncomment when assets are available
        switch (name) {
            case 'success':
                soundFile = require('../../assets/sounds/success.mp3');
                break;
            case 'levelUp':
                soundFile = require('../../assets/sounds/levelup.mp3');
                break;
            case 'click':
                soundFile = require('../../assets/sounds/click.mp3');
                break;
        }

        if (soundFile) {
            try {
                const { sound } = await Audio.Sound.createAsync(soundFile);
                await sound.playAsync();
                sound.setOnPlaybackStatusUpdate(async (status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        await sound.unloadAsync();
                    }
                });
            } catch (error) {
                console.log('Error playing sound', error);
            }
        }
        */
    };

    return (
        <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound }}>
            {children}
        </SoundContext.Provider>
    );
};
