import React, { useContext } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GamificationContext } from '../contexts/GamificationContext';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function ScanHistoryScreen({ navigation }: any) {
    const { scanHistory } = useContext(GamificationContext);

    // Sort history by date (newest first)
    const sortedHistory = [...(scanHistory || [])].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="recycle" size={24} color={colors.white} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.plasticType || 'Recycled Item'}</Text>
                <Text style={styles.cardDate}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.pointsContainer}>
                <Text style={styles.pointsValue}>+{item.points || 10}</Text>
                <Text style={styles.pointsLabel}>pts</Text>
            </View>
        </View>
    );

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
                <Text style={styles.headerTitle}>Scan History</Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                data={sortedHistory}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="history" size={60} color={colors.textMuted} />
                        <Text style={styles.emptyText}>No scans yet. Start recycling!</Text>
                    </View>
                }
            />
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
    listContent: {
        padding: spacing.md,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#7fb069',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    cardDate: {
        fontSize: typography.fontSize.small,
        color: colors.textSecondary,
    },
    pointsContainer: {
        alignItems: 'center',
    },
    pointsValue: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: '#7fb069',
    },
    pointsLabel: {
        fontSize: 10,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.bold,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: spacing.xxxl,
        gap: spacing.md,
    },
    emptyText: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
});
