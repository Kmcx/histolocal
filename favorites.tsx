import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { Stack } from 'expo-router';

const favorites = [
  {
    id: '1',
    name: 'İzmir Saat Kulesi',
    category: 'Tarihi Yerler',
    rating: 4.8,
    location: 'Konak, İzmir'
  },
  {
    id: '2',
    name: 'Kemeraltı Çarşısı',
    category: 'Alışveriş',
    rating: 4.6,
    location: 'Konak, İzmir'
  },
  {
    id: '3',
    name: 'Asansör',
    category: 'Tarihi Yerler',
    rating: 4.7,
    location: 'Karataş, İzmir'
  }
];

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Favorilerim',
          headerShadowVisible: false,
        }}
      />
      {favorites.length > 0 ? (
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {favorites.map((item) => (
            <TouchableOpacity key={item.id} style={styles.favoriteCard}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={40} color="#999" />
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.placeName}>{item.name}</Text>
                  <Text style={styles.placeCategory}>{item.category}</Text>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location" size={16} color="#666" />
                    <Text style={styles.placeLocation}>{item.location}</Text>
                  </View>
                </View>
                <View style={styles.rightContainer}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{item.rating}</Text>
                  </View>
                  <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons name="heart" size={24} color={Colors.light.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Henüz favori yeriniz yok</Text>
          <Text style={styles.emptyText}>
            Beğendiğiniz yerleri favorilere ekleyerek daha sonra kolayca ulaşabilirsiniz.
          </Text>
        </View>
      )}
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
  listContainer: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'transparent',
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.light.text,
  },
  placeCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  placeLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  favoriteButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: Colors.light.text,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 