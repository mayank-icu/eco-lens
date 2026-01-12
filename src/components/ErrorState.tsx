import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
    icon?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    message = 'Something went wrong. Please try again.',
    onRetry,
    icon = 'alert-circle-outline'
}) => {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name={icon as any} size={64} color={colors.error} />
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.button} onPress={onRetry}>
                    <Text style={styles.buttonText}>Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    message: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.round,
    },
    buttonText: {
        color: colors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
});
