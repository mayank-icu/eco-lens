// Design System Constants for PlastiSort AI - Duolingo Inspired Edition

// Colors - Vibrant, Playful, Duolingo-Inspired Palette
export const colors = {
    // Primary Colors - Earthy Green Theme
    primary: '#7fb069',
    primaryLight: '#a2d48b',
    primaryDark: '#5a8c4a',
    secondary: '#1CB0F6', // Bright blue
    secondaryLight: '#4FC3F7',
    accent: '#FF9600', // Vibrant orange
    accentLight: '#FFC107',

    // Fun accent colors
    purple: '#CE82FF',
    pink: '#FF4B4B',
    yellow: '#FFC800',

    // Status Colors - Vibrant
    error: '#FF4B4B',
    warning: '#FF9600',
    success: '#58CC02',
    info: '#1CB0F6',

    // Recycling Bin Colors
    recyclableGreen: '#58CC02',
    nonRecyclableRed: '#FF4B4B',
    needsCleaningYellow: '#FFC800',

    // Background Colors - Clean & Bright
    white: '#FFFFFF',
    lightGray: '#efe9de',
    mediumGray: '#E5E5E5',
    darkGray: '#AFAFAF',
    backgroundGradientStart: '#efe9de',
    backgroundGradientEnd: '#FFFFFF',

    // Home Page Card Colors
    todayActionsCard: '#a4bc9e',
    impactSnapshotCard: '#d5d8d1',
    quickActionsCard: '#d5d7d0',
    carouselGradientStart: '#fefdfb',
    carouselGradientEnd: '#d4e8d0',

    // Text Colors
    textPrimary: '#3C3C3C',
    textSecondary: '#777777',
    textLight: '#FFFFFF',
    textMuted: '#AFAFAF',

    // Confidence Badge Colors
    highConfidence: '#58CC02',
    mediumConfidence: '#FF9600',
    lowConfidence: '#FF4B4B',

    // Gradient Arrays - Vibrant gradients
    primaryGradient: ['#58CC02', '#89E219'],
    secondaryGradient: ['#1CB0F6', '#4FC3F7'],
    accentGradient: ['#FF9600', '#FFC107'],
    purpleGradient: ['#CE82FF', '#DA9DFF'],
    successGradient: ['#58CC02', '#89E219'],
    cardGradient: ['#FFFFFF', '#F7F7F7'],
    card: '#FFFFFF',
};

export const darkColors = {
    // Primary Colors - Adjusted for dark mode
    primary: '#58CC02',
    primaryLight: '#89E219',
    primaryDark: '#43A500',
    secondary: '#1CB0F6',
    secondaryLight: '#4FC3F7',
    accent: '#FF9600',
    accentLight: '#FFC107',

    purple: '#CE82FF',
    pink: '#FF4B4B',
    yellow: '#FFC800',

    // Status Colors
    error: '#FF4B4B',
    warning: '#FF9600',
    success: '#58CC02',
    info: '#1CB0F6',

    // Recycling Bin Colors
    recyclableGreen: '#58CC02',
    nonRecyclableRed: '#FF4B4B',
    needsCleaningYellow: '#FFC800',

    // Background Colors - Dark
    white: '#1F1F1F',
    lightGray: '#2C2C2C',
    mediumGray: '#3D3D3D',
    darkGray: '#B0B0B0',
    backgroundGradientStart: '#1F1F1F',
    backgroundGradientEnd: '#2C2C2C',

    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textLight: '#E0E0E0',
    textMuted: '#777777',

    // Confidence Badge Colors
    highConfidence: '#58CC02',
    mediumConfidence: '#FF9600',
    lowConfidence: '#FF4B4B',

    // Gradient Arrays
    primaryGradient: ['#58CC02', '#43A500'],
    secondaryGradient: ['#1CB0F6', '#1890C8'],
    accentGradient: ['#FF9600', '#E08600'],
    purpleGradient: ['#CE82FF', '#B66FE8'],
    successGradient: ['#58CC02', '#43A500'],
    cardGradient: ['#2C2C2C', '#3D3D3D'],
    card: '#2C2C2C',
};

// Typography - Rounded, friendly feel
export const typography = {
    fontSize: {
        xs: 10,
        small: 12,
        caption: 14,
        body: 16,
        bodyLarge: 18,
        heading: 20,
        headingLarge: 24,
        title: 28,
        titleLarge: 32,
        display: 40,
    },
    fontWeight: {
        light: '300' as const,
        regular: '400' as const,
        medium: '500' as const,
        semiBold: '600' as const,
        bold: '700' as const,
        extraBold: '800' as const,
        black: '900' as const,
    },
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

// Spacing - Consistent 4px grid
export const spacing = {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

// Border Radius - Rounder for playful feel
export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    round: 999,
};

// Shadows - Softer, more pronounced
export const shadows = {
    xs: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 10,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 15,
    },
};

// Animation Durations - Snappy like Duolingo
export const animations = {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 400,
    verySlow: 600,
};

// Spring configurations for bouncy animations
export const springConfig = {
    gentle: {
        friction: 7,
        tension: 40,
    },
    bouncy: {
        friction: 5,
        tension: 40,
    },
    wobbly: {
        friction: 4,
        tension: 40,
    },
};

// Breakpoints for responsive design
export const breakpoints = {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
};

// Icon Sizes
export const iconSizes = {
    xs: 14,
    sm: 18,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
    xxxl: 64,
};

// Touch Target Size
export const touchTarget = {
    min: 44,
};

// Card Styles - Playful elevated cards
export const cardStyles = {
    elevated: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        ...shadows.md,
    },
    glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: borderRadius.xl,
        ...shadows.sm,
    },
    outlined: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        borderColor: colors.mediumGray,
    },
    fun: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        borderWidth: 3,
        borderBottomWidth: 5,
        borderColor: colors.mediumGray,
        ...shadows.sm,
    },
};

// Button 3D effect presets (Duolingo style)
export const button3D = {
    small: {
        borderBottomWidth: 3,
        borderRightWidth: 1,
    },
    medium: {
        borderBottomWidth: 4,
        borderRightWidth: 2,
    },
    large: {
        borderBottomWidth: 6,
        borderRightWidth: 2,
    },
};
