import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ErrorBoundary from '@/components/ErrorBoundary';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

function TabFallback() {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>
                탭 화면에 문제가 발생했어요.
                {'\n'}
                앱을 재시작해 주세요.
            </Text>
        </View>
    );
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <ErrorBoundary fallback={<TabFallback />}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                    headerShown: false,
                    tabBarButton: HapticTab,
                }}
            >
                <Tabs.Screen
                    name='index'
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => (
                            <IconSymbol
                                size={28}
                                name='house.fill'
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='profile'
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color }) => (
                            <Ionicons
                                name='person-circle-outline'
                                size={26}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    message: {
        textAlign: 'center',
        fontSize: 16,
    },
});
