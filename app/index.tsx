import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Surface, Text, Card, Button, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const popularDestinations = [
    {
      id: 1,
      title: 'Kapadokya',
      image: require('../assets/images/cappadocia.jpg'),
      description: 'Eşsiz peri bacaları ve sıcak hava balonları',
    },
    {
      id: 2,
      title: 'Pamukkale',
      image: require('../assets/images/pamukkale.jpg'),
      description: 'Beyaz travertenler ve antik havuzlar',
    },
    {
      id: 3,
      title: 'Efes Antik Kenti',
      image: require('../assets/images/ephesus.jpg'),
      description: 'Antik Roma döneminden kalma harikalar',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Türkiye Gezi Rehberi
        </Text>
        <Searchbar
          placeholder="Gezi yerleri ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </Surface>

      <Text variant="titleLarge" style={styles.sectionTitle}>
        Popüler Destinasyonlar
      </Text>

      {popularDestinations.map((destination) => (
        <Card
          key={destination.id}
          style={styles.card}
          onPress={() => router.push(`/destination/${destination.id}`)}
        >
          <Card.Cover source={destination.image} />
          <Card.Title
            title={destination.title}
            subtitle={destination.description}
          />
          <Card.Actions>
            <Button onPress={() => router.push(`/destination/${destination.id}`)}>
              Detayları Gör
            </Button>
          </Card.Actions>
        </Card>
      ))}

      <Surface style={styles.categories}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Kategoriler
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Tarihi Yerler', 'Doğal Güzellikler', 'Plajlar', 'Yemek Kültürü'].map(
            (category) => (
              <Button
                key={category}
                mode="outlined"
                style={styles.categoryButton}
                onPress={() => router.push(`/category/${category}`)}
              >
                {category}
              </Button>
            )
          )}
        </ScrollView>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    elevation: 4,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 8,
  },
  sectionTitle: {
    margin: 16,
    marginBottom: 8,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  categories: {
    padding: 16,
    marginTop: 8,
  },
  categoryButton: {
    marginRight: 8,
  },
}); 