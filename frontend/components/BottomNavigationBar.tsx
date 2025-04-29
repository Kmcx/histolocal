import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/theme';

interface BottomNavigationBarProps {
  activeTab: 'home' | 'ai' | 'tours' | 'profile';
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({ activeTab }) => {
  const router = useRouter();

  const handleProfilePress = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (userId) {
      router.push(`/profile/${userId}`);
    } else {
      router.push('/login');
    }
  };

  const tabs = [
    { name: 'home', icon: 'home-outline', route: '/home', label: 'Home' },
    { name: 'ai', icon: 'sparkles-outline', route: '/ai', label: 'AI' },
    { name: 'tours', icon: 'map-outline', route: '/tours', label: 'Tours' },
  ];

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
        <Text style={{
  color: activeTab === 'profile' ? colors.navbarActive : colors.navbarText,
  fontSize: 12,
}}>Profil</Text>
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
  backgroundColor: colors.navbarBackground, // ✔️ tema ile uyumlu zemin
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  borderTopWidth: 1,
  borderTopColor: colors.border, // ✔️ daha yumu
  },
  tabButton: { alignItems: 'center' },
});