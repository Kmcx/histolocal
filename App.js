import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import Constants from "expo-constants";


const { width, height } = Dimensions.get("window");

const Stack = createStackNavigator();

const slides = [
  {
    id: "1",
    title: "Welcome to Histolocal",
    description: "Histolocal is designed to be a companion for those stepping into a new city. ",
  },
  {
    id: "2",
    title: "Your Local Companion, Anytime, Anywhere.",
    description: "Our app connects you with local guides, helping you explore the city and build social connections.",
  },
  {
    id: "3",
    title: "Your Journey, Guided by Community.",
    description: "Start discovering more now!",
    button: "Get Started Now",
  },
];

const Introduction = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current.scrollToOffset({ offset: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Login1")}>
          <Text style={styles.topText}>Log In</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      {item.button ? (
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate("SignUp1")}
        >
          <Text style={styles.getStartedButtonText}>{item.button}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ImageBackground
      source={require("./assets/background.png")}
      style={styles.background}
    >
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
      />
    </ImageBackground>
  );
};

const SignUp1 = ({ navigation }) => (
  <ImageBackground
    source={require("./assets/background.png")}
    style={styles.background}
  >
    <View style={styles.slide}>
      <Text style={styles.title}>Join Histolocal</Text>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("SignUp2")}
      >
        <Text style={styles.nextButtonText}>Sign up with Email</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
);

const SignUp2 = ({ navigation }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const handleNext = () => {
    if (!name || !surname || !email) {
      Alert.alert("Warning", "All fields are required to proceed.");
      return;
    }

    // Axios POST isteğini burada gerçekleştiriyoruz.
    const postData = {
      name: name,
      email: email,
      password: password,
      role: role
    };

    axios
      .post("http://localhost:5000/api/auth/register", postData, {
        headers:{
          "Content-Type": "application/json", // JSON formatında veri gönderildiğini belirtiyoruz.
        }
      })
      .then((response) => {
        console.log("Response:", response.data);
        Alert.alert("Success", "Data successfully sent!");
        navigation.navigate("SignUp3");
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to send data. Please try again later.");
      });
  };

  return (
    <ImageBackground
      source={require("./assets/background.png")}
      style={styles.background}
    >
      <View style={styles.slide}>
        <Text style={styles.title}>Register with Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Surname"
          value={surname}
          onChangeText={setSurname}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="role"
          value={role}
          onChangeText={setRole}
        />
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next Step</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const SignUp3 = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleNext = () => {
    if (!username || !password || !repeatPassword) {
      Alert.alert("Warning", "All fields are required to proceed.");
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert("Warning", "Passwords do not match.");
      return;
    }

    navigation.navigate("SignUp4");
  };

  return (
    <ImageBackground
      source={require("./assets/background.png")}
      style={styles.background}
    >
      <View style={styles.slide}>
        <Text style={styles.title}>Register with Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Repeat Password"
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next Step</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const SignUp4 = () => (
  <ImageBackground
    source={require("./assets/background.png")}
    style={styles.background}
  >
    <View style={styles.slide}>
      <Text style={styles.title}>One Last Step</Text>
      <Text style={styles.description}>
        We've sent an activation code to your email. Please enter it below.
      </Text>
      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Resend</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
);

const Login1 = ({ navigation }) => {
  const [email, setEmail] = useState(""); // Email için state
  const [password, setPassword] = useState(""); // Şifre için state

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Warning", "Both email and password are required.");
      return;
    }
  
    const loginData = {
      email: email,
      password: password,
    };
  
    // Axios POST isteği
    axios
      .post("http://localhost:5000/api/auth/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response:", response.data);
  
        // Giriş başarılı mesajı göster
        Alert.alert("Success", "Login successful!", [
          {
            text: "OK",
            onPress: () => {
              // Mesajdan sonra ana sayfaya yönlendirme
              navigation.navigate("HomePage");
            },
          },
        ]);
      })
      .catch((error) => {
        console.error("Error:", error.response?.data || error.message);
        Alert.alert(
          "Error",
          error.response?.data?.message || "Login failed. Please try again."
        );
      });
  };
  

  return (
    <ImageBackground
      source={require("./assets/background.png")}
      style={styles.background}
    >
      <View style={styles.slide}>
        <Text style={styles.title}>Log In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          value={email}
          onChangeText={setEmail} // Kullanıcı girişini state'e bağla
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword} // Kullanıcı girişini state'e bağla
        />
        <TouchableOpacity onPress={() => navigation.navigate("Login2")}>
          <Text style={styles.linkText}>I forgot my password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleLogin}>
          <Text style={styles.nextButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const Login2 = () => (
  <ImageBackground
    source={require("./assets/background.png")}
    style={styles.background}
  >
    <View style={styles.slide}>
      <Text style={styles.title}>Password Reset</Text>
      <Text style={styles.description}>
        If you enter the email address you registered with Histolocal, we will send you a link to reset your password.
      </Text>
      <TextInput style={styles.input} placeholder="Email" />
      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Reset My Password</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Introduction" component={Introduction} />
        <Stack.Screen name="SignUp1" component={SignUp1} />
        <Stack.Screen name="SignUp2" component={SignUp2} />
        <Stack.Screen name="SignUp3" component={SignUp3} />
        <Stack.Screen name="SignUp4" component={SignUp4} />
        <Stack.Screen name="Login1" component={Login1} />
        <Stack.Screen name="Login2" component={Login2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  slide: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  topBar: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  topText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  linkText: {
    fontSize: 14,
    color: "#007BFF",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  nextButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  getStartedButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
  getStartedButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
