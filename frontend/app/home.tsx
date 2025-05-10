import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { BottomNavigationBar } from '../components/BottomNavigationBar';
import { useRouter } from 'expo-router';
import { colors } from '../styles/theme';
import logo from '../assets/logo.png';
import TopNavbar from '../components/TopNavbar';
import { apiClient } from "@lib/axiosInstance";

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
      const response = await apiClient.get<GuideItem[]>("/api/guides/list");
      console.log("response.data", response.data);
      setGuides(response.data);
      setFilteredGuides(response.data);
    } catch (error) {
      console.error("Error fetching guides:", error);
      // Hata interceptor tarafından Alert ile gösterilecek
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
      <TopNavbar />
  
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Image source={logo} style={{ width: 140, height: 140 }} resizeMode="contain" />
        </View>
  
        <Text style={styles.title}>histolocal</Text>
  
        {/* AI Card */}
        <View style={styles.aiCard}>
          <Text style={styles.sectionTitle}>Plan your tour with AI suggestions</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/ai')} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Start Planning</Text>
          </TouchableOpacity>
        </View>
  
        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBox}
            placeholder="Search for guides or places..."
            placeholderTextColor={colors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.iconButton} onPress={handleSearch} activeOpacity={0.7}>
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
  
        {/* Guides & Places */}
        <View style={styles.rowSection}>
          {/* Guides */}
          <View style={styles.columnSection}>
            <Text style={styles.sectionTitle}>Guides around İzmir</Text>
            {filteredGuides.map((item) => (
              <TouchableOpacity key={item._id} onPress={() => router.push(`/profile/${item._id}`)}>
                <View style={styles.guideCard}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={item.guideDetails.availability ? styles.available : styles.notAvailable}>
                        {item.guideDetails.availability ? 'Available' : 'Not Available'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
  
          {/* Places */}
          <View style={styles.columnSection}>
            <Text style={styles.sectionTitle}>Popular places in İzmir</Text>
            {popularPlaces.map((place, index) => (
              <View key={index} style={styles.placeCard}>
                <View style={styles.cardHeader}>
                  <FontAwesome5 name="landmark" size={20} color={colors.primary} style={{ marginRight: 10 }} />
                  <View>
                    <Text style={styles.cardTitle}>{place}</Text>
                    <Text style={styles.cardSubtitle}>Must-see</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
  
      <BottomNavigationBar activeTab="home" />
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 1,
  },
  aiCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    marginVertical: 12,
    borderColor: colors.border,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: colors.buttonBackground,
    paddingVertical: 12,
    marginTop: 12,
    borderRadius: 10,
  },
  primaryButtonText: {
    textAlign: 'center',
    color: colors.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    flex: 1,
    backgroundColor: colors.card,
    color: colors.text,
  },
  iconButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  rowSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  columnSection: {
    flex: 1,
  },
  guideCard: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.card,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  placeCard: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.card,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 11,
    color: colors.secondaryText,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  available: {
    color: colors.primary,
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 12,
  },
  notAvailable: {
    color: colors.secondaryText,
    marginTop: 5,
    fontStyle: 'italic',
    fontSize: 12,
  },
});
