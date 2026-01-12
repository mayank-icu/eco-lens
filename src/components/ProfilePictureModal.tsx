import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface ProfilePictureModalProps {
    visible: boolean;
    currentPicture: number;
    onClose: () => void;
    onSelect: (pictureIndex: number) => void;
}

const PROFILE_PICTURES = [
    require('../assets/pf/1.png'),
    require('../assets/pf/2.png'),
    require('../assets/pf/3.png'),
    require('../assets/pf/4.png'),
    require('../assets/pf/5.png'),
    require('../assets/pf/6.png'),
    require('../assets/pf/7.png'),
    require('../assets/pf/8.png'),
    require('../assets/pf/9.png'),
    require('../assets/pf/10.png'),
    require('../assets/pf/11.png'),
    require('../assets/pf/12.png'),
];

export default function ProfilePictureModal({
    visible,
    currentPicture,
    onClose,
    onSelect,
}: ProfilePictureModalProps) {
    const [selectedPicture, setSelectedPicture] = useState(currentPicture);

    const handleSelect = (index: number) => {
        setSelectedPicture(index);
        onSelect(index);
        onClose();
    };

    const renderPictureItem = ({ item, index }: { item: any; index: number }) => {
        const isSelected = index === selectedPicture;

        return (
            <TouchableOpacity
                style={[styles.pictureItem, isSelected && styles.selectedPictureItem]}
                onPress={() => handleSelect(index)}
            >
                <Image source={item} style={styles.pictureImage} />
                {isSelected && (
                    <View style={styles.checkmarkContainer}>
                        <Ionicons name="checkmark-circle" size={24} color="#7fb069" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Choose Profile Picture</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={PROFILE_PICTURES}
                        renderItem={renderPictureItem}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={3}
                        contentContainerStyle={styles.gridContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalContainer: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    title: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    gridContent: {
        padding: spacing.md,
        gap: spacing.md,
    },
    pictureItem: {
        flex: 1,
        aspectRatio: 1,
        margin: spacing.xs,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
    },
    selectedPictureItem: {
        borderColor: '#7fb069',
    },
    pictureImage: {
        width: '100%',
        height: '100%',
        borderRadius: borderRadius.lg,
    },
    checkmarkContainer: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: colors.white,
        borderRadius: borderRadius.round,
    },
});
