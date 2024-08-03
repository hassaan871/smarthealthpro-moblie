import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Chat, defaultTheme } from '@flyerhq/react-native-chat-ui';
import axios from 'axios';
import ChatHeader from './components/ChatHeader';
import lightTheme from '../../Themes/LightTheme';

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

const BotChattingScreen = () => {
  const [messages, setMessages] = useState([]);
  const user = { id: '06c33e8b-e835-4736-80f4-63f44b66666c' };
  const chatbot = { id: '06c33e8b-e899-4736-80f4-63f44b66666c' };

  const addMessage = (message) => {
    setMessages((prevMessages) => [message, ...prevMessages]);
  };

  const handleSendPress = async (message) => {
    const sentMessage = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    };
    addMessage(sentMessage);

    try {
      console.log("m",message.text)
      const response = await axios.post('http://127.0.0.1:8081/chat', { message: message.text });
      const receivedMessage = {
        author: chatbot,
        createdAt: Date.now(),
        id: uuidv4(),
        text: response.data.response,
        type: 'text',
      };
      addMessage(receivedMessage);
    } catch (error) {
      console.error('Error sending message to backend:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <ChatHeader icons={true} />
      <Chat
        theme={{
          ...defaultTheme,
          colors: {
            ...defaultTheme.colors,
            primary: lightTheme.colors.secondaryBtn,
            background: '#f7fafc',
            inputBackground: lightTheme.colors.secondaryBtn,
          },
        }}
        messages={messages}
        onSendPress={handleSendPress}
        user={user}
        inverted={true} // Ensure new messages appear at the bottom
      />
    </SafeAreaProvider>
  );
};

export default BotChattingScreen;
