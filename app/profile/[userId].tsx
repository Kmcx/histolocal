import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [comments, setComments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const storedUserId = await AsyncStorage.getItem('userId');
        setCurrentUserId(storedUserId);

        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);

        // Optionally fetch comments
        const commentsResponse = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/feedback/${userId}`);
        setComments(commentsResponse.data || []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading || !profileData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#4A90E2" />
        </View>

        <TextInput
          style={styles.input}
          value={profileData?.name || ''}
          editable={false}
          placeholder="Name"
        />
        <TextInput
          style={styles.input}
          value={profileData?.email || ''}
          editable={false}
          placeholder="Email"
        />

        <Text style={styles.sectionTitle}>Bio</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={profileData?.bio || 'No bio available.'}
          editable={false}
        />

        <Text style={styles.sectionTitle}>Languages</Text>
        <Text>{profileData?.languages?.join(', ') || 'Not specified'}</Text>

        <Text style={styles.sectionTitle}>Availability</Text>
        <Text>{profileData?.guideDetails?.availability ? 'Available' : 'Not Available'}</Text>

        <Text style={styles.sectionTitle}>Comments</Text>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <View key={index} style={styles.commentBox}>
              <Text>{comment}</Text>
            </View>
          ))
        ) : (
          <Text>No comments yet.</Text>
        )}

        {currentUserId === userId && (
          <View style={{ marginTop: 20 }}>
            <Button title="Update Profile" onPress={() => router.push(`/profile/edit/${userId}`)} />
          </View>
        )}
      </ScrollView>

      <BottomNavigationBar activeTab="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 80 },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: { fontWeight: 'bold', marginTop: 20, marginBottom: 10, fontSize: 16 },
  commentBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
});