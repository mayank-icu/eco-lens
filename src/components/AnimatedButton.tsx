import React, { useRef } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { colors, borderRadius, spacing, typography, button3D, springConfig } from '../constants/theme';

interface AnimatedButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'accent' | 'purple' | 'outline';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        if (disabled || loading) return;

        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                ...springConfig.bouncy,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: 3,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        if (disabled || loading) return;

        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                ...springConfig.bouncy,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const getBackgroundColor = () => {
        if (disabled) return colors.mediumGray;
        switch (variant) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.secondary;
            case 'accent': return colors.accent;
            case 'purple': return colors.purple;
            case 'outline': return 'transparent';
            default: return colors.primary;
        }
    };

    const getBorderColor = () => {
        if (disabled) return 'transparent';
        switch (variant) {
            case 'outline': return colors.primary;
            default: return 'transparent';
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.textMuted;
        if (variant === 'outline') return colors.primary;
        return colors.white;
    };

    const getPadding = () => {
        switch (size) {
            case 'small': return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
            case 'large': return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
            default: return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
        }
    };

    return (
        <Animated.View
            style={[
                {
                    transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
                },
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                activeOpacity={0.9}
                style={[
                    styles.button,
                    {
                        backgroundColor: getBackgroundColor(),
                        borderColor: getBorderColor(),
                        borderWidth: variant === 'outline' ? 2 : 0,
                        ...getPadding(),
                    },
                    variant !== 'outline' && !disabled && styles.shadow,
                    style,
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={getTextColor()} size="small" />
                ) : (
                    <>
                        {icon && <>{icon}</>}
                        <Text
                            style={[
                                styles.text,
                                {
                                    color: getTextColor(),
                                    fontSize: size === 'small' ? typography.fontSize.caption :
                                        size === 'large' ? typography.fontSize.bodyLarge :
                                            typography.fontSize.body,
                                },
                                textStyle,
                            ]}
                        >
                            {title}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.xl,
        gap: spacing.sm,
    },
    shadow: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    text: {
        fontWeight: typography.fontWeight.bold,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});
