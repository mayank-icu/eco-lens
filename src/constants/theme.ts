// Design System Constants for PlastiSort AI - Premium Edition

// Colors - Enhanced Color Palette
export const colors = {
    // Primary Colors - Deeper, richer greens
    primary: '#1B4332',
    primaryLight: '#2D5F3F',
    primaryDark: '#081C15',
    secondary: '#40916C',
    secondaryLight: '#52B788',
    accent: '#74C69D',
    accentLight: '#95D5B2',

    // Status Colors
    error: '#D62828',
    warning: '#F77F00',
    success: '#52B788',
    info: '#4CC9F0',

    // Recycling Bin Colors
    recyclableGreen: '#40916C',
    nonRecyclableRed: '#D62828',
    needsCleaningYellow: '#F77F00',

    // Background Colors
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    mediumGray: '#E9ECEF',
    darkGray: '#6C757D',
    backgroundGradientStart: '#F8F9FA',
    backgroundGradientEnd: '#E9ECEF',

    // Text Colors
    textPrimary: '#212529',
    textSecondary: '#6C757D',
    textLight: '#FFFFFF',
    textMuted: '#ADB5BD',

    // Confidence Badge Colors
    highConfidence: '#40916C',
    mediumConfidence: '#F77F00',
    lowConfidence: '#D62828',

    // Gradient Arrays
    primaryGradient: ['#1B4332', '#2D5F3F', '#40916C'],
    accentGradient: ['#52B788', '#74C69D', '#95D5B2'],
    successGradient: ['#40916C', '#52B788'],
    cardGradient: ['#FFFFFF', '#F8F9FA'],
};

// Typography - More refined scale
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

// Border Radius - More variety
export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 999,
};

// Shadows - Enhanced depth
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

// Animation Durations
export const animations = {
    fast: 150,
    normal: 250,
    slow: 350,
    verySlow: 500,
};

// Breakpoints for responsive design
export const breakpoints = {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
};

// Icon Sizes - More granular
export const iconSizes = {
    xs: 14,
    sm: 18,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
};

// Touch Target Size
export const touchTarget = {
    min: 44, // Minimum touch target size for accessibility
};

// Card Styles - Predefined premium card styles
export const cardStyles = {
    elevated: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        ...shadows.md,
    },
    glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    outlined: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.mediumGray,
    },
};
