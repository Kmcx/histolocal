import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button, TouchableOpacity, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const currentUserId = await AsyncStorage.getItem('userId');
      setLoggedInUserId(currentUserId);

      try {
        const profileResponse = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(profileResponse.data);

        const feedbackResponse = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/feedback/user/${userId}`);
        setFeedbacks(feedbackResponse.data);
      } catch (error) {
        console.error('Error fetching profile or feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    router.push('/login');
  };

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

        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.roleText}>{profileData.role}</Text>
        <Text style={styles.email}>{profileData.email}</Text>

        <Text style={styles.sectionTitle}>Bio</Text>
        <Text>{profileData.bio || 'No bio available.'}</Text>

        <Text style={styles.sectionTitle}>Languages</Text>
        <Text>{profileData.languages?.join(', ') || 'No languages specified.'}</Text>

        <Text style={styles.sectionTitle}>Feedback</Text>
        {feedbacks.length > 0 ? (
          <FlatList
            data={feedbacks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.feedbackCard}>
                <Text>From: {item.fromUser.name}</Text>
                <Text>Rating: {item.rating} / 5</Text>
                <Text>Comment: {item.comment}</Text>
              </View>
            )}
          />
        ) : (
          <Text>No feedback yet.</Text>
        )}

        {loggedInUserId === userId && (
          <>
            <View style={{ marginTop: 20 }}>
              <Button title="Update Profile" onPress={() => router.push(`/profile/edit/${userId}`)} />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color="#FF3B30" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <BottomNavigationBar activeTab="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  roleText: { fontSize: 16, color: '#777', textAlign: 'center', marginBottom: 5 },
  email: { textAlign: 'center', marginBottom: 20, color: '#444' },
  sectionTitle: { fontWeight: 'bold', marginTop: 20, marginBottom: 10, fontSize: 16 },
  feedbackCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'center',
  },
  logoutText: { marginLeft: 8, color: '#FF3B30', fontSize: 16, fontWeight: 'bold' },
});
