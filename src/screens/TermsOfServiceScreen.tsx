import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, borderRadius, colors } from '../constants/theme';

export default function TermsOfServiceScreen({ navigation }: any) {
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
                <Text style={styles.headerTitle}>Terms of Service</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <Text style={styles.lastUpdated}>Last Updated: January 12, 2026</Text>

                    <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                    <Text style={styles.paragraph}>
                        By accessing and using Eco Lens, you accept and agree to be bound by the terms and
                        provisions of this agreement. If you do not agree to these terms, please do not use
                        our service.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Description of Service</Text>
                    <Text style={styles.paragraph}>
                        Eco Lens is a mobile application that helps users identify different types of plastic
                        materials using AI-powered image recognition. The app provides recycling information,
                        tracks environmental impact, and gamifies the recycling process through achievements
                        and leaderboards.
                    </Text>

                    <Text style={styles.sectionTitle}>3. User Accounts</Text>
                    <Text style={styles.paragraph}>
                        To use certain features of Eco Lens, you must create an account. You are responsible for:
                    </Text>
                    <Text style={styles.bulletPoint}>• Maintaining the confidentiality of your account credentials</Text>
                    <Text style={styles.bulletPoint}>• All activities that occur under your account</Text>
                    <Text style={styles.bulletPoint}>• Notifying us immediately of any unauthorized use</Text>
                    <Text style={styles.bulletPoint}>• Providing accurate and complete information</Text>

                    <Text style={styles.sectionTitle}>4. Acceptable Use</Text>
                    <Text style={styles.paragraph}>
                        You agree not to:
                    </Text>
                    <Text style={styles.bulletPoint}>• Use the service for any illegal purpose</Text>
                    <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to our systems</Text>
                    <Text style={styles.bulletPoint}>• Interfere with or disrupt the service</Text>
                    <Text style={styles.bulletPoint}>• Upload malicious code or viruses</Text>
                    <Text style={styles.bulletPoint}>• Harass or harm other users</Text>
                    <Text style={styles.bulletPoint}>• Manipulate leaderboards or achievements</Text>

                    <Text style={styles.sectionTitle}>5. AI Accuracy Disclaimer</Text>
                    <Text style={styles.paragraph}>
                        While we strive for accuracy, Eco Lens's AI-powered plastic identification is provided
                        "as is" and may not always be 100% accurate. Users should verify recycling information
                        with local recycling guidelines. We are not responsible for any consequences resulting
                        from reliance on our AI predictions.
                    </Text>

                    <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
                    <Text style={styles.paragraph}>
                        All content, features, and functionality of Eco Lens, including but not limited to
                        text, graphics, logos, icons, images, and software, are the exclusive property of
                        Eco Lens and are protected by copyright, trademark, and other intellectual property laws.
                    </Text>

                    <Text style={styles.sectionTitle}>7. User-Generated Content</Text>
                    <Text style={styles.paragraph}>
                        By sharing achievements or scan results, you grant Eco Lens a non-exclusive,
                        royalty-free license to use, display, and distribute this content for promotional
                        purposes. You retain ownership of your content.
                    </Text>

                    <Text style={styles.sectionTitle}>8. Termination</Text>
                    <Text style={styles.paragraph}>
                        We reserve the right to suspend or terminate your account at any time for violations
                        of these terms or for any other reason at our sole discretion. You may also delete
                        your account at any time through the app settings.
                    </Text>

                    <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
                    <Text style={styles.paragraph}>
                        Eco Lens shall not be liable for any indirect, incidental, special, consequential,
                        or punitive damages resulting from your use or inability to use the service.
                    </Text>

                    <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
                    <Text style={styles.paragraph}>
                        We reserve the right to modify these terms at any time. We will notify users of any
                        material changes. Your continued use of Eco Lens after such modifications constitutes
                        acceptance of the updated terms.
                    </Text>

                    <Text style={styles.sectionTitle}>11. Governing Law</Text>
                    <Text style={styles.paragraph}>
                        These terms shall be governed by and construed in accordance with applicable laws,
                        without regard to its conflict of law provisions.
                    </Text>

                    <Text style={styles.sectionTitle}>12. Contact Information</Text>
                    <Text style={styles.paragraph}>
                        For questions about these Terms of Service, please contact us at:
                    </Text>
                    <Text style={styles.contactText}>ecomentor.live@gmail.com</Text>
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

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
    card: {
        backgroundColor: colors.white,
        margin: spacing.lg,
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    lastUpdated: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        fontStyle: 'italic',
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.fontSize.bodyLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    paragraph: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.body * 1.6,
        marginBottom: spacing.md,
    },
    bulletPoint: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.body * 1.6,
        marginBottom: spacing.xs,
        paddingLeft: spacing.md,
    },
    contactText: {
        fontSize: typography.fontSize.body,
        color: '#7fb069',
        fontWeight: typography.fontWeight.semiBold,
        marginTop: spacing.xs,
    },
    bottomSpacer: {
        height: spacing.xxxl,
    },
});
