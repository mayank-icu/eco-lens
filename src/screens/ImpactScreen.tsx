import React, { useContext, useMemo, useState, useCallback, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { GamificationContext } from '../contexts/GamificationContext';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { badges, Badge } from '../constants/badges';
import { StampDetailModal } from '../components/StampDetailModal';

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
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: spacing.lg,
    },
    sectionHeader: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },

    // Your Contribution Styles
    contributionContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    contributionCard: {
        flex: 1,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        alignItems: 'center',
    },
    contributionIcon: {
        width: 48,
        height: 48,
        marginBottom: spacing.sm,
    },
    contributionValue: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    contributionUnit: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.medium,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    contributionLabel: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    contributionDescription: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.regular,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: typography.fontSize.small * 1.4,
    },

    // Weekly Progress Styles
    weeklyGraphCard: {
        backgroundColor: 'transparent',
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        paddingLeft: 0,
        marginBottom: spacing.md,
    },
    graphContainer: {
        flexDirection: 'row',
        height: 180,
    },
    yAxisContainer: {
        width: 28,
        height: 150,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginRight: spacing.xs,
    },
    yAxisLabel: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        color: colors.textSecondary,
    },
    graphContent: {
        flex: 1,
        height: 180,
        position: 'relative',
    },
    gridLinesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
        justifyContent: 'space-between',
    },
    gridLine: {
        height: 1,
        backgroundColor: '#e8e8e8',
        width: '100%',
    },
    barsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 180,
        paddingTop: 0,
    },
    barColumn: {
        flex: 1,
        alignItems: 'center',
        height: 180,
    },
    barContainer: {
        width: '100%',
        height: 150,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    barWrapper: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bar: {
        width: '70%',
        borderRadius: borderRadius.sm,
        minHeight: 4,
    },
    verticalLine: {
        width: 1,
        height: 8,
        backgroundColor: '#e8e8e8',
    },
    dayLabel: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        color: colors.textSecondary,
        marginTop: spacing.xxs,
    },

    // Achievements Styles
    achievementsContainer: {
        marginBottom: spacing.md,
    },
    stampsRow: {
        justifyContent: 'flex-start',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    stampContainer: {
        alignItems: 'center',
        width: '31%',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    stampImage: {
        width: 70,
        height: 70,
    },
    imageWrapper: {
        position: 'relative',
        marginBottom: spacing.xs,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationDot: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: colors.white,
        zIndex: 2,
    },
    stampName: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        textAlign: 'center',
        lineHeight: typography.fontSize.xs * 1.3,
    },
    stampNameLocked: {
        color: colors.textSecondary,
    },
    viewAllButton: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.md,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xs,
        borderWidth: 1,
        borderColor: '#e3eae0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    viewAllButtonText: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
        color: '#7fb069',
    },

    // Inspiration Card Styles
    inspirationCard: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    inspirationTextContainer: {
        flex: 1,
        paddingRight: spacing.sm,
    },
    inspirationHeading: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.xxs,
    },
    inspirationSubheading: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.regular,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.small * 1.4,
    },
    inspirationImage: {
        width: 80,
        height: 80,
    },
});

