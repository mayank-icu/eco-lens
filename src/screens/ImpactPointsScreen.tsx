import React, { useContext, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your journey today";
    if (streak === 1) return "Great start";
    if (streak < 7) return "Building momentum";
    if (streak < 14) return "Consistency is key";
    if (streak < 30) return "Excellent progress";
    return "Outstanding dedication";
};

export default function ImpactPointsScreen({ navigation }: any) {
    const { user } = useContext(AuthContext);

    const stats = {
        totalScans: user?.totalScans || 0,
        currentStreak: user?.currentStreak || 0,
        longestStreak: user?.longestStreak || 0,
    };

    const weekDays = useMemo(() => {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const today = new Date();
        const currentDay = today.getDay();
        const currentStreak = stats.currentStreak;

        return days.map((day, index) => {
            const isToday = index === currentDay;
            const daysSinceStart = (7 + currentDay - index) % 7;
            const isCompleted = currentStreak > daysSinceStart && !isToday;

            return {
                day,
                isToday,
                isCompleted,
            };
        });
    }, [stats.currentStreak]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Impact</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Stats Card */}
                <View style={styles.heroCard}>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.totalScans}</Text>
                            <Text style={styles.statLabel}>Total Scans</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={stats.currentStreak > 0 ? styles.statValue : [styles.statValue, { color: colors.textSecondary }]}>
                                {stats.currentStreak}
                            </Text>
                            <Text style={styles.statLabel}>Day Streak</Text>
                        </View>
                    </View>
                </View>

                {/* Streak Visualization */}
                {stats.currentStreak > 0 && (
                    <View style={styles.streakCard}>
                        <View style={styles.streakHeader}>
                            <View style={styles.streakTitleRow}>
                                <Ionicons name="flame-outline" size={22} color="#7fb069" />
                                <Text style={styles.streakTitle}>Weekly Activity</Text>
                            </View>
                            <Text style={styles.streakSubtitle}>
                                {getStreakMessage(stats.currentStreak)}
                            </Text>
                        </View>

                        <View style={styles.weekCalendar}>
                            {weekDays.map((item, index) => (
                                <View key={index} style={styles.dayColumn}>
                                    <View style={[
                                        styles.dayCircle,
                                        item.isCompleted && styles.dayCircleCompleted,
                                        item.isToday && styles.dayCircleToday,
                                    ]}>
                                        {item.isCompleted && (
                                            <Ionicons name="checkmark" size={14} color={colors.white} />
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.dayLabel,
                                        (item.isToday || item.isCompleted) && styles.dayLabelActive
                                    ]}>
                                        {item.day}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {stats.longestStreak > 0 && (
                            <View style={styles.bestStreak}>
                                <Ionicons name="trophy-outline" size={16} color="#d4af37" />
                                <Text style={styles.bestStreakText}>
                                    Best: {stats.longestStreak} days
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Impact Message */}
                <View style={styles.impactCard}>
                    <View style={styles.impactIconContainer}>
                        <Ionicons name="leaf-outline" size={24} color="#7fb069" />
                    </View>
                    <Text style={styles.impactText}>
                        Every scan contributes to a cleaner, more sustainable future
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e2d1',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: '#e8e2d1',
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        letterSpacing: 0.3,
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxxl,
    },

    // Hero Card
    heroCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        marginBottom: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 50,
        backgroundColor: colors.mediumGray,
    },
    statValue: {
        fontSize: 42,
        fontWeight: '700',
        color: '#7fb069',
        marginBottom: spacing.xs,
    },
    statLabel: {
        fontSize: typography.fontSize.small,
        fontWeight: '500',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Streak Card
    streakCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    streakHeader: {
        marginBottom: spacing.lg,
    },
    streakTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    streakTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    streakSubtitle: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        marginLeft: 30,
    },

    // Week Calendar
    weekCalendar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xs,
    },
    dayColumn: {
        alignItems: 'center',
        gap: spacing.sm,
    },
    dayCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    dayCircleCompleted: {
        backgroundColor: '#7fb069',
        borderColor: '#7fb069',
    },
    dayCircleToday: {
        borderColor: '#7fb069',
        backgroundColor: colors.white,
    },
    dayLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    dayLabelActive: {
        color: '#7fb069',
        fontWeight: '600',
    },

    // Best Streak
    bestStreak: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        marginTop: spacing.sm,
    },
    bestStreakText: {
        fontSize: typography.fontSize.small,
        fontWeight: '500',
        color: colors.textSecondary,
    },

    // Impact Card
    impactCard: {
        backgroundColor: '#f5f9f3',
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        borderWidth: 1,
        borderColor: '#e8f5e9',
    },
    impactIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    impactText: {
        flex: 1,
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});