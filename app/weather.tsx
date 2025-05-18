import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
import { Text, Card, Surface, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function WeatherScreen() {
  const { id, name } = useLocalSearchParams();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, [id]);

  const fetchWeather = async () => {
    try {
      // Burada gerçek bir hava durumu API'si kullanılacak
      // Örnek veri
      const response = {
        data: {
          current: {
            temp_c: 25,
            condition: {
              text: 'Güneşli',
              icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
            },
            humidity: 45,
            wind_kph: 12,
          },
          forecast: {
            forecastday: [
              {
                date: '2024-02-20',
                day: {
                  maxtemp_c: 28,
                  mintemp_c: 15,
                  condition: {
                    text: 'Parçalı Bulutlu',
                  },
                },
              },
              {
                date: '2024-02-21',
                day: {
                  maxtemp_c: 26,
                  mintemp_c: 14,
                  condition: {
                    text: 'Güneşli',
                  },
                },
              },
            ],
          },
        },
      };

      setWeather(response.data);
      setLoading(false);
    } catch (error) {
      setError('Hava durumu bilgisi alınamadı');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="headlineMedium">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.currentWeather}>
        <Text variant="headlineMedium" style={styles.location}>
          {name}
        </Text>
        <View style={styles.currentWeatherInfo}>
          <Image
            source={{ uri: `https:${weather.current.condition.icon}` }}
            style={styles.weatherIcon}
          />
          <Text variant="displaySmall" style={styles.temperature}>
            {weather.current.temp_c}°C
          </Text>
        </View>
        <Text variant="titleLarge" style={styles.condition}>
          {weather.current.condition.text}
        </Text>
        <View style={styles.weatherDetails}>
          <Text variant="bodyLarge">Nem: {weather.current.humidity}%</Text>
          <Text variant="bodyLarge">Rüzgar: {weather.current.wind_kph} km/s</Text>
        </View>
      </Surface>

      <Text variant="titleLarge" style={styles.forecastTitle}>
        5 Günlük Tahmin
      </Text>

      {weather.forecast.forecastday.map((day, index) => (
        <Card key={index} style={styles.forecastCard}>
          <Card.Content>
            <View style={styles.forecastRow}>
              <Text variant="titleMedium">
                {new Date(day.date).toLocaleDateString('tr-TR', {
                  weekday: 'long',
                })}
              </Text>
              <Text variant="bodyLarge">
                {day.day.mintemp_c}°C - {day.day.maxtemp_c}°C
              </Text>
            </View>
            <Text variant="bodyMedium">{day.day.condition.text}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  currentWeather: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  location: {
    marginBottom: 16,
  },
  currentWeatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherIcon: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  temperature: {
    marginBottom: 8,
  },
  condition: {
    marginBottom: 16,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  forecastTitle: {
    margin: 16,
    marginBottom: 8,
  },
  forecastCard: {
    margin: 16,
    marginTop: 0,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
}); 