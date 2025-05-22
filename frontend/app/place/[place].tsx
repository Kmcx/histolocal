import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';


const placeInfo: Record<string, { image: any; description: string; transport: string; coordinates: { lat: number; lng: number }; }> = {
  Alsancak: {
    image: require('../../assets/images/izmir-banner.png'),
    description: 'Alsancak is known for its vibrant nightlife, seaside promenade, and boutique cafes.',
    transport: 'You can reach Alsancak by İzban (Alsancak Station) or ESHOT buses from Konak and Bornova.',
    coordinates: { lat: 38.4339, lng: 27.1375 },
  },
  'Konak Square': {
    image: require('../../assets/images/izmir-banner.png'),
    description: 'Konak Square is İzmir’s symbolic center, home to the iconic Clock Tower, government buildings, palm trees, and ocean views. It is a great spot to explore the history and rhythm of the city.',
    transport: 'Accessible by İzmir Tram (Konak Station), ferry from Karşıyaka, or many central ESHOT bus lines.',
    coordinates: { lat: 38.4192, lng: 27.1287 }, 
},
  'Clock Tower': {
    image: require('../../assets/images/izmir-banner.png'),
    description: 'The Clock Tower, built in 1901, is İzmir’s most iconic landmark, located in the heart of Konak Square. It is surrounded by fountains, pigeons, and a bustling atmosphere.',
    transport: 'Reachable via İzmir Tram to Konak, or by ferry and bus to Konak Square.',
    coordinates: { lat: 38.4198, lng: 27.1286 },
  },
  'Kemeraltı Bazaar': {
    image: require('../../assets/images/izmir-banner.png'),
    description: 'Kemeraltı is a historic market district with countless shops, cafes, mosques, and artisan stalls. It’s perfect for buying souvenirs and experiencing authentic İzmir culture.',
    transport: 'Located within walking distance from Konak Square. You can take any central transportation line that goes to Konak.',
    coordinates: { lat: 38.4176, lng: 27.1272 },
  },
   'Agora Ruins': {
    image: require('../../assets/images/izmir-banner.png'),
    description: 'Agora Ruins is an ancient Roman marketplace in İzmir, offering a glimpse into the city’s long history. The area features columns, arches, and underground water channels.',
    transport: 'Easily walkable from Kemeraltı or Konak. Also accessible via tram to Çankaya station.',
    coordinates: { lat: 38.4194, lng: 27.1338 },
  },

  // Diğer yerler buraya eklenebilir
};

const leafletHtml = (lat: number, lng: number) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        #map { height: 100%; width: 100%; border-radius: 12px; }
        body, html { margin: 0; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        const map = L.map('map').setView([${lat}, ${lng}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker([${lat}, ${lng}]).addTo(map);
      </script>
    </body>
  </html>
`;

export default function PlaceDetail() {
  const { place } = useLocalSearchParams();
  const info = placeInfo[place as string];

  if (!info) return <Text style={{ padding: 20 }}>No information available for this location.</Text>;

  return (
  <ScrollView contentContainerStyle={styles.container}>
    

    {/* Başlık ortalanmış */}
    <Text style={styles.title}>{place}</Text>

    <Image source={info.image} style={styles.image} resizeMode="contain" />
    <Text style={styles.description}>{info.description}</Text>
    <Text style={styles.transport}>🚍 {info.transport}</Text>

    <WebView
      originWhitelist={['*']}
      source={{ html: leafletHtml(info.coordinates.lat, info.coordinates.lng) }}
      style={styles.map}
      javaScriptEnabled
      domStorageEnabled
    />
  </ScrollView>
);

 
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  banner: { width: '100%', height: 150, marginBottom: 15, borderRadius: 12 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  image: { width: '100%', height: 200, marginBottom: 15 },
  description: { fontSize: 16, marginBottom: 10, lineHeight: 22 },
  transport: { fontSize: 15, color: '#555' },
  map: {
    width: '100%',
    height: 250,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
});