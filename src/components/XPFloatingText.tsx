import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors, typography } from '../constants/theme';

interface XPFloatingTextProps {
    value: number;
    visible: boolean;
    onComplete?: () => void;
}

export const XPFloatingText: React.FC<XPFloatingTextProps> = ({
    value,
    visible,
    onComplete,
}) => {
    const translateYAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        if (visible) {
            // Reset position
            translateYAnim.setValue(0);
            opacityAnim.setValue(0);
            scaleAnim.setValue(0.5);

            // Animate up and fade
            Animated.parallel([
                Animated.timing(translateYAnim, {
                    toValue: -80,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.delay(800),
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                if (onComplete) onComplete();
            });
        }
    }, [visible, value]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        { translateY: translateYAnim },
                        { scale: scaleAnim },
                    ],
                    opacity: opacityAnim,
                },
            ]}
        >
            <Text style={styles.text}>+{value} XP</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: colors.primaryDark,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    text: {
        fontSize: typography.fontSize.bodyLarge,
        fontWeight: typography.fontWeight.black,
        color: colors.white,
        letterSpacing: 0.5,
    },
});
