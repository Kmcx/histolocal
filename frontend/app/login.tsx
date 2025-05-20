import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authStyles } from "../styles/authStyles";
import logo from "../assets/logo.png";
import { apiClient } from "@lib/axiosInstance";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


 const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });

      const { token, _id } = response.data;

      if (token) {
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userId", _id);
        Alert.alert("Success", "Login successful!");
        router.push("/home");
      } else {
        Alert.alert("Error", "Token not received.");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <ImageBackground 
      source={require("../assets/images/background.png")} 
      style={authStyles.background}
      resizeMode="cover"
    >
      <View style={authStyles.container}>

        {/* Logo */}
        <View style={authStyles.logoWrapper}>
          <Image source={logo} style={authStyles.logo} resizeMode="contain" />
        </View>

        <Text style={authStyles.title}>Welcome Back</Text>

        <TextInput style={authStyles.input} placeholder="Email" placeholderTextColor="#419097" value={email} onChangeText={setEmail} />
        <TextInput style={authStyles.input} placeholder="Password" placeholderTextColor="#419097" secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={authStyles.button} onPress={handleLogin}>
          <Text style={authStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register") }>
          <Text style={authStyles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/admin/login")}>
          <Text style={[authStyles.link, { marginTop: 10 }]}>Login as Admin</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}
