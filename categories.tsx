import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { View, Text } from '../components/Themed';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { Stack, useRouter } from 'expo-router';

const categories = [
  { id: 1, name: 'Restoranlar', icon: 'restaurant', count: 42 },
  { id: 2, name: 'Kafeler', icon: 'cafe', count: 28 },
  { id: 3, name: 'Oteller', icon: 'bed', count: 15 },
  { id: 4, name: 'Turistik Yerler', icon: 'camera', count: 35 },
  { id: 5, name: 'Müzeler', icon: 'business', count: 12 },
  { id: 6, name: 'Parklar', icon: 'leaf', count: 20 },
  { id: 7, name: 'Alışveriş', icon: 'cart', count: 30 },
  { id: 8, name: 'Etkinlikler', icon: 'calendar', count: 25 },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const renderItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory,
        { borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }
      ]}
      onPress={() => {
        setSelectedCategory(item.id);
        // router.push(`/category/${item.id}`);
      }}
    >
      <View style={[styles.categoryIcon, { borderRadius: 12 }]}>
        <Ionicons
          name={item.icon as any}
          size={32}
          color={selectedCategory === item.id ? Colors.light.primary : Colors.light.text}
        />
      </View>
      <Text style={[styles.categoryName, { fontFamily: 'Arial', color: '#333' }]}>{item.name}</Text>
      <Text style={[styles.categoryCount, { fontFamily: 'Arial', color: '#666' }]}>{item.count} mekan</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Kategoriler',
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors.light.text,
          },
        }}
      />
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContainer: {
    padding: 16,
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: Colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  selectedCategory: {
    backgroundColor: Colors.light.primary + '20',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
}); 