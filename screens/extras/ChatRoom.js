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

  // console.log("Receiver ID:", receiverId);

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
        `http://192.168.18.9:5000/conversations/getMessages/${convoID}`
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
            color="white"
            onPress={() => navigation.goBack()}
            style={styles.backIcon}
          />
          <View style={styles.profileImageContainer}>
            {/* Placeholder for the profile image */}
            <View style={styles.profileImage} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerName}>{name}</Text>
            <Text style={styles.headerSubtext}>Online</Text>
          </View>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#1f1f1f",
        elevation: 0,
        shadowOpacity: 0,
      },
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
          `http://192.168.18.9:5000/conversations/${convoID}/messages`,
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
    const options = {
      hour: "numeric",
      minute: "numeric",
      timeZone: "Asia/Karachi",
      hour12: true,
    };
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
    backgroundColor: "#121212",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#1f1f1f",
  },
  backIcon: {
    marginRight: 15,
  },
  profileImageContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#cccccc", // Placeholder color
  },
  headerTextContainer: {
    justifyContent: "center",
  },
  headerName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtext: {
    color: "#aaaaaa",
    fontSize: 14,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 20,
    maxWidth: "75%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#3777f0",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#2e2e2e",
  },
  messageContent: {
    fontSize: 15,
    color: "white",
  },
  receivedMessageContent: {
    fontSize: 15,
    color: "white",
  },
  messageTime: {
    textAlign: "right",
    fontSize: 11,
    color: "#b0b0b0",
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: "#1f1f1f",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#333333",
    color: "white",
    marginLeft: 10,
  },
  sendButton: {
    backgroundColor: "#3777f0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

export default ChatRoom;
