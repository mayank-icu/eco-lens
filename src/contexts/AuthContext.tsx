import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserData } from '../services/auth';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    refreshUser: (uid?: string) => Promise<void>;
    loginAsGuest: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
    updateProfilePicture: (index: number) => Promise<void>;
    deleteAccount: (password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    firebaseUser: null,
    loading: true,
    refreshUser: async () => { },
    loginAsGuest: async () => { },
    updateUser: () => { },
    updateProfilePicture: async () => { },
    deleteAccount: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async (uid?: string) => {
        const targetUid = uid || firebaseUser?.uid;
        if (targetUid) {
            const userData = await getUserData(targetUid);
            setUser(userData);
        }
    };

    const updateUser = (data: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...data });
        }
    };

    const loginAsGuest = async () => {
        const guestUser: User = {
            uid: 'guest-' + Date.now(),
            email: 'guest@e',
            displayName: 'Guest User',
            photoURL: null,
            school: null,
            createdAt: new Date(),
            totalPoints: 0,
            level: 1,
            currentStreak: 0,
            longestStreak: 0,
            totalScans: 0,
            co2Saved: 0,
            streakFreezes: 0,
            isGuest: true,
        };
        setUser(guestUser);
    };

    const updateProfilePicture = async (pictureIndex: number) => {
        if (!firebaseUser || !user) return;

        try {
            const { doc, updateDoc } = await import('firebase/firestore');
            const { db } = await import('../services/firebase');

            const photoURL = `pf/${pictureIndex + 1}.png`;
            const userRef = doc(db, 'users', firebaseUser.uid);
            await updateDoc(userRef, { photoURL });

            setUser(prev => prev ? { ...prev, photoURL } : null);
        } catch (error) {
            console.error('Profile picture update error:', error);
            throw error;
        }
    };

    const deleteAccount = async (password: string) => {
        if (!firebaseUser) return;

        try {
            const { doc, deleteDoc } = await import('firebase/firestore');
            const { db } = await import('../services/firebase');
            const { deleteUser, EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');

            const credential = EmailAuthProvider.credential(firebaseUser.email!, password);
            await reauthenticateWithCredential(firebaseUser, credential);

            const userRef = doc(db, 'users', firebaseUser.uid);
            await deleteDoc(userRef);

            await deleteUser(firebaseUser);

            setUser(null);
            setFirebaseUser(null);
        } catch (error) {
            console.error('Delete account error:', error);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);

            if (fbUser) {
                const userData = await getUserData(fbUser.uid);
                setUser(userData);
            } else {
                // Only set user to null if we are not in guest mode (which we can't easily check here without persistent state)
                // For now, let's assume if firebase auth state changes to null, we log out.
                // But wait, loginAsGuest sets 'user' state directly.
                // If onAuthStateChanged fires with null (e.g. on app start), it might overwrite our guest user if we are not careful.
                // However, onAuthStateChanged usually fires once on mount.
                // If we call loginAsGuest, it will set the user.
                // If the user logs out, we should probably clear the guest state too.
                setUser(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            firebaseUser,
            loading,
            refreshUser,
            loginAsGuest,
            updateUser,
            updateProfilePicture,
            deleteAccount
        }}>
            {children}
        </AuthContext.Provider>
    );
};
