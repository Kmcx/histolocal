import React, { useState } from "react";
import { View, ImageBackground, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, Button, Text, Surface, useTheme } from "react-native-paper";
import { authStyles } from "./styles/authStyles";

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveToken = async (key: string, value: string) => {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error("Error saving token:", error);
      throw new Error("Failed to save authentication data");
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      await saveToken("userToken", response.data.token);
      await saveToken("userRole", response.data.role);

      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Login failed. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require("../assets/images/background.png")} 
      style={authStyles.background} 
      resizeMode="cover"
    >
      <Surface style={[authStyles.container, styles.surface]}>
        <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Sign In
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/register")}
          style={styles.linkButton}
        >
          Don't have an account? Register
        </Button>
      </Surface>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  surface: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
});
