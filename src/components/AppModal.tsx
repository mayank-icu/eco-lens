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
import { BlurView } from 'expo-blur';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ModalAction {
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface AppModalProps {
    visible: boolean;
    title: string;
    message: string;
    actions: ModalAction[];
    onDismiss?: () => void;
}

export const AppModal: React.FC<AppModalProps> = ({
    visible,
    title,
    message,
    actions,
    onDismiss,
}) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

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
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start(() => scaleAnim.setValue(0.8));
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onDismiss}>
            <View style={styles.overlay}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>

                        <View style={styles.actionsContainer}>
                            {actions.map((action, index) => {
                                const isCancel = action.style === 'cancel';
                                const isDestructive = action.style === 'destructive';

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.button,
                                            isCancel && styles.buttonCancel,
                                            isDestructive && styles.buttonDestructive,
                                            // Add margin if not last item
                                            index < actions.length - 1 && styles.buttonMargin
                                        ]}
                                        onPress={action.onPress}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[
                                            styles.buttonText,
                                            isCancel && styles.buttonTextCancel,
                                            isDestructive && styles.buttonTextDestructive
                                        ]}>
                                            {action.text}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
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
        padding: spacing.xl,
    },
    container: {
        width: Math.min(SCREEN_WIDTH * 0.85, 400),
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.xl,
    },
    content: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 22,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: spacing.md,
    },
    button: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonMargin: {
        marginRight: 0, // Handled by gap
    },
    buttonCancel: {
        backgroundColor: colors.lightGray,
    },
    buttonDestructive: {
        backgroundColor: '#FFEBEE',
    },
    buttonText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    buttonTextCancel: {
        color: colors.textPrimary,
    },
    buttonTextDestructive: {
        color: colors.error,
    },
});
