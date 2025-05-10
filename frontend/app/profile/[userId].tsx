import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import { colors } from '../../styles/theme';
import { apiClient } from "@lib/axiosInstance";

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
    const token = await AsyncStorage.getItem("userToken") || await AsyncStorage.getItem("adminToken");
    const currentUserId = await AsyncStorage.getItem("userId");
    setLoggedInUserId(currentUserId);

    const adminToken = await AsyncStorage.getItem("adminToken");
    if (adminToken) {
      setIsAdmin(true);
    }

    try {
      const profileResponse = await apiClient.get(`/api/profile/${userId}`);
      setProfileData(profileResponse.data);

      const feedbackResponse = await apiClient.get(`/api/feedback/user/${userId}`);
      setFeedbacks(feedbackResponse.data);
    } catch (error) {
      console.error("Error fetching profile or feedback:", error);
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

const handleVerifyProfile = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert("Permission required", "We need access to your gallery.");
    return;
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync({ base64: false });
  if (pickerResult.canceled) return;

  const image = pickerResult.assets[0];
  const data = new FormData();
  data.append("file", {
    uri: image.uri,
    type: "image/jpeg",
    name: "id.jpg",
  } as any);
  data.append("upload_preset", "histolocal");

  try {
    const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/<your_cloud_name>/image/upload", {
      method: "POST",
      body: data,
    });

    const cloudData = await cloudinaryRes.json();
    const imageUrl = cloudData.secure_url;

    await apiClient.post("/api/profile/upload-id", { imageUrl });

    Alert.alert("Success", "Your ID has been submitted.");
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    Alert.alert("Upload Failed", "Could not upload ID.");
  }
};


  if (loading || !profileData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={100} color={colors.primary} />
        </View>

        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.roleText}>{profileData.role}</Text>
        <Text style={styles.email}>{profileData.email}</Text>

        <Text style={styles.sectionTitle}>Bio</Text>
        <Text style={styles.sectionText}>{profileData.bio || 'No bio available.'}</Text>

        <Text style={styles.sectionTitle}>Languages</Text>
        <Text style={styles.sectionText}>{profileData.languages?.join(', ') || 'No languages specified.'}</Text>

        <Text style={styles.sectionTitle}>Feedback</Text>
        {feedbacks.length > 0 ? (
          <FlatList
            data={feedbacks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.feedbackCard}>
                <Text style={styles.sectionText}>From: {item.fromUser.name}</Text>
                <Text style={styles.sectionText}>Rating: {item.rating} / 5</Text>
                <Text style={styles.sectionText}>Comment: {item.comment}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.sectionText}>No feedback yet.</Text>
        )}

        {loggedInUserId === userId && (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push(`/profile/edit/${userId}`)}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyProfile}>
              <Text style={styles.buttonText}>Verify Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={22} color="#FF3B30" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </>
        )}

        {isAdmin && profileData.idImageUrl && (
          <>
            <Text style={styles.sectionTitle}>Uploaded ID Card</Text>
            <TouchableOpacity onPress={() => router.push(profileData.idImageUrl)}>
              <Text style={styles.link}>View ID Image</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <BottomNavigationBar activeTab="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  container: { padding: 20, paddingBottom: 100 },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: colors.text },
  roleText: { fontSize: 16, color: colors.secondaryText, textAlign: 'center', marginBottom: 5 },
  email: { textAlign: 'center', marginBottom: 20, color: colors.secondaryText },
  sectionTitle: { fontWeight: 'bold', marginTop: 20, marginBottom: 8, fontSize: 16, color: colors.text },
  sectionText: { color: colors.secondaryText, marginBottom: 4 },
  feedbackCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: colors.card,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'center',
  },
  logoutText: { marginLeft: 8, color: '#FF3B30', fontSize: 16, fontWeight: 'bold' },
  link: { color: colors.primary, textDecorationLine: 'underline' },
  primaryButton: {
    backgroundColor: colors.buttonBackground,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
  },
});
