import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator, Platform } from 'react-native';
import { colors } from '../constants/theme';

// Auth screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// Main navigation
import MainTabNavigator from './MainTabNavigator';

// Phase 13: Additional screens
import NotificationsScreen from '../screens/NotificationsScreen';
import SearchScreen from '../screens/SearchScreen';
import SchoolDetailScreen from '../screens/SchoolDetailScreen';
import AchievementDetailScreen from '../screens/AchievementDetailScreen';
import HelpScreen from '../screens/HelpScreen';
import AboutScreen from '../screens/AboutScreen';
import TermsScreen from '../screens/TermsScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StampsScreen from '../screens/StampsScreen';
import ImpactPointsScreen from '../screens/ImpactPointsScreen';

// Learn detail screens
import LessonDetailScreen from '../screens/LessonDetailScreen';
import TopicDetailScreen from '../screens/TopicDetailScreen';
import PlasticDetailScreen from '../screens/PlasticDetailScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';

// Home Action Screens
import FindBinScreen from '../screens/FindBinScreen';
import ScanHistoryScreen from '../screens/ScanHistoryScreen';
import QuizScreen from '../screens/QuizScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user, loading } = useAuth();

    // Show loading state on all platforms to prevent flash of welcome screen
    if (loading) {
        // On web, show spinner. On mobile, show blank screen to avoid flash
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Platform.OS === 'web' ? colors.white : '#e8e2d1' }}>
                {Platform.OS === 'web' && <ActivityIndicator size="large" color={colors.primary} />}
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                        <Stack.Screen name="Main" component={MainTabNavigator} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                        <Stack.Screen name="Stamps" component={StampsScreen} />
                        <Stack.Screen name="ImpactPoints" component={ImpactPointsScreen} />
                        {/* Phase 13: Additional Screens */}
                        <Stack.Screen name="Notifications" component={NotificationsScreen} />
                        <Stack.Screen name="Search" component={SearchScreen} />
                        <Stack.Screen name="SchoolDetail" component={SchoolDetailScreen} />
                        <Stack.Screen name="AchievementDetail" component={AchievementDetailScreen} />
                        <Stack.Screen name="Help" component={HelpScreen} />
                        <Stack.Screen name="About" component={AboutScreen} />
                        <Stack.Screen name="Terms" component={TermsScreen} />
                        <Stack.Screen name="Privacy" component={PrivacyScreen} />
                        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
                        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
                        {/* Learn detail screens */}
                        <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
                        <Stack.Screen name="TopicDetail" component={TopicDetailScreen} />
                        <Stack.Screen name="PlasticDetail" component={PlasticDetailScreen} />
                        <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />

                        {/* Home Action Screens */}
                        <Stack.Screen name="FindBin" component={FindBinScreen} />
                        <Stack.Screen name="ScanHistory" component={ScanHistoryScreen} />
                        <Stack.Screen name="Quiz" component={QuizScreen} />
                    </>
                ) : (
                    <Stack.Group>
                        <Stack.Screen name="Auth" component={WelcomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    </Stack.Group>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
