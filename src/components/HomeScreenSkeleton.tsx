import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { spacing, borderRadius } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreenSkeleton() {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmer = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        );
        shimmer.start();

        return () => shimmer.stop();
    }, [shimmerAnim]);

    const shimmerOpacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const SkeletonBox = ({ style }: { style?: any }) => (
        <Animated.View
            style={[
                styles.skeleton,
                { opacity: shimmerOpacity },
                style,
            ]}
        />
    );

    return (
        <View style={styles.container}>
            {/* Header Skeleton */}
            <View style={styles.header}>
                <SkeletonBox style={styles.profileSkeleton} />
                <View style={styles.headerRight}>
                    <SkeletonBox style={styles.iconSkeleton} />
                    <SkeletonBox style={styles.iconSkeleton} />
                </View>
            </View>

            <View style={styles.content}>
                {/* Section Header */}
                <SkeletonBox style={styles.sectionHeaderSkeleton} />

                {/* Today's Actions Skeleton */}
                <View style={styles.todayActionsContainer}>
                    <SkeletonBox style={styles.todayActionCard} />
                    <SkeletonBox style={styles.todayActionCard} />
                    <SkeletonBox style={styles.todayActionCard} />
                </View>

                {/* Section Header */}
                <SkeletonBox style={styles.sectionHeaderSkeleton} />

                {/* Impact Snapshot Skeleton */}
                <View style={styles.impactSnapshotContainer}>
                    <SkeletonBox style={styles.impactCard} />
                    <SkeletonBox style={styles.impactCard} />
                    <SkeletonBox style={styles.impactCard} />
                </View>

                {/* Carousel Skeleton */}
                <View style={styles.carouselContainer}>
                    <SkeletonBox style={styles.carouselCard} />
                </View>

                {/* Section Header */}
                <SkeletonBox style={styles.sectionHeaderSkeleton} />

                {/* Quick Actions Skeleton */}
                <View style={styles.quickActionsContainer}>
                    <SkeletonBox style={styles.quickActionCard} />
                    <SkeletonBox style={styles.quickActionCard} />
                    <SkeletonBox style={styles.quickActionCard} />
                    <SkeletonBox style={styles.quickActionCard} />
                    <SkeletonBox style={styles.quickActionCard} />
                    <SkeletonBox style={styles.quickActionCard} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e2d1',
    },
    skeleton: {
        backgroundColor: '#d0c9b8',
        borderRadius: borderRadius.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: '#e8e2d1',
    },
    profileSkeleton: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    iconSkeleton: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    content: {
        padding: spacing.md,
        paddingTop: spacing.md,
    },
    sectionHeaderSkeleton: {
        width: 140,
        height: 24,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
        borderRadius: borderRadius.sm,
    },
    todayActionsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    todayActionCard: {
        flex: 1,
        height: 120,
        borderRadius: borderRadius.xl,
    },
    impactSnapshotContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    impactCard: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: borderRadius.xl,
    },
    carouselContainer: {
        marginTop: spacing.xl,
        marginBottom: spacing.md,
        marginHorizontal: -spacing.md,
        paddingHorizontal: spacing.md,
    },
    carouselCard: {
        width: width * 0.92,
        height: 160,
        borderRadius: borderRadius.xl,
    },
    quickActionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    quickActionCard: {
        width: (width - spacing.md * 2 - spacing.sm * 2) / 3,
        height: 100,
        borderRadius: borderRadius.xl,
    },
});
