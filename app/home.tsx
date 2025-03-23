import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
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

const popularPlaces = [
  'Kemeraltı Bazaar',
  'Konak Square',
  'Clock Tower',
  'Alsancak',
  'Agora Ruins',
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<GuideItem[]>([]);

  useEffect(() => {
    const fetchAllGuides = async () => {
      try {
        const response = await axios.get<GuideItem[]>(`${process.env.EXPO_PUBLIC_API_URL}api/guides/list`);
        setGuides(response.data);
        setFilteredGuides(response.data);
      } catch (error) {
        console.error('Error fetching guides:', error);
      }
    };

    fetchAllGuides();
  }, []);

  const handleSearch = () => {
    const filtered = guides.filter(guide =>
      guide.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGuides(filtered);
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
        <TouchableOpacity style={styles.guideButton} onPress={handleSearch}>
          <Ionicons name="search-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.guidesSection}>
          {filteredGuides.length > 0 && <Text style={styles.sectionTitle}>Guides around İzmir</Text>}
          <FlatList
            data={filteredGuides}
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
        </View>

        <View style={styles.popularPlacesSection}>
          <Text style={styles.sectionTitle}>Popular places in İzmir</Text>
          {popularPlaces.map((place, index) => (
            <View key={index} style={styles.placeCard}>
              <Text>{place}</Text>
            </View>
          ))}
        </View>
      </View>

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
  buttonText: { color: '#fff', fontWeight: 'bold' },
  contentContainer: { flexDirection: 'row', marginTop: 20, flex: 1 },
  guidesSection: { flex: 1, marginRight: 10 },
  popularPlacesSection: { flex: 1 },
  guideCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 10,
  },
  placeCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 10,
  },
  guideName: { fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  available: { color: 'green', marginTop: 5, fontWeight: 'bold' },
  notAvailable: { color: '#555', marginTop: 5, fontStyle: 'italic' },
});
