import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../constants/theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ImpactScreen from '../screens/ImpactScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import LearnScreen from '../screens/LearnScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#7fb069',
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    paddingBottom: Math.max(insets.bottom, 8),
                    paddingTop: 8,
                    height: 64 + Math.max(insets.bottom - 8, 0),
                    borderTopWidth: 0,
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    backgroundColor: '#e8e2d1',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Impact"
                component={ImpactScreen}
                options={{
                    tabBarLabel: 'Impact',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="trending-up" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Scan"
                component={ScanScreen}
                options={{
                    tabBarLabel: '',
                    tabBarStyle: { display: 'none' },
                    tabBarIcon: () => (
                        <View style={styles.scanButtonContainer}>
                            <LinearGradient
                                colors={['#7fb069', '#58a051', '#7fb069']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.scanButton}
                            >
                                <Ionicons
                                    name="scan"
                                    size={32}
                                    color={colors.white}
                                />
                            </LinearGradient>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Leaderboard"
                component={LeaderboardScreen}
                options={{
                    tabBarLabel: 'Ranks',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="trophy-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Learn"
                component={LearnScreen}
                options={{
                    tabBarLabel: 'Learn',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    scanButtonContainer: {
        position: 'absolute',
        top: -30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.lg,
        borderWidth: 4,
        borderColor: colors.white,
    },
    scanTabButton: {
        flex: 1,
    },
});
