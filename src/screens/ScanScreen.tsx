import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

import { loadModel, runInference } from '../services/ai';
import { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function ScanScreen({ navigation }: any) {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [modelLoaded, setModelLoaded] = useState(false);

    useEffect(() => {
        loadModel().then(success => setModelLoaded(success));
    }, []);

    const processImage = async (uri: string) => {
        if (!modelLoaded) {
            Alert.alert('Error', 'AI Model not loaded yet. Please wait.');
            return;
        }

        setScanning(true);
        const classification = await runInference(uri);
        setScanning(false);

        if (classification) {
            setResult({
                plasticType: classification.plasticType,
                confidence: Math.round(classification.confidence * 100),
                binColor: classification.binColor,
                co2Saved: Math.floor(Math.random() * 50) + 10,
                educationalInfo: `${classification.name} is commonly used in packaging.`,
            });
        } else {
            Alert.alert('Error', 'Could not identify plastic type.');
        }
    };

    const handleScan = async () => {
        // In a real app with camera integration, we'd capture here.
        // For now, we simulate a capture or use a dummy URI.
        await processImage('dummy-camera-uri');
    };

    const handleGalleryPick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission to access camera roll is required!');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
            await processImage(pickerResult.assets[0].uri);
        }
    };



    const handleLogScan = () => {
        Alert.alert('Success', 'Item logged successfully!');
        setResult(null);
    };

    if (scanning) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.scanningContainer}>
                    <ActivityIndicator size="large" color={colors.secondary} />
                    <Text style={styles.scanningText}>Analyzing plastic...</Text>
                    <Text style={styles.scanningSubtext}>Hold steady</Text>
                </View>
            </View>
        );
    }

    if (result) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Scan Result</Text>

                    <View style={styles.plasticCard}>
                        <Text style={styles.plasticIcon}>♻️</Text>
                        <Text style={styles.plasticType}>{result.plasticType}</Text>
                        <View style={[
                            styles.confidenceBadge,
                            { backgroundColor: result.confidence > 80 ? colors.highConfidence : colors.mediumConfidence }
                        ]}>
                            <Text style={styles.confidenceText}>{result.confidence}% confident</Text>
                        </View>
                    </View>

                    <View style={styles.binIndicator}>
                        <Text style={styles.binLabel}>Place in:</Text>
                        <View style={[styles.binCircle, { backgroundColor: colors.recyclableGreen }]}>
                            <Text style={styles.binText}>GREEN BIN</Text>
                        </View>
                    </View>

                    <View style={styles.impactCard}>
                        <Text style={styles.impactTitle}>Environmental Impact</Text>
                        <Text style={styles.impactText}>
                            Recycling this saves <Text style={styles.impactValue}>{result.co2Saved}g</Text> of CO2
                        </Text>
                    </View>

                    <View style={styles.eduCard}>
                        <Text style={styles.eduTitle}>Why this matters</Text>
                        <Text style={styles.eduText}>{result.educationalInfo}</Text>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.primaryButton} onPress={handleLogScan}>
                            <Text style={styles.primaryButtonText}>Log This Item</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton} onPress={() => setResult(null)}>
                            <Text style={styles.secondaryButtonText}>Scan Another</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.cameraContainer}>
                <View style={styles.overlay}>
                    <Text style={styles.title}>Scan Plastic Item</Text>
                    <Text style={styles.instructions}>
                        Point your camera at the plastic item's recycling symbol
                    </Text>
                </View>

                <View style={styles.viewfinder}>
                    <View style={styles.viewfinderCorner} />
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity style={styles.galleryButton} onPress={handleGalleryPick}>
                        <Text style={styles.galleryIcon}>🖼️</Text>
                        <Text style={styles.galleryText}>Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.captureButton} onPress={handleScan}>
                        <View style={styles.captureInner} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.flashButton}>
                        <Text style={styles.flashIcon}>💡</Text>
                        <Text style={styles.flashText}>Flash</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: spacing.xxl * 2,
    },
    overlay: {
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    title: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
        marginBottom: spacing.sm,
    },
    instructions: {
        fontSize: typography.fontSize.body,
        color: colors.accent,
        textAlign: 'center',
    },
    viewfinder: {
        alignSelf: 'center',
        width: 250,
        height: 250,
        borderWidth: 3,
        borderColor: colors.accent,
        borderRadius: borderRadius.xl,
        position: 'relative',
    },
    viewfinderCorner: {
        position: 'absolute',
        top: -3,
        left: -3,
        width: 50,
        height: 50,
        borderTopWidth: 6,
        borderLeftWidth: 6,
        borderColor: colors.secondary,
        borderTopLeftRadius: borderRadius.xl,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    galleryButton: {
        alignItems: 'center',
    },
    galleryIcon: {
        fontSize: 32,
    },
    galleryText: {
        color: colors.white,
        fontSize: typography.fontSize.caption,
        marginTop: spacing.xs,
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.round,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureInner: {
        width: 66,
        height: 66,
        borderRadius: borderRadius.round,
        backgroundColor: colors.white,
    },
    flashButton: {
        alignItems: 'center',
    },
    flashIcon: {
        fontSize: 32,
    },
    flashText: {
        color: colors.white,
        fontSize: typography.fontSize.caption,
        marginTop: spacing.xs,
    },
    scanningContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanningText: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
        marginTop: spacing.lg,
    },
    scanningSubtext: {
        fontSize: typography.fontSize.body,
        color: colors.accent,
        marginTop: spacing.sm,
    },
    resultContainer: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl * 2,
    },
    resultTitle: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    plasticCard: {
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    plasticIcon: {
        fontSize: 60,
        marginBottom: spacing.md,
    },
    plasticType: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
        marginBottom: spacing.sm,
    },
    confidenceBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.round,
    },
    confidenceText: {
        color: colors.white,
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.semiBold,
    },
    binIndicator: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    binLabel: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    binCircle: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.round,
    },
    binText: {
        color: colors.white,
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
    },
    impactCard: {
        backgroundColor: colors.accent + '20',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    impactTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    impactText: {
        fontSize: typography.fontSize.body,
        color: colors.textPrimary,
    },
    impactValue: {
        fontWeight: typography.fontWeight.bold,
        color: colors.secondary,
    },
    eduCard: {
        backgroundColor: colors.lightGray,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
    },
    eduTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    eduText: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    actions: {
        gap: spacing.md,
    },
    primaryButton: {
        backgroundColor: colors.secondary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.secondary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: colors.secondary,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
});
