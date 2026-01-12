import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { resetPassword } from '../services/auth';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useToast } from '../contexts/ToastContext';
import { AnimatedButton } from '../components/AnimatedButton';

interface ForgotPasswordScreenProps {
    navigation: any;
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '' });
    const { showToast } = useToast();

    const validateForm = () => {
        const newErrors = { email: '' };
        let isValid = true;

        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) {
            showToast('Please enter a valid email', 'error');
        }

        return isValid;
    };

    const handleResetPassword = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await resetPassword(email);
            showToast('Password reset email sent! Check your inbox.', 'success');
            setTimeout(() => navigation.goBack(), 2000);
        } catch (error: any) {
            showToast(error.message || 'Failed to send reset email', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <SafeAreaView>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                <View style={styles.content}>
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        Enter your email and we'll send you a link to reset your password
                    </Text>

                    <View style={styles.form}>
                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>EMAIL</Text>
                            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                                <Feather name="mail" size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="your@email.com"
                                    placeholderTextColor={colors.textSecondary}
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setErrors(prev => ({ ...prev, email: '' }));
                                    }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoComplete="email"
                                />
                            </View>
                            {errors.email ? (
                                <Text style={styles.errorText}>{errors.email}</Text>
                            ) : null}
                        </View>

                        {/* Reset Button */}
                        <AnimatedButton
                            title="Send Reset Link"
                            onPress={handleResetPassword}
                            variant="primary"
                            size="medium"
                            loading={loading}
                            disabled={loading}
                        />

                        {/* Back to Login Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Remember your password? </Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.footerLink}>Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    scrollContent: {
        flexGrow: 1,
        padding: spacing.lg,
        paddingBottom: spacing.xxxl,
    },
    header: {
        paddingTop: spacing.xl,
        marginBottom: spacing.lg,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
        fontWeight: typography.fontWeight.medium,
        lineHeight: 22,
    },
    form: {
        gap: spacing.lg,
    },
    inputContainer: {
        gap: spacing.xs,
    },
    label: {
        fontSize: 11,
        fontWeight: typography.fontWeight.bold,
        color: colors.textSecondary,
        marginLeft: spacing.xs,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md + 2,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputError: {
        borderColor: colors.error,
    },
    input: {
        flex: 1,
        fontSize: typography.fontSize.body,
        color: colors.textPrimary,
        paddingVertical: 0,
        fontWeight: typography.fontWeight.medium,
    },
    errorText: {
        fontSize: typography.fontSize.small,
        color: colors.error,
        marginLeft: spacing.xs,
        fontWeight: typography.fontWeight.semiBold,
        marginTop: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    footerText: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    footerLink: {
        fontSize: typography.fontSize.small,
        color: '#7fb069',
        fontWeight: typography.fontWeight.bold,
    },
});
