import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';

export default function MapScreen() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Örnek lokasyonlar
  const locations = [
    {
      id: 1,
      title: 'Kapadokya',
      coordinate: {
        latitude: 38.6431,
        longitude: 34.8283,
      },
    },
    {
      id: 2,
      title: 'Pamukkale',
      coordinate: {
        latitude: 37.9167,
        longitude: 29.1167,
      },
    },
    {
      id: 3,
      title: 'Efes Antik Kenti',
      coordinate: {
        latitude: 37.9411,
        longitude: 27.3417,
      },
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 39.9334,
          longitude: 32.8597,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={location.coordinate}
            title={location.title}
            onPress={() => setSelectedLocation(location)}
          />
        ))}
      </MapView>

      {selectedLocation && (
        <Surface style={styles.infoCard}>
          <Text variant="titleLarge">{selectedLocation.title}</Text>
          <Button
            mode="contained"
            onPress={() => router.push(`/destination/${selectedLocation.id}`)}
            style={styles.button}
          >
            Detayları Gör
          </Button>
        </Surface>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  button: {
    marginTop: 8,
  },
}); 