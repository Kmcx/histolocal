import { StyleSheet, ScrollView, Switch } from 'react-native';
import { View, Text } from '../../components/Themed';
import { useState } from 'react';
import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';

const notificationSettings = [
  {
    id: 'push',
    title: 'Push Bildirimleri',
    description: 'Anlık bildirimler alın',
    defaultValue: true,
  },
  {
    id: 'email',
    title: 'E-posta Bildirimleri',
    description: 'Günlük özet e-postaları alın',
    defaultValue: true,
  },
  {
    id: 'messages',
    title: 'Yeni Mesajlar',
    description: 'Rehberlerden gelen mesajları alın',
    defaultValue: true,
  },
  {
    id: 'followers',
    title: 'Yeni Takipçiler',
    description: 'Yeni takipçi bildirimlerini alın',
    defaultValue: true,
  },
  {
    id: 'tours',
    title: 'Tur Güncellemeleri',
    description: 'Tur değişikliklerini öğrenin',
    defaultValue: true,
  },
  {
    id: 'offers',
    title: 'Özel Teklifler',
    description: 'Size özel fırsatları kaçırmayın',
    defaultValue: false,
  },
  {
    id: 'newsletter',
    title: 'Bülten',
    description: 'Haftalık bültenleri alın',
    defaultValue: false,
  },
];

export default function NotificationsScreen() {
  const [settings, setSettings] = useState(
    Object.fromEntries(
      notificationSettings.map(setting => [setting.id, setting.defaultValue])
    )
  );

  const handleToggle = (id: string) => {
    setSettings(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Bildirimler',
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genel Bildirimler</Text>
            <Text style={styles.sectionDescription}>
              Hangi bildirimleri almak istediğinizi seçin
            </Text>
            {notificationSettings.slice(0, 2).map((setting) => (
              <View key={setting.id} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={settings[setting.id]}
                  onValueChange={() => handleToggle(setting.id)}
                  trackColor={{ false: '#e0e0e0', true: Colors.light.primary + '40' }}
                  thumbColor={settings[setting.id] ? Colors.light.primary : '#999'}
                />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Etkileşim Bildirimleri</Text>
            <Text style={styles.sectionDescription}>
              Diğer kullanıcılarla ilgili bildirimleri yönetin
            </Text>
            {notificationSettings.slice(2, 5).map((setting) => (
              <View key={setting.id} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={settings[setting.id]}
                  onValueChange={() => handleToggle(setting.id)}
                  trackColor={{ false: '#e0e0e0', true: Colors.light.primary + '40' }}
                  thumbColor={settings[setting.id] ? Colors.light.primary : '#999'}
                />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pazarlama Bildirimleri</Text>
            <Text style={styles.sectionDescription}>
              Özel teklifler ve güncellemeler hakkında bilgi alın
            </Text>
            {notificationSettings.slice(5).map((setting) => (
              <View key={setting.id} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={settings[setting.id]}
                  onValueChange={() => handleToggle(setting.id)}
                  trackColor={{ false: '#e0e0e0', true: Colors.light.primary + '40' }}
                  thumbColor={settings[setting.id] ? Colors.light.primary : '#999'}
                />
              </View>
            ))}
          </View>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'transparent',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
    backgroundColor: 'transparent',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: Colors.light.text,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 