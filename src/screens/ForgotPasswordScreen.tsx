import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { resetPassword } from '../services/auth';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface ForgotPasswordScreenProps {
    navigation: any;
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email);
            Alert.alert(
                'Success',
                'Password reset email sent! Check your inbox.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
                Enter your email and we'll send you a link to reset your password
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetPassword}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <Text style={styles.resetButtonText}>Send Reset Link</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <Text style={styles.backText}>Back to Sign In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl * 2,
    },
    title: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
    },
    input: {
        backgroundColor: colors.lightGray,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        fontSize: typography.fontSize.body,
        color: colors.textPrimary,
        marginBottom: spacing.lg,
    },
    resetButton: {
        backgroundColor: colors.secondary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    resetButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    backButton: {
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    backText: {
        color: colors.secondary,
        fontSize: typography.fontSize.body,
    },
});
