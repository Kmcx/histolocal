import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, Button, Platform, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import TopNavbar from '../../components/TopNavbar';
import { colors } from '../../styles/theme';
import { apiClient } from "@lib/axiosInstance";

export default function ToursScreen() {
  const [role, setRole] = useState<string | null>(null);
  const [guides, setGuides] = useState<any[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<any[]>([]);
  const [guideRatings, setGuideRatings] = useState<Record<string, number>>({});
  const [ongoingTours, setOngoingTours] = useState<any[]>([]);
  const [completedTours, setCompletedTours] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [completedTourToRate, setCompletedTourToRate] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const profileResponse = await apiClient.get(`/api/profile/${userId}`);
        setRole(profileResponse.data.role);
        fetchOngoingToursAndCheck();
        fetchCompletedTours();
        fetchGuides();
      }
    };
    fetchInitialData();
  }, []);
  const fetchOngoingToursAndCheck = async () => {
    try {
      const response = await apiClient.get("/api/tours/ongoing");
      const completedToursFound = response.data.filter((tour: any) => tour.status === 'Completed');
      if (completedToursFound.length > 0) {
        setCompletedTourToRate(completedToursFound[0]);
        setShowCompletedModal(true);
      }
      setOngoingTours(response.data);
    } catch (error) {
      console.error("Error fetching ongoing tours:", error);
    }
  };

  const fetchCompletedTours = async () => {
    try {
      const response = await apiClient.get("/api/tours/completed");
      setCompletedTours(response.data);
    } catch (error) {
      console.error("Error fetching completed tours:", error);
    }
  };

  const fetchGuides = async () => {
    const response = await apiClient.get("/api/guides/list");
    const guidesList = response.data;
    const ratingPromises = guidesList.map((guide: any) =>
      apiClient.get(`/api/feedback/average/${guide._id}`)
        .then(res => ({ id: guide._id, avg: parseFloat(res.data.averageRating) }))
        .catch(() => ({ id: guide._id, avg: 0 }))
    );
    const ratings = await Promise.all(ratingPromises);
    const ratingMap: Record<string, number> = {};
    ratings.forEach(({ id, avg }) => { ratingMap[id] = avg });
    setGuideRatings(ratingMap);
    guidesList.sort((a: any, b: any) => (ratingMap[b._id] ?? 0) - (ratingMap[a._id] ?? 0));
    setGuides(guidesList);
    setFilteredGuides(guidesList);
  };

  const handleGuideSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = guides.filter(guide => guide.name.toLowerCase().includes(text.toLowerCase()));
    setFilteredGuides(filtered);
  };

  const sendRequestToGuide = async (guideId: string) => {
    try {
      await apiClient.post("/api/tours/request", { guideId });
      Alert.alert("Success", "Tour request sent!");
    } catch (error) {
      Alert.alert("Error", "Could not send request.");
    }
  };

  const handleEndTour = async (tourId: string) => {
    try {
      await apiClient.put("/api/tours/complete", { tourId });
      Alert.alert("Tour ended successfully!");
      fetchOngoingToursAndCheck();
      fetchCompletedTours();
    } catch (error) {
      console.error("Error ending tour:", error);
    }
  };
  const renderTourCard = (item: any, type: 'ongoing' | 'completed') => (
    <TouchableOpacity
      key={item._id}
      style={[
        styles.card,
        type === 'completed' && !searchQuery && styles.completedCard // guides listesi yoksa küçük kart
      ]}
      onPress={() => router.push(`/tours/${item._id}`)}
    >
      <Text style={styles.cardTitle}>
        Tour with {role === 'Visitor' ? item.guide.name : item.visitor.name}
      </Text>
      <Text style={styles.cardText}>
        {type === 'completed'
          ? `Completed on: ${item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'N/A'}`
          : `Start: ${new Date(item.startDate).toLocaleDateString()}`}
      </Text>
      {type === 'ongoing' && (
        <Button
          title="End Tour"
          color={colors.primary}
          onPress={() => handleEndTour(item._id)}
        />
      )}
      {type === 'completed' && !searchQuery && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, marginTop: 10 }]}
          onPress={() => router.push(`/tours/${item._id}`)}
        >
          <Text style={styles.buttonText}>Tour Details</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopNavbar />

      {role === "Visitor" && (
        <>
          <Text style={styles.title}>Find a Guide</Text>

          <TextInput
            value={searchQuery}
            onChangeText={handleGuideSearch}
            placeholder="Search for guides"
            placeholderTextColor={colors.secondaryText}
            style={[styles.card, { marginBottom: 10 }]}
          />

          <FlatList
            data={filteredGuides}
            horizontal
            nestedScrollEnabled
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={[styles.card, { marginRight: 10 }]}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardText}>⭐ {guideRatings[item._id]?.toFixed(1) ?? 'N/A'}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => sendRequestToGuide(item._id)}
                >
                  <Text style={styles.buttonText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Text style={styles.sectionTitle}>Ongoing Tours</Text>
          {ongoingTours.length === 0 ? (
            <Text style={styles.cardText}>There are currently no ongoing tours.</Text>
          ) : (
            <FlatList
              data={ongoingTours}
              horizontal
              nestedScrollEnabled
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => renderTourCard(item, "ongoing")}
            />
          )}

          <Text style={styles.sectionTitle}>Completed Tours</Text>
          <FlatList
            data={completedTours}
            horizontal
            nestedScrollEnabled
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => renderTourCard(item, "completed")}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </>
      )}
      <Modal visible={showCompletedModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tour has been completed!</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => {
                setShowCompletedModal(false);
                router.push(`/tours/${completedTourToRate._id}`);
              }}
            >
              <Text style={styles.buttonText}>
                {role === "Guide" ? "Rate Visitor" : "Rate Guide"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavigationBar activeTab="tours" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: 'bold',
    color: colors.text,
  },
  button: {
    backgroundColor: colors.buttonBackground,
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 120,
  },
  buttonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  completedCard: {
    width: 200,
    padding: 10,
    marginHorizontal: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardText: {
    color: colors.secondaryText,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderColor: colors.border,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
});
