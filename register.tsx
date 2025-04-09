import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { authStyles } from "../styles/authStyles";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Visitor" | "Guide">("Visitor"); // ✅ Typed role

  // Additional fields for guides
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState("");
  const [availability, setAvailability] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    // Define base user data
    const userData: {
      name: string;
      email: string;
      password: string;
      role: "Visitor" | "Guide";
      guideDetails?: { bio: string; languages: string[]; availability: string }; // ✅ Optional guide details
    } = {
      name,
      email,
      password,
      role,
    };

    // If the role is Guide, include `guideDetails`
    if (role === "Guide") {
      userData.guideDetails = {
        bio,
        languages: languages.split(",").map((lang) => lang.trim()), // Convert to array
        availability,
      };
    }

    try {
      console.log("Sending data:", userData); // ✅ Debugging log

      const response = await axios.post("http://localhost:5000/api/auth/register", userData);

      Alert.alert("Success", "Account created! You can now login.");
      router.replace("/login");
    } catch (error) {
      console.error("Registration Error:", error);
      let errorMessage = "Registration failed.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Registration failed.";
      }

      Alert.alert("Error", errorMessage);
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

        <TextInput style={authStyles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={authStyles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={authStyles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

        {/* Role Selection Dropdown */}
        <View style={authStyles.pickerContainer}>
          <Picker
            selectedValue={role}
            style={authStyles.picker}
            onValueChange={(itemValue) => setRole(itemValue as "Visitor" | "Guide")} // ✅ Type assertion
          >
            <Picker.Item label="Visitor" value="Visitor" />
            <Picker.Item label="Guide" value="Guide" />
          </Picker>
        </View>

        {/* Show extra fields only if the user selects "Guide" */}
        {role === "Guide" && (
          <>
            <TextInput style={authStyles.input} placeholder="Bio" value={bio} onChangeText={setBio} />
            <TextInput style={authStyles.input} placeholder="Languages (comma separated)" value={languages} onChangeText={setLanguages} />
            <TextInput style={authStyles.input} placeholder="Availability (e.g., Weekends Only)" value={availability} onChangeText={setAvailability} />
          </>
        )}

        <TouchableOpacity style={authStyles.button} onPress={handleRegister}>
          <Text style={authStyles.buttonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
