import { StyleSheet, ScrollView, Linking } from 'react-native';
import { View, Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { Stack } from 'expo-router';

const faqItems = [
  {
    id: 1,
    question: 'Nasıl rehber olabilirim?',
    answer: 'Rehber olmak için profil sayfanızdan "Rehber Ol" butonuna tıklayarak başvuru yapabilirsiniz. Başvurunuz incelendikten sonra size bilgi verilecektir.',
  },
  {
    id: 2,
    question: 'Ödeme yöntemleri nelerdir?',
    answer: 'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeleriniz 256-bit SSL ile güvence altındadır.',
  },
  {
    id: 3,
    question: 'İptal ve iade politikası nedir?',
    answer: 'Turdan 24 saat öncesine kadar yapılan iptallerde tam iade yapılır. 24 saat içinde yapılan iptallerde iade yapılmaz.',
  },
  {
    id: 4,
    question: 'Puanlama sistemi nasıl çalışır?',
    answer: 'Rehberler ve yerler 1-5 yıldız arasında puanlanır. Puanlamalar kullanıcı deneyimlerine göre otomatik olarak hesaplanır.',
  },
];

const contactMethods = [
  {
    id: 'email',
    title: 'E-posta',
    description: 'destek@histolocal.com',
    icon: 'mail-outline',
    action: 'mailto:destek@histolocal.com',
  },
  {
    id: 'phone',
    title: 'Telefon',
    description: '+90 850 123 4567',
    icon: 'call-outline',
    action: 'tel:+908501234567',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    description: 'WhatsApp üzerinden mesaj gönderin',
    icon: 'logo-whatsapp',
    action: 'https://wa.me/908501234567',
  },
];

export default function HelpScreen() {
  const handleContactPress = (action: string) => {
    Linking.openURL(action);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Yardım',
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sık Sorulan Sorular</Text>
            {faqItems.map((item) => (
              <View key={item.id} style={styles.faqItem}>
                <Text style={styles.question}>{item.question}</Text>
                <Text style={styles.answer}>{item.answer}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bize Ulaşın</Text>
            <Text style={styles.sectionDescription}>
              Sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz.
            </Text>

            {contactMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={styles.contactItem}
                onPress={() => handleContactPress(method.action)}
              >
                <View style={styles.contactItemLeft}>
                  <Ionicons name={method.icon as any} size={24} color={Colors.light.text} />
                  <View style={styles.contactTexts}>
                    <Text style={styles.contactTitle}>{method.title}</Text>
                    <Text style={styles.contactDescription}>{method.description}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sosyal Medya</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Linking.openURL('https://instagram.com/histolocal')}
              >
                <Ionicons name="logo-instagram" size={24} color={Colors.light.text} />
                <Text style={styles.socialButtonText}>Instagram</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Linking.openURL('https://twitter.com/histolocal')}
              >
                <Ionicons name="logo-twitter" size={24} color={Colors.light.text} />
                <Text style={styles.socialButtonText}>Twitter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Linking.openURL('https://facebook.com/histolocal')}
              >
                <Ionicons name="logo-facebook" size={24} color={Colors.light.text} />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 16,
    color: Colors.light.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  faqItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
  },
  contactTexts: {
    marginLeft: 12,
    flex: 1,
    backgroundColor: 'transparent',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: '#666',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
}); 