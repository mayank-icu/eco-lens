// Badges configuration

export interface Badge {
    id: string;
    name: string;
    description: string;
    requirement: number;
    requirementType: 'scans' | 'streak' | 'co2' | 'leaderboard' | 'types' | 'unique' | 'special';
    rarity: 'Easy' | 'Medium' | 'Hard';
    image: any;
    unlockedDate?: string;
}

// EASY STAMPS (10) - Early Engagement
const easyStamps: Badge[] = [
    {
        id: 'welcome-aboard',
        name: 'Welcome Aboard',
        description: 'Register an account',
        requirement: 0,
        requirementType: 'special',
        rarity: 'Easy',
        image: require('../assets/stamps/welcome-aboard.png'),
    },
    {
        id: 'first-scan',
        name: 'First Scan',
        description: 'Complete your first plastic scan',
        requirement: 1,
        requirementType: 'scans',
        rarity: 'Easy',
        image: require('../assets/stamps/first-scan.png'),
    },
    {
        id: 'quick-learner',
        name: 'Quick Learner',
        description: 'Scan 5 items',
        requirement: 5,
        requirementType: 'scans',
        rarity: 'Easy',
        image: require('../assets/stamps/quick-learner.png'),
    },
    {
        id: 'getting-started',
        name: 'Getting Started',
        description: 'Scan 3 different plastic types',
        requirement: 3,
        requirementType: 'types',
        rarity: 'Easy',
        image: require('../assets/stamps/getting-started.png'),
    },
    {
        id: 'daily-habit',
        name: 'Daily Habit',
        description: 'Open the app 3 days in a row',
        requirement: 3,
        requirementType: 'streak',
        rarity: 'Easy',
        image: require('../assets/stamps/daily-habit.png'),
    },
    {
        id: 'explorer',
        name: 'Explorer',
        description: 'Visit all app sections',
        requirement: 0,
        requirementType: 'special',
        rarity: 'Easy',
        image: require('../assets/stamps/explorer.png'),
    },
    {
        id: 'double-digits',
        name: 'Double Digits',
        description: 'Scan 10 items total',
        requirement: 10,
        requirementType: 'scans',
        rarity: 'Easy',
        image: require('../assets/stamps/double-digits.png'),
    },
];

// MEDIUM STAMPS (10) - Consistent Action
const mediumStamps: Badge[] = [
    {
        id: 'variety-master',
        name: 'Variety Master',
        description: 'Scan all 4 main plastic types',
        requirement: 4,
        requirementType: 'types',
        rarity: 'Medium',
        image: require('../assets/stamps/variety-master.png'),
    },
    {
        id: 'half-century',
        name: 'Half Century',
        description: 'Scan 50 items total',
        requirement: 50,
        requirementType: 'scans',
        rarity: 'Medium',
        image: require('../assets/stamps/half-century.png'),
    },
    {
        id: 'month-commitment',
        name: 'Month Commitment',
        description: 'Maintain a 30-day scan streak',
        requirement: 30,
        requirementType: 'streak',
        rarity: 'Medium',
        image: require('../assets/stamps/month-commitment.png'),
    },
    {
        id: 'daily-dedication',
        name: 'Daily Dedication',
        description: 'Scan at least 1 item per day for 14 days',
        requirement: 14,
        requirementType: 'streak',
        rarity: 'Medium',
        image: require('../assets/stamps/daily-dedication.png'),
    },
    {
        id: 'century-club',
        name: 'Century Club',
        description: 'Scan 100 items total',
        requirement: 100,
        requirementType: 'scans',
        rarity: 'Medium',
        image: require('../assets/stamps/century-club.png'),
    },
    {
        id: 'co2-saver',
        name: 'CO₂ Saver',
        description: 'Save 1kg of CO₂ equivalent',
        requirement: 1000,
        requirementType: 'co2',
        rarity: 'Medium',
        image: require('../assets/stamps/co2-saver.png'),
    },
    {
        id: 'leaderboard-climber',
        name: 'Leaderboard Climber',
        description: 'Enter the top 10 on any leaderboard',
        requirement: 10,
        requirementType: 'leaderboard',
        rarity: 'Medium',
        image: require('../assets/stamps/leaderboard-climber.png'),
    },
    {
        id: 'scan-spree',
        name: 'Scan Spree',
        description: 'Scan 10 items in a single day',
        requirement: 10,
        requirementType: 'special',
        rarity: 'Medium',
        image: require('../assets/stamps/scan-spree.png'),
    },
    {
        id: 'diversifier',
        name: 'Diversifier',
        description: 'Scan 20 different plastic items',
        requirement: 20,
        requirementType: 'unique',
        rarity: 'Medium',
        image: require('../assets/stamps/diversifier.png'),
    },
];

