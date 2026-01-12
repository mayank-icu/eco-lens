import React, { useState, useCallback, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Modal,
    Switch,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSound } from '../contexts/SoundContext';
import { spacing, typography, borderRadius } from '../constants/theme';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

// Custom Modal Component
const CustomModal = memo(({ visible, onClose, title, message, type = 'info' }: any) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <Ionicons name="checkmark-circle" size={60} color="#7fb069" />;
            case 'error':
                return <Ionicons name="close-circle" size={60} color="#EF4444" />;
            default:
                return <Ionicons name="information-circle" size={60} color="#4FC3F7" />;
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
                <Ionicons name="warning" size={60} color="#FF9800" />
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

export default function SettingsScreen({ navigation }: any) {
    const { user, refreshUser, deleteAccount } = useAuth();
    const { colors, isDarkMode } = useTheme();
    const { soundEnabled, toggleSound } = useSound();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Delete account modals
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    // Notification modal
    const [notification, setNotification] = useState({ visible: false, title: '', message: '', type: 'info' });

    const showNotification = useCallback((title: string, message: string, type = 'info') => {
        setNotification({ visible: true, title, message, type });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification({ visible: false, title: '', message: '', type: 'info' });
    }, []);

    const handleSaveProfile = useCallback(async () => {
        if (!auth.currentUser) {
            showNotification('Error', 'No user logged in', 'error');
            return;
        }

        setLoading(true);
        try {
            // Update display name in Firestore
            if (displayName !== user?.displayName) {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userRef, { displayName });
            }

            // Update password if provided
            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    showNotification('Error', 'Passwords do not match', 'error');
                    setLoading(false);
                    return;
                }

                if (newPassword.length < 6) {
                    showNotification('Error', 'Password must be at least 6 characters', 'error');
                    setLoading(false);
                    return;
                }

                await updatePassword(auth.currentUser, newPassword);
            }

            await refreshUser();
            setNewPassword('');
            setConfirmPassword('');
            showNotification('Success', 'Profile updated successfully!', 'success');
        } catch (error: any) {
            console.error('Profile update error:', error);
            if (error.code === 'auth/requires-recent-login') {
                showNotification('Error', 'Please log out and log in again to change your password', 'error');
            } else {
                showNotification('Error', 'Failed to update profile: ' + error.message, 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [displayName, user, newPassword, confirmPassword, refreshUser, showNotification]);

    const handleDeleteAccount = useCallback(() => {
        setIsDeleteModalVisible(true);
    }, []);

    const confirmDeletePassword = useCallback(async () => {
        if (!deletePassword.trim()) {
            showNotification('Error', 'Please enter your password', 'error');
            return;
        }

        setIsDeleteModalVisible(false);
        setIsDeleteConfirmVisible(true);
    }, [deletePassword, showNotification]);

    const finalDeleteConfirmation = useCallback(async () => {
        try {
            await deleteAccount(deletePassword);
            setIsDeleteConfirmVisible(false);
            setDeletePassword('');
        } catch (error: any) {
            setIsDeleteConfirmVisible(false);
            showNotification(
                'Error',
                error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential'
                    ? 'Incorrect password. Please try again.'
                    : 'Failed to delete account. Please try again.',
                'error'
            );
            setDeletePassword('');
        }
    }, [deletePassword, deleteAccount, showNotification]);

    return (
        <View style={[styles.container, { backgroundColor: colors.lightGray }]}>
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={colors.lightGray}
            />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.lightGray }]}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: colors.white }]}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT</Text>

                    <View style={[styles.card, { backgroundColor: colors.white }]}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Display Name</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.lightGray,
                                        color: colors.textPrimary,
                                        borderColor: '#7fb069',
                                    }
                                ]}
                                value={displayName}
                                onChangeText={setDisplayName}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.lightGray,
                                        color: colors.textPrimary,
                                    }
                                ]}
                                value={user?.email || ''}
                                editable={false}
                                placeholder="Enter your email"
                                placeholderTextColor={colors.textMuted}
                            />
                            <Text style={[styles.helperText, { color: colors.textMuted }]}>
                                Email cannot be changed
                            </Text>
                        </View>

                        <View style={styles.divider} />
                        <Text style={[styles.sectionSubtitle, { color: colors.textPrimary }]}>
                            Change Password (Optional)
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>New Password</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.lightGray,
                                        color: colors.textPrimary,
                                        borderColor: '#7fb069',
                                    }
                                ]}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Enter new password (min 6 characters)"
                                placeholderTextColor={colors.textMuted}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Confirm New Password</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.lightGray,
                                        color: colors.textPrimary,
                                        borderColor: '#7fb069',
                                    }
                                ]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm new password"
                                placeholderTextColor={colors.textMuted}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButton, { opacity: loading ? 0.6 : 1 }]}
                            onPress={handleSaveProfile}
                            disabled={loading}
                        >
                            <Text style={styles.saveButtonText}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>DANGER ZONE</Text>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteAccount}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.settingIcon, { backgroundColor: '#FEF2F2' }]}>
                            <Feather name="trash-2" size={22} color="#EF4444" />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Delete Account</Text>
                            <Text style={styles.settingDescription}>
                                Permanently delete your account and all data
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Delete Account Password Modal */}
            <Modal
                visible={isDeleteModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDeleteModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.deleteModal, { backgroundColor: colors.white }]}>
                        <Ionicons name="warning" size={60} color="#EF4444" />
                        <Text style={styles.deleteModalTitle}>Delete Account</Text>
                        <Text style={[styles.deleteModalText, { color: colors.textSecondary }]}>
                            This action cannot be undone. All your data will be permanently deleted.
                        </Text>
                        <Text style={[styles.deleteModalLabel, { color: colors.textPrimary }]}>Enter your password to confirm:</Text>
                        <TextInput
                            style={[styles.deletePasswordInput, { backgroundColor: colors.lightGray, color: colors.textPrimary }]}
                            placeholder="Password"
                            placeholderTextColor="#95a5a6"
                            secureTextEntry
                            value={deletePassword}
                            onChangeText={setDeletePassword}
                            autoFocus
                        />
                        <View style={styles.deleteModalButtons}>
                            <TouchableOpacity
                                style={[styles.deleteModalCancelButton, { backgroundColor: colors.lightGray }]}
                                onPress={() => {
                                    setIsDeleteModalVisible(false);
                                    setDeletePassword('');
                                }}
                            >
                                <Text style={[styles.deleteModalCancelText, { color: colors.textPrimary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteModalConfirmButton}
                                onPress={confirmDeletePassword}
                            >
                                <Text style={styles.deleteModalConfirmText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Final Confirmation Modal */}
            <ConfirmModal
                visible={isDeleteConfirmVisible}
                onClose={() => {
                    setIsDeleteConfirmVisible(false);
                    setDeletePassword('');
                }}
                onConfirm={finalDeleteConfirmation}
                title="Final Confirmation"
                message="Are you absolutely sure? This will permanently delete your account and all associated data. This action cannot be undone."
            />

            <CustomModal
                visible={notification.visible}
                onClose={hideNotification}
                title={notification.title}
                message={notification.message}
                type={notification.type}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
    },
    headerTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
    },
    content: {
        flex: 1,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.semiBold,
        marginBottom: spacing.md,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionSubtitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    card: {
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputGroup: {
        marginBottom: spacing.md,
    },
    inputLabel: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
        marginBottom: spacing.xs,
    },
    input: {
        fontSize: typography.fontSize.body,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 2,
    },
    helperText: {
        fontSize: typography.fontSize.xs,
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: spacing.md,
    },
    saveButton: {
        backgroundColor: '#7fb069',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginTop: spacing.sm,
        shadowColor: '#7fb069',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
    settingIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    settingContent: {
        flex: 1,
    },
    settingLabel: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: typography.fontSize.small,
        color: '#6B7280',
        marginTop: 2,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: '#FEE2E2',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    bottomSpacer: {
        height: spacing.xxxl * 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    customModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: borderRadius.xxl,
        padding: spacing.xl,
        width: '100%',
        maxWidth: 350,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: '#1F2937',
        marginTop: spacing.md,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: typography.fontSize.body,
        color: '#6B7280',
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
        color: '#FFFFFF',
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: spacing.md,
        width: '100%',
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#1F2937',
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
        color: '#FFFFFF',
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
    deleteModal: {
        borderRadius: borderRadius.xxl,
        padding: spacing.xl,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    deleteModalTitle: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: '#EF4444',
        marginTop: spacing.md,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    deleteModalText: {
        fontSize: typography.fontSize.body,
        marginBottom: spacing.lg,
        textAlign: 'center',
        lineHeight: typography.fontSize.body * 1.5,
    },
    deleteModalLabel: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        marginBottom: spacing.sm,
        alignSelf: 'flex-start',
    },
    deletePasswordInput: {
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        fontSize: typography.fontSize.body,
        marginBottom: spacing.lg,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        width: '100%',
    },
    deleteModalButtons: {
        flexDirection: 'row',
        gap: spacing.md,
        width: '100%',
    },
    deleteModalCancelButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    deleteModalCancelText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
    deleteModalConfirmButton: {
        flex: 1,
        backgroundColor: '#EF4444',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    deleteModalConfirmText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: '#FFFFFF',
    },
});