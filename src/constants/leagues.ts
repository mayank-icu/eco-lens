// League system constants and utilities

export type LeagueType = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

export interface League {
    id: LeagueType;
    name: string;
    color: string;
    totalParticipants: number;
    promotionCount: number;
    demotionCount: number;
    trophy: any;
}

export const leagues: Record<LeagueType, League> = {
    Bronze: {
        id: 'Bronze',
        name: 'Bronze League',
        color: '#CD7F32',
        totalParticipants: 30,
        promotionCount: 25,
        demotionCount: 0,
        trophy: require('../assets/trophies/bronze.png'),
    },
    Silver: {
        id: 'Silver',
        name: 'Silver League',
        color: '#C0C0C0',
        totalParticipants: 30,
        promotionCount: 20,
        demotionCount: 5,
        trophy: require('../assets/trophies/silver.png'),
    },
    Gold: {
        id: 'Gold',
        name: 'Gold League',
        color: '#FFD700',
        totalParticipants: 30,
        promotionCount: 15,
        demotionCount: 5,
        trophy: require('../assets/trophies/gold.png'),
    },
    Diamond: {
        id: 'Diamond',
        name: 'Diamond League',
        color: '#B9F2FF',
        totalParticipants: 15,
        promotionCount: 0,
        demotionCount: 5,
        trophy: require('../assets/trophies/diamond.png'),
    },
};

export const leagueOrder: LeagueType[] = ['Bronze', 'Silver', 'Gold', 'Diamond'];

export interface LeagueUser {
    id: string;
    name: string;
    avatar?: string;
    weeklyPoints: number;
    rank: number;
}

export type ZoneType = 'podium' | 'promotion' | 'safe' | 'demotion';

export const getUserZone = (rank: number, league: LeagueType): ZoneType => {
    if (rank <= 3) return 'podium';

    const leagueData = leagues[league];

    // Promotion zone
    if (rank <= leagueData.promotionCount) {
        return 'promotion';
    }

    // Demotion zone
    if (leagueData.demotionCount > 0 &&
        rank > leagueData.totalParticipants - leagueData.demotionCount) {
        return 'demotion';
    }

    // Safe zone
    return 'safe';
};

export const getZoneColor = (zone: ZoneType): string => {
    switch (zone) {
        case 'podium':
            return '#FFD700'; // Gold
        case 'promotion':
            return '#7fb069'; // Green
        case 'safe':
            return '#666666'; // Gray
        case 'demotion':
            return '#e76f51'; // Red
        default:
            return '#666666';
    }
};

export const getTimeUntilSunday = (): string => {
    const now = new Date();
    const sunday = new Date();

    // Calculate next Sunday
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    sunday.setDate(now.getDate() + daysUntilSunday);
    sunday.setHours(0, 0, 0, 0);

    const diff = sunday.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
};

export const getPreviousLeague = (currentLeague: LeagueType): LeagueType | null => {
    const index = leagueOrder.indexOf(currentLeague);
    return index > 0 ? leagueOrder[index - 1] : null;
};

export const getNextLeague = (currentLeague: LeagueType): LeagueType | null => {
    const index = leagueOrder.indexOf(currentLeague);
    return index < leagueOrder.length - 1 ? leagueOrder[index + 1] : null;
};
