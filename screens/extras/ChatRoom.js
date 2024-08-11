import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userInfo } from "../tabNavScreens/HomeScreen";

/* Things to do
- get conversation id
- 
*/

const socket = io("http://192.168.18.124:5000");

const ChatRoom = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userId, setUserId] = useState("");
  const [recipientId, setRecipientId] = useState(route.params?.recipientId);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [convoID, setConvoID] = useState("");
  const scrollViewRef = useRef();

  useEffect(() => {
    console.log("Convo id from room: ", route?.params);
    setConvoID(route?.params?.convoID);
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={styles.headerContainer}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <View>
            <Text>{route?.params?.name}</Text>
          </View>
        </View>
      ),
    });
  }, [navigation, route?.params?.name]);

  useEffect(() => {
    const fetchUserId = async () => {
      setUserId(userInfo._id);
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://192.168.18.124:5000/conversations/getMessages/${convoID}`
        );
        setLoading(true);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages 11:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
    fetchMessages();

    socket.emit("joinRoom", convoID);

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
      socket.emit("leaveRoom", convoID);
    };
  }, [convoID]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      content: message,
      sender: userId,
      conversationId: convoID,
      timestamp: new Date(),
    };

    setMessage(""); // Clear the input right after getting the message
    setMessages((prevMessages) => [...prevMessages, newMessage]); // Optimistically update the UI

    try {
      await axios.post(
        `http://192.168.18.124:5000/conversations/${convoID}/messages`,
        newMessage
      );
      socket.emit("message", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally remove the message from UI or show an error
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <ScrollView ref={scrollViewRef}>
          {messages.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.message,
                item.sender === userId
                  ? styles.sentMessage
                  : styles.receivedMessage,
              ]}
            >
              <Text
                style={
                  item.sender === userId
                    ? styles.messageContent
                    : styles.recievedMessageContent
                }
              >
                {item.content}
              </Text>
              <Text style={styles.messageTime}>
                {formatTime(item.timestamp)}
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
          <Entypo name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>
        <Pressable style={styles.sendButton} onPress={sendMessage}>
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
  },
  message: {
    padding: 8,
    margin: 10,
    borderRadius: 7,
    maxWidth: "60%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff", // Blue color for sent messages
    alignItems: "flex-end",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "lightgrey", // White color for received messages
    alignItems: "flex-start",
  },
  messageContent: {
    fontSize: 13,
    color: "white", // Text color for sent messages
  },
  recievedMessageContent: {
    fontSize: 13,
    color: "black", // Text color for sent messages
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

export default ChatRoom;
