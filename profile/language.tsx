import { StyleSheet, ScrollView } from 'react-native';
import { View, Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { Stack } from 'expo-router';
import { useState } from 'react';

const languages = [
  { id: 'tr', name: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷' },
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { id: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { id: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { id: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { id: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

const regions = [
  { id: 'tr', name: 'Türkiye', timezone: 'UTC+03:00', currency: 'TRY' },
  { id: 'us', name: 'United States', timezone: 'UTC-05:00', currency: 'USD' },
  { id: 'gb', name: 'United Kingdom', timezone: 'UTC+00:00', currency: 'GBP' },
  { id: 'eu', name: 'European Union', timezone: 'UTC+01:00', currency: 'EUR' },
];

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [selectedRegion, setSelectedRegion] = useState('tr');

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Dil ve Bölge',
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uygulama Dili</Text>
            <Text style={styles.sectionDescription}>
              Tercih ettiğiniz dili seçin
            </Text>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.id}
                style={[
                  styles.languageItem,
                  selectedLanguage === language.id && styles.selectedItem,
                ]}
                onPress={() => setSelectedLanguage(language.id)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <View style={styles.languageTexts}>
                    <Text style={styles.languageName}>{language.name}</Text>
                    <Text style={styles.languageNative}>{language.nativeName}</Text>
                  </View>
                </View>
                {selectedLanguage === language.id && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bölge Ayarları</Text>
            <Text style={styles.sectionDescription}>
              Saat dilimi ve para birimi için bölgenizi seçin
            </Text>
            {regions.map((region) => (
              <TouchableOpacity
                key={region.id}
                style={[
                  styles.regionItem,
                  selectedRegion === region.id && styles.selectedItem,
                ]}
                onPress={() => setSelectedRegion(region.id)}
              >
                <View style={styles.regionInfo}>
                  <Text style={styles.regionName}>{region.name}</Text>
                  <View style={styles.regionDetails}>
                    <Text style={styles.regionDetail}>{region.timezone}</Text>
                    <Text style={styles.regionSeparator}>•</Text>
                    <Text style={styles.regionDetail}>{region.currency}</Text>
                  </View>
                </View>
                {selectedRegion === region.id && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedItem: {
    backgroundColor: Colors.light.primary + '10',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageTexts: {
    backgroundColor: 'transparent',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
    color: '#666',
  },
  regionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  regionInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  regionName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  regionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  regionDetail: {
    fontSize: 14,
    color: '#666',
  },
  regionSeparator: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 