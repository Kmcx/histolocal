import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 94 : 74,
            paddingBottom: Platform.OS === 'ios' ? 34 : 16,
            paddingTop: 8,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0',
            elevation: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            borderRadius: 20,
          },
          tabBarActiveTintColor: Colors.light.primary,
          tabBarInactiveTintColor: '#999',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 0,
            marginBottom: Platform.OS === 'ios' ? 0 : 4,
            fontFamily: 'Arial',
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            fontFamily: 'Arial',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Keşfet',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: 'Kategoriler',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favoriler',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />

        {/* Alt sayfaları gizle */}
        <Tabs.Screen
          name="profile/help"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile/account"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile/privacy"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile/language"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile/security"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile/notifications"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="place/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
