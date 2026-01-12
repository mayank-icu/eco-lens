import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    StatusBar,
    Image,
    Animated,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

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
    headerTitle: {
        fontSize: typography.fontSize.heading,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    timerText: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.medium,
        color: colors.textSecondary,
    },
    timerTextUrgent: {
        color: '#E74C3C',
        fontWeight: typography.fontWeight.bold,
    },

    // Trophy
    trophyContainer: {
        backgroundColor: colors.lightGray,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    trophyScroll: {
        paddingHorizontal: spacing.lg,
        gap: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trophyItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    trophyImageLarge: {
        width: 90,
        height: 90,
    },
    trophyImageSmall: {
        width: 60,
        height: 60,
    },
    greyscale: {
        opacity: 0.4,
    },

    // List
    listContent: {
        paddingBottom: spacing.xl,
        backgroundColor: colors.lightGray,
    },

    // User Row
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.lightGray,
        borderBottomWidth: 1,
        borderBottomColor: '#e8e2d1',
    },
    currentUserRow: {
        backgroundColor: '#f0f8f0',
        borderLeftWidth: 4,
        borderLeftColor: '#7fb069',
    },

    // Rank
    rankContainer: {
        width: 32,
        alignItems: 'center',
    },
    rankText: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.medium,
        color: colors.textSecondary,
    },
    medalBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goldBadge: {
        backgroundColor: '#FFD700',
    },
    silverBadge: {
        backgroundColor: '#C0C0C0',
    },
    bronzeBadge: {
        backgroundColor: '#CD7F32',
    },
    medalText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },

    // Avatar
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#7fb069',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.md,
    },
    avatarText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },

    // User Name
    userName: {
        flex: 1,
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.medium,
        color: colors.textSecondary,
        marginLeft: spacing.md,
    },

    // Points
    pointsContainer: {
        alignItems: 'flex-end',
        position: 'relative',
    },
    pointsText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: '#7fb069',
    },
    rankChangeIndicator: {
        position: 'absolute',
        top: -8,
        right: -8,
    },

    // Zone Labels
    zoneLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        backgroundColor: '#f5f9f3',
        gap: spacing.xs,
    },
    zoneLabelText: {
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.bold,
        color: '#7fb069',
        textTransform: 'uppercase',
    },

    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.lightGray,
    },
    lockIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#7fb069',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    emptyLottie: {
        width: 200,
        height: 200,
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: typography.fontSize.body * 1.5,
    },
    authButton: {
        marginTop: spacing.xl,
        backgroundColor: '#7fb069',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xxl,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    authButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.bold,
    },
});

type LeagueType = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

interface LeaderboardUser {
    id: string;
    name: string;
    impactPoints: number;
    rank: number;
    previousRank?: number;
}

