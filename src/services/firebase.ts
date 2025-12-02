import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAhM0JcNuF27zEzWKqV1KtQuS9mrH-lG2s",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "plasti-sort.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "plasti-sort",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "plasti-sort.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "493205509472",
    appId: process.env.FIREBASE_APP_ID || "1:493205509472:web:95748e6a5a79a5087d7a05",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-C27K1XM49S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth: Auth;

if (Platform.OS === 'web') {
    auth = getAuth(app);
} else {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
