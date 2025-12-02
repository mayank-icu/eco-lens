import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { signInWithEmail } from '../services/auth';
import { colors, spacing, typography, borderRadius, shadows, iconSizes } from '../constants/theme';

interface LoginScreenProps {
    navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    const validateForm = () => {
        const newErrors = { email: '', password: '' };
        let isValid = true;

        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await signInWithEmail(email, password);
            // Navigation happens via AuthContext
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" />

            {/* Header with gradient */}
            <LinearGradient
                colors={[colors.primaryDark, colors.primary]}
                style={styles.header}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="arrow-left" size={iconSizes.md} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Welcome Back</Text>
                <Text style={styles.headerSubtitle}>Sign in to continue your impact</Text>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.form}>
                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                            <Feather name="mail" size={iconSizes.sm} color={colors.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="your@email.com"
                                placeholderTextColor={colors.textMuted}
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
                            <View style={styles.errorContainer}>
                                <Feather name="alert-circle" size={iconSizes.xs} color={colors.error} />
                                <Text style={styles.errorText}>{errors.email}</Text>
                            </View>
                        ) : null}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                            <Feather name="lock" size={iconSizes.sm} color={colors.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor={colors.textMuted}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setErrors(prev => ({ ...prev, password: '' }));
                                }}
                                secureTextEntry={!showPassword}
                                autoComplete="password"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Feather name={showPassword ? "eye-off" : "eye"} size={iconSizes.sm} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        {errors.password ? (
                            <View style={styles.errorContainer}>
                                <Feather name="alert-circle" size={iconSizes.xs} color={colors.error} />
                                <Text style={styles.errorText}>{errors.password}</Text>
                            </View>
                        ) : null}
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotPassword')}
                        style={styles.forgotPassword}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[colors.secondary, colors.secondaryLight]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.loginButtonGradient}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.white} />
                            ) : (
                                <>
                                    <Text style={styles.loginButtonText}>Sign In</Text>
                                    <Feather name="arrow-right" size={iconSizes.sm} color={colors.white} />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.footerLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    header: {
        paddingTop: spacing.xxxl + spacing.lg,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.lg,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    headerTitle: {
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
        marginBottom: spacing.xs,
    },
    headerSubtitle: {
        fontSize: typography.fontSize.body,
        color: colors.accentLight,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    form: {
        backgroundColor: colors.white,
        borderTopLeftRadius: borderRadius.xxl,
        borderTopRightRadius: borderRadius.xxl,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxl,
        flex: 1,
        ...shadows.xl,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: colors.error,
        backgroundColor: 'rgba(214, 40, 40, 0.05)',
    },
    input: {
        flex: 1,
        fontSize: typography.fontSize.body,
        color: colors.textPrimary,
        paddingVertical: spacing.xs,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    errorText: {
        fontSize: typography.fontSize.small,
        color: colors.error,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: spacing.xl,
    },
    forgotPasswordText: {
        fontSize: typography.fontSize.caption,
        color: colors.secondary,
        fontWeight: typography.fontWeight.semiBold,
    },
    loginButton: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.md,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonGradient: {
        flexDirection: 'row',
        paddingVertical: spacing.md + spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    loginButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.bodyLarge,
        fontWeight: typography.fontWeight.bold,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    footerText: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
    },
    footerLink: {
        fontSize: typography.fontSize.body,
        color: colors.secondary,
        fontWeight: typography.fontWeight.bold,
    },
});
