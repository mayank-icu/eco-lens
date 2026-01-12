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
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { signInWithEmail } from '../services/auth';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useToast } from '../contexts/ToastContext';
import { AnimatedButton } from '../components/AnimatedButton';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
    navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const { refreshUser } = useAuth();
    const { showToast } = useToast();

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

        if (!isValid) {
            showToast('Please check your inputs', 'error');
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await signInWithEmail(email, password);
            await refreshUser();
            showToast('Welcome back!', 'success');
        } catch (error: any) {
            showToast(error.message || 'Invalid email or password', 'error');
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
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>


                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Log in to continue your journey</Text>

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

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                                <Feather name="lock" size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor={colors.textSecondary}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setErrors(prev => ({ ...prev, password: '' }));
                                    }}
                                    secureTextEntry={!showPassword}
                                    autoComplete="password"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Feather
                                        name={showPassword ? "eye-off" : "eye"}
                                        size={20}
                                        color={colors.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password ? (
                                <Text style={styles.errorText}>{errors.password}</Text>
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
                        <AnimatedButton
                            title="Log In"
                            onPress={handleLogin}
                            variant="primary"
                            size="medium"
                            loading={loading}
                            disabled={loading}
                        />

                        {/* Sign Up Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={styles.footerLink}>Sign Up</Text>
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
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logoCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#7fb069',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
        shadowColor: '#7fb069',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    logoText: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        letterSpacing: 0.5,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -spacing.sm,
    },
    forgotPasswordText: {
        fontSize: typography.fontSize.small,
        color: '#7fb069',
        fontWeight: typography.fontWeight.bold,
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