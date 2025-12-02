// Plastic Types
export enum PlasticType {
    PET = 'PET',
    HDPE = 'HDPE',
    PVC = 'PVC',
    LDPE = 'LDPE',
    PP = 'PP',
    PS = 'PS',
    OTHER = 'OTHER',
}

// Bin Colors
export enum BinColor {
    GREEN = 'green',
    RED = 'red',
    YELLOW = 'yellow',
}

// User Interface
export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
    school: string | null;
    createdAt: Date;
    totalPoints: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    totalScans: number;
    co2Saved: number;
    lastActiveDate?: Date;
    streakFreezes: number;
    isGuest: boolean;
}

// Scan Interface
export interface Scan {
    id: string;
    userId: string;
    plasticType: PlasticType;
    confidence: number;
    timestamp: Date;
    weight: number; // in grams
    co2Saved: number; // in grams
    binColor: BinColor;
    imageUrl: string | null;
}

// Achievement Interface
export interface Achievement {
    id: string;
    badgeId: string;
    userId: string;
    unlockedAt: Date;
}

// Badge Definition
export interface BadgeDefinition {
    id: string;
    name: string;
    description: string;
    iconName: string;
    requirement: {
        type: 'scans' | 'streak' | 'points' | 'types' | 'rank' | 'co2';
        value: number;
    };
}

// Leaderboard Entry
export interface LeaderboardEntry {
    userId: string;
    displayName: string;
    photoURL: string | null;
    school: string | null;
    points: number;
    rank: number;
    country: string;
}

// School Interface
export interface School {
    id: string;
    name: string;
    logo: string;
    totalStudents: number;
    totalPoints: number;
    country: string;
}

// Challenge Interface
export interface Challenge {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    targetScans: number;
    participants: string[];
    prizes: {
        first: string;
        second: string;
        third: string;
    };
}

// Navigation Types
export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    ProfileSetup: undefined;
    Main: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Scan: undefined;
    Impact: undefined;
    Leaderboard: undefined;
    Profile: undefined;
};

// API Response Types
export interface ClassificationResult {
    plasticType: PlasticType;
    confidence: number;
    binColor: BinColor;
    educationalInfo: string;
    co2Impact: number;
}
