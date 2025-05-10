import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, ScrollView, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { authStyles } from "../styles/authStyles";
import { colors } from "../styles/theme";
import logo from "../assets/logo.png";
import { apiClient } from "@lib/axiosInstance";

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
    Alert.alert("Alert", "Please fill all required fields.");
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
    const response = await apiClient.post("/api/auth/register", userData);
    Alert.alert("Success", "Successfully Registered!");
    router.push("/login");
  } catch (error) {
    console.error("Register error:", error);
    // Hata interceptor tarafından da gösterilecek
  }
};

  return (
    <ImageBackground 
      source={require("../assets/images/background.png")} 
      style={authStyles.background} 
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={authStyles.logoWrapper}>
          <Image source={logo} style={authStyles.logo} resizeMode="contain" />
        </View>

        <Text style={authStyles.title}>Register</Text>

        <TextInput style={authStyles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={authStyles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={authStyles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

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
            <TextInput style={authStyles.input} placeholder="Bio" value={bio} onChangeText={setBio} />
            <TextInput style={authStyles.input} placeholder="Languages (comma-separated)" value={languages} onChangeText={setLanguages} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
              <Text style={{ color: colors.text, marginRight: 10 }}>Availability:</Text>
              <TouchableOpacity
                onPress={() => setAvailability(!availability)}
                style={[styles.availabilityToggle, availability && styles.availabilityActive]}
              >
                <Text style={{ color: availability ? 'white' : colors.text }}>{availability ? 'Available' : 'Not Available'}</Text>
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
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedRoleButton: {
    backgroundColor: colors.primary,
  },
  roleButtonText: {
    color: colors.text,
    fontSize: 16,
  },
  selectedRoleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  availabilityToggle: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    borderRadius: 8,
  },
  availabilityActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
