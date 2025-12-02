import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    } as any),
});

export const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
    }

    try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } catch (e) {
        console.log('Error getting push token', e);
    }

    return token;
};

export const scheduleDailyNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Don't break your streak! 🔥",
            body: 'Scan a plastic item today to keep your streak alive and earn XP!',
            sound: true,
        },
        trigger: {
            hour: 18,
            minute: 0,
            repeats: true,
        } as any,
    });
};
