import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import { calculateLevel, checkStreak, XP_PER_STREAK_DAY, XP_WEEKLY_BONUS } from '../services/gamification';
import { updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useToast } from './ToastContext';

interface GamificationContextType {
    addPoints: (amount: number) => Promise<void>;
    recordScan: (co2Amount: number, points?: number) => Promise<void>;
    checkDailyStreak: () => Promise<{ canClaim: boolean, streakBroken: boolean, currentDay: number }>;
    claimDailyReward: () => Promise<void>;
    canClaimReward: boolean;
    toggleLessonTodo: (lessonId: string) => Promise<void>;
    markLessonComplete: (lessonId: string) => Promise<void>;
    claimBadge: (badgeId: string, points: number) => Promise<void>;
    scanHistory: any[];
}

export const GamificationContext = createContext<GamificationContextType>({
    addPoints: async () => { },
    recordScan: async () => { },
    checkDailyStreak: async () => ({ canClaim: false, streakBroken: false, currentDay: 1 }),
    claimDailyReward: async () => { },
    canClaimReward: false,
    toggleLessonTodo: async () => { },
    markLessonComplete: async () => { },
    claimBadge: async () => { },
});

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, updateUser } = useAuth();
    const { showToast } = useToast();
    const [canClaimReward, setCanClaimReward] = useState(false);
    const [scanHistory, setScanHistory] = useState<any[]>([]);

    // Load scan history from user object or separate collection
    useEffect(() => {
        if (user?.scanHistory) {
            setScanHistory(user.scanHistory);
        }
    }, [user]);

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
            showToast(`Level Up! 🎉 You reached Level ${newLevel}!`, 'success');
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

    const recordScan = async (co2Amount: number, points: number = 10) => {
        if (!user) return;

        const newTotalScans = (user.totalScans || 0) + 1;
        const newCo2Saved = (user.co2Saved || 0) + co2Amount;
        const newPoints = (user.totalPoints || 0) + points;

        const updates: any = {
            totalScans: newTotalScans,
            co2Saved: newCo2Saved,
            totalPoints: newPoints,
            lastActiveDate: new Date(),
            scanHistory: [...scanHistory, {
                date: new Date().toISOString(),
                co2Saved: co2Amount,
                points: points,
                plasticType: 'Scanned Item' // Placeholder, ideally passed in
            }]
        };

        setScanHistory(updates.scanHistory);

        updateUser(updates);

        if (!user.isGuest && user.uid) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    ...updates,
                    lastActiveDate: Timestamp.now()
                });
            } catch (error) {
                console.error('Error recording scan:', error);
            }
        }
    };

    const checkDailyStreak = async () => {
        if (!user) return { canClaim: false, streakBroken: false, currentDay: 1 };

        const lastClaim = user.lastClaimDate ? new Date(user.lastClaimDate) : new Date(0);
        const { isStreakActive, daysSinceLastActive } = checkStreak(lastClaim);

        // If daysSinceLastActive is 0, they already claimed today
        const canClaim = daysSinceLastActive > 0;

        // If daysSinceLastActive > 1, streak is broken (unless frozen, but simplifying for now)
        const streakBroken = daysSinceLastActive > 1;

        setCanClaimReward(canClaim);

        let currentDay = (user.currentStreak || 0) % 7;
        if (currentDay === 0 && user.currentStreak > 0) currentDay = 7;
        if (streakBroken) currentDay = 1;
        if (canClaim && !streakBroken) currentDay = (currentDay % 7) + 1;

        return { canClaim, streakBroken, currentDay };
    };

    const claimDailyReward = async () => {
        if (!user || !canClaimReward) return;

        const lastClaim = user.lastClaimDate ? new Date(user.lastClaimDate) : new Date(0);
        const { isStreakActive } = checkStreak(lastClaim);

        let newStreak = user.currentStreak || 0;
        let newPoints = user.totalPoints || 0;
        let streakMessage = '';

        if (isStreakActive) {
            newStreak += 1;
        } else {
            newStreak = 1; // Reset if broken
        }

        const currentDayInCycle = (newStreak - 1) % 7 + 1;

        let pointsToAdd = XP_PER_STREAK_DAY;
        if (currentDayInCycle === 7) {
            pointsToAdd += XP_WEEKLY_BONUS;
            streakMessage = `Weekly Goal Complete! 🌟 +${pointsToAdd} Impact Points`;
        } else {
            streakMessage = `Day ${currentDayInCycle}/7 Complete! +${pointsToAdd} Impact Points`;
        }

        newPoints += pointsToAdd;

        const updates: any = {
            currentStreak: newStreak,
            lastClaimDate: new Date(),
            lastActiveDate: new Date(),
            totalPoints: newPoints,
            longestStreak: Math.max(newStreak, user.longestStreak || 0)
        };

        updateUser(updates);
        setCanClaimReward(false);
        showToast(streakMessage, 'success');

        if (!user.isGuest && user.uid) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    ...updates,
                    lastClaimDate: Timestamp.now(),
                    lastActiveDate: Timestamp.now()
                });
            } catch (error) {
                console.error('Error updating streak:', error);
            }
        }
    };

    const toggleLessonTodo = async (lessonId: string) => {
        if (!user) return;

        const currentProgress = user.learningProgress || {};
        const currentStatus = currentProgress[lessonId];

        // If currently 'todo', remove it. If 'completed', do nothing. If undefined, set to 'todo'.
        let newStatus: 'todo' | 'completed' | undefined;

        if (currentStatus === 'todo') {
            newStatus = undefined; // Remove from list
        } else if (currentStatus === 'completed') {
            return; // Cannot toggle if already completed
        } else {
            newStatus = 'todo';
        }

        const newProgress = { ...currentProgress };
        if (newStatus) {
            newProgress[lessonId] = newStatus;
        } else {
            delete newProgress[lessonId];
        }

        const updates = { learningProgress: newProgress };
        updateUser(updates);

        if (!user.isGuest && user.uid) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, updates);
            } catch (error) {
                console.error('Error updating learning progress:', error);
            }
        }
    };

    const markLessonComplete = async (lessonId: string) => {
        if (!user) return;

        const currentProgress = user.learningProgress || {};
        if (currentProgress[lessonId] === 'completed') return; // Already completed

        const newProgress = { ...currentProgress, [lessonId]: 'completed' as const };

        // Award points for completion (e.g., 50 points)
        const pointsAwarded = 50;
        const newPoints = (user.totalPoints || 0) + pointsAwarded;
        const newLevel = calculateLevel(newPoints);

        const updates = {
            learningProgress: newProgress,
            totalPoints: newPoints,
            level: newLevel
        };

        updateUser(updates);
        showToast(`Lesson Completed! +${pointsAwarded} Points`, 'success');

        if (!user.isGuest && user.uid) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, updates);
            } catch (error) {
                console.error('Error marking lesson complete:', error);
            }
        }
    };

    const claimBadge = async (badgeId: string, points: number) => {
        if (!user) return;

        const currentClaimed = user.claimedBadges || [];
        if (currentClaimed.includes(badgeId)) return;

        const newClaimed = [...currentClaimed, badgeId];
        const newPoints = (user.totalPoints || 0) + points;
        const newLevel = calculateLevel(newPoints);

        const updates = {
            claimedBadges: newClaimed,
            totalPoints: newPoints,
            level: newLevel
        };

        updateUser(updates);
        // Toast is handled in UI for this one to sync with animation

        if (!user.isGuest && user.uid) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, updates);
            } catch (error) {
                console.error('Error claiming badge:', error);
            }
        }
    };

    useEffect(() => {
        if (user?.uid) {
            checkDailyStreak();
        }
    }, [user?.uid, user?.lastClaimDate]);

    return (
        <GamificationContext.Provider value={{
            addPoints,
            recordScan,
            checkDailyStreak,
            claimDailyReward,
            canClaimReward,
            toggleLessonTodo,
            markLessonComplete,
            claimBadge,
            scanHistory
        }}>
            {children}
        </GamificationContext.Provider>
    );
};
