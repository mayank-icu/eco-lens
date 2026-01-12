import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Platform,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedButton } from '../components/AnimatedButton';
import { useToast } from '../contexts/ToastContext';
import { AppModal } from '../components/AppModal';

const { width } = Dimensions.get('window');

export default function LessonDetailScreen({ route, navigation }: any) {
    const { lesson, quizResult } = route.params;
    const { user, updateUser } = useAuth();
    const { showToast } = useToast();
    const [showFailModal, setShowFailModal] = useState(false);

    // Check if lesson is already completed
    const isCompleted = user?.learningProgress?.[lesson.id] === 'completed';

    // Handle Quiz Result
    useEffect(() => {
        if (quizResult && !isCompleted) {
            if (quizResult.passed) {
                handleComplete(quizResult.score);
            } else {
                setShowFailModal(true);
            }
        }
    }, [quizResult]);

    const handleComplete = async (score?: number) => {
        if (isCompleted) return;

        try {
            const newProgress = {
                ...user?.learningProgress,
                [lesson.id]: 'completed'
            };

            // Calculate points: 10 points for passing
            const pointsAwarded = 10;
            const newTotalPoints = (user?.totalPoints || 0) + pointsAwarded;

            await updateUser({
                learningProgress: newProgress,
                totalPoints: newTotalPoints
            });

            showToast(`Lesson Completed! +${pointsAwarded} Points`, 'success');
            navigation.goBack();
        } catch (error) {
            console.error('Error completing lesson:', error);
            showToast('Failed to save progress', 'error');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ScrollView
                style={styles.scrollView}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <LinearGradient
                        colors={[lesson.color, `${lesson.color}DD`]}
                        style={styles.heroGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <SafeAreaView style={styles.safeArea}>
                            <View style={styles.header}>
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    style={styles.backButton}
                                >
                                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                                </TouchableOpacity>
                                <View style={styles.headerActions}>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Ionicons name="bookmark-outline" size={24} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.heroContent}>
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryText}>{lesson.category}</Text>
                                </View>
                                <Text style={styles.title}>{lesson.title}</Text>
                                <View style={styles.metaContainer}>
                                    <View style={styles.metaItem}>
                                        <Feather name="clock" size={14} color="rgba(255,255,255,0.9)" />
                                        <Text style={styles.metaText}>{lesson.duration}</Text>
                                    </View>
                                    <View style={styles.metaDivider} />
                                    <View style={styles.metaItem}>
                                        <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                                        <Text style={styles.metaText}>+10 Points</Text>
                                    </View>
                                </View>
                            </View>
                        </SafeAreaView>

                        {/* Background Icon */}
                        <View style={styles.heroIconBackground}>
                            <MaterialCommunityIcons
                                name={lesson.icon}
                                size={180}
                                color="rgba(255,255,255,0.15)"
                            />
                        </View>
                    </LinearGradient>
                </View>

                {/* Content Container */}
                <View style={styles.contentContainer}>
                    {/* Overview */}
                    <View style={styles.section}>
                        <Text style={styles.sectionText}>{lesson.content}</Text>
                    </View>

                    {/* Detailed Sections */}
                    {lesson.sections?.map((section: any, index: number) => (
                        <View key={index} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.sectionText}>{section.content}</Text>
                        </View>
                    ))}

                    {/* Quiz Section */}
                    {lesson.quiz && (
                        <View style={styles.quizCard}>
                            <View style={styles.quizHeader}>
                                <MaterialCommunityIcons name="brain" size={24} color={lesson.color} />
                                <Text style={styles.quizTitle}>Knowledge Check</Text>
                            </View>
                            <Text style={styles.quizDescription}>
                                Pass the {lesson.quiz.length}-question quiz with a score of 7 or higher to complete this lesson and earn points.
                            </Text>
                            <TouchableOpacity
                                style={[styles.quizButton, { borderColor: lesson.color }]}
                                onPress={() => navigation.navigate('Quiz', {
                                    quiz: lesson.quiz,
                                    lessonId: lesson.id,
                                    lesson: lesson // Pass full lesson object
                                })}
                            >
                                <Text style={[styles.quizButtonText, { color: lesson.color }]}>
                                    Take Quiz
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Manual Complete Button (Only if NO quiz) */}
                    {!lesson.quiz && !isCompleted && (
                        <View style={styles.footer}>
                            <AnimatedButton
                                title="Mark as Complete"
                                onPress={() => handleComplete()}
                                variant="primary"
                                size="large"
                                style={{ backgroundColor: lesson.color }}
                            />
                        </View>
                    )}

                    {/* Completed State */}
                    {isCompleted && (
                        <View style={styles.completedBanner}>
                            <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
                            <Text style={styles.completedText}>Lesson Completed</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <AppModal
                visible={showFailModal}
                title="Quiz Failed"
                message={`You scored ${quizResult?.score}/${quizResult?.total}. You need 7/10 to pass. Try again!`}
                actions={[
                    {
                        text: "Try Again",
                        onPress: () => setShowFailModal(false),
                        style: "default"
                    }
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e2d1',
    },
    scrollView: {
        flex: 1,
    },
    heroContainer: {
        height: 300,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
    },
    heroGradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroContent: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    heroIconBackground: {
        position: 'absolute',
        bottom: -40,
        right: -40,
        transform: [{ rotate: '-15deg' }],
    },
    categoryBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.round,
        alignSelf: 'flex-start',
        marginBottom: spacing.md,
    },
    categoryText: {
        color: '#FFFFFF',
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: typography.fontWeight.bold,
        color: '#FFFFFF',
        marginBottom: spacing.md,
        lineHeight: 34,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
    },
    metaDivider: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: spacing.md,
    },
    contentContainer: {
        padding: spacing.xl,
        paddingTop: spacing.xl,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    sectionText: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    quizCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    quizHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    quizTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    quizDescription: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    quizButton: {
        borderWidth: 2,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    quizButtonText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    footer: {
        marginTop: spacing.md,
        marginBottom: spacing.xxl,
    },
    completedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8F5E9',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
        marginBottom: spacing.xxl,
    },
    completedText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: '#4CAF50',
    }
});