import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { authStyles } from "../styles/authStyles";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { useEffect } from "react";
import { checkAuth } from "../utils/authGuard";

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
    <ImageBackground 
      source={require("../assets/images/background.png")} 
      style={authStyles.background}
      resizeMode="cover"
    >
      <View style={authStyles.container}>
        <Text style={authStyles.title}>Ana Sayfa</Text>
        
        <Text style={[authStyles.text, { color: "white" }]}>
          Hoş geldiniz! Başarıyla giriş yaptınız.
        </Text>

        <TouchableOpacity 
          style={authStyles.button}
          onPress={handleLogout}
        >
          <Text style={authStyles.buttonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
} 