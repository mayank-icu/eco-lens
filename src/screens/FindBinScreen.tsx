import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function FindBinScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Find Nearest Bin</Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="map" size={80} color="#7fb069" />
                </View>
                <Text style={styles.title}>Coming Soon!</Text>
                <Text style={styles.subtitle}>
                    We are working hard to map all the recycling bins in your area. Stay tuned!
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e2d1',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
        shadowColor: '#7fb069',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: typography.fontSize.display,
        fontWeight: typography.fontWeight.black,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
});
