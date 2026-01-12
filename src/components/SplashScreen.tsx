import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { colors, typography, spacing } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Play Lottie animation
        if (animationRef.current) {
            animationRef.current.play();
        }

        // Auto-finish after 3 seconds
        const timer = setTimeout(() => {
            if (onFinish) {
                onFinish();
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [fadeAnim, scaleAnim, onFinish]);

    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
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
                    <View style={styles.textContainer}>
                        <Text style={styles.appName}>Eco Lens</Text>
                        <View style={styles.taglineContainer}>
                            <View style={styles.dot} />
                            <Text style={styles.tagline}>Smart Plastic Sorting</Text>
                            <View style={styles.dot} />
                        </View>
                    </View>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
    },
    background: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    animationContainer: {
        width: 300,
        height: 300,
        marginBottom: spacing.md,
    },
    lottieAnimation: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
    },
    appName: {
        fontSize: 42,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: spacing.md,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    taglineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    tagline: {
        fontSize: typography.fontSize.body,
        color: colors.primary, // Changed to match appName
        fontWeight: typography.fontWeight.medium,
        letterSpacing: 1,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.accent,
    },
});
