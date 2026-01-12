import React, { useState, useCallback, useMemo, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    Modal,
    Linking,
    Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSound } from '../contexts/SoundContext';
import { signOut } from '../services/auth';
import { spacing, typography, borderRadius, colors } from '../constants/theme';
import ProfilePictureModal from '../components/ProfilePictureModal';

const getProfilePicture = (photoURL: string | null | undefined) => {
    if (!photoURL) return null;

    if (photoURL.startsWith('pf/')) {
        const index = parseInt(photoURL.replace('pf/', '').replace('.png', ''));
        const images = [
            require('../assets/pf/1.png'),
            require('../assets/pf/2.png'),
            require('../assets/pf/3.png'),
            require('../assets/pf/4.png'),
            require('../assets/pf/5.png'),
            require('../assets/pf/6.png'),
            require('../assets/pf/7.png'),
            require('../assets/pf/8.png'),
            require('../assets/pf/9.png'),
            require('../assets/pf/10.png'),
            require('../assets/pf/11.png'),
            require('../assets/pf/12.png'),
        ];
        return images[index - 1];
    }

    return { uri: photoURL };
};

const getUserLeague = (totalScans: number) => {
    if (totalScans >= 100) return 'Diamond';
    if (totalScans >= 50) return 'Gold';
    if (totalScans >= 20) return 'Silver';
    return 'Bronze';
};

const getLeagueColor = (league: string) => {
    switch (league) {
        case 'Diamond': return '#4FC3F7';
        case 'Gold': return '#FFD700';
        case 'Silver': return '#C0C0C0';
        default: return '#CD7F32';
    }
};

// Memoized components
const StatCard = memo(({ icon, value, label, color, onPress }: any) => (
    <TouchableOpacity
        style={styles.statCard}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
    >
        <View style={[styles.statIconBg, { backgroundColor: color }]}>
            {icon}
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
));

const SettingItem = memo(({ icon, label, description, onPress, iconColor = '#7fb069', disabled = false }: any) => (
    <TouchableOpacity
        style={[styles.settingItem, disabled && { opacity: 0.5 }]}
        onPress={onPress}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
    >
        <View style={[styles.settingIcon, { backgroundColor: `${iconColor}15` }]}>
            {icon}
        </View>
        <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>{label}</Text>
            {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
        <Feather name="chevron-right" size={18} color="#9CA3AF" />
    </TouchableOpacity>
));

const SettingToggle = memo(({ icon, label, description, value, onValueChange, iconColor = '#7fb069', disabled = false, badge = null }: any) => (
    <View style={[styles.settingItem, disabled && { opacity: 0.5 }]}>
        <View style={[styles.settingIcon, { backgroundColor: `${iconColor}15` }]}>
            {icon}
        </View>
        <View style={styles.settingContent}>
            <View style={styles.labelRow}>
                <Text style={styles.settingLabel}>{label}</Text>
                {badge && (
                    <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>{badge}</Text>
                    </View>
                )}
            </View>
            {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
        <Switch
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
            trackColor={{ false: '#E5E7EB', true: '#7fb069' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E7EB"
        />
    </View>
));

// Custom Modal Component
const CustomModal = memo(({ visible, onClose, title, message, type = 'info' }: any) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <Ionicons name="checkmark-circle" size={56} color="#7fb069" />;
            case 'error':
                return <Ionicons name="close-circle" size={56} color="#EF4444" />;
            case 'warning':
                return <Ionicons name="warning" size={56} color="#FF9800" />;
            default:
                return <Ionicons name="information-circle" size={56} color="#4FC3F7" />;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.customModal}>
                    {getIcon()}
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalMessage}>{message}</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
});

// Confirm Modal Component
const ConfirmModal = memo(({ visible, onClose, onConfirm, title, message }: any) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.customModal}>
                <Ionicons name="help-circle" size={56} color="#FF9800" />
                <Text style={styles.modalTitle}>{title}</Text>
                <Text style={styles.modalMessage}>{message}</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                        <Text style={styles.modalCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalConfirmButton} onPress={onConfirm}>
                        <Text style={styles.modalConfirmText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
));

