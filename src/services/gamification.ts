import { User } from '../types';

export const XP_PER_SCAN = 10;
export const XP_PER_STREAK_DAY = 5;
export const XP_PER_CHALLENGE = 50;
export const XP_PER_REFERRAL = 100;

export const calculateLevel = (points: number): number => {
    // Simple formula: Level = floor(sqrt(points / 20)) + 1
    // 0 pts = Lvl 1
    // 20 pts = Lvl 2
    // 80 pts = Lvl 3
    // 180 pts = Lvl 4
    return Math.floor(Math.sqrt(points / 20)) + 1;
};

export const calculateNextLevelPoints = (level: number): number => {
    // Inverse of above: Points = ((Level) ^ 2) * 20
    return Math.pow(level, 2) * 20;
};

export const getLevelProgress = (points: number, level: number): number => {
    const currentLevelPoints = calculateNextLevelPoints(level - 1); // Points needed for current level
    const nextLevelPoints = calculateNextLevelPoints(level); // Points needed for next level

    const pointsInLevel = points - currentLevelPoints;
    const pointsNeededForLevel = nextLevelPoints - currentLevelPoints;

    if (pointsNeededForLevel === 0) return 100; // Cap at max level if any

    return (pointsInLevel / pointsNeededForLevel) * 100;
};

export const checkStreak = (lastActiveDate: Date): { isStreakActive: boolean, daysSinceLastActive: number } => {
    const now = new Date();
    const lastActive = new Date(lastActiveDate);

    // Reset times to midnight for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

    const diffTime = Math.abs(today.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
        isStreakActive: diffDays <= 1, // 0 = today, 1 = yesterday
        daysSinceLastActive: diffDays
    };
};
