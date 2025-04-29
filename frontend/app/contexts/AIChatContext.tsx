// contexts/AIChatContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
};

type ChatContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const AIChatContext = createContext<ChatContextType | undefined>(undefined);

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) throw new Error('useAIChat must be used within AIChatProvider');
  return context;
};

export const AIChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      text: `👋 Hello!
I'll assist you step-by-step to create the perfect travel plan in Izmir!

Let's start with which places would you like to visit? (You can type Çeşme, Konak.. etc)`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  return (
    <AIChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </AIChatContext.Provider>
  );
};
