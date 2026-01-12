import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Image,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

type SearchTab = 'users' | 'schools';

interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    school: string;
    points: number;
    rank: number;
    isFriend: boolean;
}

interface School {
    id: string;
    name: string;
    logo: string;
    students: number;
    totalPoints: number;
    rank: number;
    location: string;
}

export default function SearchScreen({ navigation }: any) {
    const [activeTab, setActiveTab] = useState<SearchTab>('users');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data
    const mockUsers: User[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            username: '@sarah_eco',
            avatar: '👩',
            school: 'Green Valley High',
            points: 2450,
            rank: 12,
            isFriend: false,
        },
        {
            id: '2',
            name: 'Mike Chen',
            username: '@mike_recycles',
            avatar: '👨',
            school: 'Eco Academy',
            points: 3200,
            rank: 8,
            isFriend: true,
        },
        {
            id: '3',
            name: 'Emma Wilson',
            username: '@emma_green',
            avatar: '👧',
            school: 'Green Valley High',
            points: 1890,
            rank: 25,
            isFriend: false,
        },
    ];

    const mockSchools: School[] = [
        {
            id: '1',
            name: 'Green Valley High School',
            logo: '🏫',
            students: 450,
            totalPoints: 125000,
            rank: 3,
            location: 'California, USA',
        },
        {
            id: '2',
            name: 'Eco Academy',
            logo: '🌱',
            students: 320,
            totalPoints: 98000,
            rank: 7,
            location: 'Oregon, USA',
        },
        {
            id: '3',
            name: 'Sustainability Institute',
            logo: '♻️',
            students: 580,
            totalPoints: 156000,
            rank: 1,
            location: 'Washington, USA',
        },
    ];

    const filteredUsers = mockUsers.filter(
        user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.school.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredSchools = mockSchools.filter(
        school =>
            school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderUserCard = (user: User) => (
        <TouchableOpacity
            key={user.id}
            style={styles.resultCard}
            activeOpacity={0.7}
            onPress={() => {
                // Navigate to user profile
            }}
        >
            <View style={styles.cardContent}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarEmoji}>{user.avatar}</Text>
                    <View style={[styles.rankBadge, { backgroundColor: colors.secondary }]}>
                        <Text style={styles.rankText}>#{user.rank}</Text>
                    </View>
                </View>
                <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.userName}>{user.name}</Text>
                        {user.isFriend && (
                            <View style={styles.friendBadge}>
                                <Feather name="check" size={12} color={colors.white} />
                                <Text style={styles.friendBadgeText}>Friend</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.username}>{user.username}</Text>
                    <View style={styles.userMeta}>
                        <Feather name="map-pin" size={14} color={colors.textSecondary} />
                        <Text style={styles.metaText}>{user.school}</Text>
                    </View>
                    <View style={styles.userMeta}>
                        <Ionicons name="trophy-outline" size={14} color={colors.warning} />
                        <Text style={styles.metaText}>{user.points.toLocaleString()} points</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={[
                    styles.actionButton,
                    user.isFriend && styles.actionButtonSecondary,
                ]}
            >
                <Feather
                    name={user.isFriend ? 'user-check' : 'user-plus'}
                    size={18}
                    color={user.isFriend ? colors.secondary : colors.white}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderSchoolCard = (school: School) => (
        <TouchableOpacity
            key={school.id}
            style={styles.resultCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SchoolDetail', { school })}
        >
            <View style={styles.cardContent}>
                <View style={styles.schoolLogoContainer}>
                    <Text style={styles.schoolLogo}>{school.logo}</Text>
                    <View style={[styles.rankBadge, { backgroundColor: colors.warning }]}>
                        <Text style={styles.rankText}>#{school.rank}</Text>
                    </View>
                </View>
                <View style={styles.schoolInfo}>
                    <Text style={styles.schoolName}>{school.name}</Text>
                    <View style={styles.schoolMeta}>
                        <Feather name="map-pin" size={14} color={colors.textSecondary} />
                        <Text style={styles.metaText}>{school.location}</Text>
                    </View>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Feather name="users" size={14} color={colors.secondary} />
                            <Text style={styles.statText}>{school.students} students</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="trophy-outline" size={14} color={colors.warning} />
                            <Text style={styles.statText}>
                                {(school.totalPoints / 1000).toFixed(0)}k pts
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <Feather name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Feather name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Search</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Feather name="search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={`Search ${activeTab === 'users' ? 'users' : 'schools'}...`}
                        placeholderTextColor={colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Feather name="x-circle" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'users' && styles.activeTab]}
                    onPress={() => setActiveTab('users')}
                >
                    <Feather
                        name="users"
                        size={18}
                        color={activeTab === 'users' ? colors.secondary : colors.textSecondary}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'users' && styles.activeTabText,
                        ]}
                    >
                        Users
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'schools' && styles.activeTab]}
                    onPress={() => setActiveTab('schools')}
                >
                    <Feather
                        name="home"
                        size={18}
                        color={activeTab === 'schools' ? colors.secondary : colors.textSecondary}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'schools' && styles.activeTabText,
                        ]}
                    >
                        Schools
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Results */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {searchQuery.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Feather name="search" size={64} color={colors.textMuted} />
                        <Text style={styles.emptyTitle}>Start searching</Text>
                        <Text style={styles.emptyMessage}>
                            {activeTab === 'users'
                                ? 'Find friends and see their eco-friendly achievements'
                                : 'Discover schools and join the competition'}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.resultsContainer}>
                        {activeTab === 'users' ? (
                            filteredUsers.length > 0 ? (
                                filteredUsers.map(renderUserCard)
                            ) : (
                                <View style={styles.noResults}>
                                    <Feather name="user-x" size={48} color={colors.textMuted} />
                                    <Text style={styles.noResultsText}>No users found</Text>
                                </View>
                            )
                        ) : filteredSchools.length > 0 ? (
                            filteredSchools.map(renderSchoolCard)
                        ) : (
                            <View style={styles.noResults}>
                                <Feather name="home" size={48} color={colors.textMuted} />
                                <Text style={styles.noResultsText}>No schools found</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.white,
        ...shadows.sm,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.md,
    },
    headerTitle: {
        fontSize: typography.fontSize.headingLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    searchContainer: {
        padding: spacing.md,
        backgroundColor: colors.white,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: typography.fontSize.body,
        color: colors.textPrimary,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        gap: spacing.sm,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.lightGray,
        gap: spacing.xs,
    },
    activeTab: {
        backgroundColor: colors.secondary + '20',
    },
    tabText: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.medium,
        color: colors.textSecondary,
    },
    activeTabText: {
        color: colors.secondary,
        fontWeight: typography.fontWeight.semiBold,
    },
    scrollView: {
        flex: 1,
    },
    resultsContainer: {
        padding: spacing.md,
    },
    resultCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...shadows.sm,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: spacing.md,
    },
    avatarEmoji: {
        fontSize: 48,
    },
    rankBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
    },
    rankText: {
        color: colors.white,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
    },
    userInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xxs,
    },
    userName: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginRight: spacing.sm,
    },
    friendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.success,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        gap: spacing.xxs,
    },
    friendBadgeText: {
        color: colors.white,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semiBold,
    },
    username: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    userMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xxs,
        gap: spacing.xs,
    },
    metaText: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
    },
    actionButton: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        marginLeft: spacing.sm,
    },
    actionButtonSecondary: {
        backgroundColor: colors.secondary + '20',
    },
    schoolLogoContainer: {
        position: 'relative',
        marginRight: spacing.md,
    },
    schoolLogo: {
        fontSize: 48,
    },
    schoolInfo: {
        flex: 1,
    },
    schoolName: {
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    schoolMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
        gap: spacing.xs,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.xs,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    statText: {
        fontSize: typography.fontSize.caption,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxxl,
        paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
        fontSize: typography.fontSize.headingLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    emptyMessage: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: typography.fontSize.body * typography.lineHeight.normal,
    },
    noResults: {
        alignItems: 'center',
        paddingVertical: spacing.xxxl,
    },
    noResultsText: {
        fontSize: typography.fontSize.body,
        color: colors.textSecondary,
        marginTop: spacing.md,
    },
});
