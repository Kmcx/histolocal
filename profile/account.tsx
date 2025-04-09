import { StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import { View, Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { Stack } from 'expo-router';
import { useState } from 'react';

export default function AccountScreen() {
  const [userData, setUserData] = useState({
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@gmail.com',
    phone: '+90 555 123 4567',
    address: 'Alsancak, İzmir',
    birthDate: '15.05.1990',
    gender: 'Erkek',
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Hesap Bilgileri',
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://picsum.photos/200' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ad Soyad</Text>
              <TextInput
                style={styles.input}
                value={userData.name}
                onChangeText={(text) => setUserData({ ...userData, name: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-posta</Text>
              <TextInput
                style={styles.input}
                value={userData.email}
                keyboardType="email-address"
                onChangeText={(text) => setUserData({ ...userData, email: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Telefon</Text>
              <TextInput
                style={styles.input}
                value={userData.phone}
                keyboardType="phone-pad"
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Adres</Text>
              <TextInput
                style={styles.input}
                value={userData.address}
                onChangeText={(text) => setUserData({ ...userData, address: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Doğum Tarihi</Text>
              <TextInput
                style={styles.input}
                value={userData.birthDate}
                onChangeText={(text) => setUserData({ ...userData, birthDate: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cinsiyet</Text>
              <TextInput
                style={styles.input}
                value={userData.gender}
                onChangeText={(text) => setUserData({ ...userData, gender: text })}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: Colors.light.text,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 16,
    color: Colors.light.text,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 