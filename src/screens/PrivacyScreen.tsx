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

export default function PrivacyScreen({ navigation }: any) {
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
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <Text style={styles.lastUpdated}>Last Updated: January 12, 2026</Text>

                    <Text style={styles.sectionTitle}>1. Information We Collect</Text>
                    <Text style={styles.paragraph}>
                        PlastiSort collects information you provide directly to us when you create an account,
                        including your name, email address, and profile information. We also collect data about
                        your plastic scanning activities, achievements, and app usage patterns.
                    </Text>

                    <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
                    <Text style={styles.paragraph}>
                        We use the information we collect to:
                    </Text>
                    <Text style={styles.bulletPoint}>• Provide and maintain our services</Text>
                    <Text style={styles.bulletPoint}>• Track your environmental impact and progress</Text>
                    <Text style={styles.bulletPoint}>• Send you notifications about achievements and updates</Text>
                    <Text style={styles.bulletPoint}>• Improve our AI plastic identification technology</Text>
                    <Text style={styles.bulletPoint}>• Personalize your experience</Text>

                    <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
                    <Text style={styles.paragraph}>
                        Your data is securely stored using Firebase services with industry-standard encryption.
                        We implement appropriate technical and organizational measures to protect your personal
                        information against unauthorized access, alteration, disclosure, or destruction.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Sharing of Information</Text>
                    <Text style={styles.paragraph}>
                        We do not sell your personal information. We may share anonymized, aggregated data for
                        research purposes to improve plastic recycling awareness. Your scan history and personal
                        achievements remain private unless you choose to share them.
                    </Text>

                    <Text style={styles.sectionTitle}>5. Your Rights</Text>
                    <Text style={styles.paragraph}>
                        You have the right to:
                    </Text>
                    <Text style={styles.bulletPoint}>• Access your personal data</Text>
                    <Text style={styles.bulletPoint}>• Request correction of inaccurate data</Text>
                    <Text style={styles.bulletPoint}>• Request deletion of your account and data</Text>
                    <Text style={styles.bulletPoint}>• Export your data</Text>
                    <Text style={styles.bulletPoint}>• Opt-out of notifications</Text>

                    <Text style={styles.sectionTitle}>6. Camera and Storage Permissions</Text>
                    <Text style={styles.paragraph}>
                        PlastiSort requires camera access to scan plastic items and storage access to save scan
                        results. These permissions are only used for their stated purposes and images are processed
                        locally on your device.
                    </Text>

                    <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
                    <Text style={styles.paragraph}>
                        Our service is not directed to children under 13. We do not knowingly collect personal
                        information from children under 13. If you are a parent or guardian and believe your
                        child has provided us with personal information, please contact us.
                    </Text>

                    <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
                    <Text style={styles.paragraph}>
                        We may update this Privacy Policy from time to time. We will notify you of any changes
                        by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                    </Text>

                    <Text style={styles.sectionTitle}>9. Contact Us</Text>
                    <Text style={styles.paragraph}>
                        If you have any questions about this Privacy Policy, please contact us at:
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
