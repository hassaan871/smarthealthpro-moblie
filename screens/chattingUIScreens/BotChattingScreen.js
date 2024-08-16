import React, { useState, useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

const BotChattingScreen = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const user = { id: "06c33e8b-e835-4736-80f4-63f44b66666c" };
  const chatbot = { id: "06c33e8b-e899-4736-80f4-63f44b66666c" };
  const scrollViewRef = useRef();
  const navigation = useNavigation();

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendPress = async () => {
    if (!message.trim()) return;

    const sentMessage = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message,
      type: "text",
    };
    addMessage(sentMessage);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("message", message);
      const response = await axios.post(
        "http://127.0.0.1:8081/chat",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const receivedMessage = {
        author: chatbot,
        createdAt: Date.now(),
        id: uuidv4(),
        text: response.data.response,
        type: "text",
      };
      addMessage(receivedMessage);
    } catch (error) {
      console.error("Error sending message to backend:", error);
    }
  };

  const handleFileSelection = async () => {
    try {
      const response = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (response.assets && response.assets.length > 0 && !response.canceled) {
        const file = response.assets[0];
        const fileMessage = {
          author: user,
          createdAt: Date.now(),
          id: uuidv4(),
          mimeType: file.mimeType,
          name: file.name,
          size: file.size,
          type: "file",
          uri: file.uri,
        };
        addMessage(fileMessage);

        const fileUri = FileSystem.documentDirectory + file.name;
        await FileSystem.copyAsync({
          from: file.uri,
          to: fileUri,
        });

        const formData = new FormData();
        formData.append("file", {
          uri: fileUri,
          type: file.mimeType,
          name: file.name,
        });

        const chatResponse = await axios.post(
          "http://127.0.0.1:8081/chat",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const receivedMessage = {
          author: chatbot,
          createdAt: Date.now(),
          id: uuidv4(),
          text: chatResponse.data.response,
          type: "text",
        };
        addMessage(receivedMessage);
      }
    } catch (error) {
      console.error("Error selecting or uploading file:", error);
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.headerContainer}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => {
            console.log("Going back");
            navigation.goBack();
          }} // Replace with navigation logic if needed
        />
        <View>
          <Text>Chatbot</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.message,
                item.author.id === user.id
                  ? styles.sentMessage
                  : styles.receivedMessage,
              ]}
            >
              <Text
                style={
                  item.author.id === user.id
                    ? styles.messageContent
                    : styles.receivedMessageContent
                }
              >
                {item.text}
              </Text>
              <Text style={styles.messageTime}>
                {formatTime(item.createdAt)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <Entypo name="emoji-happy" size={24} color="gray" />
        <TextInput
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          style={styles.textInput}
        />
        <View style={styles.iconContainer}>
          <Entypo
            name="camera"
            size={24}
            color="gray"
            onPress={handleFileSelection}
          />
          <Feather name="mic" size={24} color="gray" />
        </View>
        <Pressable style={styles.sendButton} onPress={handleSendPress}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    backgroundColor: "#f7fafc",
  },
  message: {
    padding: 8,
    margin: 10,
    borderRadius: 7,
    maxWidth: "70%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    alignItems: "flex-end",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "lightgrey",
    alignItems: "flex-start",
  },
  messageContent: {
    fontSize: 14,
    color: "white",
  },
  receivedMessageContent: {
    fontSize: 14,
    color: "black",
  },
  messageTime: {
    textAlign: "right",
    fontSize: 9,
    color: "black",
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: "#0066b2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    textAlign: "center",
    color: "white",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

export default BotChattingScreen;
