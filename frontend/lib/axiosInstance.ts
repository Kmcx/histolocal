import axios from 'axios';
import { API_URL, AI_URL } from '../lib/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// 🟢 Backend API
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔵 AI API
export const aiClient = axios.create({
  baseURL: AI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Token ekleyici interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const userToken = await AsyncStorage.getItem("userToken");
    const adminToken = await AsyncStorage.getItem("adminToken");

    const token = adminToken || userToken;
    console.log("🟢 Token added to axios header:", token); // DEBUG LOG

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global hata gösterici
const handleError = (error: any) => {
  console.error("Axios Error:", error);
  if (error.response) {
    const message = error.response.data.message || "Server error occurred.";
    Alert.alert("Error", message);
  } else if (error.request) {
    Alert.alert("Network Error", "Could not reach the server.");
  } else {
    Alert.alert("Unexpected Error", error.message);
  }
  return Promise.reject(error);
};

apiClient.interceptors.response.use((res) => res, handleError);
aiClient.interceptors.response.use((res) => res, handleError);
