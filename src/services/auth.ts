import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInAnonymously,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile,
    User as FirebaseUser,
    GoogleAuthProvider,
    signInWithCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

// Sign up with email and password
export const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
): Promise<FirebaseUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    // Create user document in Firestore
    await createUserDocument(userCredential.user, false);

    return userCredential.user;
};

// Sign in with email and password
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<FirebaseUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

// Sign in as guest
export const signInAsGuest = async (): Promise<FirebaseUser> => {
    const userCredential = await signInAnonymously(auth);

    // Create guest user document
    await createUserDocument(userCredential.user, true);

    return userCredential.user;
};

// Sign out
export const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
};

// Create user document in Firestore
const createUserDocument = async (
    firebaseUser: FirebaseUser,
    isGuest: boolean
): Promise<void> => {
    const userRef = doc(db, 'users', firebaseUser.uid);

    // Check if user already exists
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return;
    }

    const userData: Omit<User, 'uid'> = {
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || (isGuest ? 'Guest User' : 'User'),
        photoURL: firebaseUser.photoURL,
        school: null,
        createdAt: new Date(),
        totalPoints: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        totalScans: 0,
        co2Saved: 0,
        streakFreezes: 0,
        isGuest,
    };

    await setDoc(userRef, userData);
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<User | null> => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        return {
            uid,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            lastActiveDate: data.lastActiveDate?.toDate ? data.lastActiveDate.toDate() : (data.lastActiveDate ? new Date(data.lastActiveDate) : undefined),
            lastClaimDate: data.lastClaimDate?.toDate ? data.lastClaimDate.toDate() : (data.lastClaimDate ? new Date(data.lastClaimDate) : undefined),
        } as User;
    }

    return null;
};

// Update user profile
export const updateUserProfile = async (
    uid: string,
    updates: Partial<User>
): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
};

// Convert guest to full account
export const convertGuestToAccount = async (
    email: string,
    password: string,
    displayName: string
): Promise<void> => {
    if (!auth.currentUser || !auth.currentUser.isAnonymous) {
        throw new Error('No guest user to convert');
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);

    // Update user document
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, {
        email,
        displayName,
        isGuest: false,
    });

    await updateProfile(auth.currentUser, { displayName });
};