// HARD STAMPS (10) - Elite Achievement
const hardStamps: Badge[] = [
    {
        id: 'platinum-scanner',
        name: 'Platinum Scanner',
        description: 'Scan 500 items total',
        requirement: 500,
        requirementType: 'scans',
        rarity: 'Hard',
        image: require('../assets/stamps/platinum-scanner.png'),
    },
    {
        id: 'three-month-streak',
        name: 'Three Month Streak',
        description: 'Maintain a 90-day scan streak',
        requirement: 90,
        requirementType: 'streak',
        rarity: 'Hard',
        image: require('../assets/stamps/three-month-streak.png'),
    },
    {
        id: 'podium-finish',
        name: 'Podium Finish',
        description: 'Reach top 3 on Global All-Time Leaderboard',
        requirement: 3,
        requirementType: 'leaderboard',
        rarity: 'Hard',
        image: require('../assets/stamps/podium-finish.png'),
    },
    {
        id: 'co2-champion',
        name: 'CO₂ Champion',
        description: 'Save 10kg of CO₂ equivalent',
        requirement: 10000,
        requirementType: 'co2',
        rarity: 'Hard',
        image: require('../assets/stamps/co2-champion.png'),
    },
    {
        id: 'elite-sorter',
        name: 'Elite Sorter',
        description: 'Scan 1,000 items total',
        requirement: 1000,
        requirementType: 'scans',
        rarity: 'Hard',
        image: require('../assets/stamps/elite-sorter.png'),
    },
    {
        id: 'year-round-recycler',
        name: 'Year Round Recycler',
        description: 'Maintain a 365-day scan streak',
        requirement: 365,
        requirementType: 'streak',
        rarity: 'Hard',
        image: require('../assets/stamps/year-round-recycler.png'),
    },
    {
        id: 'leaderboard-legend',
        name: 'Leaderboard Legend',
        description: 'Hold #1 position for 7 consecutive days',
        requirement: 1,
        requirementType: 'leaderboard',
        rarity: 'Hard',
        image: require('../assets/stamps/leaderboard-legend.png'),
    },
    {
        id: 'impact-hero',
        name: 'Impact Hero',
        description: 'Prevent 100 shopping bags worth of plastic',
        requirement: 2000,
        requirementType: 'scans',
        rarity: 'Hard',
        image: require('../assets/stamps/impact-hero.png'),
    },
    {
        id: 'plastic-encyclopedia',
        name: 'Plastic Encyclopedia',
        description: 'Scan 100 different unique plastic items',
        requirement: 100,
        requirementType: 'unique',
        rarity: 'Hard',
        image: require('../assets/stamps/plastic-encyclopedia.png'),
    },
    {
        id: 'ultimate-champion',
        name: 'Ultimate Champion',
        description: 'Scan 2,500 items total',
        requirement: 2500,
        requirementType: 'scans',
        rarity: 'Hard',
        image: require('../assets/stamps/ultimate-champion.png'),
    },
];

export const badges = [...easyStamps, ...mediumStamps, ...hardStamps];

export const getBadgesByRarity = (rarity: 'Easy' | 'Medium' | 'Hard') => {
    return badges.filter(badge => badge.rarity === rarity);
};

export const getUnlockedBadges = (userStats: any) => {
    return badges.filter(badge => {
        switch (badge.requirementType) {
            case 'scans':
                return (userStats?.totalScans || 0) >= badge.requirement;
            case 'streak':
                return (userStats?.currentStreak || 0) >= badge.requirement;
            case 'co2':
                return (userStats?.co2Saved || 0) >= badge.requirement;
            case 'special':
                return badge.requirement === 0; // Auto-unlock for registration/explorer
            default:
                return false;
        }
    });
};
