import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authStyles } from "../../styles/authStyles";
import { colors } from "../../styles/theme";
import logo from "../../assets/logo.png";
import { apiClient } from "@lib/axiosInstance";

export default function AdminLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      const response = await apiClient.post("/api/admin/login", {
        email,
        password,
      });

      if (response.data.token && response.data.isAdmin) {
        await AsyncStorage.setItem("adminToken", response.data.token);
        await AsyncStorage.setItem("userId", response.data.adminUserId); // ✅ userId admin için eklendi
        Alert.alert("Success", "Logged in as Admin");
        router.push("/admin/home");
      } else {
        Alert.alert("Error", "Not authorized as admin.");
      }
    } catch (error) {
      console.error("Admin Login Error:", error);
      Alert.alert("Login Failed", "Invalid credentials or network issue.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={authStyles.background}
      resizeMode="cover"
    >
      <View style={authStyles.container}>
        <View style={authStyles.logoWrapper}>
          <Image source={logo} style={authStyles.logo} resizeMode="contain" />
        </View>

        <Text style={authStyles.title}>Admin Login</Text>

        <TextInput
          style={authStyles.input}
          placeholder="Admin Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#419097"
        />
        <TextInput
          style={authStyles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#419097"
        />

        <TouchableOpacity style={authStyles.button} onPress={handleAdminLogin}>
          <Text style={authStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={authStyles.link}>Login as User</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}