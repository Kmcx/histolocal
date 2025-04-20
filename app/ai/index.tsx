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
} from 'react-native';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import { Ionicons } from '@expo/vector-icons';
import { useAIChat } from '../contexts/AIChatContext';
import MapInline from './MapScreen';
import { colors } from '../../styles/theme';
import logo from '../../assets/logo.png';
import { Image } from 'react-native';

type Message = {
  id: string;
  role: 'user' | 'ai' | 'map';
  text: string;
  timestamp: string;
  extraData?: { name: string; lat: number; lng: number }[];
};

export default function AIChatScreen() {
  const { messages, setMessages } = useAIChat() as {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  };
  const [input, setInput] = useState('');
  const [context, setContext] = useState<any>({ stage: 'awaiting_locations' });
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const typingMessage: Message = {
      id: 'typing',
      role: 'ai',
      text: 'Typing...',
      timestamp: '',
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const res = await fetch(`http://192.168.1.104:8000/generate-itinerary/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.text, context: { ...context, stage: context.stage || 'awaiting_locations' } }),
      });

      const data = await res.json();
      const aiMessage: Message = {
        id: Date.now().toString() + '_ai',
        role: 'ai',
        text: data.response || 'No response received.',
        timestamp: new Date().toLocaleTimeString(),
      };

      setContext(data.context || {});

      setMessages(prev => {
        const cleared = prev.filter(m => m.id !== 'typing');
        const updated = [...cleared, aiMessage];
        if (data.locations && Array.isArray(data.locations)) {
          const mapMessage: Message = {
            id: Date.now().toString() + '_map',
            role: 'map',
            text: '',
            timestamp: '',
            extraData: data.locations
          };
          return [...updated, mapMessage];
        } else {
          return updated;
        }
      });

    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      const errorMessage: Message = {
        id: 'error',
        role: 'ai',
        text: 'Error: Could not connect to AI server.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev.filter(m => m.id !== 'typing'), errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      if (/^\*\*(.*?)\*\*$/.test(part)) {
        return <Text key={index} style={{ fontWeight: 'bold' }}>{part.replace(/\*\*/g, '')}</Text>;
      }
      if (/^\*(.*?)\*$/.test(part)) {
        return <Text key={index} style={{ fontStyle: 'italic' }}>{part.replace(/\*/g, '')}</Text>;
      }
      if (/^\[(.*?)\]\((.*?)\)$/.test(part)) {
        const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
        return (
          <Text key={index} style={{ color: 'blue' }} onPress={() => Linking.openURL(match![2])}>
            {match![1]}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
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

        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={styles.messageText}>{renderMarkdown(item.text)}</Text>
          {item.timestamp && (
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          )}
          {item.id === 'typing' && (
            <ActivityIndicator size="small" color="#555" />
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.chatArea}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputArea}>
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
    marginBottom: 60,
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
    color: '	#1c0f45',
  },
  timestamp: {
    fontSize: 10,
    color: 'rgb(255, 255, 255)',
    marginTop: 4,
    textAlign: 'right',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
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
  
});