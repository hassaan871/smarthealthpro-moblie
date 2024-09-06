import React, { useState, useRef, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

const BotChattingScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState('');
 
  const chatbot = { id: "06c33e8b-e899-4736-80f4-63f44b66666c" };
  const scrollViewRef = useRef();
  const navigation = useNavigation();
  // const { name, image, convoID, receiverId } = route.params;
  useEffect(()=>{
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem("userToken");
      setPatientId(userID)
      console.log("user",patientId,userID)
    }
    fetchUser()
  },[])
 

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendPress = async () => {
    if (!message.trim()) return;

    const sentMessage = {
      author: patientId,
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
      formData.append("patient_id", patientId);
      console.log(patientId)
      const response = await axios.post(
        "http://192.168.100.132:8082/chat",
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
          author: patientId,
          createdAt: Date.now(),
          id: uuidv4(),
          mimeType: file.mimeType,
          name: file?.name,
          size: file.size,
          type: "file",
          uri: file.uri,
        };
        addMessage(fileMessage);

        const fileUri = FileSystem.documentDirectory + file?.name;
        await FileSystem.copyAsync({
          from: file.uri,
          to: fileUri,
        });

        const formData = new FormData();
        formData.append("file", {
          uri: fileUri,
          type: file.mimeType,
          name: file?.name,
        });

        const chatResponse = await axios.post(
          "http://127.0.0.1:8082/chat",
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
          <Text style={styles.headerName}>ChatBot</Text>
          <Text style={styles.headerSubtext}>Online</Text>
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
                item?.author === patientId
                  ? styles.sentMessage
                  : styles.receivedMessage,
              ]}
            >
              <Text
                style={
                  item?.author === patientId
                    ? styles.messageContent
                    : styles.receivedMessageContent
                }
              >
                {item?.text}
              </Text>
              <Text style={styles.messageTime}>
                {formatTime(item?.createdAt)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <Entypo name="emoji-happy" size={24} color="gray" />
        <TextInput
          placeholder="Type your message..."
          placeholderTextColor="#aaaaaa"
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
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: "#3777f0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
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
