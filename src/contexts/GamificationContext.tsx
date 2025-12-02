import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import { calculateLevel, checkStreak, XP_PER_STREAK_DAY } from '../services/gamification';
import { updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
// import Confetti from '../components/Confetti';
// import { registerForPushNotificationsAsync, scheduleDailyNotification } from '../services/notifications';

interface GamificationContextType {
    addPoints: (amount: number) => Promise<void>;
    checkDailyStreak: () => Promise<void>;
}

export const GamificationContext = createContext<GamificationContextType>({
    addPoints: async () => { },
    checkDailyStreak: async () => { },
});

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, updateUser } = useAuth();
    // const [showConfetti, setShowConfetti] = useState(false);

    const addPoints = async (amount: number) => {
        if (!user) return;

        const newPoints = (user.totalPoints || 0) + amount;
        const newLevel = calculateLevel(newPoints);
        const oldLevel = user.level || 1;

        const updates: any = {
            totalPoints: newPoints,
            level: newLevel,
        };

        if (newLevel > oldLevel) {
            // setShowConfetti(true);
            Alert.alert('Level Up! 🎉', `Congratulations! You reached Level ${newLevel}!`);
        }

        updateUser(updates);

        if (!user.isGuest && user.uid) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, updates);
            } catch (error) {
                console.error('Error updating points:', error);
            }
        }
    };

    const checkDailyStreak = async () => {
        if (!user) return;

        const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : new Date(0);
        const { isStreakActive, daysSinceLastActive } = checkStreak(lastActive);

        if (daysSinceLastActive === 0) return;

        let newStreak = user.currentStreak || 0;
        let newPoints = user.totalPoints || 0;
        let streakMessage = '';
        let streakFreezes = user.streakFreezes || 0;

        if (isStreakActive) {
            newStreak += 1;
            newPoints += XP_PER_STREAK_DAY;
            streakMessage = `You're on a ${newStreak} day streak! +${XP_PER_STREAK_DAY} XP`;
            // setShowConfetti(true);
        } else {
            if (newStreak > 0) {
                if (streakFreezes > 0) {
                    streakMessage = 'Streak Frozen! ❄️ You used a streak freeze to keep your streak!';
                    streakFreezes -= 1;
                    newStreak = user.currentStreak;
                } else {
                    streakMessage = 'Streak Broken 😢 Log in daily to keep your streak!';
                    newStreak = 1;
                }
            } else {
                newStreak = 1;
            }
        }

        const updates: any = {
            currentStreak: newStreak,
            lastActiveDate: new Date(),
            totalPoints: newPoints,
            streakFreezes,
            longestStreak: Math.max(newStreak, user.longestStreak || 0)
        };

        updateUser(updates);

        if (streakMessage) {
            Alert.alert(isStreakActive ? 'Streak Continued! 🔥' : 'Streak Status', streakMessage);
        }

        if (!user.isGuest && user.uid) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    ...updates,
                    lastActiveDate: Timestamp.now()
                });
            } catch (error) {
                console.error('Error updating streak:', error);
            }
        }
    };

    useEffect(() => {
        if (user?.uid) {
            checkDailyStreak();
            // registerForPushNotificationsAsync();
            // scheduleDailyNotification();
        }
    }, [user?.uid]);

    return (
        <GamificationContext.Provider value={{ addPoints, checkDailyStreak }}>
            {children}
            {/* <Confetti visible={showConfetti} onAnimationFinish={() => setShowConfetti(false)} /> */}
        </GamificationContext.Provider>
    );
};
