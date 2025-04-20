import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import { colors } from '../../styles/theme';

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
    const toUserId = tour.visitor._id;
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tour Details</Text>
        <View style={styles.card}>
          <Text style={styles.detailText}>Status: {tour.status}</Text>
          <Text style={styles.detailText}>Started: {new Date(tour.startDate).toLocaleString()}</Text>
          {tour.completedAt && (
            <Text style={styles.detailText}>Completed: {new Date(tour.completedAt).toLocaleString()}</Text>
          )}

          <Text style={styles.sectionTitle}>Visitor</Text>
          <TouchableOpacity onPress={() => router.push(`/profile/${tour.visitor._id}`)}>
            <Text style={styles.linkText}>{tour.visitor.name}</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Guide</Text>
          <TouchableOpacity onPress={() => router.push(`/profile/${tour.guide._id}`)}>
            <Text style={styles.linkText}>{tour.guide.name}</Text>
          </TouchableOpacity>

          {tour.status === 'Active' && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleEndTour}>
              <Text style={styles.buttonText}>End Tour</Text>
            </TouchableOpacity>
          )}

          {tour.status === 'Completed' && (
            <TouchableOpacity style={[styles.primaryButton, { marginTop: 10 }]} onPress={() => setFeedbackModalVisible(true)}>
              <Text style={styles.buttonText}>Rate Visitor / Rate Guide</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>Feedbacks for this Tour:</Text>
        {tourFeedbacks.length > 0 ? (
          tourFeedbacks.map((fb) => (
            <View key={fb._id} style={styles.feedbackCard}>
              <Text style={styles.detailText}>From: {fb.fromUser.name}</Text>
              <Text style={styles.detailText}>Rating: {fb.rating} / 5</Text>
              <Text style={styles.detailText}>Comment: {fb.comment}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.detailText}>No feedbacks yet for this tour.</Text>
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
              <TouchableOpacity style={styles.primaryButton} onPress={handleSendFeedback}>
                <Text style={styles.buttonText}>Submit Feedback</Text>
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
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: colors.text,
  },
  detailText: {
    color: colors.secondaryText,
    fontSize: 15,
    marginBottom: 4,
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderColor: colors.border,
    borderWidth: 1,
  },
  feedbackCard: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    borderColor: colors.border,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: colors.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: colors.buttonText,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 10,
    width: '85%',
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
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: colors.text,
    marginBottom: 10,
  },
});
