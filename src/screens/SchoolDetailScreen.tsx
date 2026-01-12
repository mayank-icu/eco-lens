import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

interface Student {
    id: string;
    name: string;
    avatar: string;
    points: number;
    rank: number;
}

export default function SchoolDetailScreen({ route, navigation }: any) {
    const { school } = route.params || {
        school: {
            id: '1',
            name: 'Green Valley High School',
            logo: '🏫',
            students: 450,
            totalPoints: 125000,
            rank: 3,
            location: 'California, USA',
        },
    };

    // Mock top students data
    const topStudents: Student[] = [
        { id: '1', name: 'Sarah Johnson', avatar: '👩', points: 2450, rank: 1 },
        { id: '2', name: 'Mike Chen', avatar: '👨', points: 2200, rank: 2 },
        { id: '3', name: 'Emma Wilson', avatar: '👧', points: 1890, rank: 3 },
        { id: '4', name: 'Alex Kumar', avatar: '👦', points: 1750, rank: 4 },
        { id: '5', name: 'Lisa Park', avatar: '👧', points: 1650, rank: 5 },
    ];

    const stats = [
        {
            label: 'Total Students',
            value: school.students.toLocaleString(),
            icon: 'users',
            color: colors.secondary,
        },
        {
            label: 'Total Points',
            value: (school.totalPoints / 1000).toFixed(0) + 'k',
            icon: 'trophy',
            color: colors.warning,
        },
        {
            label: 'Global Rank',
            value: '#' + school.rank,
            icon: 'award',
            color: colors.info,
        },
        {
            label: 'Avg per Student',
            value: Math.round(school.totalPoints / school.students).toLocaleString(),
            icon: 'trending-up',
            color: colors.success,
        },
    ];

    const achievements = [
        { id: '1', name: 'Top 10 School', icon: '🏆', unlocked: true },
        { id: '2', name: '100k Points', icon: '💯', unlocked: true },
        { id: '3', name: 'Eco Champions', icon: '🌱', unlocked: true },
        { id: '4', name: 'Community Leader', icon: '👥', unlocked: false },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Feather name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>School Details</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* School Info Card */}
                <View style={styles.schoolCard}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>{school.logo}</Text>
                        <View style={styles.rankBadge}>
                            <Ionicons name="trophy" size={16} color={colors.white} />
                            <Text style={styles.rankText}>#{school.rank}</Text>
                        </View>
                    </View>
                    <Text style={styles.schoolName}>{school.name}</Text>
                    <View style={styles.locationRow}>
                        <Feather name="map-pin" size={16} color={colors.textSecondary} />
                        <Text style={styles.location}>{school.location}</Text>
                    </View>
                    <TouchableOpacity style={styles.joinButton}>
                        <Feather name="user-plus" size={18} color={colors.white} />
                        <Text style={styles.joinButtonText}>Join School</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View
                                style={[
                                    styles.statIconContainer,
                                    { backgroundColor: stat.color + '20' },
                                ]}
                            >
                                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* School Achievements */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>School Achievements</Text>
                    <View style={styles.achievementsGrid}>
                        {achievements.map(achievement => (
                            <View
                                key={achievement.id}
                                style={[
                                    styles.achievementCard,
                                    !achievement.unlocked && styles.achievementLocked,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.achievementIcon,
                                        !achievement.unlocked && styles.achievementIconLocked,
                                    ]}
                                >
                                    {achievement.icon}
                                </Text>
                                <Text
                                    style={[
                                        styles.achievementName,
                                        !achievement.unlocked && styles.achievementNameLocked,
                                    ]}
                                >
                                    {achievement.name}
                                </Text>
                                {achievement.unlocked && (
                                    <View style={styles.unlockedBadge}>
                                        <Feather name="check" size={12} color={colors.white} />
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Top Students */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Top Students</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Podium */}
                    <View style={styles.podium}>
                        {/* 2nd Place */}
                        <View style={styles.podiumPosition}>
                            <View style={[styles.podiumAvatar, styles.silverAvatar]}>
                                <Text style={styles.podiumAvatarText}>
                                    {topStudents[1].avatar}
                                </Text>
                            </View>
                            <View style={[styles.podiumRank, styles.silverRank]}>
                                <Text style={styles.podiumRankText}>2</Text>
                            </View>
                            <Text style={styles.podiumName} numberOfLines={1}>
                                {topStudents[1].name.split(' ')[0]}
                            </Text>
                            <Text style={styles.podiumPoints}>
                                {topStudents[1].points.toLocaleString()}
                            </Text>
                            <View style={[styles.podiumBar, styles.silverBar]} />
                        </View>

                        {/* 1st Place */}
                        <View style={styles.podiumPosition}>
                            <View style={[styles.podiumAvatar, styles.goldAvatar]}>
                                <Text style={styles.podiumAvatarText}>
                                    {topStudents[0].avatar}
                                </Text>
                                <View style={styles.crownIcon}>
                                    <Text style={styles.crown}>👑</Text>
                                </View>
                            </View>
                            <View style={[styles.podiumRank, styles.goldRank]}>
                                <Text style={styles.podiumRankText}>1</Text>
                            </View>
                            <Text style={styles.podiumName} numberOfLines={1}>
                                {topStudents[0].name.split(' ')[0]}
                            </Text>
                            <Text style={styles.podiumPoints}>
                                {topStudents[0].points.toLocaleString()}
                            </Text>
                            <View style={[styles.podiumBar, styles.goldBar]} />
                        </View>

                        {/* 3rd Place */}
                        <View style={styles.podiumPosition}>
                            <View style={[styles.podiumAvatar, styles.bronzeAvatar]}>
                                <Text style={styles.podiumAvatarText}>
                                    {topStudents[2].avatar}
                                </Text>
                            </View>
                            <View style={[styles.podiumRank, styles.bronzeRank]}>
                                <Text style={styles.podiumRankText}>3</Text>
                            </View>
                            <Text style={styles.podiumName} numberOfLines={1}>
                                {topStudents[2].name.split(' ')[0]}
                            </Text>
                            <Text style={styles.podiumPoints}>
                                {topStudents[2].points.toLocaleString()}
                            </Text>
                            <View style={[styles.podiumBar, styles.bronzeBar]} />
                        </View>
                    </View>

                    {/* Rest of students */}
                    {topStudents.slice(3).map(student => (
                        <TouchableOpacity key={student.id} style={styles.studentCard}>
                            <View style={styles.studentRank}>
                                <Text style={styles.studentRankText}>{student.rank}</Text>
                            </View>
                            <Text style={styles.studentAvatar}>{student.avatar}</Text>
                            <View style={styles.studentInfo}>
                                <Text style={styles.studentName}>{student.name}</Text>
                                <View style={styles.studentPoints}>
                                    <Ionicons
                                        name="trophy-outline"
                                        size={14}
                                        color={colors.warning}
                                    />
                                    <Text style={styles.studentPointsText}>
                                        {student.points.toLocaleString()} points
                                    </Text>
                                </View>
                            </View>
                            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.white,
        ...shadows.sm,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.md,
    },
    headerTitle: {
        fontSize: typography.fontSize.headingLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    scrollView: {
        flex: 1,
    },
    schoolCard: {
        backgroundColor: colors.white,
        margin: spacing.md,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        ...shadows.md,
    },
    logoContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    logo: {
        fontSize: 80,
    },
    rankBadge: {
        position: 'absolute',
        bottom: 0,
        right: -8,
        backgroundColor: colors.warning,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xxs,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xxs,
    },
    rankText: {
        color: colors.white,
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.bold,
    },
    schoolName: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.lg,
    },
    location: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
    },
    joinButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        gap: spacing.sm,
    },
    joinButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.md,
        gap: spacing.md,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    statValue: {
        fontSize: typography.fontSize.headingLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xxs,
    },
    statLabel: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    section: {
        padding: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    viewAllText: {
        fontSize: typography.fontSize.caption,
        color: colors.secondary,
        fontWeight: typography.fontWeight.semiBold,
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    achievementCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        position: 'relative',
        ...shadows.sm,
    },
    achievementLocked: {
        opacity: 0.5,
    },
    achievementIcon: {
        fontSize: 40,
        marginBottom: spacing.sm,
    },
    achievementIconLocked: {
        opacity: 0.3,
    },
    achievementName: {
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.medium,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    achievementNameLocked: {
        color: colors.textSecondary,
    },
    unlockedBadge: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        backgroundColor: colors.success,
        borderRadius: borderRadius.round,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    podium: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    podiumPosition: {
        alignItems: 'center',
        flex: 1,
    },
    podiumAvatar: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.round,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        marginBottom: spacing.sm,
        position: 'relative',
    },
    goldAvatar: {
        borderColor: '#FFD700',
        backgroundColor: '#FFF9E6',
    },
    silverAvatar: {
        borderColor: '#C0C0C0',
        backgroundColor: '#F5F5F5',
    },
    bronzeAvatar: {
        borderColor: '#CD7F32',
        backgroundColor: '#FFF5E6',
    },
    podiumAvatarText: {
        fontSize: 32,
    },
    crownIcon: {
        position: 'absolute',
        top: -12,
        right: -4,
    },
    crown: {
        fontSize: 20,
    },
    podiumRank: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.round,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
    },
    goldRank: {
        backgroundColor: '#FFD700',
    },
    silverRank: {
        backgroundColor: '#C0C0C0',
    },
    bronzeRank: {
        backgroundColor: '#CD7F32',
    },
    podiumRankText: {
        color: colors.white,
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.bold,
    },
    podiumName: {
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.xxs,
    },
    podiumPoints: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    podiumBar: {
        width: '100%',
        borderTopLeftRadius: borderRadius.sm,
        borderTopRightRadius: borderRadius.sm,
    },
    goldBar: {
        height: 100,
        backgroundColor: '#FFD700',
    },
    silverBar: {
        height: 80,
        backgroundColor: '#C0C0C0',
    },
    bronzeBar: {
        height: 60,
        backgroundColor: '#CD7F32',
    },
    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadows.sm,
    },
    studentRank: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    studentRankText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textSecondary,
    },
    studentAvatar: {
        fontSize: 32,
        marginRight: spacing.md,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.xxs,
    },
    studentPoints: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    studentPointsText: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
    },
});
