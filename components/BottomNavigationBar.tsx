import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BottomNavigationBarProps {
  activeTab: 'home' | 'ai' | 'favorites' | 'profile';
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
    { name: 'home', icon: 'home-outline', route: '/home', label: 'Anasayfa' },
    { name: 'ai', icon: 'sparkles-outline', route: '/ai', label: 'AI' },
    { name: 'favorites', icon: 'heart-outline', route: '/favorites', label: 'Favoriler' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.name} onPress={() => router.push(tab.route)} style={styles.tabButton}>
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={activeTab === tab.name ? '#4A90E2' : '#777'}
          />
          <Text style={{ color: activeTab === tab.name ? '#4A90E2' : '#777', fontSize: 12 }}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={handleProfilePress} style={styles.tabButton}>
        <Ionicons
          name="person-outline"
          size={24}
          color={activeTab === 'profile' ? '#4A90E2' : '#777'}
        />
        <Text style={{ color: activeTab === 'profile' ? '#4A90E2' : '#777', fontSize: 12 }}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabButton: { alignItems: 'center' },
});
