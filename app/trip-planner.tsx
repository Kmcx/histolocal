import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Button, TextInput, Chip, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TripPlannerScreen() {
  const router = useRouter();
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Örnek destinasyonlar
  const availableDestinations = [
    { id: 1, name: 'Kapadokya', duration: '3 gün' },
    { id: 2, name: 'Pamukkale', duration: '2 gün' },
    { id: 3, name: 'Efes', duration: '2 gün' },
    { id: 4, name: 'İstanbul', duration: '4 gün' },
  ];

  const addDestination = (destination) => {
    if (!selectedDestinations.find(d => d.id === destination.id)) {
      setSelectedDestinations([...selectedDestinations, destination]);
    }
  };

  const removeDestination = (id) => {
    setSelectedDestinations(selectedDestinations.filter(d => d.id !== id));
  };

  const handleSaveTrip = () => {
    // Burada gezi planı kaydedilecek
    console.log({
      tripName,
      startDate,
      endDate,
      destinations: selectedDestinations,
    });
    router.push('/');
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.form}>
        <Text variant="headlineMedium" style={styles.title}>
          Gezi Planı Oluştur
        </Text>

        <TextInput
          mode="outlined"
          label="Gezi Adı"
          value={tripName}
          onChangeText={setTripName}
          style={styles.input}
        />

        <View style={styles.dateContainer}>
          <Button
            mode="outlined"
            onPress={() => setShowStartDatePicker(true)}
            style={styles.dateButton}
          >
            Başlangıç: {startDate.toLocaleDateString()}
          </Button>
          <Button
            mode="outlined"
            onPress={() => setShowEndDatePicker(true)}
            style={styles.dateButton}
          >
            Bitiş: {endDate.toLocaleDateString()}
          </Button>
        </View>

        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Destinasyonlar
        </Text>

        <View style={styles.destinationsList}>
          {availableDestinations.map((destination) => (
            <Chip
              key={destination.id}
              onPress={() => addDestination(destination)}
              style={styles.destinationChip}
            >
              {destination.name} ({destination.duration})
            </Chip>
          ))}
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Seçilen Destinasyonlar
        </Text>

        {selectedDestinations.map((destination) => (
          <Card key={destination.id} style={styles.selectedCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium">{destination.name}</Text>
                <Chip onPress={() => removeDestination(destination.id)}>
                  Kaldır
                </Chip>
              </View>
              <Text variant="bodyMedium">Süre: {destination.duration}</Text>
            </Card.Content>
          </Card>
        ))}

        <Button
          mode="contained"
          onPress={handleSaveTrip}
          disabled={!tripName || selectedDestinations.length === 0}
          style={styles.saveButton}
        >
          Gezi Planını Kaydet
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  destinationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  destinationChip: {
    margin: 4,
  },
  selectedCard: {
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 24,
  },
}); 