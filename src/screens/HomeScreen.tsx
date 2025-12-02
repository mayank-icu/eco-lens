import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius, shadows, iconSizes } from '../constants/theme';

interface HomeScreenProps {
    navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const { user } = useContext(AuthContext);
    const [treeScale] = useState(new Animated.Value(1));

    const animateTree = () => {
        Animated.sequence([
            Animated.timing(treeScale, {
                toValue: 1.1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(treeScale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    React.useEffect(() => {
        // Pulse animation on mount
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(treeScale, {
                    toValue: 1.05,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(treeScale, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    const stats = {
        scans: user?.totalScans || 0,
        co2Saved: user?.co2Saved || 0, // Fixed property name
        streak: user?.currentStreak || 0, // Fixed property name
        level: user?.level || 1,
        points: user?.totalPoints || 0, // Fixed property name
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Premium Header with Gradient - Now inside ScrollView */}
                <LinearGradient
                    colors={[colors.primary, colors.primaryLight, colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.greeting}>Welcome back,</Text>
                            <Text style={styles.userName}>{user?.displayName || 'Eco Warrior'}</Text>
                        </View>
                        <View style={styles.levelBadge}>
                            <Ionicons name="sparkles" size={iconSizes.sm} color={colors.accentLight} />
                            <Text style={styles.levelText}>Lv {stats.level}</Text>
                        </View>
                    </View>

                    {/* Impact Points */}
                    <View style={styles.pointsCard}>
                        <View style={styles.pointsContent}>
                            <Ionicons name="leaf" size={iconSizes.lg} color={colors.secondary} />
                            <View>
                                <Text style={styles.pointsLabel}>Total Impact</Text>
                                <Text style={styles.pointsValue}>{stats.points.toLocaleString()}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.pointsButton}
                            onPress={() => navigation.navigate('Impact')}
                        >
                            <Text style={styles.pointsButtonText}>View</Text>
                            <Feather name="chevron-right" size={iconSizes.sm} color={colors.secondary} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Quick Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatsCard
                        icon={<MaterialCommunityIcons name="barcode-scan" size={iconSizes.lg} color={colors.secondary} />}
                        title="Scans"
                        value={stats.scans}
                        color={colors.secondary}
                        iconBg="rgba(64, 145, 108, 0.12)"
                    />
                    <StatsCard
                        icon={<Feather name="wind" size={iconSizes.lg} color={colors.info} />}
                        title="CO₂ Saved"
                        value={`${stats.co2Saved}g`}
                        color={colors.info}
                        iconBg="rgba(76, 201, 240, 0.12)"
                    />
                    <StatsCard
                        icon={<Ionicons name="flame" size={iconSizes.lg} color={colors.warning} />}
                        title="Streak"
                        value={`${stats.streak} days`}
                        color={colors.warning}
                        iconBg="rgba(247, 127, 0, 0.12)"
                    />
                    <StatsCard
                        icon={<Ionicons name="trophy" size={iconSizes.lg} color={colors.accentLight} />}
                        title="Rank"
                        value={`#${(user as any)?.rank || '-'}`}
                        color={colors.accentLight}
                        iconBg="rgba(149, 213, 178, 0.12)"
                    />
                </View>

                {/* Animated Tree Visualization */}
                <View style={styles.treeCard}>
                    <Text style={styles.sectionTitle}>Your Impact Tree</Text>
                    <Animated.View
                        style={[
                            styles.treeContainer,
                            {
                                transform: [{ scale: treeScale }],
                            },
                        ]}
                    >
                        <TouchableOpacity onPress={animateTree} activeOpacity={0.8}>
                            {/* Replaced Emoji with Icon */}
                            <MaterialCommunityIcons name="tree" size={120} color={colors.secondary} />
                            <View style={styles.treeStats}>
                                <Text style={styles.treeStatsText}>{stats.points} pts</Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                    <Text style={styles.treeDescription}>
                        Growing strong! Keep scanning to make it flourish.
                    </Text>
                </View>

                {/* Scan Action Button - Hero CTA */}
                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => navigation.navigate('Scan')}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={[colors.secondary, colors.secondaryLight, colors.accent]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.scanButtonGradient}
                    >
                        <View style={styles.scanIconContainer}>
                            <MaterialCommunityIcons name="barcode-scan" size={iconSizes.xl} color={colors.white} />
                        </View>
                        <View style={styles.scanContent}>
                            <Text style={styles.scanTitle}>Scan Plastic Now</Text>
                            <Text style={styles.scanSubtitle}>Identify & recycle correctly</Text>
                        </View>
                        <Feather name="chevron-right" size={iconSizes.lg} color={colors.white} />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Weekly Challenge */}
                <View style={styles.challengeCard}>
                    <View style={styles.challengeHeader}>
                        <View style={styles.challengeIcon}>
                            <Feather name="target" size={iconSizes.md} color={colors.secondary} />
                        </View>
                        <View style={styles.challengeContent}>
                            <Text style={styles.challengeTitle}>Weekly Challenge</Text>
                            <Text style={styles.challengeDescription}>Scan 20 items this week</Text>
                        </View>
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${(stats.scans % 20 / 20) * 100}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{stats.scans % 20}/20</Text>
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={styles.activitySection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    {[1, 2, 3].map((item) => (
                        <ActivityItem key={item} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const StatsCard = ({ icon, title, value, color, iconBg }: any) => (
    <View style={[styles.statsCard, shadows.sm]}>
        <View style={[styles.statsIconContainer, { backgroundColor: iconBg }]}>
            {icon}
        </View>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
    </View>
);

const ActivityItem = () => (
    <View style={styles.activityItem}>
        <View style={styles.activityIconContainer}>
            <Ionicons name="water" size={iconSizes.md} color={colors.info} />
        </View>
        <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>PET Bottle scanned</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
        </View>
        <Text style={styles.activityPoints}>+45 pts</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxxl,
    },
    header: {
        paddingTop: spacing.xxxl + spacing.md,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.lg,
        borderBottomLeftRadius: borderRadius.xxl,
        borderBottomRightRadius: borderRadius.xxl,
        marginBottom: spacing.lg,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    greeting: {
        fontSize: typography.fontSize.body,
        color: colors.accentLight,
        fontWeight: typography.fontWeight.medium,
    },
    userName: {
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
        marginTop: spacing.xxs,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.round,
    },
    levelText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    pointsCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...shadows.md,
    },
    pointsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    pointsLabel: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    pointsValue: {
        fontSize: typography.fontSize.headingLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    pointsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        gap: spacing.xxs,
    },
    pointsButtonText: {
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.secondary,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    statsCard: {
        flex: 1,
        minWidth: '46%',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        alignItems: 'center',
    },
    statsIconContainer: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    statsValue: {
        fontSize: typography.fontSize.headingLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xxs,
    },
    statsTitle: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    treeCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    sectionTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    treeContainer: {
        marginVertical: spacing.lg,
        alignItems: 'center',
    },
    treeStats: {
        position: 'absolute',
        bottom: -10,
        alignSelf: 'center',
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.round,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        ...shadows.sm,
    },
    treeStatsText: {
        color: colors.white,
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.bold,
    },
    treeDescription: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.md,
    },
    scanButton: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.lg,
    },
    scanButtonGradient: {
        flexDirection: 'row',
        padding: spacing.lg,
        alignItems: 'center',
        gap: spacing.md,
    },
    scanIconContainer: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanContent: {
        flex: 1,
    },
    scanTitle: {
        fontSize: typography.fontSize.headingLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
        marginBottom: spacing.xxs,
    },
    scanSubtitle: {
        fontSize: typography.fontSize.caption,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    challengeCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: spacing.md,
    },
    challengeIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(64, 145, 108, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    challengeContent: {
        flex: 1,
    },
    challengeTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xxs,
    },
    challengeDescription: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.round,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.round,
    },
    progressText: {
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.bold,
        color: colors.textSecondary,
    },
    activitySection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    seeAllText: {
        fontSize: typography.fontSize.caption,
        color: colors.secondary,
        fontWeight: typography.fontWeight.semiBold,
    },
    activityItem: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        ...shadows.xs,
    },
    activityIconContainer: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(76, 201, 240, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.xxs,
    },
    activityTime: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
    },
    activityPoints: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.secondary,
    },
});
