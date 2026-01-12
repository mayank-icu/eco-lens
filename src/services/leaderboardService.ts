import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from './firebase';
import { LeaderboardEntry } from '../types';

// Get global leaderboard from Firebase users collection
export const getGlobalLeaderboard = async (limitCount: number = 50): Promise<LeaderboardEntry[]> => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('totalPoints', 'desc'), limit(limitCount));

        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map((doc, index) => {
            const data = doc.data();
            return {
                userId: doc.id,
                displayName: data.displayName || 'Anonymous',
                photoURL: data.photoURL || null,
                school: data.school || null,
                points: data.totalPoints || 0,
                rank: index + 1,
                country: data.country || 'Unknown',
            } as LeaderboardEntry;
        });

        return leaderboardData;
    } catch (error) {
        console.error('Error fetching global leaderboard:', error);
        return [];
    }
};

// Get school leaderboard
export const getSchoolLeaderboard = async (school: string, limitCount: number = 50): Promise<LeaderboardEntry[]> => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(
            usersRef,
            where('school', '==', school),
            orderBy('totalPoints', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map((doc, index) => {
            const data = doc.data();
            return {
                userId: doc.id,
                displayName: data.displayName || 'Anonymous',
                photoURL: data.photoURL || null,
                school: data.school || null,
                points: data.totalPoints || 0,
                rank: index + 1,
                country: data.country || 'Unknown',
            } as LeaderboardEntry;
        });

        return leaderboardData;
    } catch (error) {
        console.error('Error fetching school leaderboard:', error);
        return [];
    }
};

// Main function to get leaderboard based on filter
export const getLeaderboard = async (filter: 'global' | 'school' = 'global', school?: string): Promise<LeaderboardEntry[]> => {
    try {
        if (filter === 'school' && school) {
            return await getSchoolLeaderboard(school);
        }
        return await getGlobalLeaderboard();
    } catch (error) {
        console.error('Error in getLeaderboard:', error);
        return [];
    }
};

// Mock leaderboard data for development (kept for reference)
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
