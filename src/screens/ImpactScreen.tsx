import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function ImpactScreen() {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Your Impact</Text>
                <Text style={styles.subtitle}>Making the world greener  🌍</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Hero Points */}
                <View style={styles.heroCard}>
                    <Text style={styles.heroLabel}>Total Impact Points</Text>
                    <Text style={styles.heroValue}>{user?.totalPoints || 0}</Text>
                    <Text style={styles.heroTrend}>+12 this week 📈</Text>
                </View>

                {/* Impact Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Impact Breakdown</Text>
                    <View style={styles.statsGrid}>
                        <ImpactCard
                            icon="📦"
                            value={user?.totalScans || 0}
                            label="Items Scanned"
                            trend="+5"
                        />
                        <ImpactCard
                            icon="⚖️"
                            value="2.4kg"
                            label="Weight Sorted"
                            trend="+0.8kg"
                        />
                        <ImpactCard
                            icon="🌱"
                            value={`${(user?.co2Saved || 0).toFixed(1)}kg`}
                            label="CO2 Saved"
                            trend={`+${((user?.co2Saved || 0) * 0.1).toFixed(1)}kg`}
                        />
                        <ImpactCard
                            icon="🌊"
                            value="1.2kg"
                            label="Ocean Saved"
                            trend="+0.4kg"
                        />
                    </View>
                </View>

                {/* Plastic Distribution */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Plastic Types Distribution</Text>
                    <View style={styles.chartContainer}>
                        <PlasticBar label="PET" percentage={45} color={colors.secondary} />
                        <PlasticBar label="HDPE" percentage={30} color={colors.accent} />
                        <PlasticBar label="PP" percentage={15} color={colors.warning} />
                        <PlasticBar label="Other" percentage={10} color={colors.textSecondary} />
                    </View>
                </View>

                {/* Milestones */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Milestones</Text>
                    <MilestoneItem
                        title="Beginner"
                        description="Scan 50 items"
                        progress={user ? (user.totalScans / 50) * 100 : 0}
                        completed={(user?.totalScans || 0) >= 50}
                    />
                    <MilestoneItem
                        title="Eco Warrior"
                        description="Scan 200 items"
                        progress={user ? (user.totalScans / 200) * 100 : 0}
                        completed={(user?.totalScans || 0) >= 200}
                    />
                    <MilestoneItem
                        title="Planet Saver"
                        description="Scan 500 items"
                        progress={user ? (user.totalScans / 500) * 100 : 0}
                        completed={(user?.totalScans || 0) >= 500}
                    />
                </View>

                {/* Comparison */}
                <View style={styles.comparisonCard}>
                    <Text style={styles.comparisonText}>
                        You sorted <Text style={styles.comparisonValue}>23%</Text> more than last month! 🎉
                    </Text>
                </View>

                <View style={styles.spacer} />
            </ScrollView>
        </View>
    );
}

const ImpactCard = ({ icon, value, label, trend }: any) => (
    <View style={styles.impactCard}>
        <Text style={styles.impactIcon}>{icon}</Text>
        <Text style={styles.impactValue}>{value}</Text>
        <Text style={styles.impactLabel}>{label}</Text>
        <Text style={styles.impactTrend}>{trend}</Text>
    </View>
);

const PlasticBar = ({ label, percentage, color }: any) => (
    <View style={styles.barContainer}>
        <Text style={styles.barLabel}>{label}</Text>
        <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.barPercentage}>{percentage}%</Text>
    </View>
);

const MilestoneItem = ({ title, description, progress, completed }: any) => (
    <View style={styles.milestoneItem}>
        <View style={styles.milestoneIcon}>
            <Text>{completed ? '✅' : '🔒'}</Text>
        </View>
        <View style={styles.milestoneContent}>
            <Text style={styles.milestoneTitle}>{title}</Text>
            <Text style={styles.milestoneDescription}>{description}</Text>
            <View style={styles.milestoneProgress}>
                <View style={[styles.milestoneBar, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
            <Text style={styles.milestonePercentage}>{Math.round(progress)}%</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl * 1.5,
        paddingBottom: spacing.lg,
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
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: borderRadius.xl * 1.5,
        borderTopRightRadius: borderRadius.xl * 1.5,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
    },
    heroCard: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        marginBottom: spacing.lg,
        ...shadows.md,
    },
    heroLabel: {
        fontSize: typography.fontSize.body,
        color: colors.white,
        opacity: 0.9,
    },
    heroValue: {
        fontSize: 48,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
        marginVertical: spacing.sm,
    },
    heroTrend: {
        fontSize: typography.fontSize.caption,
        color: colors.white,
        opacity: 0.9,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    impactCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
    },
    impactIcon: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    impactValue: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    impactLabel: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    impactTrend: {
        fontSize: typography.fontSize.small,
        color: colors.secondary,
        marginTop: spacing.xs,
    },
    chartContainer: {
        gap: spacing.md,
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    barLabel: {
        width: 50,
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.medium,
        color: colors.textPrimary,
    },
    barTrack: {
        flex: 1,
        height: 24,
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: borderRadius.sm,
    },
    barPercentage: {
        width: 40,
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        textAlign: 'right',
    },
    milestoneItem: {
        flexDirection: 'row',
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    milestoneIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.round,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    milestoneContent: {
        flex: 1,
    },
    milestoneTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
    },
    milestoneDescription: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs / 2,
        marginBottom: spacing.sm,
    },
    milestoneProgress: {
        height: 6,
        backgroundColor: colors.white,
        borderRadius: borderRadius.sm,
        marginBottom: spacing.xs,
    },
    milestoneBar: {
        height: '100%',
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.sm,
    },
    milestonePercentage: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
    },
    comparisonCard: {
        backgroundColor: colors.accent + '20',
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
    },
    comparisonText: {
        fontSize: typography.fontSize.body,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    comparisonValue: {
        fontWeight: typography.fontWeight.bold,
        color: colors.secondary,
    },
    spacer: {
        height: spacing.xl,
    },
});