export default function LeaderboardScreen({ navigation }: any) {
    const getTimeUntilSunday = (): { text: string; hours: number } => {
        const now = new Date();
        const daysUntilSunday = (7 - now.getDay()) % 7 || 7;

        if (daysUntilSunday === 1) {
            const hours = 24 - now.getHours();
            return { text: `${hours}h`, hours };
        }
        if (daysUntilSunday < 7) return { text: `${daysUntilSunday}d`, hours: daysUntilSunday * 24 };

        const hours = 23 - now.getHours();
        return { text: `${hours}h`, hours };
    };

    const AnimatedCounter = ({ value }: { value: number }) => {
        const [displayValue, setDisplayValue] = useState(0);

        useEffect(() => {
            let start = 0;
            const duration = 1000;
            const increment = value / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= value) {
                    setDisplayValue(value);
                    clearInterval(timer);
                } else {
                    setDisplayValue(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }, [value]);

        return <Text style={styles.pointsText}>{displayValue}</Text>;
    };
    const { user, updateUser: updateAuthUser } = useAuth();
    const [currentLeague, setCurrentLeague] = useState<LeagueType>('Bronze');
    const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
    const [timeLeft, setTimeLeft] = useState({ text: '', hours: 0 });
    const [loading, setLoading] = useState(true);
    const [previousRanks, setPreviousRanks] = useState<Map<string, number>>(new Map());

    useEffect(() => {
        if (user && !user.isGuest) {
            // Use stored league or default to Bronze
            setCurrentLeague(user.league || 'Bronze');
            fetchRealLeaderboard();
        } else if (user?.isGuest) {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const updateTimer = () => {
            setTimeLeft(getTimeUntilSunday());
        };
        updateTimer();
        const interval = setInterval(updateTimer, 60000);
        return () => clearInterval(interval);
    }, []);

    const checkLeagueProgression = async (currentRank: number) => {
        if (!user || user.isGuest || user.uid.startsWith('guest-')) return;

        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const lastCheck = user.lastLeagueCheck || 0;

        // Calculate week IDs (epoch weeks)
        const currentWeekId = Math.floor(now / oneWeek);
        const lastCheckedWeekId = Math.floor(lastCheck / oneWeek);

        // If it's a new week since we last checked
        if (currentWeekId > lastCheckedWeekId) {
            let newLeague = user.league || 'Bronze';
            let didChange = false;

            if (currentRank <= 5) {
                // Promote
                if (newLeague === 'Bronze') newLeague = 'Silver';
                else if (newLeague === 'Silver') newLeague = 'Gold';
                else if (newLeague === 'Gold') newLeague = 'Diamond';
                didChange = true;
            } else if (currentRank > 15 && newLeague !== 'Bronze') {
                // Demote (No demotion in Bronze)
                if (newLeague === 'Diamond') newLeague = 'Gold';
                else if (newLeague === 'Gold') newLeague = 'Silver';
                else if (newLeague === 'Silver') newLeague = 'Bronze';
                didChange = true;
            }

            // Update user profile
            try {
                const { doc, updateDoc } = await import('firebase/firestore');
                const userRef = doc(db, 'users', user.uid);

                await updateDoc(userRef, {
                    league: newLeague,
                    lastLeagueCheck: now
                });

                // Update local context
                updateAuthUser({
                    league: newLeague,
                    lastLeagueCheck: now
                });

                if (didChange && newLeague !== user.league) {
                    Alert.alert('League Update', `You are now in ${newLeague} League!`);
                }
            } catch (error) {
                console.error('Error updating league:', error);
            }
        }
    };

    const getWeekId = () => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
        return `${now.getFullYear()}-W${weekNum}`;
    };

    const assignUserToLeaderboard = async (currentLeague: string): Promise<string | undefined> => {
        if (!user || user.isGuest || user.uid.startsWith('guest-')) return undefined;

        const weekId = getWeekId();
        const baseId = `${currentLeague}_${weekId}`;

        // Check if user already has a valid leaderboard ID for this week
        if (user.leaderboardId && user.leaderboardId.startsWith(baseId)) {
            return user.leaderboardId;
        }

        try {
            const { doc, updateDoc, runTransaction } = await import('firebase/firestore');

            // Try to find an open bucket or create a new one
            // We'll check metadata or just try incremental IDs
            // Simplified: check buckets 0, 1, 2... until we find one with < 20 users

            let bucketIndex = 0;
            let assignedId = '';

            // Limit attempts to avoid infinite loops
            while (bucketIndex < 100) {
                const targetId = `${baseId}_${bucketIndex}`;
                const leaderboardRef = doc(db, 'leaderboards', targetId);

                // We need to do this atomically
                await runTransaction(db, async (transaction) => {
                    const lbDoc = await transaction.get(leaderboardRef);

                    if (!lbDoc.exists()) {
                        // Create new bucket
                        transaction.set(leaderboardRef, {
                            league: currentLeague,
                            weekId: weekId,
                            users: [user.uid],
                            userCount: 1,
                            createdAt: Date.now()
                        });
                        assignedId = targetId;
                    } else {
                        const data = lbDoc.data();
                        if (data.userCount < 20) {
                            // Add to existing bucket
                            if (!data.users.includes(user.uid)) {
                                transaction.update(leaderboardRef, {
                                    users: [...data.users, user.uid],
                                    userCount: data.userCount + 1
                                });
                            }
                            assignedId = targetId;
                        }
                    }
                });

                if (assignedId) break;
                bucketIndex++;
            }

            if (assignedId) {
                // Update user profile
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    leaderboardId: assignedId
                });

                // Update local context
                updateAuthUser({
                    leaderboardId: assignedId
                });

                return assignedId;
            }
        } catch (error) {
            console.error('Error assigning leaderboard:', error);
        }
        return undefined;
    };

    const fetchRealLeaderboard = async () => {
        if (!user || user.isGuest || user.uid.startsWith('guest-')) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);

            // Ensure user is assigned to a leaderboard
            let targetLeaderboardId: string | undefined = user?.leaderboardId || undefined;
            const currentWeekId = getWeekId();

            // If no ID or ID is from old week/league, re-assign
            if (!targetLeaderboardId || !targetLeaderboardId.includes(currentWeekId) || !targetLeaderboardId.startsWith(currentLeague)) {
                targetLeaderboardId = await assignUserToLeaderboard(currentLeague);
            }

            if (!targetLeaderboardId) {
                setLoading(false);
                return;
            }

            // Fetch users in this specific leaderboard bucket
            const { doc, getDoc, documentId, where } = await import('firebase/firestore');

            // Get the list of user IDs from the leaderboard document
            const lbRef = doc(db, 'leaderboards', targetLeaderboardId);
            const lbDoc = await getDoc(lbRef);

            if (!lbDoc.exists()) {
                setLoading(false);
                return;
            }

            const userIds = lbDoc.data().users || [];

            if (userIds.length === 0) {
                setLeaderboardUsers([]);
                setLoading(false);
                return;
            }

            // Fetch user data for these IDs
            // Firestore 'in' query supports max 10 (or 30 depending on version), but we have max 20.
            // Safe to fetch in batches or all at once if < 30.
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where(documentId(), 'in', userIds));
            const querySnapshot = await getDocs(q);

            const users: LeaderboardUser[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                users.push({
                    id: doc.id,
                    name: data.displayName || 'Anonymous',
                    impactPoints: data.totalPoints || 0,
                    rank: 0, // Will assign after sort
                    previousRank: previousRanks.get(doc.id),
                });
            });

            // Sort by points
            users.sort((a, b) => b.impactPoints - a.impactPoints);

            // Assign ranks
            users.forEach((u, index) => {
                u.rank = index + 1;
            });

            const newRankMap = new Map<string, number>();
            users.forEach(user => newRankMap.set(user.id, user.rank));
            setPreviousRanks(newRankMap);

            setLeaderboardUsers(users);

            // Check for promotion if user is in the list
            if (user) {
                const myEntry = users.find(u => u.id === user.uid);
                if (myEntry) {
                    checkLeagueProgression(myEntry.rank);
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            setLoading(false);
        }
    };

    const hasPoints = (user?.totalPoints || 0) > 0;
    const promotionZone = 5;
    const demotionZone = 15;

    if (user?.isGuest || user?.uid.startsWith('guest-')) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Leaderboard</Text>
                </View>
                <View style={styles.emptyState}>
                    <View style={styles.lockIconContainer}>
                        <Ionicons name="lock-closed" size={40} color={colors.white} />
                    </View>
                    <Text style={styles.emptyTitle}>Leagues are for Members</Text>
                    <Text style={styles.emptyText}>
                        Join the Eco Lens community to compete in weekly leagues, earn trophies, and see how you rank against others!
                    </Text>
                    <TouchableOpacity
                        style={styles.authButton}
                        onPress={() => navigation.navigate('Auth')}
                    >
                        <Text style={styles.authButtonText}>Create Free Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (!hasPoints) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Leaderboard</Text>
                </View>
                <View style={styles.emptyState}>
                    <LottieView
                        source={require('../assets/animations/trophy.json')}
                        style={styles.emptyLottie}
                        loop={false}
                        autoPlay
                    />
                    <Text style={styles.emptyTitle}>Collect Impact Points</Text>
                    <Text style={styles.emptyText}>
                        Start scanning plastic items to earn points and join the league!
                    </Text>
                </View>
            </View>
        );
    }

    const RankChangeIndicator = ({ previousRank, currentRank }: { previousRank?: number; currentRank: number }) => {
        if (!previousRank || previousRank === currentRank) return null;

        const isUp = currentRank < previousRank;
        const scaleAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                }),
                Animated.delay(2000),
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }, []);

        return (
            <Animated.View style={[
                styles.rankChangeIndicator,
                { transform: [{ scale: scaleAnim }] }
            ]}>
                <Ionicons
                    name={isUp ? "arrow-up" : "arrow-down"}
                    size={16}
                    color={isUp ? "#7fb069" : "#E74C3C"}
                />
            </Animated.View>
        );
    };

    const renderUser = ({ item }: { item: LeaderboardUser }) => {
        const isCurrentUser = item.id === user?.uid;
        const isTop3 = item.rank <= 3;

        return (
            <>
                {item.rank === promotionZone + 1 && (
                    <View style={styles.zoneLabel}>
                        <Ionicons name="arrow-up-circle" size={16} color="#7fb069" />
                        <Text style={styles.zoneLabelText}>Promotion Zone</Text>
                    </View>
                )}

                <View style={[styles.userRow, isCurrentUser && styles.currentUserRow]}>
                    <View style={styles.rankContainer}>
                        {isTop3 ? (
                            <View style={[
                                styles.medalBadge,
                                item.rank === 1 && styles.goldBadge,
                                item.rank === 2 && styles.silverBadge,
                                item.rank === 3 && styles.bronzeBadge
                            ]}>
                                <Text style={styles.medalText}>{item.rank}</Text>
                            </View>
                        ) : (
                            <Text style={styles.rankText}>{item.rank}</Text>
                        )}
                    </View>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {item.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>

                    <Text style={styles.userName} numberOfLines={1}>
                        {isCurrentUser ? `${item.name} (You)` : item.name}
                    </Text>

                    <View style={styles.pointsContainer}>
                        <AnimatedCounter value={item.impactPoints} />
                        {isCurrentUser && <RankChangeIndicator previousRank={item.previousRank} currentRank={item.rank} />}
                    </View>
                </View>

                {item.rank === demotionZone && (
                    <View style={styles.zoneLabel}>
                        <Ionicons name="arrow-down-circle" size={16} color="#E74C3C" />
                        <Text style={[styles.zoneLabelText, { color: '#E74C3C' }]}>Demotion Zone</Text>
                    </View>
                )}
            </>
        );
    };

    const isUrgent = timeLeft.hours <= 24;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#e8e2d1" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>{currentLeague} League</Text>
                <View style={styles.timerContainer}>
                    <Ionicons
                        name="time-outline"
                        size={18}
                        color={isUrgent ? '#E74C3C' : colors.textSecondary}
                    />
                    <Text style={[
                        styles.timerText,
                        isUrgent && styles.timerTextUrgent
                    ]}>
                        {timeLeft.text}
                    </Text>
                </View>
            </View>

            <View style={styles.trophyContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.trophyScroll}
                >
                    <View style={styles.trophyItem}>
                        <Image
                            source={require('../assets/trophies/bronze.png')}
                            style={[
                                currentLeague === 'Bronze' ? styles.trophyImageLarge : styles.trophyImageSmall,
                                currentLeague !== 'Bronze' && styles.greyscale
                            ]}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.trophyItem}>
                        <Image
                            source={require('../assets/trophies/silver.png')}
                            style={[
                                currentLeague === 'Silver' ? styles.trophyImageLarge : styles.trophyImageSmall,
                                currentLeague !== 'Silver' && styles.greyscale
                            ]}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.trophyItem}>
                        <Image
                            source={require('../assets/trophies/gold.png')}
                            style={[
                                currentLeague === 'Gold' ? styles.trophyImageLarge : styles.trophyImageSmall,
                                currentLeague !== 'Gold' && styles.greyscale
                            ]}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.trophyItem}>
                        <Image
                            source={require('../assets/trophies/diamond.png')}
                            style={[
                                currentLeague === 'Diamond' ? styles.trophyImageLarge : styles.trophyImageSmall,
                                currentLeague !== 'Diamond' && styles.greyscale
                            ]}
                            resizeMode="contain"
                        />
                    </View>
                </ScrollView>
            </View>

            <FlatList
                data={leaderboardUsers}
                renderItem={renderUser}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={fetchRealLeaderboard}
            />
        </View>
    );
}


