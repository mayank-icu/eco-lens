import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, borderRadius, shadows, iconSizes } from '../constants/theme';

interface WelcomeScreenProps {
    navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
    const [loading, setLoading] = useState(false);
    const { loginAsGuest } = useAuth();

    const handleGuestSignIn = async () => {
        setLoading(true);
        try {
            await loginAsGuest();
            // Navigation will happen automatically via AppNavigator when user state changes
        } catch (error) {
            console.error('Guest login failed:', error);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Gradient */}
            <View style={StyleSheet.absoluteFillObject}>
                <LinearGradient
                    colors={[colors.primaryDark, colors.primary, colors.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                />

                {/* Decorative circles */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
            </View>

            <View style={styles.content}>
                {/* Logo and Title */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons name="recycle" size={iconSizes.xxl * 1.5} color={colors.accentLight} />
                        <View style={styles.sparkleContainer}>
                            <Ionicons name="sparkles" size={iconSizes.md} color={colors.accent} />
                        </View>
                    </View>
                    <Text style={styles.title}>PlastiSort AI</Text>
                    <Text style={styles.subtitle}>Scan. Sort. Save the Planet.</Text>
                    <View style={styles.tagline}>
                        <Text style={styles.taglineText}>Join the recycling revolution</Text>
                    </View>
                </View>

                {/* Features */}
                <View style={styles.features}>
                    <FeatureCard
                        icon={<MaterialCommunityIcons name="recycle" size={iconSizes.lg} color={colors.secondaryLight} />}
                        title="Instant Scanning"
                        description="AI-powered plastic identification"
                    />
                    <FeatureCard
                        icon={<Feather name="trending-up" size={iconSizes.lg} color={colors.accent} />}
                        title="Track Impact"
                        description="Visualize your environmental contribution"
                    />
                    <FeatureCard
                        icon={<Ionicons name="trophy" size={iconSizes.lg} color={colors.accentLight} />}
                        title="Compete & Win"
                        description="Global leaderboards & achievements"
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={() => navigation.navigate('SignUp')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[colors.secondary, colors.secondaryLight]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.primaryButtonText}>Get Started</Text>
                            <Feather name="arrow-right" size={iconSizes.sm} color={colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.8}
                    >
                        <Feather name="user" size={iconSizes.sm} color={colors.white} />
                        <Text style={styles.secondaryButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.guestButton}
                        onPress={handleGuestSignIn}
                        disabled={loading}
                        activeOpacity={0.7}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.accentLight} size="small" />
                        ) : (
                            <Text style={styles.guestButtonText}>Continue as Guest →</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <View style={styles.featureCard}>
        <View style={styles.featureIconContainer}>
            {icon}
        </View>
        <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    decorativeCircle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(116, 198, 157, 0.1)',
        top: -100,
        right: -100,
    },
    decorativeCircle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(149, 213, 178, 0.08)',
        bottom: 100,
        left: -50,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxxl,
        paddingBottom: spacing.xl,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    logoContainer: {
        position: 'relative',
        marginBottom: spacing.lg,
    },
    sparkleContainer: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.round,
        padding: spacing.xxs,
    },
    title: {
        fontSize: typography.fontSize.display,
        fontWeight: typography.fontWeight.extraBold,
        color: colors.white,
        marginBottom: spacing.xs,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: typography.fontSize.bodyLarge,
        color: colors.accentLight,
        textAlign: 'center',
        fontWeight: typography.fontWeight.medium,
    },
    tagline: {
        marginTop: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        backgroundColor: 'rgba(116, 198, 157, 0.15)',
        borderRadius: borderRadius.round,
        borderWidth: 1,
        borderColor: 'rgba(116, 198, 157, 0.3)',
    },
    taglineText: {
        color: colors.accentLight,
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.semiBold,
    },
    features: {
        gap: spacing.md,
        marginVertical: spacing.xl,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    featureIconContainer: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
        marginBottom: spacing.xxs,
    },
    featureDescription: {
        fontSize: typography.fontSize.caption,
        color: colors.accentLight,
        lineHeight: typography.lineHeight.normal * typography.fontSize.caption,
    },
    actions: {
        gap: spacing.md,
    },
    button: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    buttonGradient: {
        flexDirection: 'row',
        paddingVertical: spacing.md + spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    primaryButton: {
        ...shadows.lg,
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.bodyLarge,
        fontWeight: typography.fontWeight.bold,
        letterSpacing: 0.5,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        paddingVertical: spacing.md + spacing.xs,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    secondaryButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.bodyLarge,
        fontWeight: typography.fontWeight.semiBold,
    },
    guestButton: {
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    guestButtonText: {
        color: colors.accentLight,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.medium,
    },
});
