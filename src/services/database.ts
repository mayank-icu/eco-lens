import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Scan, User, LeaderboardEntry, Challenge } from '../types';

// Collection References
const USERS_COLLECTION = 'users';
const SCANS_COLLECTION = 'scans';
const CHALLENGES_COLLECTION = 'challenges';

// Mock data for fallback/guest mode
const MOCK_SCANS: any[] = [
    { id: '1', plasticType: 'PET', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), co2Saved: 45, binColor: 'green' },
    { id: '2', plasticType: 'HDPE', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), co2Saved: 30, binColor: 'green' },
    { id: '3', plasticType: 'PVC', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), co2Saved: 0, binColor: 'red' },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { userId: '1', displayName: 'Sarah Chen', photoURL: null, school: 'Green Valley High', points: 1250, rank: 1, country: 'USA' },
    { userId: '2', displayName: 'Mike Johnson', photoURL: null, school: 'Oak Ridge School', points: 1180, rank: 2, country: 'USA' },
    { userId: '3', displayName: 'Emma Davis', photoURL: null, school: 'Green Valley High', points: 1050, rank: 3, country: 'USA' },
    { userId: '4', displayName: 'Alex Kumar', photoURL: null, school: 'Pine Tree Academy', points: 920, rank: 4, country: 'USA' },
    { userId: '5', displayName: 'Lisa Wang', photoURL: null, school: 'Oak Ridge School', points: 875, rank: 5, country: 'USA' },
];

export const getUserScans = async (userId: string, limitCount: number = 10): Promise<Scan[]> => {
    if (userId.startsWith('guest-')) {
        return MOCK_SCANS as Scan[];
    }

    try {
        const q = query(
            collection(db, SCANS_COLLECTION),
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: (doc.data().timestamp as Timestamp).toDate()
        })) as Scan[];
    } catch (error) {
        console.error('Error fetching user scans:', error);
        return [];
    }
};

export const getLeaderboard = async (filter: 'week' | 'month' | 'alltime' = 'week'): Promise<LeaderboardEntry[]> => {
    // In a real app, you'd have different collections or queries for time periods
    // For now, we'll return the mock leaderboard or fetch top users
    try {
        const q = query(
            collection(db, USERS_COLLECTION),
            orderBy('totalPoints', 'desc'),
            limit(20)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return MOCK_LEADERBOARD;
        }

        return querySnapshot.docs.map((doc, index) => ({
            userId: doc.id,
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL,
            school: doc.data().school,
            points: doc.data().totalPoints,
            rank: index + 1,
            country: 'USA' // Default for now
        })) as LeaderboardEntry[];
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return MOCK_LEADERBOARD;
    }
};

export const getWeeklyChallenge = async (): Promise<Challenge | null> => {
    // Return a static challenge for now, or fetch from DB
    return {
        id: 'weekly-1',
        title: 'Weekly Challenge',
        description: 'Scan 20 items this week',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        targetScans: 20,
        participants: [],
        prizes: { first: 'Gold Badge', second: 'Silver Badge', third: 'Bronze Badge' }
    };
};

export const saveScan = async (userId: string, scanData: Partial<Scan>) => {
    if (userId.startsWith('guest-')) return;

    try {
        await addDoc(collection(db, SCANS_COLLECTION), {
            userId,
            ...scanData,
            timestamp: Timestamp.now()
        });

        // Update user stats (this should ideally be a cloud function)
        // For now we just return success
        return true;
    } catch (error) {
        console.error('Error saving scan:', error);
        throw error;
    }
};
