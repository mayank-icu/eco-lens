import React, { useContext, useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
    Dimensions,
    Image,
    Platform,
    FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { DailyClaimModal } from '../components/DailyClaimModal';
import HomeScreenSkeleton from '../components/HomeScreenSkeleton';
import { colors as staticColors, spacing, typography, borderRadius } from '../constants/theme';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
    navigation: any;
}

// Memoized components for better performance
const TodayActionCard = memo(({ item, onPress }: any) => (
    <TouchableOpacity
        style={styles.todayActionCard}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Image
            source={item.icon}
            style={styles.todayActionIcon}
            resizeMode="contain"
            fadeDuration={0}
        />
        <Text style={styles.todayActionText} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
));

const ImpactCard = memo(({ icon, label, value }: any) => (
    <View style={styles.impactCard}>
        <Image
            source={icon}
            style={styles.impactIcon}
            resizeMode="contain"
            fadeDuration={0}
        />
        <Text style={styles.impactLabel}>{label}</Text>
        <Text style={styles.impactValue}>{value}</Text>
    </View>
));

const CarouselCard = memo(({ item, colors }: any) => (
    <LinearGradient
        colors={[colors.carouselGradientStart, colors.carouselGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.carouselCard}
    >
        <View style={styles.carouselTextContainer}>
            <Text style={styles.carouselHeading}>{item.heading}</Text>
            <Text style={styles.carouselSubheading}>{item.subheading}</Text>
        </View>
        <Image
            source={item.image}
            style={styles.carouselImage}
            resizeMode="contain"
            fadeDuration={0}
        />
    </LinearGradient>
));

const QuickActionCard = memo(({ item, onPress }: any) => (
    <TouchableOpacity
        style={styles.quickActionCard}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Image
            source={item.icon}
            style={styles.quickActionIcon}
            resizeMode="contain"
            fadeDuration={0}
        />
        <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
));

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const { user, refreshUser } = useContext(AuthContext);
    const { checkDailyStreak, claimDailyReward } = useGamification();
    const { colors, isDarkMode } = useTheme();

    const [refreshing, setRefreshing] = useState(false);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [claimData, setClaimData] = useState({ day: 1, streakBroken: false });

    useEffect(() => {
        checkStreakStatus();
    }, [user?.uid]);

    const checkStreakStatus = async () => {
        const { canClaim, streakBroken, currentDay } = await checkDailyStreak();
        if (canClaim) {
            setClaimData({ day: currentDay, streakBroken });
            setShowClaimModal(true);
        }
    };

    const handleClaim = useCallback(async () => {
        await claimDailyReward();
        setShowClaimModal(false);
    }, [claimDailyReward]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refreshUser();
            await checkStreakStatus();
        } catch (error) {
            console.log('Error refreshing:', error);
        }
        setRefreshing(false);
    }, [refreshUser]);

    // Memoized stats calculation
    const stats = useMemo(() => ({
        scans: user?.totalScans || 0,
        co2Saved: user?.co2Saved || 0,
        plasticSaved: ((user?.co2Saved || 0) / 1000).toFixed(2),
        streak: user?.currentStreak || 0,
        level: user?.level || 1,
        points: user?.totalPoints || 0,
    }), [user?.totalScans, user?.co2Saved, user?.currentStreak, user?.level, user?.totalPoints]);

    // Memoized action handlers
    const handleScanPress = useCallback(() => navigation.navigate('Scan'), [navigation]);
    const handleFindBinPress = useCallback(() => navigation.navigate('FindBin'), [navigation]);
    const handleQuizPress = useCallback(() => {
        navigation.navigate('Learn');
    }, [navigation]);
    const handleProfilePress = useCallback(() => navigation.navigate('Profile'), [navigation]);
    const handleImpactPointsPress = useCallback(() => navigation.navigate('ImpactPoints'), [navigation]);
    const handleNotificationsPress = useCallback(() => navigation.navigate('Notifications'), [navigation]);

    // Memoized data arrays
    const todayActions = useMemo(() => [
        {
            id: '1',
            icon: require('../assets/icons/home-log_waste.png'),
            title: 'Log Your Waste',
            action: handleScanPress,
        },
        {
            id: '2',
            icon: require('../assets/icons/home-nearest_bin.png'),
            title: 'Find Nearest Bin',
            action: handleFindBinPress,
        },
        {
            id: '3',
            icon: require('../assets/icons/home-take_quiz.png'),
            title: 'Take a Quiz',
            action: handleQuizPress,
        },
    ], [handleScanPress, handleFindBinPress, handleQuizPress]);

    const carouselData = useMemo(() => [
        {
            id: '1',
            heading: 'Instant Recycling Check',
            subheading: 'Scan and verify instantly',
            image: require('../assets/icons/home-card2.png'),
        },
        {
            id: '2',
            heading: 'Global Green Network',
            subheading: 'Join the movement',
            image: require('../assets/icons/home-card4.png'),
        },
        {
            id: '3',
            heading: 'Earn Points, Get Rewards',
            subheading: 'Redeem exciting perks',
            image: require('../assets/icons/home-card3.png'),
        },
        {
            id: '4',
            heading: 'Clean for a Better Planet',
            subheading: 'Rinse before recycling',
            image: require('../assets/icons/home-card1.png'),
        },
    ], []);

    const quickActions = useMemo(() => [
        {
            id: '1',
            icon: require('../assets/icons/home-log_waste.png'),
            title: 'Log Waste',
            action: () => navigation.navigate('Scan'),
        },
        {
            id: '2',
            icon: require('../assets/icons/home-scan_history.png'),
            title: 'Scan History',
            action: () => navigation.navigate('ScanHistory'),
        },
        {
            id: '3',
            icon: require('../assets/icons/home-rewards.png'),
            title: 'Rewards',
            action: () => navigation.navigate('Stamps'),
        },
        {
            id: '4',
            icon: require('../assets/icons/home-tutorials.png'),
            title: 'Tutorials',
            action: () => navigation.navigate('Learn'),
        },
        {
            id: '5',
            icon: require('../assets/icons/home-bin_locations.png'),
            title: 'Bin Locations',
            action: () => navigation.navigate('FindBin'),
        },
        {
            id: '6',
            icon: require('../assets/icons/home-support.png'),
            title: 'Support',
            action: () => navigation.navigate('Help'),
        },
    ], [navigation]);

    // Memoized render functions
    const renderCarouselItem = useCallback(({ item }: any) => (
        <CarouselCard item={item} colors={colors} />
    ), [colors]);

    const getItemLayout = useCallback((data: any, index: number) => ({
        length: width * 0.92 + spacing.sm,
        offset: (width * 0.92 + spacing.sm) * index,
        index,
    }), []);

    return (
        <View style={[styles.container, { backgroundColor: colors.lightGray }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.lightGray} />

            <DailyClaimModal
                visible={showClaimModal}
                onClaim={handleClaim}
                day={claimData.day}
                streakBroken={claimData.streakBroken}
            />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.lightGray }]}>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={handleProfilePress}
                >
                    <View style={styles.profileInitials}>
                        <Text style={styles.profileInitialsText}>
                            {user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.energyButton}
                        onPress={handleImpactPointsPress}
                    >
                        <View style={styles.energyIconContainer}>
                            <Ionicons
                                name="flash"
                                size={28}
                                color="#7fb069"
                            />
                            <View style={styles.pointsBadge}>
                                <Text style={styles.pointsText}>{stats.scans}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={handleNotificationsPress}
                    >
                        <Ionicons name="notifications-outline" size={28} color="#7fb069" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={[styles.scrollView, { backgroundColor: colors.lightGray }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* Today's Actions Section */}
                <Text style={[styles.sectionHeader, { color: colors.textPrimary }]}>Today's Actions</Text>
                <View style={styles.todayActionsContainer}>
                    {todayActions.map((item) => (
                        <TodayActionCard key={item.id} item={item} onPress={item.action} />
                    ))}
                </View>

                {/* Impact Snapshot Section */}
                <Text style={styles.sectionHeader}>Impact Snapshot</Text>
                <View style={styles.impactSnapshotContainer}>
                    <ImpactCard
                        icon={require('../assets/icons/home-items_sorted.png')}
                        label="Items Sorted"
                        value={stats.scans}
                    />
                    <ImpactCard
                        icon={require('../assets/icons/home-kg-plastic.png')}
                        label="Plastic Saved"
                        value={`${stats.plasticSaved} kg`}
                    />
                    <ImpactCard
                        icon={require('../assets/icons/home-co2.png')}
                        label="CO2 Reduced"
                        value={`${stats.co2Saved}g`}
                    />
                </View>

                {/* Carousel Section - Using FlatList instead of nested ScrollView */}
                <View style={styles.carouselContainer}>
                    <FlatList
                        data={carouselData}
                        renderItem={renderCarouselItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width * 0.92 + spacing.sm}
                        decelerationRate="fast"
                        contentContainerStyle={styles.carouselContent}
                        getItemLayout={getItemLayout}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={2}
                        initialNumToRender={2}
                        windowSize={3}
                    />
                </View>

                {/* Quick Actions Section */}
                <Text style={styles.sectionHeader}>Quick Actions</Text>
                <View style={styles.quickActionsContainer}>
                    {quickActions.map((item) => (
                        <QuickActionCard key={item.id} item={item} onPress={item.action} />
                    ))}
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
    profileButton: {
        padding: 0,
    },
    profileInitials: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: staticColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInitialsText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.white,
    },
    notificationButton: {
        padding: spacing.xs,
    },
    bellIcon: {
        width: 28,
        height: 28,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    energyButton: {
        padding: spacing.xs,
    },
    energyIconContainer: {
        position: 'relative',
    },
    pointsBadge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#7fb069',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#e8e2d1',
    },
    pointsText: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.white,
    },
    scrollView: {
        flex: 1,
        backgroundColor: staticColors.lightGray,
    },
    scrollContent: {
        padding: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.xxxl,
    },
    sectionHeader: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.semiBold,
        color: staticColors.textPrimary,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },

    // Today's Actions Styles
    todayActionsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    todayActionCard: {
        flex: 1,
        backgroundColor: staticColors.todayActionsCard,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 120,
    },
    todayActionIcon: {
        width: 48,
        height: 48,
        marginBottom: spacing.xs,
    },
    todayActionText: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
        color: staticColors.textPrimary,
        textAlign: 'center',
    },

    // Impact Snapshot Styles - Made responsive for desktop
    impactSnapshotContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    impactCard: {
        flex: 1,
        backgroundColor: staticColors.impactSnapshotCard,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        // Remove aspectRatio for mobile, set maxHeight for desktop
        ...(Platform.OS === 'web' ? {
            maxHeight: 140,
            minHeight: 120,
        } : {
            aspectRatio: 1,
        }),
    },
    impactIcon: {
        width: 40,
        height: 40,
        marginBottom: spacing.xs,
    },
    impactLabel: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semiBold,
        color: staticColors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xxs,
    },
    impactValue: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.textPrimary,
        textAlign: 'center',
    },

    // Carousel Styles
    carouselContainer: {
        marginTop: spacing.xl,
        marginBottom: spacing.md,
        marginHorizontal: -spacing.md,
    },
    carouselContent: {
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
    },
    carouselCard: {
        width: width * 0.92,
        height: 160,
        borderRadius: borderRadius.xl,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        marginRight: spacing.sm,
    },
    carouselTextContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: spacing.sm,
    },
    carouselHeading: {
        fontSize: typography.fontSize.bodyLarge,
        fontWeight: typography.fontWeight.semiBold,
        color: staticColors.textPrimary,
        marginBottom: spacing.sm,
        marginTop: spacing.xs,
    },
    carouselSubheading: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.medium,
        color: staticColors.textSecondary,
        lineHeight: typography.fontSize.body * 1.4,
    },
    carouselImage: {
        width: 100,
        height: 100,
    },

    // Quick Actions Styles
    quickActionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    quickActionCard: {
        width: (width - spacing.md * 2 - spacing.sm * 2) / 3,
        backgroundColor: staticColors.quickActionsCard,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickActionIcon: {
        width: 44,
        height: 44,
        marginBottom: spacing.sm,
    },
    quickActionText: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
        color: staticColors.textPrimary,
        textAlign: 'center',
    },
});