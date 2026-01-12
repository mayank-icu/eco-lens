import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    Animated,
    Platform,
    Share,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { Badge } from '../constants/badges';
import { useGamification } from '../contexts/GamificationContext';

interface StampDetailModalProps {
    visible: boolean;
    onClose: () => void;
    stamp: Badge | null;
    isUnlocked: boolean;
    isClaimed: boolean;
    onClaim?: () => void; // Optional callback if parent needs to know
}

export const StampDetailModal: React.FC<StampDetailModalProps> = ({
    visible,
    onClose,
    stamp,
    isUnlocked,
    isClaimed,
    onClaim
}) => {
    const { claimBadge } = useGamification();
    const [showFirework, setShowFirework] = useState(false);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [isSharing, setIsSharing] = useState(false);

    const viewRef = useRef<View>(null);
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fireworkRef = useRef<LottieView>(null);

    const getPointsForRarity = (rarity: string) => {
        switch (rarity) {
            case 'Easy': return 10;
            case 'Medium': return 20;
            case 'Hard': return 50;
            default: return 10;
        }
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'Easy': return '#7fb069';
            case 'Medium': return '#f4a261';
            case 'Hard': return '#e76f51';
            default: return colors.primary;
        }
    };

    useEffect(() => {
        if (visible && stamp) {
            setShowFirework(false);
            setRewardPoints(0);

            scaleAnim.setValue(0);
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start();

            if (isUnlocked && !isClaimed) {
                const points = getPointsForRarity(stamp.rarity);
                setRewardPoints(points);
                setShowFirework(true);

                // Play animation after a short delay
                setTimeout(() => {
                    fireworkRef.current?.play();
                    claimBadge(stamp.id, points);
                    if (onClaim) onClaim();

                    // Stop animation after 5 seconds
                    setTimeout(() => {
                        setShowFirework(false);
                    }, 5000);
                }, 300);
            }
        }
    }, [visible, stamp, isUnlocked, isClaimed]);

    const handleShare = async () => {
        if (!stamp || !viewRef.current) return;

        try {
            setIsSharing(true);
            // Wait for re-render to hide buttons if needed (though buttons are outside capture view now)
            await new Promise(resolve => setTimeout(resolve, 100));

            const uri = await captureRef(viewRef, {
                format: 'png',
                quality: 1,
            });

            setIsSharing(false);

            if (Platform.OS === 'android' || Platform.OS === 'ios') {
                const isAvailable = await Sharing.isAvailableAsync();
                if (isAvailable) {
                    await Sharing.shareAsync(uri);
                }
            } else {
                await Share.share({
                    message: `I unlocked the ${stamp.name} stamp in Eco Lens!`,
                    url: uri,
                });
            }
        } catch (error) {
            console.error('Error sharing:', error);
            setIsSharing(false);
        }
    };

    if (!stamp) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalWrapper}>


                    {/* Shareable Content */}
                    <View ref={viewRef} collapsable={false} style={styles.shareableContent}>
                        <LinearGradient
                            colors={isSharing ? ['#ffffff', '#ffffff'] : ['#fef9f3', '#f5f0e8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.modalContent}
                        >
                            {/* Rarity Tag - Top Left */}
                            <View style={[
                                styles.rarityTag,
                                { backgroundColor: getRarityColor(stamp.rarity) }
                            ]}>
                                <MaterialCommunityIcons name="star-four-points" size={12} color={colors.white} />
                                <Text style={styles.rarityTagText}>{stamp.rarity}</Text>
                            </View>

                            {/* Stamp Image - Centered */}
                            <Animated.View style={[
                                styles.stampImageContainer,
                                { transform: [{ scale: scaleAnim }] }
                            ]}>
                                {/* Firework Animation Layer - Inside Card */}
                                {showFirework && (
                                    <View style={styles.fireworkContainer}>
                                        <LottieView
                                            ref={fireworkRef}
                                            source={require('../assets/animations/firework.json')}
                                            autoPlay={false}
                                            loop={true}
                                            style={styles.firework}
                                            resizeMode="cover"
                                        />
                                    </View>
                                )}
                                <Image
                                    source={stamp.image}
                                    style={styles.detailStampImage}
                                    resizeMode="contain"
                                />
                            </Animated.View>

                            {/* Stamp Info */}
                            <Text style={styles.detailName}>{stamp.name}</Text>
                            <Text style={styles.detailDescription}>{stamp.description}</Text>

                            {/* Reward Message */}
                            {showFirework && (
                                <View style={styles.rewardContainer}>
                                    <Text style={styles.rewardText}>+{rewardPoints} Points!</Text>
                                </View>
                            )}

                            {/* Unlock Status */}
                            {isUnlocked ? (
                                <View style={styles.unlockedSection}>
                                    <Ionicons name="checkmark-circle" size={20} color="#7fb069" />
                                    <Text style={styles.unlockedText}>Unlocked!</Text>
                                </View>
                            ) : (
                                <View style={styles.lockedSection}>
                                    <Ionicons name="lock-closed" size={20} color={colors.textSecondary} />
                                    <Text style={styles.lockedText}>Keep going to unlock</Text>
                                </View>
                            )}
                        </LinearGradient>
                    </View>

                    {/* Close Button - Outside shareable content */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Ionicons name="close-circle" size={36} color="#fff" />
                    </TouchableOpacity>

                    {/* Share Button - Outside shareable content */}
                    {isUnlocked && !isSharing && (
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={handleShare}
                        >
                            <Ionicons name="share-social" size={22} color={colors.white} />
                            <Text style={styles.shareButtonText}>Share Achievement</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalWrapper: {
        width: '90%',
        maxWidth: 400,
        position: 'relative',
    },
    shareableContent: {
        width: '100%',
    },
    modalContent: {
        borderRadius: borderRadius.xxl,
        padding: spacing.xxxl,
        paddingTop: spacing.xxl,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    fireworkContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0, // Behind the image
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
    },
    firework: {
        width: 300,
        height: 300,
        opacity: 0.8,
    },
    closeButton: {
        position: 'absolute',
        top: -50,
        right: 0,
        zIndex: 10,
    },
    rarityTag: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xxs,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xxs,
        borderRadius: borderRadius.round,
    },
    rarityTagText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    stampImageContainer: {
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
    },
    detailStampImage: {
        width: 140,
        height: 140,
    },
    detailName: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    detailDescription: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.regular,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.md,
        lineHeight: typography.fontSize.small * 1.5,
    },
    rewardContainer: {
        backgroundColor: '#FFF9C4',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#FBC02D',
    },
    rewardText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: '#F57F17',
    },
    unlockedSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.md,
    },
    unlockedText: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.semiBold,
        color: '#7fb069',
    },
    lockedSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.md,
    },
    lockedText: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.medium,
        color: colors.textSecondary,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: '#7fb069',
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.xl,
        marginTop: spacing.xl,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    shareButtonText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
});
