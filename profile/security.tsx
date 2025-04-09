import { StyleSheet, ScrollView, Switch } from 'react-native';
import { View, Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { Stack } from 'expo-router';
import { useState } from 'react';

export default function SecurityScreen() {
  const [settings, setSettings] = useState({
    twoFactor: false,
    biometric: true,
    locationTracking: true,
    dataSharing: false,
    notifications: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Güvenlik Ayarları',
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Güvenlik</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="key-outline" size={24} color={Colors.light.text} />
                <Text style={styles.menuItemText}>Şifre Değiştir</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="shield-checkmark-outline" size={24} color={Colors.light.text} />
                <View style={styles.settingTexts}>
                  <Text style={styles.settingTitle}>İki Faktörlü Doğrulama</Text>
                  <Text style={styles.settingDescription}>Hesabınızı daha güvenli hale getirin</Text>
                </View>
              </View>
              <Switch
                value={settings.twoFactor}
                onValueChange={() => toggleSetting('twoFactor')}
                trackColor={{ false: '#ddd', true: Colors.light.primary + '50' }}
                thumbColor={settings.twoFactor ? Colors.light.primary : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="finger-print-outline" size={24} color={Colors.light.text} />
                <View style={styles.settingTexts}>
                  <Text style={styles.settingTitle}>Biyometrik Kilit</Text>
                  <Text style={styles.settingDescription}>Parmak izi veya yüz tanıma ile giriş yapın</Text>
                </View>
              </View>
              <Switch
                value={settings.biometric}
                onValueChange={() => toggleSetting('biometric')}
                trackColor={{ false: '#ddd', true: Colors.light.primary + '50' }}
                thumbColor={settings.biometric ? Colors.light.primary : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gizlilik</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="location-outline" size={24} color={Colors.light.text} />
                <View style={styles.settingTexts}>
                  <Text style={styles.settingTitle}>Konum Takibi</Text>
                  <Text style={styles.settingDescription}>Size yakın yerleri görebilirsiniz</Text>
                </View>
              </View>
              <Switch
                value={settings.locationTracking}
                onValueChange={() => toggleSetting('locationTracking')}
                trackColor={{ false: '#ddd', true: Colors.light.primary + '50' }}
                thumbColor={settings.locationTracking ? Colors.light.primary : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="share-outline" size={24} color={Colors.light.text} />
                <View style={styles.settingTexts}>
                  <Text style={styles.settingTitle}>Veri Paylaşımı</Text>
                  <Text style={styles.settingDescription}>Deneyiminizi iyileştirmek için veri paylaşın</Text>
                </View>
              </View>
              <Switch
                value={settings.dataSharing}
                onValueChange={() => toggleSetting('dataSharing')}
                trackColor={{ false: '#ddd', true: Colors.light.primary + '50' }}
                thumbColor={settings.dataSharing ? Colors.light.primary : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
                <View style={styles.settingTexts}>
                  <Text style={styles.settingTitle}>Bildirimler</Text>
                  <Text style={styles.settingDescription}>Önemli güncellemelerden haberdar olun</Text>
                </View>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={() => toggleSetting('notifications')}
                trackColor={{ false: '#ddd', true: Colors.light.primary + '50' }}
                thumbColor={settings.notifications ? Colors.light.primary : '#f4f3f4'}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Hesabı Sil</Text>
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
    padding: 20,
    backgroundColor: 'transparent',
  },
  section: {
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: Colors.light.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.light.text,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
    backgroundColor: 'transparent',
  },
  settingTexts: {
    marginLeft: 12,
    flex: 1,
    backgroundColor: 'transparent',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
  },
  dangerButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  dangerButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
}); 