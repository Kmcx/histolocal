import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
  Image,
  Keyboard,
  KeyboardEvent,
  TextStyle
} from 'react-native';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import { Ionicons } from '@expo/vector-icons';
import { useAIChat } from '../contexts/AIChatContext';
import MapInline from './MapScreen';
import { colors } from '../../styles/theme';
import logo from '../../assets/logo.png';
import TopNavbar from '../../components/TopNavbar';
import { aiClient } from "@lib/axiosInstance";


const NAVBAR_HEIGHT = 60;
const TOPNAV_HEIGHT = Platform.OS === 'ios' ? 60 : 40;

// Map mesajları için
type MapMessage = {
  id: string;
  role: 'map';
  text: string;
  timestamp: string;
  extraData?: { name: string; lat: number; lng: number }[];
};

// AI ve User mesajları için
type AIOrUserMessage = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  extraData2?: {
    type: 'itinerary';
    travelDate: string;
    locations: string[];
    category: string;
    suggested: { district: string; category: string; places: string[] }[];
    transport: Record<string, string>;
    weather: string | Record<string, string>;
  };
};

// Tüm mesajları temsil eden birleşik tür
type Message = MapMessage | AIOrUserMessage;


export default function AIChatScreen() {
  const { messages, setMessages } = useAIChat() as {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  };

  const [input, setInput] = useState('');
  const [context, setContext] = useState<any>({ stage: 'awaiting_locations' });
  const [loading, setLoading] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(NAVBAR_HEIGHT);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) => {
      setKeyboardOffset(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(NAVBAR_HEIGHT);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const timestamp = new Date().toLocaleTimeString();
  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    text: input,
    timestamp,
  };

  setMessages((prev: Message[]) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  const typingMessage: Message = {
    id: "typing",
    role: "ai",
    text: "Typing...",
    timestamp: "",
  };
  setMessages((prev: Message[]) => [...prev, typingMessage]);

  try {
    const res = await aiClient.post("/generate-itinerary/", {
      prompt: userMessage.text,
      context,
    });

    const data = res.data;

    const aiMessage: Message = {
      id: Date.now().toString() + "_ai",
      role: "ai",
      text: data.response || "No response received.",
      timestamp: new Date().toLocaleTimeString(),
      extraData2: data.extraData2,
    };

    setContext(data.context || {});

    setMessages((prev: Message[]) => {
      const cleared = prev.filter((m) => m.id !== "typing");
      const updated = [...cleared, aiMessage];

      if (data.locations && Array.isArray(data.locations)) {
        const mapMessage: Message = {
          id: Date.now().toString() + "_map",
          role: "map",
          text: "",
          timestamp: "",
          extraData: data.locations,
        };
        return [...updated, mapMessage];
      } else {
        return updated;
      }
    });
  } catch (err) {
    const errorMessage: Message = {
      id: "error",
      role: "ai",
      text: "Error: Could not connect to AI server.",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev: Message[]) => [...prev.filter((m) => m.id !== "typing"), errorMessage]);
  } finally {
    setLoading(false);
  }
};


