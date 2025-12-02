import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserData } from '../services/auth';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    loginAsGuest: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    firebaseUser: null,
    loading: true,
    refreshUser: async () => { },
    loginAsGuest: async () => { },
    updateUser: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        if (firebaseUser) {
            const userData = await getUserData(firebaseUser.uid);
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
            email: 'guest@plastisort.ai',
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
        <AuthContext.Provider value={{ user, firebaseUser, loading, refreshUser, loginAsGuest, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
