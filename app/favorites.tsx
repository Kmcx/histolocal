import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const updatedFavorites = favorites.filter(fav => fav.id !== id);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Favori silinirken hata:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Favori Yerlerim
      </Text>

      {favorites.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text variant="bodyLarge" style={styles.emptyText}>
              Henüz favori yeriniz bulunmuyor.
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push('/')}
              style={styles.exploreButton}
            >
              Keşfetmeye Başla
            </Button>
          </Card.Content>
        </Card>
      ) : (
        favorites.map((favorite) => (
          <Card key={favorite.id} style={styles.card}>
            <Card.Cover source={favorite.image} />
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleLarge">{favorite.title}</Text>
                <IconButton
                  icon="heart"
                  iconColor="red"
                  size={24}
                  onPress={() => removeFavorite(favorite.id)}
                />
              </View>
              <Text variant="bodyMedium">{favorite.description}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() => router.push(`/destination/${favorite.id}`)}
              >
                Detayları Gör
              </Button>
            </Card.Actions>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    margin: 16,
    textAlign: 'center',
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  emptyCard: {
    margin: 16,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  exploreButton: {
    marginTop: 8,
  },
}); 