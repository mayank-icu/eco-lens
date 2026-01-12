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


interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'milestone' | 'streak' | 'diversity' | 'social' | 'impact';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlocked: boolean;
    unlockedAt?: Date;
    progress?: number;
    requirement: string;
    reward: string;
}

export default function AchievementDetailScreen({ route, navigation }: any) {
    const { achievement } = route.params || {
        achievement: {
            id: '1',
            name: 'Eco Champion',
            description: 'Scan 100 plastic items and make a real environmental impact',
            icon: '🏆',
            category: 'milestone' as const,
            rarity: 'epic' as const,
            unlocked: true,
            unlockedAt: new Date('2024-11-15'),
            progress: 100,
            requirement: 'Scan 100 plastic items',
            reward: '500 bonus points',
        },
    };

    type RarityType = 'common' | 'rare' | 'epic' | 'legendary';
    type CategoryType = 'milestone' | 'streak' | 'diversity' | 'social' | 'impact';

    const rarityColors: Record<RarityType, string> = {
        common: colors.textSecondary,
        rare: colors.info,
        epic: colors.secondary,
        legendary: colors.warning,
    };

    const rarityLabels: Record<RarityType, string> = {
        common: 'Common',
        rare: 'Rare',
        epic: 'Epic',
        legendary: 'Legendary',
    };

    const categoryIcons: Record<CategoryType, string> = {
        milestone: 'flag',
        streak: 'zap',
        diversity: 'grid',
        social: 'users',
        impact: 'trending-up',
    };

    const relatedAchievements: Achievement[] = [
        {
            id: '2',
            name: 'Getting Started',
            description: 'Complete your first scan',
            icon: '🌱',
            category: 'milestone',
            rarity: 'common',
            unlocked: true,
            progress: 100,
            requirement: 'Scan 1 item',
            reward: '50 points',
        },
        {
            id: '3',
            name: 'Dedicated Sorter',
            description: 'Maintain a 7-day scanning streak',
            icon: '🔥',
            category: 'streak',
            rarity: 'rare',
            unlocked: false,
            progress: 57,
            requirement: '7 day streak',
            reward: '300 points',
        },
        {
            id: '4',
            name: 'Planet Protector',
            description: 'Save 10kg of CO2 emissions',
            icon: '🌍',
            category: 'impact',
            rarity: 'epic',
            unlocked: false,
            progress: 73,
            requirement: 'Save 10kg CO2',
            reward: '750 points',
        },
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
                <Text style={styles.headerTitle}>Achievement</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Achievement Hero Card */}
                <View
                    style={[
                        styles.heroCard,
                        {
                            borderColor: rarityColors[achievement.rarity as RarityType],
                            borderWidth: 2,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.rarityBadge,
                            { backgroundColor: rarityColors[achievement.rarity as RarityType] },
                        ]}
                    >
                        <Text style={styles.rarityText}>
                            {rarityLabels[achievement.rarity as RarityType]}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.iconContainer,
                            !achievement.unlocked && styles.iconContainerLocked,
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
                        {achievement.unlocked && (
                            <View style={styles.unlockedBadge}>
                                <Feather name="check" size={20} color={colors.white} />
                            </View>
                        )}
                    </View>

                    <Text style={styles.achievementName}>{achievement.name}</Text>
                    <Text style={styles.achievementDescription}>
                        {achievement.description}
                    </Text>

                    {achievement.unlocked && achievement.unlockedAt && (
                        <View style={styles.unlockedInfo}>
                            <Feather name="calendar" size={16} color={colors.success} />
                            <Text style={styles.unlockedText}>
                                Unlocked on {achievement.unlockedAt.toLocaleDateString()}
                            </Text>
                        </View>
                    )}

                    {!achievement.unlocked && achievement.progress !== undefined && (
                        <View style={styles.progressSection}>
                            <View style={styles.progressHeader}>
                                <Text style={styles.progressLabel}>Progress</Text>
                                <Text style={styles.progressPercentage}>
                                    {achievement.progress}%
                                </Text>
                            </View>
                            <View style={styles.progressBarContainer}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        {
                                            width: `${achievement.progress}%`,
                                            backgroundColor: rarityColors[achievement.rarity as RarityType],
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                    )}
                </View>

                {/* Details Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Details</Text>

                    <View style={styles.detailCard}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <Feather
                                    name={categoryIcons[achievement.category as CategoryType] as any}
                                    size={20}
                                    color={colors.secondary}
                                />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Category</Text>
                                <Text style={styles.detailValue}>
                                    {achievement.category.charAt(0).toUpperCase() +
                                        achievement.category.slice(1)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <Feather name="target" size={20} color={colors.info} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Requirement</Text>
                                <Text style={styles.detailValue}>{achievement.requirement}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="gift-outline" size={20} color={colors.warning} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Reward</Text>
                                <Text style={styles.detailValue}>{achievement.reward}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <Ionicons
                                    name="sparkles-outline"
                                    size={20}
                                    color={rarityColors[achievement.rarity as RarityType]}
                                />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Rarity</Text>
                                <Text
                                    style={[
                                        styles.detailValue,
                                        { color: rarityColors[achievement.rarity as RarityType] },
                                    ]}
                                >
                                    {rarityLabels[achievement.rarity as RarityType]}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Tips Section */}
                {!achievement.unlocked && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tips to Unlock</Text>
                        <View style={styles.tipsCard}>
                            <View style={styles.tipItem}>
                                <View style={styles.tipBullet}>
                                    <Text style={styles.tipBulletText}>1</Text>
                                </View>
                                <Text style={styles.tipText}>
                                    Scan plastic items regularly to build your progress
                                </Text>
                            </View>
                            <View style={styles.tipItem}>
                                <View style={styles.tipBullet}>
                                    <Text style={styles.tipBulletText}>2</Text>
                                </View>
                                <Text style={styles.tipText}>
                                    Check your daily challenges for bonus opportunities
                                </Text>
                            </View>
                            <View style={styles.tipItem}>
                                <View style={styles.tipBullet}>
                                    <Text style={styles.tipBulletText}>3</Text>
                                </View>
                                <Text style={styles.tipText}>
                                    Maintain your streak to unlock achievements faster
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Related Achievements */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Related Achievements</Text>
                    {relatedAchievements.map(related => (
                        <TouchableOpacity
                            key={related.id}
                            style={styles.relatedCard}
                            onPress={() =>
                                navigation.push('AchievementDetail', { achievement: related })
                            }
                        >
                            <View
                                style={[
                                    styles.relatedIcon,
                                    !related.unlocked && styles.relatedIconLocked,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.relatedIconText,
                                        !related.unlocked && styles.relatedIconTextLocked,
                                    ]}
                                >
                                    {related.icon}
                                </Text>
                            </View>
                            <View style={styles.relatedContent}>
                                <View style={styles.relatedHeader}>
                                    <Text style={styles.relatedName}>{related.name}</Text>
                                    <View
                                        style={[
                                            styles.relatedRarity,
                                            { backgroundColor: rarityColors[related.rarity] },
                                        ]}
                                    >
                                        <Text style={styles.relatedRarityText}>
                                            {rarityLabels[related.rarity]}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.relatedDescription} numberOfLines={1}>
                                    {related.description}
                                </Text>
                                {!related.unlocked && related.progress !== undefined && (
                                    <View style={styles.relatedProgressBar}>
                                        <View
                                            style={[
                                                styles.relatedProgress,
                                                {
                                                    width: `${related.progress}%`,
                                                    backgroundColor: rarityColors[related.rarity],
                                                },
                                            ]}
                                        />
                                    </View>
                                )}
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
    heroCard: {
        backgroundColor: colors.white,
        margin: spacing.md,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        position: 'relative',
        ...shadows.md,
    },
    rarityBadge: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
    rarityText: {
        color: colors.white,
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: borderRadius.round,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        position: 'relative',
    },
    iconContainerLocked: {
        opacity: 0.5,
    },
    achievementIcon: {
        fontSize: 64,
    },
    achievementIconLocked: {
        opacity: 0.3,
    },
    unlockedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.success,
        borderRadius: borderRadius.round,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.white,
    },
    achievementName: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    achievementDescription: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: typography.fontSize.body * typography.lineHeight.normal,
        marginBottom: spacing.lg,
    },
    unlockedInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.success + '20',
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    unlockedText: {
        fontSize: typography.fontSize.caption,
        color: colors.success,
        fontWeight: typography.fontWeight.semiBold,
    },
    progressSection: {
        width: '100%',
        marginTop: spacing.md,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    progressLabel: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    progressPercentage: {
        fontSize: typography.fontSize.caption,
        color: colors.textPrimary,
        fontWeight: typography.fontWeight.bold,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: borderRadius.sm,
    },
    section: {
        padding: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    detailCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...shadows.sm,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    detailIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xxs,
    },
    detailValue: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.mediumGray,
        marginVertical: spacing.xs,
    },
    tipsCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...shadows.sm,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    tipBullet: {
        width: 24,
        height: 24,
        borderRadius: borderRadius.round,
        backgroundColor: colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    tipBulletText: {
        color: colors.white,
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.bold,
    },
    tipText: {
        flex: 1,
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.body * typography.lineHeight.normal,
    },
    relatedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadows.sm,
    },
    relatedIcon: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.md,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    relatedIconLocked: {
        opacity: 0.5,
    },
    relatedIconText: {
        fontSize: 32,
    },
    relatedIconTextLocked: {
        opacity: 0.3,
    },
    relatedContent: {
        flex: 1,
    },
    relatedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xxs,
    },
    relatedName: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        flex: 1,
    },
    relatedRarity: {
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        marginLeft: spacing.sm,
    },
    relatedRarityText: {
        color: colors.white,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    relatedDescription: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    relatedProgressBar: {
        height: 4,
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
        marginTop: spacing.xs,
    },
    relatedProgress: {
        height: '100%',
        borderRadius: borderRadius.sm,
    },
});
