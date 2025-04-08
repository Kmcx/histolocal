import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


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
    const token = await AsyncStorage.getItem("adminToken");
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users:", error);
      Alert.alert("Error", "Could not fetch users.");
    }
  };

  const banUser = async (userId: string) => {
    const token = await AsyncStorage.getItem("adminToken");
    try {
      await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}api/admin/ban/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Success", "User has been banned.");
      fetchUsers(); // refresh list
    } catch (error) {
      Alert.alert("Error", "Failed to ban user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUser = ({ item }: any) => (
    <View style={styles.userCard}>
      <Text style={styles.name}>{item.name} ({item.role})</Text>
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
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  userCard: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginBottom: 15,
  },
  name: { fontSize: 16, fontWeight: "600" },
  verified: { color: "green", fontWeight: "500" },
  banned: { color: "red", fontWeight: "500" },
  actions: { flexDirection: "row", gap: 15, marginTop: 10 },
  link: { color: "#007BFF", fontWeight: "500" },
});
