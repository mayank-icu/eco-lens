import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedButton } from '../components/AnimatedButton';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface WelcomeScreenProps {
    navigation: any;
}

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
    const [loading, setLoading] = useState(false);
    const { loginAsGuest } = useAuth();

    const handleGuestSignIn = async () => {
        setLoading(true);
        try {
            await loginAsGuest();
        } catch (error) {
            console.error('Guest login failed:', error);
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />

            <View style={styles.content}>
                {/* Hero Section */}
                <View style={styles.hero}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Smart Recycling</Text>
                        <Text style={styles.subtitle}>for a Better Tomorrow</Text>
                    </View>

                    <Text style={styles.description}>
                        Identify plastics instantly with AI, track your environmental impact, and make recycling simple
                    </Text>
                </View>

                {/* Features Grid */}
                {width < 768 ? (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScroll}
                        style={styles.featuresScrollView}
                    >
                        <View style={styles.featureCard}>
                            <View style={styles.featureIcon}>
                                <MaterialCommunityIcons name="camera-outline" size={24} color="#7fb069" />
                            </View>
                            <Text style={styles.featureTitle}>Instant Scan</Text>
                            <Text style={styles.featureText}>AI-powered plastic identification</Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={styles.featureIcon}>
                                <MaterialCommunityIcons name="chart-line" size={24} color="#7fb069" />
                            </View>
                            <Text style={styles.featureTitle}>Track Impact</Text>
                            <Text style={styles.featureText}>Monitor your recycling progress</Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={styles.featureIcon}>
                                <MaterialCommunityIcons name="school-outline" size={24} color="#7fb069" />
                            </View>
                            <Text style={styles.featureTitle}>Learn More</Text>
                            <Text style={styles.featureText}>Discover recycling best practices</Text>
                        </View>
                    </ScrollView>
                ) : (
                    <View style={styles.featuresContainer}>
                        <View style={styles.featureCard}>
                            <View style={styles.featureIcon}>
                                <MaterialCommunityIcons name="camera-outline" size={24} color="#7fb069" />
                            </View>
                            <Text style={styles.featureTitle}>Instant Scan</Text>
                            <Text style={styles.featureText}>AI-powered plastic identification</Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={styles.featureIcon}>
                                <MaterialCommunityIcons name="chart-line" size={24} color="#7fb069" />
                            </View>
                            <Text style={styles.featureTitle}>Track Impact</Text>
                            <Text style={styles.featureText}>Monitor your recycling progress</Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={styles.featureIcon}>
                                <MaterialCommunityIcons name="school-outline" size={24} color="#7fb069" />
                            </View>
                            <Text style={styles.featureTitle}>Learn More</Text>
                            <Text style={styles.featureText}>Discover recycling best practices</Text>
                        </View>
                    </View>
                )}

                {/* Bottom Actions */}
                <View style={styles.actions}>
                    <AnimatedButton
                        title="Get Started"
                        onPress={() => navigation.navigate('SignUp')}
                        variant="primary"
                        size="medium"
                    />

                    <AnimatedButton
                        title="I Have an Account"
                        onPress={() => navigation.navigate('Login')}
                        variant="outline"
                        size="medium"
                    />

                    <TouchableOpacity
                        style={styles.guestButton}
                        onPress={handleGuestSignIn}
                        disabled={loading}
                        activeOpacity={0.7}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.textSecondary} size="small" />
                        ) : (
                            <Text style={styles.guestButtonText}>Continue as Guest</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e2d1',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xl,
    },
    hero: {
        alignItems: 'center',
        paddingTop: spacing.xxl,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 32,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 32,
        fontWeight: typography.fontWeight.bold,
        color: '#7fb069',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    description: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: typography.fontWeight.medium,
        paddingHorizontal: spacing.md,
        marginTop: spacing.md,
    },
    featuresScrollView: {
        flexGrow: 0,
    },
    horizontalScroll: {
        paddingHorizontal: spacing.xs,
        gap: spacing.sm,
    },
    featuresContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingHorizontal: spacing.xs,
    },
    featureCard: {
        width: width < 768 ? width * 0.7 : undefined,
        flex: width < 768 ? undefined : 1,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(127, 176, 105, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    featureTitle: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: 4,
        textAlign: 'center',
    },
    featureText: {
        fontSize: 11,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 14,
    },
    actions: {
        gap: spacing.md,
        paddingTop: spacing.md,
    },
    guestButton: {
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    guestButtonText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
    },
});