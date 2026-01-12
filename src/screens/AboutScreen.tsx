import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function AboutScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Eco Lens</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* App Info */}
                <View style={styles.section}>
                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons name="recycle" size={64} color="#7fb069" />
                    </View>

                    <Text style={styles.appName}>Eco Lens</Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                    <Text style={styles.tagline}>AI-Powered Plastic Sorting Assistant</Text>
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About the App</Text>
                    <View style={styles.card}>
                        <Text style={styles.description}>
                            Eco Lens helps you identify different types of plastics and learn how to recycle them properly.
                            Using advanced AI technology, we make recycling easier and more accessible for everyone.
                        </Text>
                        <Text style={styles.description}>
                            Our mission is to reduce plastic waste and promote sustainable living through education and technology.
                        </Text>
                    </View>
                </View>

                {/* Features */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Features</Text>
                    <View style={styles.card}>
                        <FeatureItem
                            icon="camera"
                            title="AI Scanning"
                            description="Instantly identify plastic types with your camera"
                        />
                        <FeatureItem
                            icon="school"
                            title="Learn & Grow"
                            description="Access educational content about recycling"
                        />
                        <FeatureItem
                            icon="trophy"
                            title="Gamification"
                            description="Earn points and achievements for recycling"
                        />
                        <FeatureItem
                            icon="analytics"
                            title="Track Impact"
                            description="Monitor your environmental contribution"
                        />
                    </View>
                </View>

                {/* Contact */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact</Text>
                    <View style={styles.card}>
                        <Text style={styles.contactText}>
                            For support or feedback, please contact us at:
                        </Text>
                        <Text style={styles.email}>ecomentor.live@gmail.com</Text>
                    </View>
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

const FeatureItem = ({ icon, title, description }: any) => (
    <View style={styles.featureItem}>
        <View style={styles.featureIcon}>
            <Ionicons name={icon} size={24} color="#7fb069" />
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
        backgroundColor: '#e8e2d1',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: '#e8e2d1',
    },
    headerTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: spacing.lg,
    },
    appName: {
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    version: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    tagline: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
    },
    description: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.body * 1.6,
        marginBottom: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    featureIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: '#7fb06915',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.xxs,
    },
    featureDescription: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.small * 1.5,
    },
    contactText: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    email: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: '#7fb069',
    },
    bottomSpacer: {
        height: spacing.xxxl,
    },
});
