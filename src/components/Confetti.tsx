import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import LottieView from 'lottie-react-native';

interface ConfettiProps {
    visible: boolean;
    onAnimationFinish?: () => void;
}

export default function Confetti({ visible, onAnimationFinish }: ConfettiProps) {
    const animation = useRef<LottieView>(null);

    useEffect(() => {
        if (visible) {
            animation.current?.play();
        } else {
            animation.current?.reset();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.container} pointerEvents="none">
                <LottieView
                    ref={animation}
                    // Fallback to tree animation if confetti is missing for now, 
                    // but ideally this should be a confetti.json
                    source={require('../../assets/animations/confetti.json')} // Updated path
                    style={styles.animation}
                    autoPlay
                    loop={false}
                    onAnimationFinish={onAnimationFinish}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    animation: {
        width: '100%',
        height: '100%',
    },
});
