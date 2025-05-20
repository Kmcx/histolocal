import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../styles/theme';

export const AdminNavigationBar: React.FC<{ activeTab: 'home' | 'ai' | 'admin' | 'profile' }> = ({ activeTab }) => {
  const router = useRouter();

  const tabs = [
    { name: 'home', icon: 'home-outline', route: '/home', label: 'Home' },
    { name: 'ai', icon: 'sparkles-outline', route: '/ai', label: 'AI' },
    { name: 'admin', icon: 'settings-outline', route: '/home', label: 'Admin' },
  ];

  const handleProfilePress = async () => {
    router.push('/login'); // Admin profil yerine istenirse özelleştirilebilir
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.name} onPress={() => router.push(tab.route)} style={styles.tabButton}>
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={activeTab === tab.name ? colors.navbarActive : colors.navbarText}
          />
          <Text style={{ color: activeTab === tab.name ? colors.navbarActive : colors.navbarText, fontSize: 12 }}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={handleProfilePress} style={styles.tabButton}>
        <Ionicons
          name="person-outline"
          size={24}
          color={activeTab === 'profile' ? colors.navbarActive : colors.navbarText}
        />
        <Text style={{ color: activeTab === 'profile' ? colors.navbarActive : colors.navbarText, fontSize: 12 }}>
          Profil
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: colors.navbarBackground,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabButton: { alignItems: 'center' },
});
