import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Linking,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function HelpScreen({ navigation }: any) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How do I scan plastic items?",
            answer: "Tap the Scan button on the home screen, point your camera at the plastic item, and take a photo. Our AI will identify the plastic type and tell you how to recycle it."
        },
        {
            question: "What plastic types can the app identify?",
            answer: "PlastiSort can identify all 7 types of plastics (PET, HDPE, PVC, LDPE, PP, PS, and Other) commonly found in household items."
        },
        {
            question: "How do I earn points?",
            answer: "You earn points by scanning plastic items, completing quizzes, and maintaining daily streaks. Points help you level up and unlock achievements."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we take privacy seriously. Your data is encrypted and stored securely. We never share your personal information with third parties."
        },
        {
            question: "Can I use the app offline?",
            answer: "The scanning feature requires an internet connection to analyze images. However, you can view your scan history and learning materials offline."
        },
        {
            question: "How accurate is the AI detection?",
            answer: "Our AI has been trained on thousands of plastic items and achieves over 95% accuracy. For best results, ensure good lighting and clear photos."
        },
        {
            question: "What should I do if a scan is incorrect?",
            answer: "You can report incorrect scans through the scan results screen. This helps us improve our AI model for future predictions."
        },
    ];

    const contactOptions = [
        {
            icon: 'mail',
            title: 'Email Support',
            subtitle: 'ecomentor.live@gmail.com',
            action: () => Linking.openURL('mailto:ecomentor.live@gmail.com'),
        },
        {
            icon: 'message-circle',
            title: 'Live Chat',
            subtitle: 'Chat with our team',
            action: () => { },
        },
        {
            icon: 'book-open',
            title: 'Documentation',
            subtitle: 'View full guides',
            action: () => { },
        },
    ];

    const toggleFAQ = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

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
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Quick Help Card */}
                <View style={styles.quickHelpCard}>
                    <View style={styles.quickHelpIcon}>
                        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#7fb069" />
                    </View>
                    <View style={styles.quickHelpContent}>
                        <Text style={styles.quickHelpTitle}>Need Quick Help?</Text>
                        <Text style={styles.quickHelpText}>
                            Browse FAQs below
                        </Text>
                    </View>
                </View>


                {/* FAQs */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                    {faqs.map((faq, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.faqCard}
                            onPress={() => toggleFAQ(index)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.questionContainer}>
                                <View style={styles.questionIconContainer}>
                                    <Feather
                                        name="help-circle"
                                        size={18}
                                        color="#7fb069"
                                    />
                                </View>
                                <Text style={styles.question}>{faq.question}</Text>
                                <Ionicons
                                    name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </View>
                            {expandedIndex === index && (
                                <View style={styles.answerContainer}>
                                    <Text style={styles.answer}>{faq.answer}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
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
        letterSpacing: 0.3,
    },
    backButton: {
        padding: spacing.xs,
    },
    content: {
        flex: 1,
    },

    // Quick Help Card
    quickHelpCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    quickHelpIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(127, 176, 105, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    quickHelpContent: {
        flex: 1,
    },
    quickHelpTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    quickHelpText: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        lineHeight: 18,
    },

    // Contact Options
    section: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        letterSpacing: 0.3,
    },
    contactGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    contactCard: {
        flex: 1,
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        minHeight: 110,
        justifyContent: 'center',
    },
    contactIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(127, 176, 105, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    contactTitle: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 4,
    },
    contactSubtitle: {
        fontSize: 11,
        color: colors.textSecondary,
        textAlign: 'center',
    },

    // FAQs
    faqCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    questionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    questionIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(127, 176, 105, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    question: {
        flex: 1,
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        lineHeight: 20,
    },
    answerContainer: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    answer: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        lineHeight: 20,
    },

    // Resources
    resourceCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginBottom: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    resourceIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    resourceContent: {
        flex: 1,
    },
    resourceTitle: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    resourceSubtitle: {
        fontSize: 11,
        color: colors.textSecondary,
    },

    bottomSpacer: {
        height: 80,
    },
});