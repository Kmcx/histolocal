import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Pressable, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
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

const AnimatedCard = ({ children }: { children: React.ReactNode }) => {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPressIn={() => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default function HomeScreen() {
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [averageRatings, setAverageRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await apiClient.get<GuideItem[]>("/api/guides/list");
        setGuides(response.data);

        const ratingPromises = response.data.map(guide =>
          apiClient.get(`/api/feedback/average/${guide._id}`)
            .then(res => ({ id: guide._id, avg: parseFloat(res.data.averageRating) }))
            .catch(() => ({ id: guide._id, avg: 0 }))
        );

        const ratings = await Promise.all(ratingPromises);
        const ratingMap: Record<string, number> = {};
        ratings.forEach(({ id, avg }) => { ratingMap[id] = avg });
        setAverageRatings(ratingMap);
      } catch (error) {
        console.error("Error fetching guides or ratings:", error);
      }
    };

    fetchGuides();
  }, []);

  return (
    <View style={styles.container}>
      <TopNavbar />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo & App Name */}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Image source={logo} style={{ width: 100, height: 100 }} resizeMode="contain" />
          <Text style={styles.appName}>histolocal</Text>
        </View>

        {/* Start Planning */}
        <View style={styles.aiCard}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/ai')} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Start Planning</Text>
          </TouchableOpacity>
        </View>

        {/* Guides Section */}
        <Text style={styles.sectionTitle}>Guides around Izmir</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
          {guides.map((item) => (
            <AnimatedCard key={item._id}>
              <TouchableOpacity onPress={() => router.push(`/profile/${item._id}`)} style={styles.guideCard}>
                <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={item.guideDetails.availability ? styles.available : styles.notAvailable}>
                  {item.guideDetails.availability ? 'Available' : 'Not Available'}
                </Text>
                <Text style={styles.ratingText}>⭐ {averageRatings[item._id]?.toFixed(1) ?? 'N/A'}</Text>
              </TouchableOpacity>
            </AnimatedCard>
          ))}
        </ScrollView>

        {/* Popular Places Section */}
        <Text style={styles.sectionTitle}>Popular places in Izmir</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}>
          {popularPlaces.map((item) => (
            <AnimatedCard key={item}>
              <TouchableOpacity
                onPress={() => router.push(`/place/${encodeURIComponent(item)}`)}
                style={styles.placeCardModern}
                activeOpacity={0.8}
              >
                <FontAwesome5 name="landmark" size={24} color={colors.primary} />
                <Text style={styles.cardTitle}>{item}</Text>
                <Text style={styles.cardSubtitle}>Popular spot</Text>
              </TouchableOpacity>
            </AnimatedCard>
          ))}
        </ScrollView>
      </ScrollView>

      <BottomNavigationBar activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
  },
  aiCard: {
    alignItems: 'center',
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: colors.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  primaryButtonText: {
    textAlign: 'center',
    color: colors.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  guideCard: {
    backgroundColor: colors.card,
    padding: 12,
    marginRight: 10,
    borderRadius: 12,
    alignItems: 'center',
    width: 150,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeCardModern: {
    backgroundColor: colors.card,
    padding: 16,
    marginRight: 14,
    borderRadius: 16,
    width: 180,
    height: 140,
    justifyContent: 'space-between',
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 11,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  available: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  notAvailable: {
    color: colors.secondaryText,
    fontSize: 12,
    fontStyle: 'italic',
  },
  ratingText: {
    fontSize: 13,
    marginTop: 4,
    color: colors.primary,
    textAlign: 'center',
  },
});