// Memoized components for better performance
const ContributionCard = memo(({ icon, value, unit, label, description }: any) => (
    <LinearGradient
        colors={['#f5f9f3', '#d4e8d0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.contributionCard}
    >
        <Image
            source={icon}
            style={styles.contributionIcon}
            resizeMode="contain"
            fadeDuration={0}
        />
        <Text style={styles.contributionValue}>{value}</Text>
        <Text style={styles.contributionUnit}>{unit}</Text>
        <Text style={styles.contributionLabel}>{label}</Text>
        <Text style={styles.contributionDescription}>{description}</Text>
    </LinearGradient>
));

const WeeklyBar = memo(({ item, maxValue, getBarColor }: any) => (
    <View style={styles.barColumn}>
        <View style={styles.barContainer}>
            <View style={styles.barWrapper}>
                <View
                    style={[
                        styles.bar,
                        {
                            height: item.value > 0 ? `${(item.value / maxValue) * 100}%` : 0,
                            backgroundColor: getBarColor(item.value),
                        },
                    ]}
                />
            </View>
        </View>
        <View style={styles.verticalLine} />
        <Text style={styles.dayLabel}>{item.day}</Text>
    </View>
));

const StampCard = memo(({ badge, isClaimed, onPress }: any) => (
    <TouchableOpacity
        style={styles.stampContainer}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.imageWrapper}>
            <Image
                source={badge.image}
                style={styles.stampImage}
                resizeMode="contain"
                fadeDuration={0}
            />
            {!isClaimed && (
                <View style={styles.notificationDot} />
            )}
        </View>
        <Text style={styles.stampName} numberOfLines={2}>
            {badge.name}
        </Text>
    </TouchableOpacity>
));

export default function ImpactScreen({ navigation }: any) {
    const { user } = useContext(AuthContext);
    const { scanHistory } = useContext(GamificationContext);
    const [selectedStamp, setSelectedStamp] = useState<Badge | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    // Memoized stats
    const stats = useMemo(() => ({
        plasticSaved: ((user?.co2Saved || 0) / 1000).toFixed(2),
        co2Reduced: (user?.co2Saved || 0) + 'g',
        totalScans: user?.totalScans || 0,
    }), [user?.co2Saved, user?.totalScans]);

    // Calculate weekly data from real scan history
    const weeklyData = useMemo(() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday

        return days.map((day, index) => {
            const targetDate = new Date(weekStart);
            targetDate.setDate(weekStart.getDate() + index);
            const dateStr = targetDate.toISOString().split('T')[0];

            // Safety check for scanHistory
            const scansForDay = scanHistory && Array.isArray(scanHistory)
                ? scanHistory.filter(scan => {
                    if (!scan.date) return false;
                    const scanDate = new Date(scan.date);
                    return scanDate.toDateString() === targetDate.toDateString();
                }).length
                : 0;

            return {
                day,
                value: scansForDay,
            };
        });
    }, [scanHistory]);

    const maxValue = useMemo(() => Math.max(...weeklyData.map(d => d.value), 1), [weeklyData]);

    // Get color based on value intensity (darker for more, lighter for less)
    const getBarColor = useCallback((value: number) => {
        if (value === 0) return '#e8e8e8';
        const intensity = value / maxValue;
        if (intensity > 0.7) return '#7fb069'; // Dark green
        if (intensity > 0.4) return '#9bc785'; // Medium green
        return '#c9e4bc'; // Light green
    }, [maxValue]);

    // Show 6 most recent unlocked stamps
    const unlockedStamps = useMemo(() =>
        badges
            .filter(badge => (user?.totalScans || 0) >= badge.requirement)
            .slice(0, 6),
        [user?.totalScans]
    );

    const claimedBadges = useMemo(() => user?.claimedBadges || [], [user?.claimedBadges]);

    const handleStampPress = useCallback((stamp: Badge) => {
        setSelectedStamp(stamp);
        setShowDetail(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowDetail(false);
    }, []);

    const renderStamp = useCallback(({ item }: { item: Badge }) => {
        const isClaimed = claimedBadges.includes(item.id);
        return (
            <StampCard
                badge={item}
                isClaimed={isClaimed}
                onPress={() => handleStampPress(item)}
            />
        );
    }, [claimedBadges, handleStampPress]);

    const keyExtractor = useCallback((item: Badge) => item.id, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Impact</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Your Contribution Section */}
                <Text style={styles.sectionHeader}>Your Contribution</Text>
                <View style={styles.contributionContainer}>
                    <ContributionCard
                        icon={require('../assets/icons/home-kg-plastic.png')}
                        value={stats.plasticSaved}
                        unit="kg"
                        label="Plastic Saved"
                        description="Equivalent to saving 2,100 standard bottles."
                    />
                    <ContributionCard
                        icon={require('../assets/icons/home-co2.png')}
                        value={stats.co2Reduced}
                        unit="kg"
                        label="CO₂ Reduced"
                        description="Equal to planting 12 new trees."
                    />
                </View>

                {/* Weekly Progress Section */}
                {weeklyData.some(d => d.value > 0) && (
                    <>
                        <Text style={styles.sectionHeader}>Weekly Progress</Text>
                        <View style={styles.weeklyGraphCard}>
                            <View style={styles.graphContainer}>
                                {/* Y-axis points */}
                                <View style={styles.yAxisContainer}>
                                    <Text style={styles.yAxisLabel}>{maxValue}</Text>
                                    <Text style={styles.yAxisLabel}>{Math.ceil(maxValue * 0.75)}</Text>
                                    <Text style={styles.yAxisLabel}>{Math.ceil(maxValue * 0.5)}</Text>
                                    <Text style={styles.yAxisLabel}>{Math.ceil(maxValue * 0.25)}</Text>
                                    <Text style={styles.yAxisLabel}>0</Text>
                                </View>

                                {/* Graph content with grid lines */}
                                <View style={styles.graphContent}>
                                    {/* Horizontal grid lines */}
                                    <View style={styles.gridLinesContainer}>
                                        {[0, 0.25, 0.5, 0.75, 1].map((_, index) => (
                                            <View key={index} style={styles.gridLine} />
                                        ))}
                                    </View>

                                    {/* Bars */}
                                    <View style={styles.barsContainer}>
                                        {weeklyData.map((item, index) => (
                                            <WeeklyBar
                                                key={index}
                                                item={item}
                                                maxValue={maxValue}
                                                getBarColor={getBarColor}
                                            />
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </>
                )}

                {/* Achievements Section */}
                <Text style={styles.sectionHeader}>Achievements</Text>
                <View style={styles.achievementsContainer}>
                    <FlatList
                        data={unlockedStamps}
                        renderItem={renderStamp}
                        keyExtractor={keyExtractor}
                        numColumns={3}
                        scrollEnabled={false}
                        columnWrapperStyle={styles.stampsRow}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={6}
                        initialNumToRender={6}
                        windowSize={3}
                    />
                    <TouchableOpacity
                        style={styles.viewAllButton}
                        onPress={() => navigation.navigate('Stamps')}
                    >
                        <Text style={styles.viewAllButtonText}>View All</Text>
                        <Ionicons name="arrow-forward" size={16} color="#7fb069" />
                    </TouchableOpacity>
                </View>

                {/* Inspiration Card */}
                <LinearGradient
                    colors={['#f5f9f3', '#d4e8d0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.inspirationCard}
                >
                    <View style={styles.inspirationTextContainer}>
                        <Text style={styles.inspirationHeading}>Keep It Up!</Text>
                        <Text style={styles.inspirationSubheading}>
                            You're making a real difference. Keep going!
                        </Text>
                    </View>
                    <Image
                        source={require('../assets/icons/impact-motivation.png')}
                        style={styles.inspirationImage}
                        resizeMode="contain"
                        fadeDuration={0}
                    />
                </LinearGradient>
            </ScrollView>

            <StampDetailModal
                visible={showDetail}
                onClose={handleCloseModal}
                stamp={selectedStamp}
                isUnlocked={true}
                isClaimed={selectedStamp ? claimedBadges.includes(selectedStamp.id) : false}
            />
        </View>
    );
}
