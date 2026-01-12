// Example: How to use LoadingOverlay in your screens

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';

// Example 1: Loading user data
export function ExampleScreen1() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        fetchUserData().then(() => {
            setLoading(false);
        });
    }, []);

    return (
        <View>
            <Text>Your content here</Text>

            {/* Show loading overlay while fetching data */}
            <LoadingOverlay
                visible={loading}
                message="Loading your profile..."
            />
        </View>
    );
}

// Example 2: Loading on button click
export function ExampleScreen2() {
    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        await fetchData();
        setLoading(false);
    };

    return (
        <View>
            <Button title="Refresh" onPress={handleRefresh} />

            <LoadingOverlay
                visible={loading}
                message="Refreshing data..."
            />
        </View>
    );
}

// Example 3: Multiple loading states
export function ExampleScreen3() {
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);

    const isLoading = loadingProfile || loadingStats;

    useEffect(() => {
        Promise.all([
            fetchProfile().then(() => setLoadingProfile(false)),
            fetchStats().then(() => setLoadingStats(false)),
        ]);
    }, []);

    return (
        <View>
            <Text>Your content here</Text>

            <LoadingOverlay
                visible={isLoading}
                message="Loading your data..."
            />
        </View>
    );
}

// Example 4: Conditional messages
export function ExampleScreen4() {
    const [loading, setLoading] = useState(true);
    const [loadingType, setLoadingType] = useState<'profile' | 'stats' | 'leaderboard'>('profile');

    const getMessage = () => {
        switch (loadingType) {
            case 'profile': return 'Loading your profile...';
            case 'stats': return 'Calculating your stats...';
            case 'leaderboard': return 'Fetching leaderboard...';
            default: return 'Loading...';
        }
    };

    return (
        <View>
            <Text>Your content here</Text>

            <LoadingOverlay
                visible={loading}
                message={getMessage()}
            />
        </View>
    );
}

// Mock API functions (replace with real ones)
async function fetchUserData() {
    return new Promise(resolve => setTimeout(resolve, 2000));
}

async function fetchData() {
    return new Promise(resolve => setTimeout(resolve, 1500));
}

async function fetchProfile() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

async function fetchStats() {
    return new Promise(resolve => setTimeout(resolve, 1500));
}
