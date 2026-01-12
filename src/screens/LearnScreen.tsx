import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    StatusBar,
    Dimensions,
    SafeAreaView,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { featuredLessons, exploreTopics, plasticTypes, trendingArticles, Lesson } from '../data/learningContent';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const TOPIC_CARD_WIDTH = (width - (spacing.lg * 2) - spacing.sm) / 2;

export default function LearnScreen({ navigation }: any) {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter content based on search query
    const filteredLessons = useMemo(() => {
        if (!searchQuery) return featuredLessons;
        return featuredLessons.filter(l =>
            l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const filteredTopics = useMemo(() => {
        if (!searchQuery) return exploreTopics;
        return exploreTopics.filter(t =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const filteredPlastics = useMemo(() => {
        if (!searchQuery) return plasticTypes;
        return plasticTypes.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const filteredArticles = useMemo(() => {
        if (!searchQuery) return trendingArticles;
        return trendingArticles.filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // Organize plastics into rows of 2
    const plasticRows = useMemo(() => {
        const rows = [];
        for (let i = 0; i < filteredPlastics.length; i += 2) {
            rows.push(filteredPlastics.slice(i, i + 2));
        }
        return rows;
    }, [filteredPlastics]);

    const getProgress = (lessonId: string) => {
        if (user?.learningProgress?.[lessonId] === 'completed') return 1;
        return 0;
    };

    const handleTopicPress = (topic: any) => {
        // Create a topic lesson object
        const topicLesson = {
            id: topic.id,
            title: topic.title,
            duration: '5 min',
            icon: topic.icon,
            color: topic.color,
            category: 'Topic' as const,
            content: `Learn more about ${topic.title}. This comprehensive guide covers everything you need to know about this important recycling topic.`,
            sections: [
                {
                    title: 'Overview',
                    content: `${topic.title} is an essential aspect of modern recycling practices. Understanding this topic will help you make better environmental decisions.`
                },
                {
                    title: 'Key Points',
                    content: 'By learning about this topic, you\'ll be able to identify recyclable materials more accurately, reduce contamination in recycling streams, and contribute to a more sustainable future.'
                },
                {
                    title: 'Taking Action',
                    content: 'Apply what you learn here in your daily life. Small changes in how we handle recyclables can make a significant environmental impact.'
                }
            ]
        };
        navigation.navigate('LessonDetail', { lesson: topicLesson });
    };

    const handlePlasticPress = (plastic: any) => {
        // Create a plastic guide lesson object
        const plasticLesson = {
            id: plastic.id,
            title: `${plastic.name} (Type ${plastic.number})`,
            duration: '4 min',
            icon: plastic.recyclable ? 'recycle' : 'delete-outline',
            color: plastic.recyclable ? '#7fb069' : '#EF4444',
            category: 'Guide' as const,
            content: plastic.info,
            sections: [
                {
                    title: 'What is it?',
                    content: plastic.description
                },
                {
                    title: 'Common Examples',
                    content: plastic.examples
                },
                {
                    title: 'Recycling Status',
                    content: plastic.recyclable
                        ? `${plastic.name} (Type ${plastic.number}) is recyclable in most areas. However, check with your local recycling facility for specific guidelines as acceptance can vary by location.`
                        : `${plastic.name} (Type ${plastic.number}) is generally not accepted in curbside recycling programs. Consider reducing usage and looking for alternatives.`
                },
                {
                    title: 'Environmental Impact',
                    content: plastic.recyclable
                        ? 'Recycling this plastic helps reduce landfill waste and conserves natural resources. Make sure to rinse containers before recycling.'
                        : 'This plastic type is difficult to recycle due to its composition. Focus on reducing consumption and finding reusable alternatives.'
                }
            ]
        };
        navigation.navigate('LessonDetail', { lesson: plasticLesson });
    };

    const renderLessonCard = ({ item }: { item: Lesson }) => {
        const progress = getProgress(item.id);

        return (
            <TouchableOpacity
                style={styles.lessonCard}
                onPress={() => navigation.navigate('LessonDetail', { lesson: item })}
                activeOpacity={0.85}
            >
                <LinearGradient
                    colors={[item.color, `${item.color}DD`]}
                    style={styles.lessonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Background Icon */}
                    <View style={styles.lessonIconBackground}>
                        <MaterialCommunityIcons
                            name={item.icon as any}
                            size={110}
                            color="#FFFFFF"
                        />
                    </View>

                    <View style={styles.lessonContent}>
                        {/* Header */}
                        <View style={styles.lessonHeader}>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.lessonCategory}>{item.category}</Text>
                            </View>
                            <View style={styles.durationBadge}>
                                <Feather name="clock" size={10} color="#FFFFFF" />
                                <Text style={styles.durationText}>{item.duration}</Text>
                            </View>
                        </View>

                        {/* Title */}
                        <Text style={styles.lessonTitle} numberOfLines={2}>
                            {item.title}
                        </Text>

                        {/* Progress Section */}
                        <View style={styles.progressSection}>
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${progress * 100}%` }
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>
                                {progress > 0 ? `${Math.round(progress * 100)}% Complete` : 'Start Learning'}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />

            {/* Header with Search */}
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View style={styles.searchContainer}>
                        <Feather
                            name="search"
                            size={20}
                            color={colors.textSecondary}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search lessons, plastics..."
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery('')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Featured Lessons */}
                {filteredLessons.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Featured Lessons
                        </Text>
                        <FlatList
                            data={filteredLessons}
                            renderItem={renderLessonCard}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                            snapToInterval={CARD_WIDTH + spacing.md}
                            decelerationRate="fast"
                        />
                    </View>
                )}

                {/* Daily Tip */}
                {!searchQuery && (
                    <View style={styles.section}>
                        <View style={styles.dailyTipCard}>
                            <View style={styles.bulbIconContainer}>
                                <Ionicons name="bulb-outline" size={24} color="#FFC107" />
                            </View>
                            <View style={styles.dailyTipContent}>
                                <Text style={styles.dailyTipTitle}>
                                    Daily Tip
                                </Text>
                                <Text style={styles.dailyTipText}>
                                    Rinse your recyclables! Food residue can contaminate an entire batch of recycling.
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Browse Topics */}
                {filteredTopics.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Browse Topics
                        </Text>
                        <View style={styles.topicsGrid}>
                            {filteredTopics.map(topic => (
                                <TouchableOpacity
                                    key={topic.id}
                                    style={styles.topicCard}
                                    onPress={() => handleTopicPress(topic)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.topicIcon, { backgroundColor: `${topic.color}15` }]}>
                                        <MaterialCommunityIcons
                                            name={topic.icon}
                                            size={22}
                                            color={topic.color}
                                        />
                                    </View>
                                    <Text style={styles.topicName} numberOfLines={2}>
                                        {topic.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Plastics Guide */}
                {filteredPlastics.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Plastics Guide
                        </Text>
                        <View style={styles.plasticsGrid}>
                            {plasticRows.map((row, rowIndex) => (
                                <View key={rowIndex} style={styles.plasticRow}>
                                    {row.map(plastic => (
                                        <TouchableOpacity
                                            key={plastic.id}
                                            style={styles.plasticCard}
                                            onPress={() => handlePlasticPress(plastic)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[
                                                styles.plasticIcon,
                                                { backgroundColor: plastic.recyclable ? 'rgba(127, 176, 105, 0.15)' : 'rgba(239, 68, 68, 0.15)' }
                                            ]}>
                                                <MaterialCommunityIcons
                                                    name={plastic.recyclable ? 'recycle' : 'delete-outline'}
                                                    size={28}
                                                    color={plastic.recyclable ? '#7fb069' : '#EF4444'}
                                                />
                                                <View style={[
                                                    styles.plasticCodeBadge,
                                                    { backgroundColor: plastic.recyclable ? '#7fb069' : '#EF4444' }
                                                ]}>
                                                    <Text style={styles.plasticCodeText}>{plastic.number}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.plasticContent}>
                                                <Text style={styles.plasticName}>
                                                    {plastic.name}
                                                </Text>
                                                <Text style={styles.plasticDescription} numberOfLines={2}>
                                                    {plastic.description}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Latest Articles */}
                {filteredArticles.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Latest Articles
                        </Text>
                        {filteredArticles.map(article => (
                            <TouchableOpacity
                                key={article.id}
                                style={styles.articleCard}
                                onPress={() => navigation.navigate('LessonDetail', { lesson: article })}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.articleIconContainer,
                                    { backgroundColor: `${article.color}15` }
                                ]}>
                                    <MaterialCommunityIcons
                                        name={article.icon as any}
                                        size={26}
                                        color={article.color}
                                    />
                                </View>
                                <View style={styles.articleContent}>
                                    <View style={styles.articleHeader}>
                                        <Text style={[styles.articleCategory, { color: article.color }]}>
                                            {article.category}
                                        </Text>
                                        <Text style={styles.articleReadTime}>
                                            {article.duration}
                                        </Text>
                                    </View>
                                    <Text style={styles.articleTitle} numberOfLines={2}>
                                        {article.title}
                                    </Text>
                                </View>
                                <View style={styles.articleArrow}>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color={colors.textSecondary}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Empty State */}
                {filteredLessons.length === 0 &&
                    filteredTopics.length === 0 &&
                    filteredPlastics.length === 0 &&
                    filteredArticles.length === 0 && (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons
                                name="magnify"
                                size={64}
                                color={colors.textSecondary}
                            />
                            <Text style={styles.emptyStateText}>
                                No results found for "{searchQuery}"
                            </Text>
                            <Text style={styles.emptyStateSubtext}>
                                Try searching with different keywords
                            </Text>
                        </View>
                    )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e2d1',
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#e8e2d1',
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        height: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: typography.fontSize.body,
        color: colors.textPrimary,
        height: '100%',
        paddingVertical: 0,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    horizontalList: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },

    // Daily Tip
    dailyTipCard: {
        flexDirection: 'row',
        marginHorizontal: spacing.lg,
        padding: spacing.lg,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'flex-start',
    },
    bulbIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF3CD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    dailyTipContent: {
        flex: 1,
        paddingTop: 2,
    },
    dailyTipTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    dailyTipText: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        lineHeight: 19,
    },

    // Featured Lessons
    lessonCard: {
        width: CARD_WIDTH,
        height: 180,
        borderRadius: borderRadius.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    lessonGradient: {
        flex: 1,
        padding: spacing.lg,
        position: 'relative',
        justifyContent: 'space-between',
    },
    lessonIconBackground: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        opacity: 0.15,
    },
    lessonContent: {
        flex: 1,
        zIndex: 2,
        justifyContent: 'space-between',
    },
    lessonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    lessonCategory: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.round,
        gap: 4,
    },
    durationText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: typography.fontWeight.semiBold,
    },
    lessonTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: '#FFFFFF',
        lineHeight: 20,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    progressSection: {
        marginTop: 'auto',
    },
    progressBar: {
        height: 5,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.95)',
        fontWeight: typography.fontWeight.semiBold,
    },

    // Topics
    topicsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    topicCard: {
        width: TOPIC_CARD_WIDTH,
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        minHeight: 72,
    },
    topicIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    topicName: {
        flex: 1,
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        lineHeight: 18,
    },

    // Plastics
    plasticsGrid: {
        paddingHorizontal: spacing.lg,
    },
    plasticRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    plasticCard: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        minHeight: 165,
        justifyContent: 'center',
    },
    plasticIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
        position: 'relative',
    },
    plasticCodeBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    plasticCodeText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    plasticContent: {
        alignItems: 'center',
    },
    plasticName: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: 4,
        textAlign: 'center',
    },
    plasticDescription: {
        fontSize: 11,
        color: colors.textSecondary,
        lineHeight: 14,
        textAlign: 'center',
    },

    // Articles
    articleCard: {
        flexDirection: 'row',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.sm,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        padding: spacing.md,
    },
    articleIconContainer: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    articleContent: {
        flex: 1,
        justifyContent: 'center',
    },
    articleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    articleCategory: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    articleReadTime: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    articleTitle: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        lineHeight: 18,
    },
    articleArrow: {
        paddingLeft: spacing.sm,
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxl * 2,
        paddingHorizontal: spacing.xl,
    },
    emptyStateText: {
        marginTop: spacing.md,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        marginTop: spacing.xs,
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});