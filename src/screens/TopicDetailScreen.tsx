import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function TopicDetailScreen({ route, navigation }: any) {
    const { topic } = route.params;

    const articles = [
        { id: '1', title: 'Introduction to ' + topic.title, readTime: '3 min' },
        { id: '2', title: 'Advanced ' + topic.title + ' Concepts', readTime: '5 min' },
        { id: '3', title: topic.title + ' Best Practices', readTime: '4 min' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Topic</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.iconContainer, { backgroundColor: topic.color }]}>
                    <MaterialCommunityIcons name={topic.icon} size={56} color="#7fb069" />
                </View>

                <Text style={styles.title}>{topic.title}</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.text}>
                        Explore comprehensive resources about {topic.title.toLowerCase()}. Learn about its impact,
                        importance, and how you can make a difference through your daily actions.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Related Articles</Text>
                    {articles.map((article) => (
                        <TouchableOpacity key={article.id} style={styles.articleCard}>
                            <View style={styles.articleContent}>
                                <Text style={styles.articleTitle}>{article.title}</Text>
                                <View style={styles.articleMeta}>
                                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                                    <Text style={styles.articleReadTime}>{article.readTime}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: spacing.xxxl }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: '#e8e2d1',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.round,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    text: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.body * 1.6,
    },
    articleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
    },
    articleContent: {
        flex: 1,
    },
    articleTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.xxs,
    },
    articleMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xxs,
    },
    articleReadTime: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
    },
});
