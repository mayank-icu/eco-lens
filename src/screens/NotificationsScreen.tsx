import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    PanResponder,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { AuthContext } from '../contexts/AuthContext';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

export default function NotificationsScreen({ navigation }: any) {
    const { user, firebaseUser } = useContext(AuthContext);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Load notifications from user data
        if (user?.notifications && Array.isArray(user.notifications)) {
            const loadedNotifications = user.notifications.map((notif: any) => ({
                ...notif,
                timestamp: notif.timestamp?.toDate ? notif.timestamp.toDate() : new Date(notif.timestamp),
            }));
            setNotifications(loadedNotifications);
        } else {
            // Initialize with welcome notification if none exist
            const welcomeNotification: Notification = {
                id: '1',
                title: 'Welcome to Eco Lens!',
                message: 'Thank you for joining us on this journey to make the planet greener. Start scanning to earn rewards!',
                timestamp: new Date(),
                read: false,
            };
            setNotifications([welcomeNotification]);
            saveNotificationsToFirebase([welcomeNotification]);
        }
    }, [user]);

    const saveNotificationsToFirebase = async (updatedNotifications: Notification[]) => {
        if (!firebaseUser) return;

        try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            await updateDoc(userRef, {
                notifications: updatedNotifications,
            });
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    };

    const markAsRead = async (id: string) => {
        const updatedNotifications = notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        );
        setNotifications(updatedNotifications);
        await saveNotificationsToFirebase(updatedNotifications);
    };

    const deleteNotification = async (id: string) => {
        const updatedNotifications = notifications.filter(notif => notif.id !== id);
        setNotifications(updatedNotifications);
        await saveNotificationsToFirebase(updatedNotifications);
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const SwipeableNotification = ({ notification }: { notification: Notification }) => {
        const translateX = useRef(new Animated.Value(0)).current;
        const lastOffset = useRef(0);

        const panResponder = useRef(
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) => {
                    return Math.abs(gestureState.dx) > 10;
                },
                onPanResponderMove: (_, gestureState) => {
                    const newValue = lastOffset.current + gestureState.dx;
                    // Limit swipe to left (-100) and right (100)
                    if (newValue >= -100 && newValue <= 100) {
                        translateX.setValue(newValue);
                    }
                },
                onPanResponderRelease: (_, gestureState) => {
                    const finalOffset = lastOffset.current + gestureState.dx;

                    // Swipe left to delete (threshold: -60)
                    if (finalOffset < -60) {
                        Animated.timing(translateX, {
                            toValue: -100,
                            duration: 200,
                            useNativeDriver: true,
                        }).start(() => {
                            setTimeout(() => deleteNotification(notification.id), 100);
                        });
                        lastOffset.current = -100;
                    }
                    // Swipe right to mark as read (threshold: 60)
                    else if (finalOffset > 60) {
                        markAsRead(notification.id);
                        Animated.spring(translateX, {
                            toValue: 0,
                            useNativeDriver: true,
                        }).start();
                        lastOffset.current = 0;
                    }
                    // Return to center
                    else {
                        Animated.spring(translateX, {
                            toValue: 0,
                            useNativeDriver: true,
                        }).start();
                        lastOffset.current = 0;
                    }
                },
            })
        ).current;

        return (
            <View style={styles.swipeContainer}>
                {/* Background actions */}
                <View style={styles.actionsBackground}>
                    <View style={styles.markReadAction}>
                        <Feather name="check" size={20} color={colors.white} />
                        <Text style={styles.actionText}>Read</Text>
                    </View>
                    <View style={styles.deleteAction}>
                        <Feather name="trash-2" size={20} color={colors.white} />
                        <Text style={styles.actionText}>Delete</Text>
                    </View>
                </View>

                {/* Notification card */}
                <Animated.View
                    style={[
                        styles.notificationCard,
                        { transform: [{ translateX }] },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.notificationContent}>
                        <View style={styles.textContainer}>
                            <View style={styles.titleRow}>
                                <Text style={styles.notificationTitle}>
                                    {notification.title}
                                </Text>
                                {!notification.read && <View style={styles.unreadDot} />}
                            </View>
                            <Text style={styles.notificationMessage}>
                                {notification.message}
                            </Text>
                            <Text style={styles.timestamp}>
                                {formatTimestamp(notification.timestamp)}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </View>
        );
    };

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
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Notifications List */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {notifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Feather name="bell-off" size={64} color={colors.textMuted} />
                        <Text style={styles.emptyTitle}>No notifications</Text>
                        <Text style={styles.emptyMessage}>
                            You're all caught up! Check back later for updates.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.notificationsList}>
                        {notifications.map((notification) => (
                            <SwipeableNotification
                                key={notification.id}
                                notification={notification}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e2d1',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    },
    notificationsList: {
        padding: spacing.md,
    },
    swipeContainer: {
        marginBottom: spacing.md,
        position: 'relative',
    },
    actionsBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    markReadAction: {
        backgroundColor: colors.success,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: borderRadius.lg,
        borderBottomLeftRadius: borderRadius.lg,
    },
    deleteAction: {
        backgroundColor: colors.error,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: borderRadius.lg,
        borderBottomRightRadius: borderRadius.lg,
    },
    actionText: {
        color: colors.white,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semiBold,
        marginTop: spacing.xxs,
    },
    notificationCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    notificationTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginLeft: spacing.xs,
    },
    notificationMessage: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.small * 1.5,
        marginBottom: spacing.sm,
    },
    timestamp: {
        fontSize: typography.fontSize.xs,
        color: colors.textMuted,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxxl * 2,
        paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
        fontSize: typography.fontSize.headingLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    emptyMessage: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: typography.fontSize.body * 1.5,
    },
});
