import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Platform,
    Image,
    Modal,
    ScrollView,
    Pressable,
    TextInput,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { colors as staticColors, spacing, typography, borderRadius } from '../constants/theme';
import { loadModel, runInference } from '../services/ai';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import { useGamification } from '../contexts/GamificationContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function ScanScreen({ navigation }: any) {
    const { recordScan } = useGamification();
    const { showToast } = useToast();
    const { colors } = useTheme();

    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [showTips, setShowTips] = useState(false);
    const [flashEnabled, setFlashEnabled] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const animationRef = useRef<LottieView>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportErrors, setReportErrors] = useState({
        wrongType: false,
        lowConfidence: false,
        wrongBin: false,
        other: false,
    });
    const [reportFeedback, setReportFeedback] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadModel();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if (scanning && animationRef.current) {
            animationRef.current.play();
        }
    }, [scanning]);

    const playScanSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/scan.mp3')
            );
            await sound.playAsync();
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    };

    const processImage = async (uri: string) => {
        setImageUri(uri);
        setScanning(true);

        setTimeout(async () => {
            try {
                const classification = await runInference(uri);
                setScanning(false);

                if (classification) {
                    playScanSound();
                    const isRecyclable = classification.binColor === 'green';
                    const co2Amount = isRecyclable ? Math.floor(Math.random() * 50) + 10 : 0;

                    setResult({
                        plasticType: classification.plasticType,
                        confidence: Math.round(classification.confidence * 100),
                        binColor: classification.binColor,
                        co2Saved: co2Amount,
                        educationalInfo: classification.educationalInfo,
                        recyclable: isRecyclable,
                        isPlastic: classification.isPlastic
                    });
                } else {
                    setScanning(false);
                    setImageUri(null);
                    showToast('Could not identify plastic type. Please try again.', 'error');
                }
            } catch (error) {
                setScanning(false);
                setImageUri(null);
                showToast('An error occurred during processing.', 'error');
            }
        }, 2000);
    };

    const handleTakePicture = async () => {
        if (!cameraRef.current) return;

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
            });
            if (photo) {
                await processImage(photo.uri);
            }
        } catch (error) {
            console.error('Camera error:', error);
            showToast('Failed to take picture. Please try again.', 'error');
        }
    };

    const handleGalleryPick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            showToast('Gallery access is required to select images.', 'error');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
            await processImage(pickerResult.assets[0].uri);
        }
    };

    const handleFileDrop = async (event: any) => {
        event.preventDefault();
        setIsDragging(false);

        if (isWeb && event.dataTransfer?.files?.length > 0) {
            const file = event.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const uri = e.target?.result as string;
                    await processImage(uri);
                };
                reader.readAsDataURL(file);
            } else {
                showToast('Please upload an image file', 'error');
            }
        }
    };

    const handleFileSelect = async (event: any) => {
        if (isWeb && event.target?.files?.length > 0) {
            const file = event.target.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const uri = e.target?.result as string;
                    await processImage(uri);
                };
                reader.readAsDataURL(file);
            } else {
                showToast('Please upload an image file', 'error');
            }
        }
    };

    const handleLogScan = async () => {
        if (!result) return;

        const basePoints = 10;
        const confidenceBonus = Math.round((result.confidence / 100) * 10);
        const totalPoints = basePoints + confidenceBonus;

        // Use recordScan to add points and log history in one go
        await recordScan(result.co2Saved, totalPoints);

        showToast(`Item logged! +${totalPoints} points earned! 🎉`, 'success');
        resetScan();
    };

    const resetScan = () => {
        setResult(null);
        setImageUri(null);
        setScanning(false);
    };

    const handleSubmitReport = () => {
        const selectedErrors = Object.entries(reportErrors)
            .filter(([_, value]) => value)
            .map(([key]) => key);

        if (selectedErrors.length === 0) {
            showToast('Please select at least one issue', 'error');
            return;
        }

        console.log('Report submitted:', { errors: selectedErrors, feedback: reportFeedback });
        showToast('Thank you for your feedback! We\'ll review this result.', 'success');

        setShowReportModal(false);
        setReportErrors({ wrongType: false, lowConfidence: false, wrongBin: false, other: false });
        setReportFeedback('');
    };

    // Scanning State
    if (scanning && imageUri) {
        return (
            <View style={styles.fullscreenContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <View style={styles.scanningOverlay}>
                    <View style={styles.scanningContent}>
                        <LottieView
                            ref={animationRef}
                            source={require('../assets/animations/scanner.json')}
                            autoPlay
                            loop
                            style={styles.lottieAnimation}
                        />
                        <Text style={styles.scanningTitle}>Analyzing Plastic...</Text>
                        <Text style={styles.scanningSubtext}>AI is identifying the plastic type</Text>
                    </View>
                </View>
            </View>
        );
    }

    // Result State
    if (result) {
        const isPlastic = result.isPlastic !== false; // Default to true if undefined (legacy)
        const isRecyclable = result.recyclable;
        const statusColor = isPlastic
            ? (isRecyclable ? '#58CC02' : '#e76f51')
            : '#f4a261'; // Orange for non-plastic/unknown

        return (
            <View style={styles.fullscreenContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

                {/* Result Header */}
                <View style={styles.resultHeader}>
                    <TouchableOpacity onPress={resetScan} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.resultHeaderTitle}>Scan Result</Text>
                    <TouchableOpacity onPress={() => setShowReportModal(true)} style={styles.reportButton}>
                        <Ionicons name="flag-outline" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.resultContainer} showsVerticalScrollIndicator={false}>
                    {/* Image Preview Card */}
                    <View style={styles.imageCard}>
                        {imageUri && (
                            <Image source={{ uri: imageUri }} style={styles.resultImage} />
                        )}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={styles.imageOverlay}
                        >
                            <View style={styles.imageOverlayContent}>
                                <Text style={styles.overlayTitle}>{result.name}</Text>
                                <View style={[styles.confidenceTag, { backgroundColor: statusColor }]}>
                                    <MaterialCommunityIcons name="check-decagram" size={14} color="#fff" />
                                    <Text style={styles.confidenceTagText}>{result.confidence}% Confidence</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Main Status Card */}
                    <View style={styles.statusCard}>
                        <View style={[styles.statusIconContainer, { backgroundColor: `${statusColor}20` }]}>
                            <MaterialCommunityIcons
                                name={!isPlastic ? "alert-circle-outline" : (isRecyclable ? "recycle" : "trash-can-outline")}
                                size={48}
                                color={statusColor}
                            />
                        </View>
                        <Text style={styles.statusTitle}>
                            {!isPlastic ? "Not a Plastic Item" : (isRecyclable ? "Recyclable Plastic" : "Non-Recyclable")}
                        </Text>
                        <Text style={styles.statusSubtitle}>
                            {result.plasticType === 'Not Plastic'
                                ? "This item appears to be non-plastic."
                                : `Identified as ${result.plasticType}`}
                        </Text>
                    </View>

                    {/* Action Cards Grid */}
                    <View style={styles.gridContainer}>
                        {/* Disposal Guide */}
                        <View style={styles.gridCard}>
                            <View style={[styles.cardIcon, { backgroundColor: '#e3f2fd' }]}>
                                <MaterialCommunityIcons name="delete-variant" size={24} color="#2196f3" />
                            </View>
                            <Text style={styles.cardLabel}>Disposal</Text>
                            <Text style={[styles.cardValue, { color: isRecyclable ? '#58CC02' : '#e76f51' }]}>
                                {isRecyclable ? 'Green Bin' : 'Red Bin'}
                            </Text>
                        </View>

                        {/* CO2 Impact (Only for plastics) */}
                        {isPlastic && (
                            <View style={styles.gridCard}>
                                <View style={[styles.cardIcon, { backgroundColor: '#e8f5e9' }]}>
                                    <MaterialCommunityIcons name="leaf" size={24} color="#58CC02" />
                                </View>
                                <Text style={styles.cardLabel}>Impact</Text>
                                <Text style={styles.cardValue}>{result.co2Saved}g CO₂</Text>
                            </View>
                        )}
                    </View>

                    {/* Educational Info */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <Ionicons name="information-circle" size={24} color={colors.primary} />
                            <Text style={styles.infoTitle}>About this Item</Text>
                        </View>
                        <Text style={styles.infoText}>{result.educationalInfo}</Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        {isPlastic && (
                            <TouchableOpacity style={styles.primaryButton} onPress={handleLogScan}>
                                <LinearGradient
                                    colors={['#58CC02', '#4CAF50']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.primaryButtonGradient}
                                >
                                    <Ionicons name="add-circle-outline" size={24} color="#fff" />
                                    <Text style={styles.primaryButtonText}>Log to History</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={resetScan}
                        >
                            <Text style={styles.secondaryButtonText}>
                                Scan Another Item
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>


                {/* Report Modal */}
                <Modal
                    visible={showReportModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowReportModal(false)}
                >
                    <Pressable style={styles.modalOverlay} onPress={() => setShowReportModal(false)}>
                        <Pressable style={styles.tipsModal} onPress={(e) => e.stopPropagation()}>
                            <View style={styles.tipsHeader}>
                                <Text style={styles.tipsTitle}>Report Wrong Result</Text>
                                <TouchableOpacity onPress={() => setShowReportModal(false)}>
                                    <Ionicons name="close-circle" size={32} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.tipsScrollView} showsVerticalScrollIndicator={false}>
                                <Text style={styles.reportSubtitle}>What's wrong with this result?</Text>

                                <View style={styles.checkboxContainer}>
                                    <TouchableOpacity
                                        style={styles.checkboxRow}
                                        onPress={() => setReportErrors(prev => ({ ...prev, wrongType: !prev.wrongType }))}
                                    >
                                        <View style={[styles.checkbox, reportErrors.wrongType && styles.checkboxChecked]}>
                                            {reportErrors.wrongType && <Ionicons name="checkmark" size={18} color="#fff" />}
                                        </View>
                                        <Text style={styles.checkboxLabel}>Wrong plastic type identified</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.checkboxRow}
                                        onPress={() => setReportErrors(prev => ({ ...prev, lowConfidence: !prev.lowConfidence }))}
                                    >
                                        <View style={[styles.checkbox, reportErrors.lowConfidence && styles.checkboxChecked]}>
                                            {reportErrors.lowConfidence && <Ionicons name="checkmark" size={18} color="#fff" />}
                                        </View>
                                        <Text style={styles.checkboxLabel}>Low confidence score</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.checkboxRow}
                                        onPress={() => setReportErrors(prev => ({ ...prev, wrongBin: !prev.wrongBin }))}
                                    >
                                        <View style={[styles.checkbox, reportErrors.wrongBin && styles.checkboxChecked]}>
                                            {reportErrors.wrongBin && <Ionicons name="checkmark" size={18} color="#fff" />}
                                        </View>
                                        <Text style={styles.checkboxLabel}>Incorrect bin color</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.checkboxRow}
                                        onPress={() => setReportErrors(prev => ({ ...prev, other: !prev.other }))}
                                    >
                                        <View style={[styles.checkbox, reportErrors.other && styles.checkboxChecked]}>
                                            {reportErrors.other && <Ionicons name="checkmark" size={18} color="#fff" />}
                                        </View>
                                        <Text style={styles.checkboxLabel}>Other</Text>
                                    </TouchableOpacity>
                                </View>

                                {reportErrors.other && (
                                    <View style={styles.feedbackContainer}>
                                        <Text style={styles.feedbackLabel}>Please describe the issue:</Text>
                                        <TextInput
                                            style={styles.feedbackInput}
                                            placeholder="Type your feedback here..."
                                            placeholderTextColor="#95a5a6"
                                            multiline
                                            numberOfLines={4}
                                            value={reportFeedback}
                                            onChangeText={setReportFeedback}
                                        />
                                    </View>
                                )}

                                <TouchableOpacity style={styles.submitReportButton} onPress={handleSubmitReport}>
                                    <Text style={styles.submitReportText}>Submit Report</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
        );
    }

    // Web Interface
    if (isWeb) {
        return (
            <View style={styles.fullscreenContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />

                <Animated.View style={[styles.webContainer, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={styles.webHeader}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.webBackButton}>
                            <Ionicons name="arrow-back" size={24} color={staticColors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.webHeaderTitle}>Scan Plastic</Text>
                        <TouchableOpacity style={styles.webHelpButton} onPress={() => setShowTips(true)}>
                            <Ionicons name="help-circle-outline" size={28} color="#7fb069" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.webScrollView}
                        contentContainerStyle={styles.webScrollContent}
                        showsVerticalScrollIndicator={false}
                    >


                        {/* Upload Area - Drag and drop events are web-only */}
                        {/* Upload Area - Drag and drop events are web-only */}
                        {/* @ts-ignore */}
                        <View
                            style={[
                                styles.uploadArea,
                                isDragging && styles.uploadAreaDragging
                            ]}
                            onDragOver={(e: any) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleFileDrop}
                        >
                            <MaterialCommunityIcons
                                name="cloud-upload-outline"
                                size={80}
                                color={isDragging ? "#58CC02" : "#7fb069"}
                            />
                            <Text style={styles.uploadTitle}>
                                {isDragging ? "Drop your image here" : "Upload Plastic Image"}
                            </Text>
                            <Text style={styles.uploadSubtitle}>
                                Drag and drop an image or click to browse
                            </Text>

                            <View style={styles.uploadButtons}>
                                <TouchableOpacity
                                    style={styles.uploadButton}
                                    onPress={() => {
                                        // @ts-ignore
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = handleFileSelect;
                                        input.click();
                                    }}
                                >
                                    <LinearGradient
                                        colors={['#7fb069', '#58CC02']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.uploadButtonGradient}
                                    >
                                        <Ionicons name="folder-open-outline" size={24} color="#fff" />
                                        <Text style={styles.uploadButtonText}>Choose File</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                {!isWeb && (
                                    <TouchableOpacity
                                        style={styles.galleryButton}
                                        onPress={handleGalleryPick}
                                    >
                                        <Ionicons name="images-outline" size={24} color="#7fb069" />
                                        <Text style={styles.galleryButtonText}>From Gallery</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <Text style={styles.uploadHint}>
                                Supported formats: JPG, PNG, WEBP
                            </Text>
                        </View>


                    </ScrollView>
                </Animated.View>

                {/* Tips Modal */}
                <Modal
                    visible={showTips}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowTips(false)}
                >
                    <Pressable style={styles.modalOverlay} onPress={() => setShowTips(false)}>
                        <Pressable style={styles.tipsModal} onPress={(e) => e.stopPropagation()}>
                            <View style={styles.tipsHeader}>
                                <Text style={styles.tipsTitle}>Tips & Tricks</Text>
                                <TouchableOpacity onPress={() => setShowTips(false)}>
                                    <Ionicons name="close-circle" size={32} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.tipsScrollView} showsVerticalScrollIndicator={false}>
                                <View style={styles.tipsList}>
                                    <View style={styles.tipCard}>
                                        <Ionicons name="sunny" size={32} color="#7fb069" />
                                        <Text style={styles.tipTitle}>Good Lighting</Text>
                                        <Text style={styles.tipDescription}>
                                            Ensure the item is well-lit for better recognition
                                        </Text>
                                    </View>

                                    <View style={styles.tipCard}>
                                        <MaterialCommunityIcons name="crop-square" size={32} color="#7fb069" />
                                        <Text style={styles.tipTitle}>Center the Item</Text>
                                        <Text style={styles.tipDescription}>
                                            Keep the plastic item centered in the frame
                                        </Text>
                                    </View>

                                    <View style={styles.tipCard}>
                                        <MaterialCommunityIcons name="focus-field" size={32} color="#7fb069" />
                                        <Text style={styles.tipTitle}>Clear Focus</Text>
                                        <Text style={styles.tipDescription}>
                                            Make sure the recycling symbol is clearly visible
                                        </Text>
                                    </View>

                                    <View style={styles.tipCard}>
                                        <Ionicons name="hand-left" size={32} color="#7fb069" />
                                        <Text style={styles.tipTitle}>High Quality</Text>
                                        <Text style={styles.tipDescription}>
                                            Use high-resolution images for best results
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.helpButton}
                                    onPress={() => {
                                        setShowTips(false);
                                        navigation.navigate('Help');
                                    }}
                                >
                                    <Text style={styles.helpButtonText}>Need More Help?</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#7fb069" />
                                </TouchableOpacity>
                            </ScrollView>
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
        );
    }

    // Mobile Permission Handling
    if (!permission) {
        // Camera permissions are still loading
        return <View style={styles.fullscreenContainer} />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.fullscreenContainer, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 18, color: colors.textPrimary }}>
                    We need your permission to show the camera
                </Text>
                <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
                    <LinearGradient
                        colors={['#7fb069', '#58CC02']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.primaryButtonGradient}
                    >
                        <Text style={styles.primaryButtonText}>Grant Permission</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }

    // Mobile Camera View
    return (
        <View style={styles.fullscreenContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
                enableTorch={flashEnabled}
            >
                <View style={styles.cameraHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                        <Ionicons name="close" size={28} color={colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.cameraTitle}>Scan Plastic</Text>
                    <TouchableOpacity style={styles.headerButton} onPress={() => setShowTips(true)}>
                        <Ionicons name="help-circle-outline" size={28} color={colors.white} />
                    </TouchableOpacity>
                </View>

                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructions}>
                        Point camera at the recycling symbol or plastic item
                    </Text>
                </View>

                <View style={styles.viewfinderContainer}>
                    <View style={styles.simpleFrame}>
                        <View style={[styles.corner, styles.cornerTopLeft]} />
                        <View style={[styles.corner, styles.cornerTopRight]} />
                        <View style={[styles.corner, styles.cornerBottomLeft]} />
                        <View style={[styles.corner, styles.cornerBottomRight]} />
                    </View>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleGalleryPick}>
                        <Ionicons name="images-outline" size={28} color="#7fb069" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.scanButton} onPress={handleTakePicture}>
                        <LinearGradient
                            colors={['#7fb069', '#58CC02']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.scanGradient}
                        >
                            <MaterialCommunityIcons name="camera" size={32} color={colors.white} />
                            <Text style={styles.scanText}>SCAN</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setFlashEnabled(!flashEnabled)}
                    >
                        <Ionicons
                            name={flashEnabled ? "flash" : "flash-outline"}
                            size={28}
                            color="#7fb069"
                        />
                    </TouchableOpacity>
                </View>
            </CameraView>

            <Modal
                visible={showTips}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowTips(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.tipsModal}>
                        <View style={styles.tipsHeader}>
                            <Text style={styles.tipsTitle}>Tips & Tricks</Text>
                            <TouchableOpacity onPress={() => setShowTips(false)}>
                                <Ionicons name="close-circle" size={32} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.tipsScrollView}
                            contentContainerStyle={styles.tipsScrollContent}
                            showsVerticalScrollIndicator={false}
                            bounces={true}
                        >
                            <View style={styles.tipsList}>
                                <View style={styles.tipCard}>
                                    <Ionicons name="sunny" size={32} color="#7fb069" />
                                    <Text style={styles.tipTitle}>Good Lighting</Text>
                                    <Text style={styles.tipDescription}>
                                        Ensure the item is well-lit for better recognition
                                    </Text>
                                </View>

                                <View style={styles.tipCard}>
                                    <MaterialCommunityIcons name="crop-square" size={32} color="#7fb069" />
                                    <Text style={styles.tipTitle}>Center the Item</Text>
                                    <Text style={styles.tipDescription}>
                                        Keep the plastic item centered in the frame
                                    </Text>
                                </View>

                                <View style={styles.tipCard}>
                                    <MaterialCommunityIcons name="focus-field" size={32} color="#7fb069" />
                                    <Text style={styles.tipTitle}>Clear Focus</Text>
                                    <Text style={styles.tipDescription}>
                                        Make sure the recycling symbol is clearly visible
                                    </Text>
                                </View>

                                <View style={styles.tipCard}>
                                    <Ionicons name="hand-left" size={32} color="#7fb069" />
                                    <Text style={styles.tipTitle}>Hold Steady</Text>
                                    <Text style={styles.tipDescription}>
                                        Keep your phone steady while scanning
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.helpButton}
                                onPress={() => {
                                    setShowTips(false);
                                    navigation.navigate('Help');
                                }}
                            >
                                <Text style={styles.helpButtonText}>Need More Help?</Text>
                                <Ionicons name="arrow-forward" size={20} color="#7fb069" />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    fullscreenContainer: {
        flex: 1,
        backgroundColor: '#e8e2d1',
    },
    webContainer: {
        flex: 1,
    },
    webHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || spacing.xl : spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: '#e8e2d1',
    },
    webBackButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.round,
        backgroundColor: staticColors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    webHeaderTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.textPrimary,
    },
    webHelpButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webScrollView: {
        flex: 1,
    },
    webScrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxxl,
    },

    uploadArea: {
        backgroundColor: staticColors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.xxxl,
        alignItems: 'center',
        marginVertical: spacing.xl,
        borderWidth: 3,
        borderStyle: 'dashed',
        borderColor: '#7fb069',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    uploadAreaDragging: {
        borderColor: '#58CC02',
        backgroundColor: '#f0f9eb',
    },
    uploadTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.textPrimary,
        marginTop: spacing.lg,
        marginBottom: spacing.xs,
    },
    uploadSubtitle: {
        fontSize: typography.fontSize.body,
        color: staticColors.textSecondary,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    uploadButtons: {
        flexDirection: isWeb ? 'row' : 'column',
        gap: spacing.md,
        width: '100%',
        maxWidth: 400,
    },
    uploadButton: {
        flex: 1,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    uploadButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
    },
    uploadButtonText: {
        color: staticColors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    galleryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        borderColor: '#7fb069',
        backgroundColor: staticColors.white,
    },
    galleryButtonText: {
        color: '#7fb069',
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    uploadHint: {
        fontSize: typography.fontSize.small,
        color: staticColors.textSecondary,
        marginTop: spacing.lg,
    },


    camera: {
        flex: 1,
    },
    previewImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    scanningOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanningContent: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    lottieAnimation: {
        width: 280,
        height: 280,
        marginBottom: spacing.xl,
    },
    scanningTitle: {
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.white,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    scanningSubtext: {
        fontSize: typography.fontSize.body,
        color: '#7fb069',
        textAlign: 'center',
    },
    cameraHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || spacing.xl : spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.round,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.white,
    },
    instructionsContainer: {
        paddingHorizontal: spacing.xl,
        marginTop: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        paddingVertical: spacing.sm,
    },
    instructions: {
        fontSize: typography.fontSize.small,
        color: staticColors.white,
        textAlign: 'center',
        lineHeight: typography.fontSize.small * 1.5,
    },
    viewfinderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    simpleFrame: {
        width: width * 0.7,
        height: width * 0.7,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderColor: '#7fb069',
        borderWidth: 4,
    },
    cornerTopLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: borderRadius.md,
    },
    cornerTopRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: borderRadius.md,
    },
    cornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: borderRadius.md,
    },
    cornerBottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: borderRadius.md,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg,
        paddingTop: spacing.md,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    iconButton: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.round,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButton: {
        width: 140,
        height: 60,
        borderRadius: borderRadius.xl,
    },
    scanGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        borderRadius: borderRadius.xl,
    },
    scanText: {
        color: staticColors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        letterSpacing: 1.5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    tipsModal: {
        backgroundColor: staticColors.white,
        borderTopLeftRadius: borderRadius.xxl,
        borderTopRightRadius: borderRadius.xxl,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.lg,
        maxHeight: '65%',
    },
    tipsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    tipsTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.textPrimary,
    },
    tipsScrollView: {
        flexGrow: 0,
    },
    tipsList: {
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    tipCard: {
        backgroundColor: staticColors.lightGray,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
    },
    tipTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.textPrimary,
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
    },
    tipDescription: {
        fontSize: typography.fontSize.small,
        color: staticColors.textSecondary,
        textAlign: 'center',
        lineHeight: typography.fontSize.small * 1.5,
    },
    helpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: '#7fb069',
    },
    helpButtonText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: '#7fb069',
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || spacing.md : spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: '#e8e2d1',
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.round,
        backgroundColor: staticColors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    reportButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.round,
        backgroundColor: staticColors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    resultHeaderTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.textPrimary,
    },
    resultContainer: {
        flex: 1,
        backgroundColor: staticColors.lightGray,
    },
    imagePreviewContainer: {
        backgroundColor: staticColors.white,
        marginBottom: spacing.md,
        overflow: 'hidden',
    },
    resultImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    successIconContainer: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        backgroundColor: staticColors.white,
        marginBottom: spacing.md,
    },
    successGradient: {
        width: 120,
        height: 120,
        borderRadius: borderRadius.round,
        alignItems: 'center',
        justifyContent: 'center',
    },
    plasticCard: {
        backgroundColor: staticColors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.md,
        marginHorizontal: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    plasticType: {
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        color: '#7fb069',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    confidenceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.round,
    },
    confidenceText: {
        color: staticColors.white,
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.bold,
    },
    binCard: {
        backgroundColor: staticColors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        marginHorizontal: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    binHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    binLabel: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.textSecondary,
    },
    binPill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.lg,
    },
    binText: {
        color: staticColors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    impactCard: {
        backgroundColor: staticColors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        marginHorizontal: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    impactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    impactTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: '#7fb069',
    },
    impactText: {
        fontSize: typography.fontSize.body,
        color: staticColors.textPrimary,
        lineHeight: typography.fontSize.body * 1.5,
    },
    impactValue: {
        fontWeight: typography.fontWeight.bold,
        color: '#7fb069',
        fontSize: typography.fontSize.heading,
    },
    eduCard: {
        backgroundColor: staticColors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        marginHorizontal: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    eduHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    eduTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: '#7fb069',
    },
    eduText: {
        fontSize: typography.fontSize.body,
        color: staticColors.textSecondary,
        lineHeight: typography.fontSize.body * 1.5,
    },
    actions: {
        gap: spacing.md,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xxxl,
        paddingTop: spacing.md,
    },
    primaryButton: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        shadowColor: '#7fb069',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
    },
    primaryButtonText: {
        color: staticColors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        borderColor: '#7fb069',
        backgroundColor: staticColors.white,
    },
    secondaryButtonText: {
        color: '#7fb069',
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    reportSubtitle: {
        fontSize: typography.fontSize.body,
        color: staticColors.textSecondary,
        marginBottom: spacing.md,
        fontWeight: typography.fontWeight.semiBold,
    },
    checkboxContainer: {
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#7fb069',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#7fb069',
    },
    checkboxLabel: {
        fontSize: typography.fontSize.body,
        color: staticColors.textPrimary,
        flex: 1,
    },
    feedbackContainer: {
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    feedbackLabel: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: staticColors.textPrimary,
        marginBottom: spacing.sm,
    },
    feedbackInput: {
        backgroundColor: staticColors.lightGray,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        fontSize: typography.fontSize.body,
        color: staticColors.textPrimary,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    submitReportButton: {
        backgroundColor: '#7fb069',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginTop: spacing.md,
        shadowColor: '#7fb069',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitReportText: {
        color: staticColors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
    // New Result View Styles
    imageCard: {
        height: 300,
        backgroundColor: '#000',
        position: 'relative',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        justifyContent: 'flex-end',
        padding: spacing.lg,
    },
    imageOverlayContent: {
        gap: spacing.xs,
    },
    overlayTitle: {
        color: '#fff',
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    confidenceTag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    confidenceTagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statusCard: {
        backgroundColor: '#fff',
        margin: spacing.md,
        marginTop: -20,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    statusIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    statusTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: staticColors.textPrimary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    statusSubtitle: {
        fontSize: typography.fontSize.body,
        color: staticColors.textSecondary,
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    gridCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    cardLabel: {
        fontSize: 12,
        color: staticColors.textSecondary,
        fontWeight: '600',
        marginBottom: 2,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: staticColors.textPrimary,
    },
    infoCard: {
        backgroundColor: '#fff',
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    infoTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: 'bold',
        color: staticColors.textPrimary,
    },
    infoText: {
        fontSize: typography.fontSize.body,
        color: staticColors.textSecondary,
        lineHeight: 24,
    },
});
