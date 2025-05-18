import React from 'react';
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
              <Text style={[styles.greeting, { fontFamily: 'Arial', color: '#333' }]}>Merhaba 👋</Text>
              <Text style={[styles.subtitle, { fontFamily: 'Arial', color: '#666' }]}>İzmir'i keşfetmeye hazır mısın?</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={32} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View style={[styles.searchContainer, { borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }]}>
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
          <Text style={[styles.sectionTitle, { fontFamily: 'Arial', color: '#333' }]}>Kategoriler</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.categoryCard, { backgroundColor: item.color + '15', borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }]}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color + '25', borderRadius: 12 }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={[styles.categoryName, { fontFamily: 'Arial', color: '#333' }]}>{item.name}</Text>
                <Text style={[styles.categoryCount, { fontFamily: 'Arial', color: '#666' }]}>{item.count} yer</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Places Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Arial', color: '#333' }]}>Öne Çıkan Yerler</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.placesList}
          >
            {featuredPlaces.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.placeCard, { borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }]}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color="#999" />
                </View>
                <View style={styles.placeInfo}>
                  <Text style={[styles.placeName, { fontFamily: 'Arial', color: '#333' }]}>{item.name}</Text>
                  <View style={styles.placeDetails}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={[styles.rating, { fontFamily: 'Arial', color: '#333' }]}>{item.rating}</Text>
                    </View>
                    <Text style={[styles.placeCategory, { fontFamily: 'Arial', color: '#666' }]}>{item.category}</Text>
                  </View>
                  <Text style={[styles.placeLocation, { fontFamily: 'Arial', color: '#666' }]}>{item.location}</Text>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
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
    fontWeight: '600',
    marginBottom: 16,
  },
  categoriesList: {
    paddingBottom: 16,
  },
  categoryCard: {
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
  },
  placesList: {
    paddingBottom: 16,
  },
  placeCard: {
    backgroundColor: '#fff',
    marginRight: 16,
    overflow: 'hidden',
    minWidth: 200,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeInfo: {
    padding: 12,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  placeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  placeCategory: {
    fontSize: 14,
  },
  placeLocation: {
    fontSize: 14,
  },
});
