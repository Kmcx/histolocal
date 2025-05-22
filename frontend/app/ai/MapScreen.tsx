import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// Tip tanımı
type LocationItem = { name: string; lat: number; lng: number };

// locations prop'unu burada tanımlıyoruz
export default function MapInline({ locations }: { locations: LocationItem[] }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>#map { height: 100vh; width: 100vw; margin: 0; padding: 0; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        const points = ${JSON.stringify(locations.map(({ lat, lng }) => [lat, lng]))};
        const names = ${JSON.stringify(locations.map(({ name }) => name))};

        const map = L.map('map').setView(points[0], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(map);

        points.forEach(([lat, lng], i) => {
          L.marker([lat, lng]).addTo(map).bindPopup(names[i]);
        });

        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds);

      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView originWhitelist={['*']} source={{ html }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    marginVertical: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
