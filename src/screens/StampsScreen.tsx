import React, { useContext, useState, useCallback, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    StatusBar,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { badges, Badge, getUnlockedBadges } from '../constants/badges';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { StampDetailModal } from '../components/StampDetailModal';

const { width } = Dimensions.get('window');

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
        backgroundColor: '#e8e2d1',
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
    scrollView: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: spacing.xxxl,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    stampsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    stampContainer: {
        width: (width - spacing.md * 2 - spacing.sm * 2) / 3,
        marginBottom: spacing.sm,
    },
    stampCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        height: 160, // Fixed height for uniformity
    },
    lockedStampCard: {
        backgroundColor: '#f5f5f5',
    },
    imageWrapper: {
        position: 'relative',
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    stampImage: {
        width: 80,
        height: 80,
    },
    greyscaleOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greyscaleImage: {
        opacity: 0.4,
        tintColor: '#666666',
    },
    notificationDot: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: colors.white,
        zIndex: 2,
    },
    nameContainer: {
        height: 40, // Fixed container height for 2 lines
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    stampName: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        textAlign: 'center',
        lineHeight: typography.fontSize.xs * 1.4,
    },
    stampNameLocked: {
        color: colors.textSecondary,
        opacity: 0.6,
    },
});

// Memoized stamp card component with proper image handling
const StampCard = memo(({ stamp, isUnlocked, isClaimed, onPress }: any) => (
    <TouchableOpacity
        style={styles.stampContainer}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[
            styles.stampCard,
            !isUnlocked && styles.lockedStampCard
        ]}>
            <View style={styles.imageWrapper}>
                <Image
                    source={stamp.image}
                    style={styles.stampImage}
                    resizeMode="contain"
                    fadeDuration={0}
                    // Key prop to force re-render if unlock status changes
                    key={`${stamp.id}-${isUnlocked}`}
                />
                {/* Greyscale overlay for locked stamps */}
                {!isUnlocked && (
                    <View style={styles.greyscaleOverlay}>
                        <Image
                            source={stamp.image}
                            style={[styles.stampImage, styles.greyscaleImage]}
                            resizeMode="contain"
                            fadeDuration={0}
                        />
                    </View>
                )}
                {/* Notification dot for unclaimed stamps */}
                {isUnlocked && !isClaimed && (
                    <View style={styles.notificationDot} />
                )}
            </View>
            <View style={styles.nameContainer}>
                <Text style={[
                    styles.stampName,
                    !isUnlocked && styles.stampNameLocked
                ]} numberOfLines={2}>
                    {stamp.name}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
));

export default function StampsScreen({ navigation }: any) {
    const { user } = useContext(AuthContext);
    const [selectedStamp, setSelectedStamp] = useState<Badge | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    const unlockedBadges = getUnlockedBadges(user);
    const unlockedIds = unlockedBadges.map(b => b.id);
    const claimedBadges = user?.claimedBadges || [];

    const easyStamps = badges.filter(b => b.rarity === 'Easy');
    const mediumStamps = badges.filter(b => b.rarity === 'Medium');
    const hardStamps = badges.filter(b => b.rarity === 'Hard');

    const allSections = [
        { title: `Easy Stamps (${easyStamps.filter(s => unlockedIds.includes(s.id)).length}/${easyStamps.length})`, data: easyStamps },
        { title: `Medium Stamps (${mediumStamps.filter(s => unlockedIds.includes(s.id)).length}/${mediumStamps.length})`, data: mediumStamps },
        { title: `Hard Stamps (${hardStamps.filter(s => unlockedIds.includes(s.id)).length}/${hardStamps.length})`, data: hardStamps },
    ];

    const handleStampPress = useCallback((stamp: Badge) => {
        setSelectedStamp(stamp);
        setShowDetail(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowDetail(false);
    }, []);

    const renderStamp = useCallback((stamp: Badge) => {
        const isUnlocked = unlockedIds.includes(stamp.id);
        const isClaimed = claimedBadges.includes(stamp.id);

        return (
            <StampCard
                key={stamp.id}
                stamp={stamp}
                isUnlocked={isUnlocked}
                isClaimed={isClaimed}
                onPress={() => handleStampPress(stamp)}
            />
        );
    }, [unlockedIds, claimedBadges, handleStampPress]);

    const renderSection = ({ item: section }: any) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.stampsGrid}>
                {section.data.map((stamp: Badge) => renderStamp(stamp))}
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
                <Text style={styles.headerTitle}>Stamps Collection</Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                data={allSections}
                renderItem={renderSection}
                keyExtractor={(_, index) => index.toString()}
                maxToRenderPerBatch={3}
                updateCellsBatchingPeriod={100}
                initialNumToRender={8}
                windowSize={5}
                removeClippedSubviews={true}
            />

            <StampDetailModal
                visible={showDetail}
                onClose={handleCloseModal}
                stamp={selectedStamp}
                isUnlocked={selectedStamp ? unlockedIds.includes(selectedStamp.id) : false}
                isClaimed={selectedStamp ? claimedBadges.includes(selectedStamp.id) : false}
            />
        </View>
    );
}