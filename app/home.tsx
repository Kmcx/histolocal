// ✅ Updated HomeScreen with Guide List Button (TypeScript-safe)

import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavigationBar } from '../components/BottomNavigationBar';
import axios from 'axios';
import { useRouter } from 'expo-router';

const router = useRouter();

interface GuideDetails {
  bio: string;
  languages: string[];
  availability: boolean;
}

interface GuideItem {
  _id: string;
  name: string;
  guideDetails: GuideDetails;
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState<GuideItem[]>([]);

  const fetchAllGuides = async () => {
    try {
      const response = await axios.get<GuideItem[]>(`${process.env.EXPO_PUBLIC_API_URL}api/guides/list`);
      setGuides(response.data);
    } catch (error) {
      console.error('Error fetching guides:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search for guides or places..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.guideButton} onPress={fetchAllGuides}>
          <Ionicons name="people-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
  data={guides}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/profile/${item._id}`)}>
      <View style={styles.guideCard}>
        <Text style={styles.guideName}>{item.name}</Text>
        <Text style={item.guideDetails.availability ? styles.available : styles.notAvailable}>
          {item.guideDetails.availability ? 'Available' : 'Not Available'}
        </Text>
      </View>
    </TouchableOpacity>
  )}
/>

      <BottomNavigationBar activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center' },
  searchBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  guideButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 10,
  },
  guideCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 10,
  },
  guideName: { fontSize: 18, fontWeight: 'bold' },
  available: { color: 'green', marginTop: 5, fontWeight: 'bold' },
  notAvailable: { color: '#555', marginTop: 5, fontStyle: 'italic' },
});