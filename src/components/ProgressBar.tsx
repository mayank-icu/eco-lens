import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, typography, shadows } from '../constants/theme';

interface ProgressBarProps {
    progress: number; // 0-100
    label?: string;
    showPercentage?: boolean;
    color?: 'primary' | 'secondary' | 'accent' | 'purple';
    height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    label,
    showPercentage = true,
    color = 'primary',
    height = 16,
}) => {
    const widthAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(widthAnim, {
            toValue: progress,
            friction: 7,
            tension: 40,
            useNativeDriver: false,
        }).start();

        // Celebration pulse when reaching 100%
        if (progress >= 100) {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [progress]);

    const getGradient = () => {
        switch (color) {
            case 'primary': return colors.primaryGradient;
            case 'secondary': return colors.secondaryGradient;
            case 'accent': return colors.accentGradient;
            case 'purple': return colors.purpleGradient;
            default: return colors.primaryGradient;
        }
    };

    const width = widthAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Animated.View style={[styles.barContainer, { height, transform: [{ scale: scaleAnim }] }]}>
                <Animated.View style={[styles.fillContainer, { width }]}>
                    <LinearGradient
                        colors={getGradient()}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.fill}
                    />
                </Animated.View>
            </Animated.View>
            {showPercentage && (
                <Text style={styles.percentage}>{Math.round(progress)}%</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.bold,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    barContainer: {
        width: '100%',
        backgroundColor: colors.mediumGray,
        borderRadius: borderRadius.round,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: colors.darkGray,
    },
    fillContainer: {
        height: '100%',
    },
    fill: {
        flex: 1,
    },
    percentage: {
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'right',
        marginTop: spacing.xs,
    },
});
