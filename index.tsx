import { StyleSheet, ScrollView, View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { Stack } from 'expo-router';

const featuredPlaces = [
  {
    id: '1',
    name: 'İzmir Saat Kulesi',
    rating: 4.8,
    category: 'Tarihi Yerler',
    location: 'Konak, İzmir'
  },
  {
    id: '2',
    name: 'Kemeraltı Çarşısı',
    rating: 4.6,
    category: 'Alışveriş',
    location: 'Konak, İzmir'
  },
  {
    id: '3',
    name: 'Asansör',
    rating: 4.7,
    category: 'Tarihi Yerler',
    location: 'Karataş, İzmir'
  }
];

const categories = [
  {
    id: '1',
    name: 'Tarihi Yerler',
    icon: 'business',
    count: 45,
    color: '#FF6B6B'
  },
  {
    id: '2',
    name: 'Müzeler',
    icon: 'museum',
    count: 32,
    color: '#4ECDC4'
  },
  {
    id: '3',
    name: 'Parklar',
    icon: 'leaf',
    count: 28,
    color: '#45B7D1'
  },
  {
    id: '4',
    name: 'Restoranlar',
    icon: 'restaurant',
    count: 56,
    color: '#96CEB4'
  }
];

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Merhaba 👋</Text>
              <Text style={styles.subtitle}>İzmir'i keşfetmeye hazır mısın?</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={32} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Mekan veya rehber ara..."
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.categoryCard, { backgroundColor: item.color + '15' }]}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color + '25' }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryCount}>{item.count} yer</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Places Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Öne Çıkan Yerler</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.placesList}
          >
            {featuredPlaces.map((item) => (
              <TouchableOpacity key={item.id} style={styles.placeCard}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color="#999" />
                </View>
                <View style={styles.placeInfo}>
                  <Text style={styles.placeName}>{item.name}</Text>
                  <View style={styles.placeDetails}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                    <Text style={styles.placeCategory}>{item.category}</Text>
                  </View>
                  <Text style={styles.placeLocation}>{item.location}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.light.background,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: Colors.light.text,
  },
  categoriesList: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 120,
    padding: 16,
    marginRight: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  placesList: {
    paddingRight: 20,
  },
  placeCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeInfo: {
    padding: 16,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  placeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  placeCategory: {
    fontSize: 14,
    color: '#666',
  },
  placeLocation: {
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
