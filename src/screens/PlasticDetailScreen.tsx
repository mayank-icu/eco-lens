import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function PlasticDetailScreen({ route, navigation }: any) {
    const { plastic } = route.params;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Plastic Type</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: plastic.recyclable ? '#7fb069' : '#e76f51' }
                ]}>
                    <Text style={styles.number}>{plastic.number}</Text>
                    <MaterialCommunityIcons
                        name={plastic.recyclable ? 'recycle' : 'close-circle'}
                        size={48}
                        color={colors.white}
                    />
                </View>

                <Text style={styles.title}>{plastic.name}</Text>
                <Text style={styles.description}>{plastic.description}</Text>

                <View style={[
                    styles.statusCard,
                    { backgroundColor: plastic.recyclable ? '#f5f9f3' : '#fff3f3' }
                ]}>
                    <MaterialCommunityIcons
                        name={plastic.recyclable ? 'check-circle' : 'alert-circle'}
                        size={24}
                        color={plastic.recyclable ? '#7fb069' : '#e76f51'}
                    />
                    <Text style={[
                        styles.statusText,
                        { color: plastic.recyclable ? '#7fb069' : '#e76f51' }
                    ]}>
                        {plastic.recyclable ? 'Recyclable' : 'Not Recyclable'}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Common Uses</Text>
                    <Text style={styles.text}>{plastic.examples}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Information</Text>
                    <Text style={styles.text}>{plastic.info}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Disposal Instructions</Text>
                    {plastic.recyclable ? (
                        <View>
                            <View style={styles.instructionItem}>
                                <MaterialCommunityIcons name="numeric-1-circle" size={20} color="#7fb069" />
                                <Text style={styles.instructionText}>Rinse the container to remove residue</Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <MaterialCommunityIcons name="numeric-2-circle" size={20} color="#7fb069" />
                                <Text style={styles.instructionText}>Remove labels if possible</Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <MaterialCommunityIcons name="numeric-3-circle" size={20} color="#7fb069" />
                                <Text style={styles.instructionText}>Place in recycling bin</Text>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <View style={styles.instructionItem}>
                                <MaterialCommunityIcons name="alert" size={20} color="#e76f51" />
                                <Text style={styles.instructionText}>
                                    This plastic type should go in the regular trash bin
                                </Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <MaterialCommunityIcons name="information" size={20} color="#e76f51" />
                                <Text style={styles.instructionText}>
                                    Consider reducing usage of this plastic type
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={{ height: spacing.xxxl }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: '#e8e2d1',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.round,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: borderRadius.round,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: spacing.lg,
    },
    number: {
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
    },
    title: {
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    description: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
    },
    statusText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    text: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.body * 1.6,
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    instructionText: {
        flex: 1,
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.body * 1.5,
    },
});
