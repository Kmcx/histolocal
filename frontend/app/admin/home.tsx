import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../styles/theme";
import { apiClient } from "@lib/axiosInstance";
// import { AdminNavigationBar } from "../../components/AdminNavigationBar";  update LATER

type UserType = {
  _id: string;
  name: string;
  email?: string;
  role: string;
  isVerified: boolean;
  banned: boolean;
  idImageUrl?: string;
};

export default function AdminHome() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<UserType[]>([]);
  const router = useRouter();

   const handleGoBack = () => {
    router.back();
  };

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get("/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users:", error);
      Alert.alert("Error", "Could not fetch users.");
    }
  };

  const fetchPendingVerifications = async () => {
    try {
      const res = await apiClient.get("/api/admin/verification-requests");
      setPendingVerifications(res.data);
    } catch (err) {
      console.error("Pending verifications fetch failed:", err);
    }
  };

  const handleVerify = async (userId: string) => {
    try {
      await apiClient.post("/api/admin/verify-user", { userId });
      Alert.alert("User Verified");
      fetchUsers();
      fetchPendingVerifications();
    } catch (err) {
      Alert.alert("Error", "Verification failed");
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await apiClient.post("/api/admin/reject-user", { userId });
      Alert.alert("User Rejected");
      fetchUsers();
      fetchPendingVerifications();
    } catch (err) {
      Alert.alert("Error", "Rejection failed");
    }
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

  const unbanUser = async (userId: string) => {
    try {
      await apiClient.post(`/api/admin/unban/${userId}`);
      Alert.alert("Success", "User unbanned.");
      fetchUsers();
    } catch (error) {
      Alert.alert("Error", "Failed to unban user.");
    }
  };

  const unverifyUser = async (userId: string) => {
    try {
      await apiClient.post(`/api/admin/unverify/${userId}`);
      Alert.alert("Success", "Verification removed.");
      fetchUsers();
      fetchPendingVerifications();
    } catch (error) {
      Alert.alert("Error", "Failed to remove verification.");
    }
  };

  const handleAdminLogout = async () => {
    await AsyncStorage.removeItem("adminToken");
    Alert.alert("Logged out", "You have been logged out as Admin.");
    router.push("/login");
  };

  useEffect(() => {
    fetchUsers();
    fetchPendingVerifications();
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

        {!item.banned ? (
          <TouchableOpacity onPress={() => banUser(item._id)}>
            <Text style={[styles.link, { color: "red" }]}>Ban</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => unbanUser(item._id)}>
            <Text style={[styles.link, { color: "orange" }]}>Unban</Text>
          </TouchableOpacity>
        )}

        {item.isVerified && (
          <TouchableOpacity onPress={() => unverifyUser(item._id)}>
            <Text style={[styles.link, { color: "gray" }]}>Remove Verification</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
  <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAdminLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.heading}>Admin Panel – All Users</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderUser({ item })}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      <Text style={styles.heading}>Pending ID Verifications</Text>
      {pendingVerifications.map((user) => (
        <View key={user._id} style={styles.userCard}>
          <Text style={styles.name}>{user.name} ({user.role})</Text>
          <Text style={styles.name}>{user.email}</Text>
          {user.idImageUrl && (
            <Image
              source={{ uri: user.idImageUrl }}
              style={{ height: 150, width: 150, marginVertical: 10, borderRadius: 10 }}
            />
          )}
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <TouchableOpacity onPress={() => handleVerify(user._id)}>
              <Text style={{ color: "green", fontWeight: "600" }}>✔ Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReject(user._id)}>
              <Text style={{ color: "red", fontWeight: "600" }}>✖ Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>

    {/* AdminNavigationBar kaldırıldı */}
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
    flexWrap: "wrap",
  },
  link: {
    color: colors.primary,
    fontWeight: "500",
  },
  headerRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},
backText: {
  fontSize: 16,
  color: colors.primary,
  fontWeight: "bold",
},
logoutText: {
  fontSize: 16,
  color: "red",
  fontWeight: "600",
},
});
