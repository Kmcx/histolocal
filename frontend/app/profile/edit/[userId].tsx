import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { BottomNavigationBar } from '../../../components/BottomNavigationBar';
import { colors } from '../../../styles/theme';
import { apiClient } from "@lib/axiosInstance";

export default function ProfileEditScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState('');
  const [availability, setAvailability] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
    try {
      const response = await apiClient.get(`/api/profile/${userId}`);
      setProfileData(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
      setBio(response.data.bio || '');
      setLanguages(response.data.languages?.join(', ') || '');
      setAvailability(response.data.guideDetails?.availability ?? null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

    fetchProfile();
  }, [userId]);

  const handleUpdate = async () => {
  try {
    const updatedData: any = {
      name,
      email,
      bio,
      languages: languages.split(',').map((lang) => lang.trim()),
      guideDetails: {
        availability,
      },
    };

    await apiClient.put(`/api/profile/edit/${userId}`, updatedData);
    Alert.alert('Success', 'Profile updated successfully!');
    router.back();
  } catch (error) {
    console.error('Error updating profile:', error);
    Alert.alert('Error', 'Failed to update profile.');
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Update Your Profile</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.secondaryText}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={colors.secondaryText}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          placeholderTextColor={colors.secondaryText}
        />
        <TextInput
          style={styles.input}
          placeholder="Languages (comma separated)"
          value={languages}
          onChangeText={setLanguages}
          placeholderTextColor={colors.secondaryText}
        />

        <Text style={styles.availabilityTitle}>Availability</Text>
        <View style={styles.availabilityButtons}>
          <TouchableOpacity
            style={[styles.availabilityButton, availability === true && styles.activeButton]}
            onPress={() => setAvailability(true)}
          >
            <Text style={availability === true ? styles.activeButtonText : styles.buttonText}>Available</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.availabilityButton, availability === false && styles.activeButton]}
            onPress={() => setAvailability(false)}
          >
            <Text style={availability === false ? styles.activeButtonText : styles.buttonText}>Not Available</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigationBar activeTab="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 80 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: colors.text,
  },
  availabilityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  availabilityButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.border,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.text,
  },
  activeButtonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: colors.buttonBackground,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
  },
});
