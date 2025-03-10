import { View, Text, Button, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { authStyles } from "../styles/authStyles"; // ✅ Import styles


export default function HomeScreen() {
  const router = useRouter();

  return (
<ImageBackground 
      source={require("../assets/images/background.png")} 
      style={authStyles.background} 
      resizeMode="cover"
    >

    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Welcome to Histolocal</Text>
      <Button title="Login" onPress={() => router.push("/login")} />
      <Button title="Register" onPress={() => router.push("/register")} />
    </View>
</ImageBackground>
  );
}
