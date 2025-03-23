import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal,Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';

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
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      if (token && userId) {
        const profileResponse = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/tours/ongoing`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const completedToursFound = response.data.filter((tour: any) => tour.status === 'Completed');
      if (completedToursFound.length > 0) {
        setCompletedTourToRate(completedToursFound[0]);
        setShowCompletedModal(true);
      }

      setOngoingTours(response.data);
    } catch (error) {
      console.error('Error fetching ongoing tours:', error);
    }
  };

  const fetchCompletedTours = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/tours/completed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompletedTours(response.data);
    } catch (error) {
      console.error('Error fetching completed tours:', error);
    }
  };

  const sendRequestToGuide = async (guideId: string) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}api/tours/request`, { guideId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Tour request sent!');
    } catch (error) {
      Alert.alert('Error', 'Could not send request.');
    }
  };

  const fetchGuides = async () => {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/guides/list`);
    setGuides(response.data);
  };

  const fetchRequestsForGuide = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/tours/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTourRequests(response.data);
  };

  const handleAccept = async (requestId: string) => {
    const token = await AsyncStorage.getItem('userToken');
    await axios.put(`${process.env.EXPO_PUBLIC_API_URL}api/tours/accept`, { tourId: requestId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Alert.alert('Accepted', 'Tour accepted and started.');
    fetchRequestsForGuide();
    fetchOngoingToursAndCheck();
  };

  const handleReject = async (requestId: string) => {
    const token = await AsyncStorage.getItem('userToken');
    await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}api/tours/reject`, {
      data: { tourId: requestId },
      headers: { Authorization: `Bearer ${token}` },
    });
    Alert.alert('Rejected', 'Request rejected.');
    fetchRequestsForGuide();
  };

  const handleEndTour = async (tourId: string) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      await axios.put(`${process.env.EXPO_PUBLIC_API_URL}api/tours/complete`, { tourId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Tour ended successfully!');
      fetchOngoingToursAndCheck();
      fetchCompletedTours();
    } catch (error) {
      console.error('Error ending tour:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      {role === 'Visitor' && (
        <>
          <Text style={styles.title}>Find a Guide</Text>
          <TouchableOpacity style={styles.findGuideButton} onPress={fetchGuides}>
            <Text style={styles.findGuideButtonText}>List Guides</Text>
          </TouchableOpacity>
          <FlatList
            data={guides}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.guideCard}>
                <Text style={styles.guideName}>{item.name}</Text>
                <TouchableOpacity style={styles.requestButton} onPress={() => sendRequestToGuide(item._id)}>
                  <Text style={styles.buttonText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Text style={styles.subtitle}>Ongoing Tours</Text>
          <FlatList
            data={ongoingTours}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.guideCard}>
                <TouchableOpacity onPress={() => router.push(`/tours/${item._id}`)}>
                  <Text>Tour with {role === 'Visitor' ? item.guide.name : item.visitor.name}</Text>
                  <Text>Start: {new Date(item.startDate).toLocaleDateString()}</Text>
                </TouchableOpacity>
                <Button
                  title="End Tour"
                  color="#FF3B30"
                  onPress={() => handleEndTour(item._id)}
                />
              </View>
            )}
          />


          <Text style={styles.subtitle}>Completed Tours</Text>
          <FlatList
            data={completedTours}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.guideCard} onPress={() => router.push(`/tours/${item._id}`)}>
                <Text>Tour with {role === 'Visitor' ? item.guide.name : item.visitor.name}</Text>
                <Text>
                  Completed on: {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'Not Available'}
                </Text>
              </TouchableOpacity>
            )}
          />

        </>
      )}

      {role === 'Guide' && (
        <>
          <Text style={styles.title}>Incoming Requests</Text>
          <TouchableOpacity style={styles.findGuideButton} onPress={fetchRequestsForGuide}>
            <Text style={styles.findGuideButtonText}>Load Requests</Text>
          </TouchableOpacity>
          <FlatList
            data={tourRequests}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.requestCard}>
                <Text>Visitor: {item.visitor.name}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item._id)}>
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item._id)}>
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

            <Text style={styles.subtitle}>Ongoing Tours</Text>
            <FlatList
              data={ongoingTours}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.guideCard}>
                  <TouchableOpacity onPress={() => router.push(`/tours/${item._id}`)}>
                    <Text>Tour with {role === 'Guide' ? item.guide.name : item.visitor.name}</Text>
                    <Text>Start: {new Date(item.startDate).toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  <Button
                    title="End Tour"
                    color="#FF3B30"
                    onPress={() => handleEndTour(item._id)}
                  />
                </View>
              )}
            />


          <Text style={styles.subtitle}>Completed Tours</Text>
          <FlatList
            data={completedTours}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.guideCard} onPress={() => router.push(`/tours/${item._id}`)}>
                <Text>Tour with {role === 'Guide' ? item.guide.name : item.visitor.name}</Text>
                <Text>
                  Completed on: {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'Not Available'}
                </Text>
              </TouchableOpacity>
            )}
/>

        </>
      )}

      <Modal visible={showCompletedModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tour has been completed!</Text>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => {
                setShowCompletedModal(false);
                router.push(`/tours/${completedTourToRate._id}`);
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                {role === 'Guide' ? 'Rate Visitor' : 'Rate Guide'}
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
    padding: 20 
  },
  findGuideButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  findGuideButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  guideCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  guideName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  requestButton: {
    backgroundColor: '#4A90E2',
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  subtitle: { 
    fontSize: 18, 
    marginTop: 30, 
    marginBottom: 10, 
    fontWeight: 'bold' 
  },
  requestCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },
  acceptButton: { 
    backgroundColor: 'green', 
    padding: 10, 
    borderRadius: 8 
  },
  rejectButton: { 
    backgroundColor: 'red', 
    padding: 10, 
    borderRadius: 8 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    width: '80%' 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  sendButton: { 
    backgroundColor: '#4A90E2', 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 10 
  },
  title: { 
  fontSize: 22, 
  fontWeight: 'bold', 
  marginBottom: 20, 
  textAlign: 'center' 
},

});

