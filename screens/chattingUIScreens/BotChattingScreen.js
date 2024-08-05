import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Chat, defaultTheme } from '@flyerhq/react-native-chat-ui';
import axios from 'axios';
import ChatHeader from './components/ChatHeader';
import lightTheme from '../../Themes/LightTheme';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

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
      const formData = new FormData();
      formData.append('message', message.text);
      const response = await axios.post('http://127.0.0.1:8081/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

  const handleFileSelection = async () => {
    console.log("file");
    try {
      const response = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });
  
      console.log('DocumentPicker response:', response);
  
      if (response.assets && response.assets.length > 0 && !response.canceled) {
        const file = response.assets[0];
        const fileMessage = {
          author: user,
          createdAt: Date.now(),
          id: uuidv4(),
          mimeType: file.mimeType,
          name: file.name,
          size: file.size,
          type: 'file',
          uri: file.uri,
        };
        addMessage(fileMessage);
        console.log('File selected:', fileMessage);
  
        const fileUri = FileSystem.documentDirectory + file.name;
        await FileSystem.copyAsync({
          from: file.uri,
          to: fileUri,
        });
        console.log('File copied to:', fileUri);
  
        const formData = new FormData();
        formData.append('file', {
          uri: fileUri,
          type: file.mimeType,
          name: file.name,
        });
  
        const chatResponse = await axios.post('http://127.0.0.1:8081/chat', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Backend response:', chatResponse.data);
  
        const receivedMessage = {
          author: chatbot,
          createdAt: Date.now(),
          id: uuidv4(),
          text: chatResponse.data.response,
          type: 'text',
        };
        addMessage(receivedMessage);
      } else {
        console.log('DocumentPicker cancelled or error:', response);
      }
    } catch (error) {
      console.error('Error selecting or uploading file:', error);
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
        onAttachmentPress={handleFileSelection}
      />
    </SafeAreaProvider>
  );
};

export default BotChattingScreen;
