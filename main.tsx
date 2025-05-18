import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { authStyles } from "../styles/authStyles";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { useEffect } from "react";
import { checkAuth } from "../utils/authGuard";
import { LinearGradient } from "expo-linear-gradient";

export default function MainScreen() {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.replace("/login");
      }
    };

    verifyAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // Token'ı platform'a göre sil
      if (Platform.OS === "web") {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userRole");
      } else {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userRole");
      }
      
      // Login sayfasına yönlendir
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={authStyles.background}
    >
      <View style={authStyles.container}>
        <Text style={[authStyles.title, { fontFamily: "Arial", color: "white" }]}>Ana Sayfa</Text>
        
        <Text style={[authStyles.text, { color: "white", fontFamily: "Arial" }]}>
          Hoş geldiniz! Başarıyla giriş yaptınız.
        </Text>

        <TouchableOpacity 
          style={[authStyles.button, { borderRadius: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3.84, elevation: 5 }]}
          onPress={handleLogout}
        >
          <Text style={[authStyles.buttonText, { fontFamily: "Arial" }]}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
} 