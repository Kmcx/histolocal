import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, Button, Platform } from 'react-native';
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
  const [tourRequests, setTourRequests] = useState<any[]>([]);
  const [ongoingTours, setOngoingTours] = useState<any[]>([]);
  const [completedTours, setCompletedTours] = useState<any[]>([]);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [completedTourToRate, setCompletedTourToRate] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
  const fetchInitialData = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      const profileResponse = await apiClient.get(`/api/profile/${userId}`);
      console.log("User role:", profileResponse.data.role); // DEBUG LOG
      setRole(profileResponse.data.role);
      fetchOngoingToursAndCheck();
      fetchCompletedTours();
    }
  };

    fetchInitialData();
    const interval = setInterval(fetchOngoingToursAndCheck, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOngoingToursAndCheck = async () => {
  try {
    const response = await apiClient.get("/api/tours/ongoing");
    console.log("Fetched ongoing tours:", response.data); // DEBUG LOG

    const completedToursFound = response.data.filter((tour: any) => tour.status === 'Completed');
    if (completedToursFound.length > 0) {
      console.log("Completed tours found (in ongoing):", completedToursFound); // DEBUG LOG
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
    console.log("Fetched completed tours:", response.data); // DEBUG LOG
    setCompletedTours(response.data);
  } catch (error) {
    console.error("Error fetching completed tours:", error);
  }
};



  const sendRequestToGuide = async (guideId: string) => {
  try {
    await apiClient.post("/api/tours/request", { guideId });
    Alert.alert("Success", "Tour request sent!");
  } catch (error) {
    Alert.alert("Error", "Could not send request.");
  }
};


  const fetchGuides = async () => {
  const response = await apiClient.get("/api/guides/list");
  setGuides(response.data);
};


  const fetchRequestsForGuide = async () => {
  const response = await apiClient.get("/api/tours/requests");
  setTourRequests(response.data);
};


  const handleAccept = async (requestId: string) => {
  await apiClient.put("/api/tours/accept", { tourId: requestId });
  Alert.alert("Accepted", "Tour accepted and started.");
  fetchRequestsForGuide();
  fetchOngoingToursAndCheck();
};


  const handleReject = async (requestId: string) => {
  await apiClient.delete("/api/tours/reject", {
    data: { tourId: requestId },
  });
  Alert.alert("Rejected", "Request rejected.");
  fetchRequestsForGuide();
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
      style={styles.card}
      onPress={() => router.push(`/tours/${item._id}`)}
    >
      <Text style={styles.cardTitle}>Tour with {role === 'Visitor' ? item.guide.name : item.visitor.name}</Text>
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
    </TouchableOpacity>
  );

  return (
  <View style={styles.container}>
    <TopNavbar />

    {role === "Visitor" && (
      <>
        <Text style={styles.title}>Find a Guide</Text>

        <TouchableOpacity style={styles.button} onPress={fetchGuides}>
          <Text style={styles.buttonText}>List Guides</Text>
        </TouchableOpacity>

        <FlatList
          data={guides}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
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
          <Text style={styles.cardText}>No ongoing tours to show.</Text>
        ) : (
          <FlatList
            data={ongoingTours}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => renderTourCard(item, "ongoing")}
            contentContainerStyle={{ paddingBottom: 100 }} // 👈 Nav bar yüksekliği kadar boşluk
          />
        )}

        <Text style={styles.sectionTitle}>Completed Tours</Text>
        {completedTours.length === 0 ? (
          <Text style={styles.cardText}>No completed tours yet.</Text>
        ) : (
          <FlatList
            data={completedTours}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => renderTourCard(item, "completed")}
            contentContainerStyle={{ paddingBottom: 100 }} // 👈 Nav bar yüksekliği kadar boşluk
          />
        )}
      </>
    )}

    {role === "Guide" && (
      <>
        <Text style={styles.title}>Incoming Requests</Text>

        <TouchableOpacity style={styles.button} onPress={fetchRequestsForGuide}>
          <Text style={styles.buttonText}>Load Requests</Text>
        </TouchableOpacity>

        <FlatList
          data={tourRequests}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Visitor: {item.visitor.name}</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "green" }]}
                  onPress={() => handleAccept(item._id)}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "red" }]}
                  onPress={() => handleReject(item._id)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <Text style={styles.sectionTitle}>Ongoing Tours</Text>
        {ongoingTours.length === 0 ? (
          <Text style={styles.cardText}>No ongoing tours to show.</Text>
        ) : (
          <FlatList
            data={ongoingTours}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => renderTourCard(item, "ongoing")}
            contentContainerStyle={{ paddingBottom: 100 }} // 👈 Nav bar yüksekliği kadar boşluk
          />
        )}

        <Text style={styles.sectionTitle}>Completed Tours</Text>
        {completedTours.length === 0 ? (
          <Text style={styles.cardText}>No completed tours yet.</Text>
        ) : (
          <FlatList
            data={completedTours}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => renderTourCard(item, "completed")}
            contentContainerStyle={{ paddingBottom: 100 }} // 👈 Nav bar yüksekliği kadar boşluk
          />
        )}
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
  container: { flex: 1, padding: 20,paddingTop: Platform.OS === 'ios' ? 60 : 40, backgroundColor: colors.background },
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardText: {
    color: colors.secondaryText,
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
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
