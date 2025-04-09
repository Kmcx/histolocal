import { StyleSheet, ScrollView } from 'react-native';
import { View, Text } from '../../components/Themed';
import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';

const privacyContent = [
  {
    id: 1,
    title: 'Veri Toplama',
    content: 'HistoLocal olarak, kullanıcılarımızın gizliliğine önem veriyoruz. Uygulamamızı kullanırken, bazı kişisel bilgilerinizi topluyoruz. Bu bilgiler arasında adınız, e-posta adresiniz, konum bilgileriniz ve uygulama kullanım verileriniz bulunmaktadır.',
  },
  {
    id: 2,
    title: 'Veri Kullanımı',
    content: 'Topladığımız bilgileri, size daha iyi bir hizmet sunmak, güvenliğinizi sağlamak ve yasal yükümlülüklerimizi yerine getirmek için kullanıyoruz. Verileriniz, sizin onayınız olmadan üçüncü taraflarla paylaşılmaz.',
  },
  {
    id: 3,
    title: 'Çerezler ve Takip',
    content: 'Uygulamamızda, deneyiminizi iyileştirmek için çerezler ve benzer teknolojiler kullanıyoruz. Bu teknolojiler, tercihlerinizi hatırlamak ve size özelleştirilmiş içerik sunmak için kullanılır.',
  },
  {
    id: 4,
    title: 'Veri Güvenliği',
    content: 'Kişisel verilerinizin güvenliği bizim için önemlidir. Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. SSL şifreleme, güvenli veri depolama ve düzenli güvenlik denetimleri bunlardan bazılarıdır.',
  },
  {
    id: 5,
    title: 'Veri Saklama',
    content: 'Kişisel verilerinizi, yasal yükümlülüklerimiz gerektirdiği sürece veya hesabınız aktif olduğu sürece saklıyoruz. Hesabınızı sildiğinizde, verileriniz makul bir süre içinde sistemlerimizden tamamen silinir.',
  },
  {
    id: 6,
    title: 'Haklarınız',
    content: 'KVKK kapsamında, kişisel verilerinize erişim, düzeltme, silme ve işleme itiraz etme haklarına sahipsiniz. Bu haklarınızı kullanmak için destek ekibimizle iletişime geçebilirsiniz.',
  },
];

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Gizlilik Politikası',
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Gizlilik Politikası</Text>
            <Text style={styles.headerDescription}>
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </Text>
          </View>

          <View style={styles.sections}>
            {privacyContent.map((section) => (
              <View key={section.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionContent}>{section.content}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bu gizlilik politikası, HistoLocal uygulamasını kullanımınızı kapsar ve zaman zaman güncellenebilir. Önemli değişiklikler olduğunda sizi bilgilendireceğiz.
            </Text>
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
  header: {
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: '#666',
  },
  sections: {
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
  section: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
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
  footerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
}); 