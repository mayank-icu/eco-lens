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
import { signUpWithEmail } from '../services/auth';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useToast } from '../contexts/ToastContext';
import { AnimatedButton } from '../components/AnimatedButton';
import { useAuth } from '../contexts/AuthContext';

interface SignUpScreenProps {
    navigation: any;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const { refreshUser } = useAuth();
    const { showToast } = useToast();

    const validateForm = () => {
        const newErrors = { name: '', email: '', password: '', confirmPassword: '' };
        let isValid = true;

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

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
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
            newErrors.password = 'Must contain a number and special character';
            isValid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) {
            showToast('Please check your inputs', 'error');
        }

        return isValid;
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const user = await signUpWithEmail(email, password, name);
            await refreshUser(user.uid);
            showToast('Account created! Welcome!', 'success');
        } catch (error: any) {
            showToast(error.message || 'Sign up failed', 'error');
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
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the eco-friendly community</Text>

                    <View style={styles.form}>
                        {/* Name Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>NAME</Text>
                            <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                                <Feather name="user" size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Your name"
                                    placeholderTextColor={colors.textSecondary}
                                    value={name}
                                    onChangeText={(text) => {
                                        setName(text);
                                        setErrors(prev => ({ ...prev, name: '' }));
                                    }}
                                />
                            </View>
                            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                        </View>

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
                            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                                <Feather name="lock" size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Min 6 characters"
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
                            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>CONFIRM PASSWORD</Text>
                            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                                <Feather name="lock" size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Re-enter password"
                                    placeholderTextColor={colors.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        setErrors(prev => ({ ...prev, confirmPassword: '' }));
                                    }}
                                    secureTextEntry={!showPassword}
                                    autoComplete="password"
                                />
                            </View>
                            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
                        </View>

                        {/* Sign Up Button */}
                        <AnimatedButton
                            title="Create Account"
                            onPress={handleSignUp}
                            variant="primary"
                            size="medium"
                            loading={loading}
                            disabled={loading}
                        />

                        {/* Login Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
