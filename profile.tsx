import { StyleSheet, ScrollView, Image, Switch } from 'react-native';
import { View, Text } from '../components/Themed';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { Stack, useRouter } from 'expo-router';

const userData = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet@example.com',
  bio: 'İzmir tutkunu, profesyonel rehber',
  languages: ['Türkçe', 'İngilizce', 'Almanca'],
  expertise: ['Tarihi Yerler', 'Müzeler', 'Yerel Lezzetler'],
  rating: 4.9,
  toursCompleted: 128,
  isVerified: true,
  isGuide: true,
};

const menuItems = [
  {
    id: 'account',
    title: 'Hesap Bilgileri',
    icon: 'person-circle',
    route: '/profile/account',
  },
  {
    id: 'guide',
    title: 'Rehber Profili',
    icon: 'compass',
    route: '/profile/guide',
    guideOnly: true,
  },
  {
    id: 'security',
    title: 'Güvenlik',
    icon: 'shield-checkmark',
    route: '/profile/security',
  },
  {
    id: 'notifications',
    title: 'Bildirimler',
    icon: 'notifications',
    route: '/profile/notifications',
  },
  {
    id: 'language',
    title: 'Dil ve Bölge',
    icon: 'language',
    route: '/profile/language',
  },
  {
    id: 'help',
    title: 'Yardım',
    icon: 'help-circle',
    route: '/profile/help',
  },
  {
    id: 'privacy',
    title: 'Gizlilik Politikası',
    icon: 'lock-closed',
    route: '/profile/privacy',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(true);

  const handleAvailabilityToggle = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Profil',
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color={Colors.light.primary} />
            </View>
            {userData.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} />
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.email}>{userData.email}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Profili Düzenle</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Guide Stats */}
        {userData.isGuide && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.rating}</Text>
              <View style={styles.ratingStars}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.statLabel}>Puan</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.toursCompleted}</Text>
              <Text style={styles.statLabel}>Tamamlanan Tur</Text>
            </View>
          </View>
        )}

        {/* Availability Toggle */}
        {userData.isGuide && (
          <View style={styles.availabilityContainer}>
            <View style={styles.availabilityContent}>
              <Ionicons 
                name={isAvailable ? "radio-button-on" : "radio-button-off"} 
                size={24} 
                color={isAvailable ? Colors.light.primary : "#666"} 
              />
              <Text style={styles.availabilityText}>Müsaitlik Durumu</Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={handleAvailabilityToggle}
              trackColor={{ false: '#e0e0e0', true: Colors.light.primary + '40' }}
              thumbColor={isAvailable ? Colors.light.primary : '#999'}
            />
          </View>
        )}

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hakkımda</Text>
          <Text style={styles.bioText}>{userData.bio}</Text>
        </View>

        {/* Languages Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diller</Text>
          <View style={styles.tagContainer}>
            {userData.languages.map((language, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{language}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Expertise Section */}
        {userData.isGuide && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uzmanlık Alanları</Text>
            <View style={styles.tagContainer}>
              {userData.expertise.map((item, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems
            .filter(item => !item.guideOnly || (item.guideOnly && userData.isGuide))
            .map((item, index, filteredArray) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === filteredArray.length - 1 && styles.lastMenuItem,
                ]}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon as any} size={24} color={Colors.light.text} />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
            ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  profileInfo: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.light.text,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '15',
  },
  editButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  availabilityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  availabilityText: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.light.text,
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.light.text,
  },
  bioText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
    marginHorizontal: -4,
  },
  tag: {
    backgroundColor: Colors.light.primary + '15',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    margin: 4,
  },
  tagText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.light.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 12,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
    marginLeft: 8,
  },
}); 