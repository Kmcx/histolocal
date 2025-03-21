import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomNavigationBar } from '../../../components/BottomNavigationBar';

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
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
      const token = await AsyncStorage.getItem('userToken');
      const updatedData: any = {
        name,
        email,
        bio,
        languages: languages.split(',').map((lang) => lang.trim()),
        guideDetails: {
          availability,
        },
      };

      await axios.put(`${process.env.EXPO_PUBLIC_API_URL}api/profile/edit/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Update Your Profile</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
        />
        <TextInput
          style={styles.input}
          placeholder="Languages (comma separated)"
          value={languages}
          onChangeText={setLanguages}
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

        <Button title="Save Changes" onPress={handleUpdate} />
      </ScrollView>

      <BottomNavigationBar activeTab="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 80 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  availabilityTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  availabilityButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  availabilityButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  buttonText: { color: '#000' },
  activeButtonText: { color: '#fff', fontWeight: 'bold' },
});