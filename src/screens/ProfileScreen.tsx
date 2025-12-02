import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    StatusBar,
    Platform,
    useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import { signOut } from '../services/auth';
import { getUserScans } from '../services/database';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { Scan } from '../types';

const BADGES = [
    { id: '1', name: 'First Scan', icon: 'target', library: 'Feather', color: colors.secondary, requirement: 1 },
    { id: '2', name: 'Starter', icon: 'rocket-outline', library: 'Ionicons', color: colors.info, requirement: 10 },
    { id: '3', name: 'Pro Sorter', icon: 'fire', library: 'MaterialCommunityIcons', color: colors.warning, requirement: 50 },
    { id: '4', name: 'Champion', icon: 'trophy-outline', library: 'Ionicons', color: colors.accent, requirement: 100 },
    { id: '5', name: 'Perfect Week', icon: 'star-outline', library: 'Ionicons', color: colors.secondaryLight, requirement: 500 },
    { id: '6', name: 'Expert', icon: 'school-outline', library: 'Ionicons', color: colors.primary, requirement: 1000 },
];

export default function ProfileScreen({ navigation }: any) {
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const { soundEnabled, toggleSound } = useSound();
    const [recentScans, setRecentScans] = useState<Scan[]>([]);
    const [loading, setLoading] = useState(true);

    // Responsive badge width
    const isDesktop = width > 768;
    const badgeWidth = isDesktop ? '15%' : '30%';

    useEffect(() => {
        const fetchHistory = async () => {
            if (user?.uid) {
                const scans = await getUserScans(user.uid, 3);
                setRecentScans(scans);
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                    },
                },
            ]
        );
    };

    const renderIcon = (library: string, name: string, size: number, color: string) => {
        switch (library) {
            case 'Feather': return <Feather name={name as any} size={size} color={color} />;
            case 'Ionicons': return <Ionicons name={name as any} size={size} color={color} />;
            case 'MaterialCommunityIcons': return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
            default: return <Feather name="help-circle" size={size} color={color} />;
        }
    };

    const isBadgeUnlocked = (requirement: number) => {
        return (user?.totalScans || 0) >= requirement;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Header with Gradient Cover */}
                <View style={styles.headerContainer}>
                    <LinearGradient
                        colors={[colors.primary, colors.primaryLight]}
                        style={styles.coverPhoto}
                    >
                        <TouchableOpacity style={styles.editButton}>
                            <Feather name="edit-2" size={20} color={colors.white} />
                        </TouchableOpacity>
                    </LinearGradient>

                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                {user?.photoURL ? (
                                    // Image component would go here
                                    <Text style={styles.avatarText}>{user.displayName?.[0] || 'U'}</Text>
                                ) : (
                                    <Text style={styles.avatarText}>{user?.displayName?.[0] || 'U'}</Text>
                                )}
                            </View>
                            <View style={styles.onlineBadge} />
                        </View>

                        <Text style={styles.userName}>{user?.displayName || 'Guest User'}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'guest@plastisort.ai'}</Text>

                        <View style={styles.userStats}>
                            <UserStat
                                label="Level"
                                value={user?.level.toString() || '1'}
                                icon={<Ionicons name="star" size={16} color={colors.warning} />}
                            />
                            <View style={styles.statDivider} />
                            <UserStat
                                label="Rank"
                                value={`#${(user as any)?.rank || '-'}`}
                                icon={<Ionicons name="trophy" size={16} color={colors.accent} />}
                            />
                            <View style={styles.statDivider} />
                            <UserStat
                                label="Points"
                                value={user?.totalPoints?.toString() || '0'}
                                icon={<Ionicons name="leaf" size={16} color={colors.secondary} />}
                            />
                        </View>
                    </View>
                </View>

                {/* Achievement Badges */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Achievement Badges</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.badgesGrid}>
                        {BADGES.map((badge) => {
                            const unlocked = isBadgeUnlocked(badge.requirement);
                            return (
                                <View key={badge.id} style={[styles.badgeCard, { width: badgeWidth }, !unlocked && styles.badgeLocked]}>
                                    <View style={[styles.badgeIconContainer, { backgroundColor: unlocked ? `${badge.color}20` : colors.lightGray }]}>
                                        {renderIcon(badge.library, badge.icon, 24, unlocked ? badge.color : colors.textSecondary)}
                                    </View>
                                    <Text style={styles.badgeName} numberOfLines={1}>{badge.name}</Text>
                                    {!unlocked && (
                                        <View style={styles.lockOverlay}>
                                            <Feather name="lock" size={12} color={colors.textSecondary} />
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Scan History */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Scans</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Scan')}>
                            <Text style={styles.seeAllText}>Scan New</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.historyCard}>
                        {recentScans.length > 0 ? (
                            recentScans.map((scan, index) => (
                                <React.Fragment key={scan.id}>
                                    <ScanHistoryItem
                                        type={scan.plasticType}
                                        date={scan.timestamp ? new Date(scan.timestamp).toLocaleDateString() : 'Just now'}
                                        binColor={scan.binColor}
                                        points={`+${scan.co2Saved}`}
                                    />
                                    {index < recentScans.length - 1 && <View style={styles.divider} />}
                                </React.Fragment>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>No scans yet. Start scanning!</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <View style={styles.settingsCard}>
                        <SettingItem
                            icon={<Feather name="user" size={20} color={colors.primary} />}
                            label="Account Settings"
                            value="Manage"
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon={<Feather name="bell" size={20} color={colors.warning} />}
                            label="Notifications"
                            value="On"
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon={<Feather name="volume-2" size={20} color={colors.secondary} />}
                            label="Sound Effects"
                            value={soundEnabled ? "On" : "Off"}
                            onPress={toggleSound}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon={<Feather name="globe" size={20} color={colors.info} />}
                            label="Language"
                            value="English"
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon={<Feather name="shield" size={20} color={colors.success} />}
                            label="Privacy & Security"
                        />
                    </View>
                </View>

                {/* Support & Logout */}
                <View style={styles.section}>
                    <View style={styles.settingsCard}>
                        <SettingItem
                            icon={<Feather name="help-circle" size={20} color={colors.secondary} />}
                            label="Help & Support"
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon={<Feather name="info" size={20} color={colors.textSecondary} />}
                            label="About PlastiSort"
                            value="v1.0.0"
                        />
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Feather name="log-out" size={20} color={colors.white} />
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

const UserStat = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
    <View style={styles.stat}>
        <View style={styles.statValueContainer}>
            {icon}
            <Text style={styles.statValue}>{value}</Text>
        </View>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const ScanHistoryItem = ({ type, date, binColor, points }: any) => (
    <TouchableOpacity style={styles.historyItem}>
        <View style={[styles.historyIcon, { backgroundColor: binColor === 'green' ? `${colors.recyclableGreen}20` : `${colors.nonRecyclableRed}20` }]}>
            <MaterialCommunityIcons
                name="recycle"
                size={24}
                color={binColor === 'green' ? colors.recyclableGreen : colors.nonRecyclableRed}
            />
        </View>
        <View style={styles.historyContent}>
            <Text style={styles.historyType}>{type} Plastic</Text>
            <Text style={styles.historyDate}>{date}</Text>
        </View>
        <View style={styles.historyRight}>
            <Text style={styles.historyPoints}>{points} pts</Text>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
        </View>
    </TouchableOpacity>
);

const SettingItem = ({ icon, label, value, onPress }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
        <View style={styles.settingIconContainer}>
            {icon}
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <Feather name="chevron-right" size={16} color={colors.textMuted} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    content: {
        flex: 1,
    },
    headerContainer: {
        marginBottom: spacing.lg,
        backgroundColor: colors.white,
        borderBottomLeftRadius: borderRadius.xxl,
        borderBottomRightRadius: borderRadius.xxl,
        ...shadows.sm,
        paddingBottom: spacing.xl,
    },
    coverPhoto: {
        height: 140,
        width: '100%',
    },
    editButton: {
        position: 'absolute',
        top: spacing.xl * 1.5,
        right: spacing.lg,
        width: 40,
        height: 40,
        borderRadius: borderRadius.round,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileHeader: {
        alignItems: 'center',
        marginTop: -50,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: borderRadius.round,
        backgroundColor: colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: colors.white,
        ...shadows.md,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 20,
        height: 20,
        borderRadius: borderRadius.round,
        backgroundColor: colors.success,
        borderWidth: 3,
        borderColor: colors.white,
    },
    userName: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xxs,
    },
    userEmail: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    userStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.xl,
        gap: spacing.lg,
    },
    stat: {
        alignItems: 'center',
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.xxs,
    },
    statValue: {
        fontSize: typography.fontSize.bodyLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: colors.mediumGray,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
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
        marginBottom: spacing.sm,
    },
    seeAllText: {
        fontSize: typography.fontSize.caption,
        color: colors.secondary,
        fontWeight: typography.fontWeight.semiBold,
    },
    badgesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    badgeCard: {
        aspectRatio: 0.9,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,
        ...shadows.xs,
    },
    badgeLocked: {
        opacity: 0.7,
        backgroundColor: colors.lightGray,
    },
    badgeIconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.round,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    badgeName: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.medium,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    lockOverlay: {
        position: 'absolute',
        top: spacing.xs,
        right: spacing.xs,
    },
    historyCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.sm,
        ...shadows.sm,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    historyIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    historyContent: {
        flex: 1,
    },
    historyType: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
    },
    historyDate: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
    },
    historyRight: {
        alignItems: 'flex-end',
        gap: spacing.xxs,
    },
    historyPoints: {
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.bold,
        color: colors.secondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGray,
        marginLeft: spacing.xl + spacing.md,
    },
    emptyState: {
        padding: spacing.lg,
        alignItems: 'center',
    },
    emptyStateText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.body,
    },
    settingsCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        ...shadows.sm,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.white,
    },
    settingIconContainer: {
        width: 36,
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    settingLabel: {
        flex: 1,
        fontSize: typography.fontSize.body,
        color: colors.textPrimary,
    },
    settingValue: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        marginRight: spacing.sm,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.error,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.xl,
        marginTop: spacing.xl,
        gap: spacing.sm,
        ...shadows.md,
    },
    logoutButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    bottomSpacer: {
        height: spacing.xxxl,
    },
});