export default function ProfileScreen({ navigation }: any) {
    const { user, updateProfilePicture } = useAuth();
    const { colors: themeColors, isDarkMode, toggleTheme } = useTheme();
    const { soundEnabled, toggleSound } = useSound();

    const [isPictureModalVisible, setIsPictureModalVisible] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [notification, setNotification] = useState({ visible: false, title: '', message: '', type: 'info' });

    const showNotification = useCallback((title: string, message: string, type = 'info') => {
        setNotification({ visible: true, title, message, type });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification({ visible: false, title: '', message: '', type: 'info' });
    }, []);

    const handleLogout = useCallback(async () => {
        setShowLogoutConfirm(false);
        await signOut();
    }, []);

    const handlePictureSelect = useCallback(async (index: number) => {
        try {
            await updateProfilePicture(index);
            setIsPictureModalVisible(false);
            showNotification('Success', 'Profile picture updated successfully!', 'success');
        } catch (error) {
            showNotification('Error', 'Failed to update profile picture. Please try again.', 'error');
        }
    }, [updateProfilePicture, showNotification]);

    const handleOpenURL = useCallback((url: string) => {
        Linking.openURL(url).catch(() => {
            showNotification('Error', 'Could not open link', 'error');
        });
    }, [showNotification]);

    const currentLeague = useMemo(() => getUserLeague(user?.totalScans || 0), [user?.totalScans]);
    const leagueColor = useMemo(() => getLeagueColor(currentLeague), [currentLeague]);
    const profileImageSource = useMemo(() => getProfilePicture(user?.photoURL), [user?.photoURL]);

    const currentPictureIndex = useMemo(() => {
        if (user?.photoURL && user.photoURL.startsWith('pf/')) {
            return parseInt(user.photoURL.replace('pf/', '').replace('.png', '')) - 1;
        }
        return 0;
    }, [user?.photoURL]);

    const stats = useMemo(() => ({
        currentStreak: user?.currentStreak || 0,
        co2Saved: user?.co2Saved || 0,
        plasticSaved: ((user?.co2Saved || 0) / 1000).toFixed(2),
    }), [user]);

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
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
            >
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={() => setIsPictureModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[leagueColor, `${leagueColor}90`]}
                            style={styles.avatarGradient}
                        >
                            <View style={styles.avatar}>
                                {profileImageSource ? (
                                    <Image source={profileImageSource} style={styles.avatarImage} />
                                ) : (
                                    <Text style={styles.avatarText}>{user?.displayName?.[0] || 'U'}</Text>
                                )}
                            </View>
                        </LinearGradient>
                        <View style={[styles.editBadge, { backgroundColor: leagueColor }]}>
                            <Feather name="edit-2" size={14} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.userName}>{user?.displayName || 'Guest User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>

                    {/* League Badge */}
                    <View style={[styles.leagueBadge, { backgroundColor: `${leagueColor}15`, borderColor: `${leagueColor}30` }]}>
                        <Ionicons name="trophy-outline" size={16} color={leagueColor} />
                        <Text style={[styles.leagueText, { color: leagueColor }]}>{currentLeague}</Text>
                    </View>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsSection}>
                    <View style={styles.statsContainer}>
                        <StatCard
                            icon={<Ionicons name="flame-outline" size={22} color="#FFFFFF" />}
                            value={stats.currentStreak}
                            label="Day Streak"
                            color="#FF6B6B"
                            onPress={() => navigation.navigate('Impact')}
                        />
                        <StatCard
                            icon={<Ionicons name="leaf-outline" size={22} color="#FFFFFF" />}
                            value={`${stats.co2Saved}g`}
                            label="CO₂ Saved"
                            color="#7fb069"
                            onPress={() => navigation.navigate('Impact')}
                        />
                        <StatCard
                            icon={<MaterialCommunityIcons name="recycle" size={22} color="#FFFFFF" />}
                            value={`${stats.plasticSaved}kg`}
                            label="Plastic Saved"
                            color="#4FC3F7"
                            onPress={() => navigation.navigate('Impact')}
                        />
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.groupedCard}>
                        <SettingToggle
                            icon={<Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"} size={20} color="#7fb069" />}
                            label="Dark Mode"
                            description="Switch between light and dark theme"
                            value={false}
                            onValueChange={() => {}}
                            disabled={true}
                            badge="Coming Soon"
                        />
                        
                        <View style={styles.itemDivider} />

                        <SettingToggle
                            icon={<Ionicons name={soundEnabled ? "volume-high-outline" : "volume-mute-outline"} size={20} color="#7fb069" />}
                            label="Sound Effects"
                            description="Enable or disable app sounds"
                            value={soundEnabled}
                            onValueChange={toggleSound}
                        />
                    </View>
                </View>

                {/* Data & Privacy Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data & Privacy</Text>
                    <View style={styles.groupedCard}>
                        <SettingItem
                            icon={<MaterialCommunityIcons name="download-outline" size={20} color="#7fb069" />}
                            label="Download My Data"
                            description="Export your scan history"
                            onPress={() => showNotification('Coming Soon', 'This feature will be available soon!', 'info')}
                        />

                        <View style={styles.itemDivider} />

                        <SettingItem
                            icon={<MaterialCommunityIcons name="shield-check-outline" size={20} color="#7fb069" />}
                            label="Privacy Policy"
                            description="Read our privacy policy"
                            onPress={() => navigation.navigate('PrivacyPolicy')}
                        />

                        <View style={styles.itemDivider} />

                        <SettingItem
                            icon={<MaterialCommunityIcons name="file-document-outline" size={20} color="#7fb069" />}
                            label="Terms of Service"
                            description="Read our terms and conditions"
                            onPress={() => navigation.navigate('TermsOfService')}
                        />
                    </View>
                </View>

                {/* Help & Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Help & Support</Text>
                    <View style={styles.groupedCard}>
                        <SettingItem
                            icon={<Feather name="help-circle" size={20} color="#7fb069" />}
                            label="Help Center"
                            description="Get help and FAQs"
                            onPress={() => navigation.navigate('Help')}
                        />

                        <View style={styles.itemDivider} />

                        <SettingItem
                            icon={<Feather name="star" size={20} color="#7fb069" />}
                            label="Rate Us"
                            description="Rate PlastiSort on the app store"
                            onPress={() => showNotification('Thank You!', 'Please rate us on your app store', 'success')}
                        />

                        <View style={styles.itemDivider} />

                        <SettingItem
                            icon={<Feather name="share-2" size={20} color="#7fb069" />}
                            label="Share App"
                            description="Share PlastiSort with friends"
                            onPress={() => showNotification('Share', 'Share PlastiSort with your friends!', 'info')}
                        />
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.groupedCard}>
                        <SettingItem
                            icon={<Feather name="info" size={20} color="#7fb069" />}
                            label="About PlastiSort"
                            description="Version 1.0.0"
                            onPress={() => navigation.navigate('About')}
                        />

                        <View style={styles.itemDivider} />

                        <SettingItem
                            icon={<MaterialCommunityIcons name="update" size={20} color="#7fb069" />}
                            label="Check for Updates"
                            description="See if new version is available"
                            onPress={() => showNotification('Up to Date', 'You are using the latest version!', 'success')}
                        />
                    </View>
                </View>

                {/* Logout Button */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => setShowLogoutConfirm(true)}
                        activeOpacity={0.8}
                    >
                        <Feather name="log-out" size={18} color="#FFFFFF" />
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>

            <ProfilePictureModal
                visible={isPictureModalVisible}
                currentPicture={currentPictureIndex}
                onClose={() => setIsPictureModalVisible(false)}
                onSelect={handlePictureSelect}
            />

            <CustomModal
                visible={notification.visible}
                onClose={hideNotification}
                title={notification.title}
                message={notification.message}
                type={notification.type}
            />

            <ConfirmModal
                visible={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="Logout"
                message="Are you sure you want to logout?"
            />
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
    headerTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        letterSpacing: 0.3,
    },
    backButton: {
        padding: spacing.xs,
    },
    settingsButton: {
        padding: spacing.xs,
    },
    content: {
        flex: 1,
    },
    profileHeader: {
        alignItems: 'center',
        paddingTop: spacing.xl,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.white,
        borderBottomLeftRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
        marginBottom: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    avatar: {
        width: 92,
        height: 92,
        borderRadius: 46,
        backgroundColor: '#7fb069',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.white,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 46,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.white,
    },
    userName: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    userEmail: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    leagueBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        borderWidth: 1,
    },
    leagueText: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
    },
    statsSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.white,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xs,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    statValue: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    groupedCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
    },
    itemDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 68,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    settingContent: {
        flex: 1,
    },
    settingLabel: {
        fontSize: typography.fontSize.body,
        color: colors.textPrimary,
        fontWeight: typography.fontWeight.semiBold,
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        marginTop: 1,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    comingSoonBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    comingSoonText: {
        fontSize: 10,
        color: '#92400E',
        fontWeight: typography.fontWeight.bold,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7fb069',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
        shadowColor: '#7fb069',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    logoutButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
    bottomSpacer: {
        height: 80,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    customModal: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: typography.fontSize.body * 1.5,
        marginBottom: spacing.lg,
    },
    modalButton: {
        backgroundColor: '#7fb069',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xxxl,
        borderRadius: borderRadius.lg,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
        width: '100%',
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: colors.lightGray,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    modalCancelText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
    modalConfirmButton: {
        flex: 1,
        backgroundColor: '#7fb069',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    modalConfirmText: {
        color: colors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
});