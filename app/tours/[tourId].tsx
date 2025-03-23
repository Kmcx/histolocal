import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';

export default function TourDetailScreen() {
  const { tourId } = useLocalSearchParams();
  const router = useRouter();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [tourFeedbacks, setTourFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTourDetails = async () => {
      const token = await AsyncStorage.getItem('userToken');
      try {
        const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/tours/${tourId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTour(res.data);

        // Tura ait feedback'leri çek
        const feedbackRes = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/feedback/bytour/${tourId}`);
        setTourFeedbacks(feedbackRes.data);
      } catch (error) {
        console.error('Error loading tour details or feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourDetails();
  }, [tourId]);

  const handleEndTour = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      await axios.put(`${process.env.EXPO_PUBLIC_API_URL}api/tours/complete`, { tourId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Tour ended successfully!');
      const updatedTour = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/tours/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTour(updatedTour.data);
    } catch (error) {
      console.error('Error ending tour:', error);
    }
  };

  const handleSendFeedback = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const toUserId = tour.visitor._id;  // örnek: guide -> visitor
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}api/feedback`, {
        toUser: toUserId,
        rating: Number(rating),
        comment,
        tourId: tour._id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Feedback submitted!');
      setFeedbackModalVisible(false);
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  if (loading || !tour) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tour Details</Text>
        <Text>Status: {tour.status}</Text>
        <Text>Started: {new Date(tour.startDate).toLocaleString()}</Text>
        {tour.completedAt && <Text>Completed: {new Date(tour.completedAt).toLocaleString()}</Text>}

        <Text style={styles.sectionTitle}>Visitor Info</Text>
        <TouchableOpacity onPress={() => router.push(`/profile/${tour.visitor._id}`)}>
          <Text style={styles.clickableName}>{tour.visitor.name}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Guide Info</Text>
        <TouchableOpacity onPress={() => router.push(`/profile/${tour.guide._id}`)}>
          <Text style={styles.clickableName}>{tour.guide.name}</Text>
        </TouchableOpacity>

        {tour.status === 'Active' && (
          <View style={{ marginTop: 20 }}>
            <Button title="End Tour" color="#FF3B30" onPress={handleEndTour} />
          </View>
        )}

        {tour.status === 'Completed' && (
          <View style={{ marginTop: 20 }}>
            <Button title="Rate Visitor / Rate Guide" onPress={() => setFeedbackModalVisible(true)} />
          </View>
        )}

        <Text style={styles.sectionTitle}>Feedbacks for this Tour:</Text>
        {tourFeedbacks.length > 0 ? (
          tourFeedbacks.map((fb) => (
            <View key={fb._id} style={styles.feedbackCard}>
              <Text>From: {fb.fromUser.name}</Text>
              <Text>Rating: {fb.rating} / 5</Text>
              <Text>Comment: {fb.comment}</Text>
            </View>
          ))
        ) : (
          <Text>No feedbacks yet for this tour.</Text>
        )}

        <Modal visible={feedbackModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Give Feedback</Text>
              <TextInput
                placeholder="Rating (1-5)"
                keyboardType="numeric"
                value={rating}
                onChangeText={setRating}
                style={styles.input}
              />
              <TextInput
                placeholder="Comment"
                multiline
                value={comment}
                onChangeText={setComment}
                style={[styles.input, { height: 80 }]}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendFeedback}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Submit Feedback</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFeedbackModalVisible(false)}>
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <BottomNavigationBar activeTab="tours" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  sectionTitle: { fontWeight: 'bold', marginTop: 20, marginBottom: 10, fontSize: 16 },
  clickableName: { color: '#4A90E2', textDecorationLine: 'underline', fontSize: 16, marginBottom: 5 },
  feedbackCard: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  sendButton: { backgroundColor: '#4A90E2', padding: 12, borderRadius: 8, marginTop: 10 },
});
