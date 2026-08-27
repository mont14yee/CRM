import React, { createContext, useContext, ReactNode } from 'react';
import { ClientMessage } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils';

interface MessagesContextValue {
  messages: ClientMessage[];
  addMessage: (msg: Omit<ClientMessage, 'id' | 'timestamp'>) => void;
  deleteMessage: (id: string) => void;
  lastMessageForClient: (clientId: string) => ClientMessage | undefined;
}

const MessagesContext = createContext<MessagesContextValue | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useLocalStorage<ClientMessage[]>('conneq-messages', []);

  const addMessage = (msg: Omit<ClientMessage, 'id' | 'timestamp'>) => {
    const newMessage: ClientMessage = {
      ...msg,
      id: generateId(),
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [newMessage, ...prev]);
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const lastMessageForClient = (clientId: string) => {
    return messages.find((m) => m.clientId === clientId);
  };

  return (
    <MessagesContext.Provider value={{ messages, addMessage, deleteMessage, lastMessageForClient }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}
