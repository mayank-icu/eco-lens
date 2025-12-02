import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getLeaderboard } from '../services/database';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';

export default function LeaderboardScreen() {
    const { user } = useAuth();
    const [tab, setTab] = useState<'global' | 'school' | 'friends'>('global');
    const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'alltime'>('week');
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            const data = await getLeaderboard(timeFilter);
            setLeaderboardData(data);
            setLoading(false);
        };
        fetchLeaderboard();
    }, [timeFilter]);

    // Current user rank
    const currentUserRank = {
        uid: user?.uid || 'current',
        displayName: user?.displayName || 'You',
        photoURL: user?.photoURL || null,
        school: user?.school || null,
        points: user?.totalPoints || 0,
        rank: (user as any)?.rank || '-',
    };

    const renderPodium = () => {
        if (leaderboardData.length < 3) return null;

        const top3 = leaderboardData.slice(0, 3);
        const [first, second, third] = top3;

        return (
            <View style={styles.podiumContainer}>
                {/* Second Place */}
                <View style={[styles.podiumPlace, styles.secondPlace]}>
                    <View style={[styles.avatar, styles.silverAvatar]}>
                        <Text style={styles.avatarText}>{second.displayName[0]}</Text>
                    </View>
                    <Text style={styles.podiumRank}>🥈</Text>
                    <Text style={styles.podiumName} numberOfLines={1}>{second.displayName}</Text>
                    <Text style={styles.podiumPoints}>{second.points} pts</Text>
                    <View style={[styles.podiumBlock, { height: 80, backgroundColor: '#C0C0C0' }]}>
                        <Text style={styles.podiumNumber}>2</Text>
                    </View>
                </View>

                {/* First Place */}
                <View style={[styles.podiumPlace, styles.firstPlace]}>
                    <View style={[styles.avatar, styles.goldAvatar]}>
                        <Text style={styles.avatarText}>{first.displayName[0]}</Text>
                    </View>
                    <Text style={styles.podiumRank}>👑</Text>
                    <Text style={styles.podiumName} numberOfLines={1}>{first.displayName}</Text>
                    <Text style={styles.podiumPoints}>{first.points} pts</Text>
                    <View style={[styles.podiumBlock, { height: 100, backgroundColor: '#FFD700' }]}>
                        <Text style={styles.podiumNumber}>1</Text>
                    </View>
                </View>

                {/* Third Place */}
                <View style={[styles.podiumPlace, styles.thirdPlace]}>
                    <View style={[styles.avatar, styles.bronzeAvatar]}>
                        <Text style={styles.avatarText}>{third.displayName[0]}</Text>
                    </View>
                    <Text style={styles.podiumRank}>🥉</Text>
                    <Text style={styles.podiumName} numberOfLines={1}>{third.displayName}</Text>
                    <Text style={styles.podiumPoints}>{third.points} pts</Text>
                    <View style={[styles.podiumBlock, { height: 60, backgroundColor: '#CD7F32' }]}>
                        <Text style={styles.podiumNumber}>3</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderRankItem = ({ item }: { item: any }) => (
        <View style={styles.rankItem}>
            <Text style={styles.rankNumber}>#{item.rank}</Text>
            <View style={styles.rankAvatar}>
                <Text style={styles.rankAvatarText}>{item.displayName[0]}</Text>
            </View>
            <View style={styles.rankInfo}>
                <Text style={styles.rankName}>{item.displayName}</Text>
                {item.school && <Text style={styles.rankSchool}>{item.school}</Text>}
            </View>
            <Text style={styles.rankPoints}>{item.points}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={colors.white} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Leaderboard</Text>
                <Text style={styles.subtitle}>Compete with eco-warriors 🏆</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'global' && styles.activeTab]}
                    onPress={() => setTab('global')}
                >
                    <Text style={[styles.tabText, tab === 'global' && styles.activeTabText]}>Global</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'school' && styles.activeTab]}
                    onPress={() => setTab('school')}
                >
                    <Text style={[styles.tabText, tab === 'school' && styles.activeTabText]}>School</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'friends' && styles.activeTab]}
                    onPress={() => setTab('friends')}
                >
                    <Text style={[styles.tabText, tab === 'friends' && styles.activeTabText]}>Friends</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Time Filters */}
                <View style={styles.timeFilters}>
                    {['week', 'month', 'alltime'].map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterButton, timeFilter === filter && styles.activeFilter]}
                            onPress={() => setTimeFilter(filter as any)}
                        >
                            <Text style={[styles.filterText, timeFilter === filter && styles.activeFilterText]}>
                                {filter === 'alltime' ? 'All Time' : `This ${filter}`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Podium */}
                {renderPodium()}

                {/* Rank List */}
                <View style={styles.rankListContainer}>
                    <FlatList
                        data={leaderboardData.slice(3)}
                        renderItem={renderRankItem}
                        keyExtractor={(item) => item.userId}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                {/* Current User Rank */}
                <View style={styles.currentUserRank}>
                    <View style={styles.currentUserCard}>
                        <Text style={styles.currentUserLabel}>Your Rank</Text>
                        <View style={styles.currentUserInfo}>
                            <Text style={styles.currentUserRankNumber}>#{currentUserRank.rank}</Text>
                            <Text style={styles.currentUserPoints}>{currentUserRank.points} points</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl * 1.5,
        paddingBottom: spacing.md,
    },
    title: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    subtitle: {
        fontSize: typography.fontSize.body,
        color: colors.accent,
        marginTop: spacing.xs,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderRadius: borderRadius.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    activeTab: {
        backgroundColor: colors.secondary,
    },
    tabText: {
        fontSize: typography.fontSize.caption,
        color: colors.white,
        opacity: 0.7,
    },
    activeTabText: {
        opacity: 1,
        fontWeight: typography.fontWeight.semiBold,
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: borderRadius.xl * 1.5,
        borderTopRightRadius: borderRadius.xl * 1.5,
        paddingTop: spacing.lg,
    },
    timeFilters: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    filterButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.lightGray,
    },
    activeFilter: {
        backgroundColor: colors.secondary,
    },
    filterText: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
    },
    activeFilterText: {
        color: colors.white,
        fontWeight: typography.fontWeight.semiBold,
    },
    podiumContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    podiumPlace: {
        alignItems: 'center',
        flex: 1,
    },
    firstPlace: {
        marginTop: -20,
    },
    secondPlace: {},
    thirdPlace: {},
    avatar: {
        width: 50,
        height: 50,
        borderRadius: borderRadius.round,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
        borderWidth: 3,
    },
    goldAvatar: {
        backgroundColor: '#FFD700',
        borderColor: '#FFA500',
    },
    silverAvatar: {
        backgroundColor: '#C0C0C0',
        borderColor: '#A8A8A8',
    },
    bronzeAvatar: {
        backgroundColor: '#CD7F32',
        borderColor: '#B8722B',
    },
    avatarText: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    podiumRank: {
        fontSize: 24,
        marginBottom: spacing.xs,
    },
    podiumName: {
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    podiumPoints: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    podiumBlock: {
        width: '100%',
        borderTopLeftRadius: borderRadius.md,
        borderTopRightRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    podiumNumber: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    rankListContainer: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    rankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
    },
    rankNumber: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textSecondary,
        width: 40,
    },
    rankAvatar: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.round,
        backgroundColor: colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    rankAvatarText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    rankInfo: {
        flex: 1,
    },
    rankName: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
    },
    rankSchool: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        marginTop: spacing.xs / 2,
    },
    rankPoints: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.secondary,
    },
    currentUserRank: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    currentUserCard: {
        backgroundColor: colors.secondary,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.md,
    },
    currentUserLabel: {
        fontSize: typography.fontSize.caption,
        color: colors.white,
        opacity: 0.9,
        marginBottom: spacing.xs,
    },
    currentUserInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    currentUserRankNumber: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    currentUserPoints: {
        fontSize: typography.fontSize.body,
        color: colors.white,
    },
});
