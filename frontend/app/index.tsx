import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { authStyles } from "../styles/authStyles";
import logo from "../assets/logo.png";
import { colors } from "../styles/theme";
import { BlurView } from "expo-blur";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground 
      source={require("../assets/images/background.png")} 
      style={authStyles.background} 
      resizeMode="cover"
    >
      {/* BlurView tüm ekranı kaplar */}
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.content}>

        {/* Tüm içeriği saran çerçeve */}
        <View style={styles.outerBox}>
          {/* Logo */}
          <Image source={logo} style={styles.logo} resizeMode="contain" />

          {/* Başlık */}
          <Text style={styles.appTitle}>Histolocal</Text>

          {/* Slogan */}
          <Text style={styles.slogan}>Explore the city, smartly planned.</Text>

          {/* Butonlar */}
          <TouchableOpacity style={styles.wideButton} onPress={() => router.push("/login")}>
            <Text style={authStyles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.wideButton, { marginTop: 12 }]} onPress={() => router.push("/register")}>
            <Text style={authStyles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  outerBox: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // kutunun arkası biraz koyu (isteğe bağlı)
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
    letterSpacing: 1,
    // textTransform: 'lowercase',
  },
  slogan: {
    color: colors.primary,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: 'bold',
  },
  wideButton: {
    backgroundColor: colors.buttonBackground,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 10,
    minWidth: 200,
  },
});
