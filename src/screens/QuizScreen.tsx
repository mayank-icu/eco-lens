import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { AnimatedButton } from '../components/AnimatedButton';
import { AppModal } from '../components/AppModal';


export default function QuizScreen({ route, navigation }: any) {
    const { quiz, lessonId, lesson } = route.params || {};
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showQuitModal, setShowQuitModal] = useState(false);

    if (!quiz || !lessonId) {
        navigation.goBack();
        return null;
    }

    const currentQuestion = quiz[currentQuestionIndex];
    const progress = (currentQuestionIndex + 1) / quiz.length;

    const handleOptionPress = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);

        // Instant check
        setIsAnswered(true);
        if (index === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        const passed = score >= 7;
        navigation.navigate('LessonDetail', {
            lesson: lesson || { id: lessonId }, // Pass full lesson if available
            quizResult: {
                score: score,
                total: quiz.length,
                passed: passed
            }
        });
    };

    const renderOption = (option: string, index: number) => {
        let backgroundColor = colors.white;
        let borderColor = 'transparent';
        let textColor = colors.textPrimary;
        let iconName = 'radiobox-blank';
        let iconColor = colors.textSecondary;

        if (isAnswered) {
            if (index === currentQuestion.correctAnswer) {
                backgroundColor = '#E8F5E9';
                borderColor = '#4CAF50';
                textColor = '#2E7D32';
                iconName = 'check-circle';
                iconColor = '#4CAF50';
            } else if (index === selectedOption) {
                backgroundColor = '#FFEBEE';
                borderColor = '#F44336';
                textColor = '#C62828';
                iconName = 'close-circle';
                iconColor = '#F44336';
            }
        } else {
            if (index === selectedOption) {
                backgroundColor = '#E3F2FD';
                borderColor = '#2196F3';
                textColor = '#1565C0';
                iconName = 'radiobox-marked';
                iconColor = '#2196F3';
            }
        }

        return (
            <TouchableOpacity
                key={index}
                style={[
                    styles.optionCard,
                    { backgroundColor, borderColor }
                ]}
                onPress={() => handleOptionPress(index)}
                activeOpacity={0.8}
                disabled={isAnswered}
            >
                <View style={styles.optionContent}>
                    <MaterialCommunityIcons name={iconName as any} size={24} color={iconColor} />
                    <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                </View>
                <View style={styles.headerContent}>
                    <Text style={styles.progressText}>
                        Question {currentQuestionIndex + 1}/{quiz.length}
                    </Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowQuitModal(true)}
                    >
                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {/* Question */}
                <Text style={styles.questionText}>{currentQuestion.question}</Text>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option: string, index: number) =>
                        renderOption(option, index)
                    )}
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                {isAnswered && (
                    <AnimatedButton
                        title={currentQuestionIndex === quiz.length - 1 ? "Finish Quiz" : "Next Question"}
                        onPress={handleNext}
                        variant="primary"
                        size="large"
                    />
                )}
            </View>

            <AppModal
                visible={showQuitModal}
                title="Quit Quiz?"
                message="Are you sure you want to quit? Your progress will be lost."
                actions={[
                    {
                        text: "Cancel",
                        onPress: () => setShowQuitModal(false),
                        style: "cancel"
                    },
                    {
                        text: "Quit",
                        onPress: () => {
                            setShowQuitModal(false);
                            navigation.goBack();
                        },
                        style: "destructive"
                    }
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: StatusBar.currentHeight || spacing.md,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: colors.lightGray,
        width: '100%',
    },
    progressBar: {
        height: '100%',
        backgroundColor: colors.primary,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
    },
    progressText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textSecondary,
    },
    closeButton: {
        padding: spacing.xs,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    questionText: {
        fontSize: typography.fontSize.h3,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xl,
        lineHeight: 32,
    },
    optionsContainer: {
        gap: spacing.md,
    },
    optionCard: {
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        marginBottom: spacing.sm,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    optionText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.medium,
        flex: 1,
    },
    footer: {
        padding: spacing.lg,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
});
