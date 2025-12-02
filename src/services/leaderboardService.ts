import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { LeaderboardEntry } from '../types';

// Get global leaderboard
export const getGlobalLeaderboard = async (limitCount: number = 50): Promise<LeaderboardEntry[]> => {
    try {
        const leaderboardRef = collection(db, 'leaderboard');
        const q = query(leaderboardRef, orderBy('points', 'desc'), limit(limitCount));

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc, index) => ({
            ...doc.data(),
            rank: index + 1,
        } as LeaderboardEntry));
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
};

// Mock leaderboard data for development
export const getMockLeaderboard = (): LeaderboardEntry[] => {
    return [
        { userId: '1', displayName: 'Sarah Chen', photoURL: null, school: 'Green Valley High', points: 1250, rank: 1, country: 'USA' },
        { userId: '2', displayName: 'Mike Johnson', photoURL: null, school: 'Oak Ridge School', points: 1180, rank: 2, country: 'USA' },
        { userId: '3', displayName: 'Emma Davis', photoURL: null, school: 'Green Valley High', points: 1050, rank: 3, country: 'USA' },
        { userId: '4', displayName: 'Alex Kumar', photoURL: null, school: 'Pine Tree Academy', points: 920, rank: 4, country: 'India' },
        { userId: '5', displayName: 'Lisa Wang', photoURL: null, school: 'Oak Ridge School', points: 875, rank: 5, country: 'China' },
        { userId: '6', displayName: 'Tom Brown', photoURL: null, school: 'Green Valley High', points: 820, rank: 6, country: 'UK' },
        { userId: '7', displayName: 'Sofia Martinez', photoURL: null, school: 'Pine Tree Academy', points: 785, rank: 7, country: 'Spain' },
        { userId: '8', displayName: 'Ryan Lee', photoURL: null, school: 'Oak Ridge School', points: 740, rank: 8, country: 'USA' },
    ];
};
