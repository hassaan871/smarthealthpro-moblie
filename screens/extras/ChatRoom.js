import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useContext,
} from "react";
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
import { useSocketContext } from "../../SocketContext";
import Context from "../../Helper/context";

const ChatRoom = ({ route }) => {
  const { name, image, convoID, receiverId } = route.params;
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocketContext();
  const { userInfo } = useContext(Context);

  const scrollViewRef = useRef();

  console.log("Receiver ID:", receiverId);

  const listeMessages = () => {
    const { socket } = useSocketContext();

    useEffect(() => {
      socket?.on("newMessage", (newMessage) => {
        newMessage.shouldShake = true;
        setMessages([...messages, newMessage]);
      });

      // Scroll to the bottom when a new message arrives
      scrollViewRef.current?.scrollToEnd({ animated: true });

      return () => socket?.off("newMessage");
    }, [socket, messages, setMessages]);
  };
  listeMessages();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.18.124:5000/conversations/getMessages/${convoID}`
      );
      setMessages(response.data);
    } catch (error) {
      console.log("No conversation found: ", error);
    } finally {
      setLoading(false);
      // Scroll to the bottom after messages are loaded
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      setUserId(userInfo._id);
    };

    fetchUserId();
    fetchMessages();
  }, [convoID]);

  useEffect(() => {
    if (socket) {
      const handleMessageReceive = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.on("newMessage", handleMessageReceive);

      return () => {
        socket.off("newMessage", handleMessageReceive);
      };
    } else {
      console.warn("Socket is not initialized.");
    }
  }, [socket]);

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
            <Text>{name}</Text>
          </View>
        </View>
      ),
    });
  }, [navigation, name]);

  const sendMessage = async () => {
    if (socket) {
      if (!message.trim()) return;

      const newMessage = {
        content: message,
        sender: userInfo._id,
        conversationId: convoID,
        timestamp: new Date(),
      };

      setMessage(""); // Clear the input right after sending the message
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Optimistically update the UI

      // Scroll to the bottom after sending a message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      try {
        await axios.post(
          `http://192.168.18.124:5000/conversations/${convoID}/messages`,
          {
            content: newMessage.content,
            sender: newMessage.sender,
            receiverId: receiverId,
          }
        );
        socket?.emit("sendMessage", { newMessage });

        setTimeout(() => {
          fetchMessages();
        }, 100);
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send the message. Please try again.");
      }
    } else {
      console.log("socket does not exist");
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <ScrollView
          ref={scrollViewRef} // Attach the ref to ScrollView
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
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
                    : styles.receivedMessageContent
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
  receivedMessageContent: {
    fontSize: 13,
    color: "black", // Text color for received messages
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
