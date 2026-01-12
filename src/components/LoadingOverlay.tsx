import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { colors, typography, spacing } from '../constants/theme';

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
}

export default function LoadingOverlay({ visible, message = 'Loading...' }: LoadingOverlayProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            if (animationRef.current) {
                animationRef.current.play();
            }
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, fadeAnim]);

    if (!visible) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.overlay,
                {
                    opacity: fadeAnim,
                },
            ]}
        >
            <LinearGradient
                colors={[colors.primary, colors.primaryLight, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    {/* Lottie Animation */}
                    <View style={styles.animationContainer}>
                        <LottieView
                            ref={animationRef}
                            source={require('../assets/animations/splash.json')}
                            autoPlay
                            loop
                            style={styles.lottieAnimation}
                        />
                    </View>

                    {/* App Name */}
                    <Text style={styles.appName}>Eco Lens</Text>

                    {/* Loading Message */}
                    <View style={styles.messageContainer}>
                        <ActivityIndicator size="small" color={colors.white} />
                        <Text style={styles.message}>{message}</Text>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    animationContainer: {
        width: 200,
        height: 200,
        marginBottom: spacing.lg,
    },
    lottieAnimation: {
        width: '100%',
        height: '100%',
    },
    appName: {
        fontSize: 36,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: spacing.xl,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    message: {
        fontSize: typography.fontSize.body,
        color: colors.accentLight,
        fontWeight: typography.fontWeight.medium,
    },
});
