import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { XP_PER_STREAK_DAY, XP_WEEKLY_BONUS } from '../services/gamification';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive helper
const getResponsiveSize = () => {
    const isTablet = SCREEN_WIDTH >= 768;
    const isDesktop = SCREEN_WIDTH >= 1024;
    
    if (isDesktop) {
        return {
            containerWidth: 480,
            lottieSize: 140,
            titleSize: 32,
            subtitleSize: 16,
            pointsSize: 64,
            padding: spacing.xxl,
        };
    } else if (isTablet) {
        return {
            containerWidth: 420,
            lottieSize: 120,
            titleSize: 28,
            subtitleSize: 15,
            pointsSize: 56,
            padding: spacing.xl,
        };
    } else {
        return {
            containerWidth: SCREEN_WIDTH * 0.85,
            lottieSize: 100,
            titleSize: 24,
            subtitleSize: 14,
            pointsSize: 48,
            padding: spacing.xl,
        };
    }
};

interface DailyClaimModalProps {
    visible: boolean;
    onClaim: () => void;
    day: number; // 1-7
    streakBroken: boolean;
}

export const DailyClaimModal: React.FC<DailyClaimModalProps> = ({
    visible,
    onClaim,
    day,
    streakBroken,
}) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const responsiveSize = getResponsiveSize();

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => scaleAnim.setValue(0.8));
        }
    }, [visible]);

    if (!visible) return null;

    const isBonusDay = day === 7;
    const points = isBonusDay ? XP_PER_STREAK_DAY + XP_WEEKLY_BONUS : XP_PER_STREAK_DAY;

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={styles.overlay}>
                {/* Glass Effect Background */}
                <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

                <Animated.View
                    style={[
                        styles.container,
                        {
                            width: responsiveSize.containerWidth,
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={[styles.content, { padding: responsiveSize.padding }]}>
                        {streakBroken && day > 1 && (
                            <View style={styles.brokenBadge}>
                                <Text style={styles.brokenText}>Streak Reset</Text>
                            </View>
                        )}

                        {/* Lottie Streak Animation */}
                        <View style={styles.lottieWrapper}>
                            <LottieView
                                source={require('../assets/animations/streak.json')}
                                style={[
                                    styles.lottieAnimation,
                                    {
                                        width: responsiveSize.lottieSize,
                                        height: responsiveSize.lottieSize,
                                    },
                                ]}
                                autoPlay
                                loop={false}
                            />
                        </View>

                        <Text 
                            style={[
                                styles.title,
                                { fontSize: responsiveSize.titleSize }
                            ]}
                        >
                            {isBonusDay ? 'Weekly Bonus!' : 'Daily Reward'}
                        </Text>

                        <Text 
                            style={[
                                styles.subtitle,
                                { fontSize: responsiveSize.subtitleSize }
                            ]}
                        >
                            {streakBroken && day > 1
                                ? "You missed a day, but don't worry! Start a new streak today."
                                : day === 1
                                    ? "Welcome! Start your daily streak today! "
                                    : `You're on a roll! Keep it up for Day ${day}.`
                            }
                        </Text>

                        {/* Day Progress Indicator */}
                        {!streakBroken && (
                            <View style={styles.progressContainer}>
                                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                                    <View
                                        key={d}
                                        style={[
                                            styles.dayDot,
                                            d <= day && styles.dayDotActive,
                                            d === 7 && styles.dayDotBonus,
                                        ]}
                                    >
                                        {d === 7 && d <= day && (
                                            <Text style={styles.bonusIcon}>⭐</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.rewardCard}>
                            <View style={styles.rewardHeader}>
                                <Text style={styles.rewardBadge}>
                                    {isBonusDay ? 'BONUS' : 'REWARD'}
                                </Text>
                            </View>
                            <Text 
                                style={[
                                    styles.pointsValue,
                                    { fontSize: responsiveSize.pointsSize }
                                ]}
                            >
                                +{points}
                            </Text>
                            <Text style={styles.pointsLabel}>Impact Points</Text>
                            
                            {isBonusDay && (
                                <View style={styles.bonusNote}>
                                    <Text style={styles.bonusNoteText}>
                                        Complete 7-day streak bonus!
                                    </Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.claimButton,
                                isBonusDay && styles.claimButtonBonus
                            ]}
                            onPress={onClaim}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.claimButtonText}>
                                {isBonusDay ? 'CLAIM BONUS' : 'CLAIM REWARD'}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.footerText}>
                            {isBonusDay 
                                ? 'Amazing! Start a new 7-day streak!' 
                                : `${7 - day} more day${7 - day > 1 ? 's' : ''} until bonus!`
                            }
                        </Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: borderRadius.xxl,
        overflow: 'hidden',
        ...shadows.xl,
        maxHeight: SCREEN_HEIGHT * 0.85,
    },
    content: {
        alignItems: 'center',
    },
    brokenBadge: {
        backgroundColor: colors.error,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.round,
        marginBottom: spacing.md,
    },
    brokenText: {
        color: colors.white,
        fontSize: typography.fontSize.small,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    lottieWrapper: {
        marginBottom: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottieAnimation: {
        alignSelf: 'center',
    },
    title: {
        fontWeight: typography.fontWeight.extraBold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
        lineHeight: 22,
        paddingHorizontal: spacing.sm,
    },
    progressContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    dayDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayDotActive: {
        backgroundColor: '#7fb069',
        transform: [{ scale: 1.2 }],
    },
    dayDotBonus: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    bonusIcon: {
        fontSize: 12,
    },
    rewardCard: {
        backgroundColor: colors.white,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        marginBottom: spacing.lg,
        width: '100%',
        borderWidth: 2,
        borderColor: '#7fb069',
        ...shadows.md,
    },
    rewardHeader: {
        marginBottom: spacing.sm,
    },
    rewardBadge: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.bold,
        color: '#7fb069',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    pointsValue: {
        fontWeight: '900',
        color: '#7fb069',
        marginBottom: 4,
        textShadowColor: 'rgba(127, 176, 105, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    pointsLabel: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bonusNote: {
        marginTop: spacing.sm,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
    },
    bonusNoteText: {
        fontSize: typography.fontSize.small,
        color: '#92400E',
        fontWeight: typography.fontWeight.semiBold,
    },
    claimButton: {
        backgroundColor: '#7fb069',
        width: '100%',
        paddingVertical: spacing.md + 4,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        ...shadows.md,
        shadowColor: '#7fb069',
        shadowOpacity: 0.4,
        marginBottom: spacing.sm,
    },
    claimButtonBonus: {
        backgroundColor: '#FFD700',
        shadowColor: '#FFD700',
    },
    claimButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.bodyLarge,
        fontWeight: typography.fontWeight.bold,
        letterSpacing: 1.2,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    footerText: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
        textAlign: 'center',
    },
});