const renderMarkdown = (text: string) => {
  const lines = text.split("\n");

  return (
    <View>
      {lines.map((line, index) => {
        let style: TextStyle = {
          fontSize: 15,
          color: '#2f3640',
          lineHeight: 22,
        };

        let emoji = "";
        const lower = line.toLowerCase();

        // 🔹 Başlıklar
        if (line.startsWith("Tour Theme")) {
          style = styles.itinerarySectionTitle;
        }
        if (line.startsWith("Must")) {
          style = styles.itinerarySectionTitle;
        }
        if (line.startsWith("Public")) {
          style = styles.itinerarySectionTitle;
        }
        if (line.startsWith("🔄")) {
          style = styles.itinerarySectionTitle;
        }
        if (line.startsWith("➡️")) {
          style = styles.itinerarySectionTitle;
        }

        // 🔹 Emoji ve özel font satırları
        if (lower.includes("sunny")) emoji = "☀️ ";
        if (lower.includes("rain")) emoji = "🌧️ ";
        if (lower.includes("cloud")) emoji = "☁️ ";
        if (line.includes("(Nature)")) emoji = "🌲 ";
        if (line.includes("(Beaches)")) emoji = "🏖️ ";
        if (line.includes("(City Life)")) emoji = "🌆 ";
        if (line.includes("(Historical Sites)")) emoji = "🏛️ ";
        if (lower.includes("metro")) emoji = "🚇 ";
        if (lower.includes("bus") || lower.includes("eshot")) emoji = "🚌 ";
        if (lower.includes("ferry")) emoji = "⛴️ ";

        // 🔹 Emoji’li satırlar daha büyük gösterilsin
        if (emoji) {
          style = styles.itineraryEmojiLine;
        }

        return (
          <Text key={index} style={style}>
            {emoji + line}
          </Text>
        );
      })}
    </View>
  );
};




  const renderItem = ({ item }: { item: Message }) => {
  if (item.role === 'map') {
    return (
      <View style={{ height: 400, marginVertical: 10 }}>
        <MapInline locations={item.extraData || []} />
      </View>
    );
  }

  const isUser = item.role === 'user';
  const isItinerary = item.role === 'ai' && item.extraData2?.type === 'itinerary';

  return (
    <View style={[styles.messageContainer, isUser ? styles.userAlign : styles.aiAlign]}>
      {isUser ? (
        <Ionicons
          name="person-circle-outline"
          size={30}
          color="#4A90E2"
          style={{ marginRight: 8 }}
        />
      ) : (
        <Image source={logo} style={styles.aiLogo} resizeMode="contain" />
      )}

      <View style={[
        styles.messageBubble,
        isUser
          ? styles.userBubble
          : (isItinerary ? styles.itineraryBubble : styles.aiBubble)
      ]}>
        {isItinerary && (
         <Text style={styles.itineraryTitle}>
          {(item.extraData2?.locations || []).join(" - ") + " Tour Plan " + new Date().toLocaleDateString('en-GB') + " 🔥"}
         </Text>

        )}
        {renderMarkdown(item.text)}


        {item.timestamp && <Text style={styles.timestamp}>{item.timestamp}</Text>}
        {item.id === 'typing' && <ActivityIndicator size="small" color="#555" />}
      </View>
    </View>
  );
};


  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TopNavbar /> {/* ✅ TopNavbar en üstte sabit */}
      <View style={styles.chatArea}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10, paddingBottom: 140 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      </View>

      <View style={[styles.inputArea, { bottom: keyboardOffset }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          style={styles.input}
          multiline
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={loading}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{loading ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>

      <BottomNavigationBar activeTab="ai" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatArea: {
    flex: 1,
    paddingTop: TOPNAV_HEIGHT, // ✅ TopNavbar yüksekliği kadar boşluk
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  userAlign: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
  aiAlign: { justifyContent: 'flex-start', alignSelf: 'flex-start' },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#96cdcd',
  },
  aiBubble: {
    backgroundColor: '#96cdcd',
  },
  messageText: {
    fontSize: 16,
    color: '#1c0f45',
  },
  timestamp: {
    fontSize: 10,
    color: 'rgb(255, 255, 255)',
    marginTop: 4,
    textAlign: 'right',
  },
  inputArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    zIndex: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
    marginRight: 10,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: colors.buttonBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
  },
  aiLogo: {
    width: 28,
    height: 28,
    marginRight: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    backgroundColor: colors.card,
  },
  itineraryBubble: {
  backgroundColor: '#ffffff',
  borderWidth: 1,
  borderColor: '#96cdcd',
  padding: 12,
  borderRadius: 14,
  marginTop: 4,
},
itineraryTitle: {
  fontSize: 25,
  fontWeight: 'bold',
  marginBottom: 6,
  color: '#1c0f45',
},
itineraryContentText: {
  fontSize: 20,
  color: '#2f3640',
  lineHeight: 22,
},

itinerarySectionTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 8,
  marginBottom: 4,
  color: '#0a3d62',
},

itineraryEmojiLine: {
  fontSize: 20,
  color: '#1e272e',
}


});
