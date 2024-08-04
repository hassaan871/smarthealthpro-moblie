import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Chat, defaultTheme, MessageType } from '@flyerhq/react-native-chat-ui';
import axios from 'axios';
import { useActionSheet } from '@expo/react-native-action-sheet';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import { launchImageLibrary } from 'react-native-image-picker';
import ChatHeader from './components/ChatHeader';
import lightTheme from '../../Themes/LightTheme';

// For the testing purposes, you should probably use https://github.com/uuidjs/uuid
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

const BotChattingScreen = () => {
  const { showActionSheetWithOptions } = useActionSheet();
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

  const handleFileSelection = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      const fileMessage = {
        author: user,
        createdAt: Date.now(),
        id: uuidv4(),
        mimeType: response.type ?? undefined,
        name: response.name,
        size: response.size ?? 0,
        type: 'file',
        uri: response.uri,
      };
      addMessage(fileMessage);

      const formData = new FormData();
      formData.append('file', {
        uri: response.uri,
        type: response.type,
        name: response.name,
      });

      const chatResponse = await axios.post('http://127.0.0.1:8081/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const receivedMessage = {
        author: chatbot,
        createdAt: Date.now(),
        id: uuidv4(),
        text: chatResponse.data.response,
        type: 'text',
      };
      addMessage(receivedMessage);
    } catch (error) {
      console.error('Error selecting or uploading file:', error);
    }
  };

  const handleImageSelection = () => {
    launchImageLibrary(
      {
        includeBase64: true,
        maxWidth: 1440,
        mediaType: 'photo',
        quality: 0.7,
      },
      async ({ assets }) => {
        const response = assets?.[0];

        if (response?.base64) {
          const imageMessage = {
            author: user,
            createdAt: Date.now(),
            height: response.height,
            id: uuidv4(),
            name: response.fileName ?? response.uri?.split('/').pop() ?? '🖼',
            size: response.fileSize ?? 0,
            type: 'image',
            uri: `data:image/*;base64,${response.base64}`,
            width: response.width,
          };
          addMessage(imageMessage);

          const formData = new FormData();
          formData.append('file', {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          });

          try {
            const chatResponse = await axios.post('http://127.0.0.1:8081/chat', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            const receivedMessage = {
              author: chatbot,
              createdAt: Date.now(),
              id: uuidv4(),
              text: chatResponse.data.response,
              type: 'text',
            };
            addMessage(receivedMessage);
          } catch (error) {
            console.error('Error sending image to backend:', error);
          }
        }
      }
    );
  };

  const handleAttachmentPress = () => {
    showActionSheetWithOptions(
      {
        options: ['Photo', 'File', 'Cancel'],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            handleImageSelection();
            break;
          case 1:
            handleFileSelection();
            break;
        }
      }
    );
  };

  const handleFilePress = async (message) => {
    try {
      await FileViewer.open(message.uri, { showOpenWithDialog: true });
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const handlePreviewDataFetched = ({ message, previewData }) => {
    setMessages(
      messages.map((m) =>
        m.id === message.id ? { ...m, previewData } : m
      )
    );
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
        onAttachmentPress={handleAttachmentPress}
        onFilePress={handleFilePress}
        onPreviewDataFetched={handlePreviewDataFetched}
        user={user}
        inverted={true} // Ensure new messages appear at the bottom
      />
    </SafeAreaProvider>
  );
};

export default BotChattingScreen;
