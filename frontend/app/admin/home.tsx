import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../styles/theme";
import { apiClient } from "@lib/axiosInstance";

type UserType = {
  _id: string;
  name: string;
  role: string;
  isVerified: boolean;
  banned: boolean;
};

export default function AdminHome() {
  const [users, setUsers] = useState<UserType[]>([]);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get("/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users:", error);
      Alert.alert("Error", "Could not fetch users.");
    }
  };

  const handleAdminLogout = async () => {
    await AsyncStorage.removeItem("adminToken");
    Alert.alert("Logged out", "You have been logged out as Admin.");
    router.push("/login");
  };

  const banUser = async (userId: string) => {
    try {
      await apiClient.delete(`/api/admin/ban/${userId}`);
      Alert.alert("Success", "User has been banned.");
      fetchUsers();
    } catch (error) {
      Alert.alert("Error", "Failed to ban user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUser = ({ item }: any) => (
    <View style={styles.userCard}>
      <Text style={styles.name}>
        {item.name} ({item.role})
      </Text>
      {item.isVerified && <Text style={styles.verified}>✅ Verified</Text>}
      {item.banned && <Text style={styles.banned}>🚫 Banned</Text>}

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => router.push(`/profile/${item._id}`)}>
          <Text style={styles.link}>View Profile</Text>
        </TouchableOpacity>

        {!item.banned && (
          <TouchableOpacity onPress={() => banUser(item._id)}>
            <Text style={[styles.link, { color: "red" }]}>Ban User</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Panel – All Users</Text>

      <TouchableOpacity
        onPress={handleAdminLogout}
        style={{ alignSelf: "flex-end", marginBottom: 10 }}
      >
        <Text style={{ color: "red", fontWeight: "600" }}>Logout</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderUser({ item })}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
  },
  userCard: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.card,
    marginBottom: 15,
    borderColor: colors.border,
    borderWidth: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  verified: {
    color: "green",
    fontWeight: "500",
  },
  banned: {
    color: "red",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },
  link: {
    color: colors.primary,
    fontWeight: "500",
  },
});