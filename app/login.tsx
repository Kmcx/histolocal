import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Image } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authStyles } from "../styles/authStyles";
import logo from "../assets/logo.png";

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
      const response = await axios.post(`http://192.168.1.104:5000/api/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userId', response.data._id);
        Alert.alert("Success", "Login successful!");
        router.push("/home");
      } else {
        Alert.alert("Error", "Token not received.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to login. Please try again.");
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

        <TextInput style={authStyles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={authStyles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

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
