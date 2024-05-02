import { Chat, defaultTheme } from '@flyerhq/react-native-chat-ui';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatHeader from './components/ChatHeader';

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.floor(Math.random() * 16);
        const v = c === 'x' ? r : (r % 4) + 8;
        return v.toString(16);
    });
}

const BotChattingScreen = () => {
    const [messages, setMessages] = useState([]);
    const user = { id: '06c33e8b-e835-4736-80f4-63f44b66666c' };
    const chatbot = { id: "06c33e8b-e899-4736-80f4-63f44b66666c" };

    const addMessage = (message) => {
        setMessages((prevMessages) => [message,...prevMessages]);
    }

    const handleSendPress = (message) => {
        const sentMessage = {
            author: user,
            createdAt: Date.now(),
            id: uuidv4(),
            text: message.text,
            type: 'text',
        };
        addMessage(sentMessage);

        setTimeout(() => {
            const receivedMessage = {
                author: chatbot,
                createdAt: Date.now(),
                id: uuidv4(),
                text: "yes you are right ",
                type: 'text',
            };
            addMessage(receivedMessage);
        }, 500);
    }

    return (
        <SafeAreaProvider>
            <ChatHeader icons={true} />
            <Chat
            // change text message background
                theme={{ ...defaultTheme, colors: { ...defaultTheme.colors, primary: '#3182ce' }}}
                messages={messages}
                onSendPress={handleSendPress}
                user={user}
                inverted={true} // Ensure new messages appear at the bottom
            />
        </SafeAreaProvider>
    );
}

export default BotChattingScreen;
