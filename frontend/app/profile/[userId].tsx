import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, FlatList, Alert, Switch, Button } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import { AdminNavigationBar } from '../../components/AdminNavigationBar'; 
import { colors } from '../../styles/theme';
import { apiClient } from "@lib/axiosInstance";

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [kvkkVisible, setKvkkVisible] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

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
    await AsyncStorage.removeItem('adminToken'); //  clear admin logout
    await AsyncStorage.removeItem('userId');
    router.push('/login');
  };


  const handleVerifyProfile = () => {
    setKvkkVisible((prev) => !prev);
  };

  const launchImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "You need to allow access to your photos.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (pickerResult.canceled) {
      Alert.alert("Cancelled", "No image selected.");
      return;
    }

    const image = pickerResult.assets[0];
    const formData = new FormData();
    formData.append("file", {
      uri: image.uri,
      name: "id.jpg",
      type: "image/jpeg",
    } as any);

    try {
      setUploading(true);
      const res = await apiClient.post("/api/profile/upload-id", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Your ID image has been uploaded. Your verification is now pending.");
      setProfileData({ ...profileData, isVerified: "pending" });
      setKvkkVisible(false);
      setConsentGiven(false);
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to upload ID image.");
    } finally {
      setUploading(false);
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
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
      {/* ← Back tuşu */}
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 10 }}>
        <Text style={{ color: colors.primary, fontWeight: "bold" }}>← Back</Text>
      </TouchableOpacity>

      <View style={{ alignItems: "center" }}>
        <Ionicons name="person-circle-outline" size={100} color={colors.primary} />
      </View>

      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>{profileData.name}</Text>
      <Text style={{ fontSize: 16, textAlign: "center" }}>{profileData.role}</Text>
      <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 10 }}>{profileData.email}</Text>

      {profileData.isVerified === true && <Text style={{ color: "green", textAlign: "center" }}>✅ Verified</Text>}
      {profileData.isVerified === "pending" && loggedInUserId === userId && (
        <Text style={{ color: "orange", textAlign: "center" }}>⏳ Verification Pending</Text>
      )}

      <Text style={{ fontWeight: "bold", marginTop: 20 }}>Bio</Text>
      <Text>{profileData.bio || 'No bio available.'}</Text>

      <Text style={{ fontWeight: "bold", marginTop: 20 }}>Languages</Text>
      <Text>{profileData.languages?.join(', ') || 'No languages specified.'}</Text>

      <Text style={{ fontWeight: "bold", marginTop: 20 }}>Feedback</Text>
      {feedbacks.length > 0 ? (
        <FlatList
          data={feedbacks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10, padding: 10, backgroundColor: colors.card, borderRadius: 8 }}>
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
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push(`/profile/edit/${userId}`)}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyProfile}>
            <Text style={styles.buttonText}>📤 Verify Profile</Text>
          </TouchableOpacity>

          {kvkkVisible && (
            <View style={{ backgroundColor: "#fff", padding: 16, borderRadius: 10, marginTop: 15 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>KVKK Aydınlatma Metni</Text>
              <Text style={{ fontSize: 13, marginBottom: 10 }}>
                TR: Kimlik fotoğrafınızı yükleyerek, kişisel verilerinizin 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında işlenmesine onay vermiş olursunuz.
              </Text>
              <Text style={{ fontSize: 13, marginBottom: 10 }}>
                EN: By uploading your ID photo, you consent to the processing of your personal data in accordance with the Personal Data Protection Law (KVKK).
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Switch value={consentGiven} onValueChange={setConsentGiven} />
                <Text style={{ marginLeft: 10 }}>I agree</Text>
              </View>
              <Button title={uploading ? "Uploading..." : "Select and Upload Photo"} onPress={launchImagePicker} disabled={!consentGiven || uploading} />
            </View>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={22} color="#FF3B30" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </>
      )}

      {isAdmin && profileData.idImageUrl && (
        <>
          <Text style={{ fontWeight: "bold", marginTop: 20 }}>Uploaded ID Card</Text>
          <TouchableOpacity onPress={() => router.push(profileData.idImageUrl)}>
            <Text style={{ color: colors.primary }}>View ID Image</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>

    {isAdmin ? (
      <AdminNavigationBar activeTab="profile" />
    ) : (
      <BottomNavigationBar activeTab="profile" />
    )}
  </View>
);

}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  primaryButton: { backgroundColor: '#96CECD', padding: 12, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  buttonText: { color: "white", fontWeight: "bold" },
  logoutButton: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 },
  logoutText: { marginLeft: 8, color: '#FF3B30', fontSize: 16, fontWeight: 'bold' },
});
