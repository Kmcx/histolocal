// ✅ Güncellenmiş register.tsx (Guide seçildiğinde ek alanları açan sürüm)

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { authStyles } from "../styles/authStyles";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Visitor" | "Guide">("Visitor");

  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState("");
  const [availability, setAvailability] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert("Alert", "Please fill whole areas.");
      return;
    }

    const userData: any = {
      name,
      email,
      password,
      role,
    };

    if (role === "Guide") {
      userData.isVerified = false;
      userData.guideDetails = {
        bio,
        languages: languages.split(",").map((lang) => lang.trim()),
        availability,
      };
    }

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}api/auth/register`, userData);
      Alert.alert("Success", "Successfully Registered!");
      router.push("/login");
    } catch (error) {
      console.error("Register error hatası:", error);
      Alert.alert("Error", "Registration failed.");
    }
  };

  return (
    <ImageBackground 
      source={require("../assets/images/background.png")} 
      style={authStyles.background} 
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={authStyles.container}>
        <Text style={authStyles.title}>Register</Text>

        <TextInput style={[authStyles.input, { color: 'black' }]} placeholderTextColor="#000" placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={[authStyles.input, { color: 'black' }]} placeholderTextColor="#000" placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={[authStyles.input, { color: 'black' }]} placeholderTextColor="#000" placeholder="password" secureTextEntry value={password} onChangeText={setPassword} />

        <View style={styles.roleSelectionContainer}>
          <TouchableOpacity onPress={() => setRole("Visitor")} style={[styles.roleButton, role === "Visitor" && styles.selectedRoleButton]}>
            <Text style={[styles.roleButtonText, role === "Visitor" && styles.selectedRoleText]}>Visitor</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRole("Guide")} style={[styles.roleButton, role === "Guide" && styles.selectedRoleButton]}>
            <Text style={[styles.roleButtonText, role === "Guide" && styles.selectedRoleText]}>Guide</Text>
          </TouchableOpacity>
        </View>

        {role === "Guide" && (
          <View>
            <TextInput style={[authStyles.input, { color: 'black' }]} placeholderTextColor="#000" placeholder="Biyografi (bio)" value={bio} onChangeText={setBio} />
            <TextInput style={[authStyles.input, { color: 'black' }]} placeholderTextColor="#000" placeholder="Languages (Seperate with comas)" value={languages} onChangeText={setLanguages} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
              <Text style={{ color: 'black', marginRight: 10 }}>Availability:</Text>
              <TouchableOpacity
                onPress={() => setAvailability(!availability)}
                style={[styles.availabilityToggle, availability && styles.availabilityActive]}
              >
                <Text style={{ color: availability ? 'white' : 'black' }}>{availability ? 'Available' : 'Not Available'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={authStyles.button} onPress={handleRegister}>
          <Text style={authStyles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={authStyles.link}>Already have account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  roleSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedRoleButton: {
    backgroundColor: '#4A90E2',
  },
  roleButtonText: {
    color: 'black',
    fontSize: 16,
  },
  selectedRoleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  availabilityToggle: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
  },
  availabilityActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
});