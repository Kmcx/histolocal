import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Button, Chip, Surface } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DestinationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Bu kısım normalde API'den gelecek
  const destinationDetails = {
    id: 1,
    title: 'Kapadokya',
    image: require('../../assets/images/cappadocia.jpg'),
    description: 'Kapadokya, Türkiye\'nin en önemli turistik bölgelerinden biridir. Peri bacaları, sıcak hava balonları ve tarihi yeraltı şehirleriyle ünlüdür.',
    location: 'Nevşehir, Türkiye',
    bestTimeToVisit: 'Nisan - Ekim',
    activities: [
      'Sıcak hava balonu turu',
      'ATV safari',
      'Yeraltı şehri gezisi',
      'Güneş batımı manzarası',
    ],
    tips: [
      'Balon turu için erken rezervasyon yapın',
      'Rahat yürüyüş ayakkabısı giyin',
      'Güneş koruyucu kullanın',
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Cover source={destinationDetails.image} />
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {destinationDetails.title}
          </Text>
          <Text variant="bodyLarge" style={styles.location}>
            {destinationDetails.location}
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            {destinationDetails.description}
          </Text>

          <Surface style={styles.infoSection}>
            <Text variant="titleMedium">En İyi Ziyaret Zamanı</Text>
            <Chip style={styles.chip}>{destinationDetails.bestTimeToVisit}</Chip>
          </Surface>

          <Surface style={styles.infoSection}>
            <Text variant="titleMedium">Yapılabilecek Aktiviteler</Text>
            {destinationDetails.activities.map((activity, index) => (
              <Chip key={index} style={styles.chip}>
                {activity}
              </Chip>
            ))}
          </Surface>

          <Surface style={styles.infoSection}>
            <Text variant="titleMedium">Gezi İpuçları</Text>
            {destinationDetails.tips.map((tip, index) => (
              <Text key={index} style={styles.tip}>
                • {tip}
              </Text>
            ))}
          </Surface>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => router.push('/map')}
          style={styles.button}
        >
          Haritada Göster
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.push('/reviews')}
          style={styles.button}
        >
          Yorumları Gör
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  location: {
    marginBottom: 16,
    opacity: 0.7,
  },
  description: {
    marginBottom: 24,
    lineHeight: 24,
  },
  infoSection: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  chip: {
    marginTop: 8,
    marginRight: 8,
  },
  tip: {
    marginTop: 8,
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 