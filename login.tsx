import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Platform } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Web fallback storage
import { authStyles } from "../styles/authStyles";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const saveToken = async (key: string, value: string) => {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.setItem(key, value); // ✅ Use AsyncStorage on Web
      } else {
        await SecureStore.setItemAsync(key, value); // ✅ Use SecureStore on Mobile
      }
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const handleLogin = async () => {
    console.log("Login button clicked!");

    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      console.log("Sending login request with:", { email, password });

      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      // ✅ Store token securely based on platform
      await saveToken("userToken", response.data.token);
      await saveToken("userRole", response.data.role);

      Alert.alert("Success", "Login successful!");
      router.replace("/"); // Redirect to home
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Login failed.";
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
      <View style={authStyles.container}>
        <Text style={authStyles.title}>Login</Text>

        <TextInput style={authStyles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={authStyles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={authStyles.button} onPress={handleLogin}>
          <Text style={authStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={authStyles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
