import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useContext,
  useCallback,
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
  Image,
  Alert,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import { useSocketContext } from "../../SocketContext";
import Context from "../../Helper/context";
import * as Crypto from "expo-crypto";
var C = require("crypto-js");
import CryptoES from "crypto-es";
import messaging from "@react-native-firebase/messaging";
import { encrypt, decrypt } from "./EncryptionUtils";
import { useFocusEffect } from "@react-navigation/native";
import { debounce } from "lodash";

const ChatRoom = ({ route }) => {
  const { item, convoID, receiverId } = route.params;
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { userInfo } = useContext(Context);
  const { socket, connectSocket } = useSocketContext();

  const joinRoom = useCallback(() => {
    if (socket && convoID) {
      socket.emit("joinRoom", convoID);
    }
  }, [socket, convoID]);

  const leaveRoom = useCallback(() => {
    if (socket && convoID) {
      socket.emit("leaveRoom", convoID);
    }
  }, [socket, convoID]);

  useEffect(() => {
    joinRoom();
    return () => leaveRoom();
  }, [joinRoom, leaveRoom]);
  0;

  useFocusEffect(
    React.useCallback(() => {
      if (!socket || !socket.connected) {
        console.log("Socket not connected, attempting to reconnect...");
        connectSocket();
      }
      return () => {
        // Cleanup function if needed
      };
    }, [socket, connectSocket])
  );

  useEffect(() => {
    if (socket) {
      const handleMessageReceive = (newMessage) => {
        console.log("Received message:", newMessage);
        const decryptedMessage = decryptMessage(newMessage);
        if (decryptedMessage) {
          setMessages((prevMessages) => {
            // Check if the message already exists in the array
            if (!prevMessages.some((msg) => msg._id === decryptedMessage._id)) {
              return [...prevMessages, decryptedMessage];
            }
            return prevMessages;
          });
          scrollViewRef.current?.scrollToEnd({ animated: true });
        } else {
          console.error("Failed to decrypt message:", newMessage);
        }
      };

      socket.on("newMessage", handleMessageReceive);

      return () => {
        socket.off("newMessage", handleMessageReceive);
      };
    }
  }, [socket]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground notification received:", remoteMessage);
      // You can show an alert or update the UI here
      // Alert.alert(
      //   remoteMessage.notification.title,
      //   remoteMessage.notification.body
      // );
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (convoID) {
      setLoading(true);
    }
  }, []);

  const scrollViewRef = useRef();

  // console.log("Receiver ID:", receiverId);

  const handleMessagePress = async (item) => {
    console.log("Message pressed:", item);

    if (item.fileInfo && item.fileInfo.mimetype === "application/pdf") {
      try {
        const pdfUrl = item.fileInfo.url;
        console.log("Attempting to open PDF:", pdfUrl);

        // Make sure the URL uses http://10.0.2.2:5000 for Android emulator
        const adjustedUrl = pdfUrl.replace(
          "http://192.168.18.124:5000",
          "http://10.0.2.2:5000"
        );

        navigation.navigate("PdfViewer", { uri: adjustedUrl });
      } catch (error) {
        console.error("Error opening PDF:", error);
        Alert.alert("Error", "Unable to open PDF file. Please try again.");
      }
    } else if (item.fileInfo) {
      Alert.alert("File", `This is a ${item.fileInfo.mimetype} file.`);
    } else {
      Alert.alert("Message", item.content);
    }
  };

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
            <Image
              source={{
                uri:
                  item?.avatar?.url?.length > 0
                    ? item?.avatar?.url
                    : item?.avatar,
              }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text numberOfLines={1} style={styles.headerName}>
              {item?.name || item?.fullName}
            </Text>
            <Text style={styles.headerSubtext}>Online</Text>
          </View>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#1f1f1f",
        elevation: 0,
        shadowOpacity: 0,
        height: 60, // Increased height
      },
    });
  }, [navigation, item]);

  const formatTime = (time) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      timeZone: "Asia/Karachi",
      hour12: true,
    };
    return new Date(time).toLocaleString("en-US", options);
  };

  const handleFileSelection = async () => {
    console.log("Starting file selection process");
    try {
      console.log("Calling DocumentPicker.getDocumentAsync");
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      console.log("DocumentPicker result:", JSON.stringify(result, null, 2));

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log("File selected successfully");
        const file = result.assets[0];
        const formData = new FormData();
        formData.append("file", {
          uri: file.uri,
          type: file.mimeType,
          name: file.name,
        });
        console.log("FormData created:", formData);

        console.log("Sending POST request to upload file");
        const uploadResponse = await axios.post(
          `http://10.0.2.2:5000/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(
          "Upload response:",
          JSON.stringify(uploadResponse.data, null, 2)
        );

        const encryptedFileName = encrypt(
          uploadResponse.data.file.originalName
        );
        const encryptedFileUrl = encrypt(uploadResponse.data.file.url);

        const encryptedFileInfo = {
          ...uploadResponse.data.file,
          originalName: encryptedFileName,
          url: encryptedFileUrl,
        };

        console.log("Calling sendMessage with file info");
        await sendMessage(null, encryptedFileInfo);
        console.log("Message sent with file info");
      } else {
        console.log("File selection cancelled or failed");
      }
    } catch (error) {
      console.error("Error in handleFileSelection:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      Alert.alert("Error", "Failed to select or upload file: " + error.message);
    }
  };

  const decryptMessage = (msg) => {
    try {
      return {
        ...msg,
        content: msg.fileInfo ? msg.content : decrypt(msg.content),
        fileInfo: msg.fileInfo
          ? {
              ...msg.fileInfo,
              originalName: decrypt(msg.fileInfo.originalName),
              url: decrypt(msg.fileInfo.url),
            }
          : null,
      };
    } catch (error) {
      console.error("Error decrypting message:", error);
      return null;
    }
  };

  const fetchMessages = useCallback(async () => {
    if (convoID) {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://192.168.18.124:5000/conversations/getMessages/${convoID}`
        );
        const decryptedMessages = response.data.map(decryptMessage);
        setMessages(decryptedMessages);
      } catch (error) {
        console.log("Error fetching messages: ", error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      setUserId(userInfo._id);
    };

    fetchUserId();
    fetchMessages();
  }, [fetchMessages, userInfo._id]);

  const sendNotification = async (receiverId, senderName, messageContent) => {
    try {
      const response = await axios.post(
        "http://10.0.2.2:5000/send-notification",
        {
          receiverId,
          title: `New message from ${senderName}`,
          body: messageContent,
        }
      );
      console.log("Notification sent:", response.data);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const sendMessage = async (textMessage = null, fileInfo = null) => {
    console.log("Starting sendMessage function");
    console.log("textMessage:", textMessage);
    console.log("fileInfo:", JSON.stringify(fileInfo, null, 2));

    if (!socket) {
      console.log("socket does not exist");
      return;
    }

    if (!textMessage?.trim() && !fileInfo) {
      console.log("No message or file to send");
      return;
    }

    setIsSending(true);

    let conversationId;
    try {
      if (!convoID) {
        console.log("Creating new conversation");
        const response = await axios.post(
          "http://10.0.2.2:5000/conversations",
          {
            currentUserId: userInfo._id,
            otherUserId: item._id,
            currentUserObjectIdAvatar: userInfo?.avatar,
            otherUserObjectIdAvatar: item?.avatar,
            currentUserObjectIdName: userInfo?.fullName,
            otherUserObjectIdName: item?.fullName,
          }
        );
        conversationId = response.data?._id;
        console.log("New conversation created with ID:", conversationId);
      } else {
        console.log("Using existing conversation ID:", convoID);
      }

      let newMessage;
      if (textMessage) {
        const encryptedContent = encrypt(textMessage);
        newMessage = {
          content: encryptedContent,
          sender: userInfo._id,
          conversationId: convoID ? convoID : conversationId,
          timestamp: new Date(),
        };
      } else if (fileInfo) {
        console.log("file info in chatroom: ", fileInfo);
        newMessage = {
          content: encrypt("File shared"),
          sender: userInfo._id,
          conversationId: convoID ? convoID : conversationId,
          timestamp: new Date(),
          fileInfo: fileInfo,
        };
      }

      console.log("New message object:", JSON.stringify(newMessage, null, 2));

      setMessage("");
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   {
      //     ...newMessage,
      //     content: textMessage || decrypt(newMessage.content),
      //     fileInfo: fileInfo
      //       ? {
      //           ...fileInfo,
      //           originalName: decrypt(fileInfo.originalName),
      //           url: decrypt(fileInfo.url),
      //         }
      //       : null,
      //   },
      // ]);
      console.log("Message added to local state");

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      console.log("Sending message to server");
      const response = await axios.post(
        `http://10.0.2.2:5000/conversations/${
          convoID ? convoID : conversationId
        }/messages`,
        newMessage
      );

      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   {
      //     ...newMessage,
      //     _id: response.data._id, // Use the ID from the server response
      //     content: textMessage, // Use the unencrypted text for display
      //     isSender: true, // Flag to identify sender's messages
      //   },
      // ]);

      console.log("Server response:", JSON.stringify(response.data, null, 2));

      console.log("Updating last message");
      await axios.put(
        `http://10.0.2.2:5000/conversations/${
          convoID ? convoID : conversationId
        }/lastMessage`,
        {
          lastMessage: textMessage || "File shared",
        }
      );

      console.log("Emitting sendMessage event to socket");
      // socket?.emit("sendMessage", {
      //   newMessage: {
      //     ...newMessage,
      //     content: textMessage || newMessage.content,
      //   },
      //   room: convoID,
      // });
      console.log("Message sent successfully");
      await sendNotification(
        receiverId,
        userInfo.fullName,
        textMessage || "New file shared"
      );
    } catch (error) {
      console.error("Error in sendMessage:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      Alert.alert("Error", "Failed to send the message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const debouncedSendMessage = useCallback(
    debounce((message) => sendMessage(message), 300, {
      leading: true,
      trailing: false,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        ) : (
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollViewContent}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((item, index) => (
              <Pressable
                onPress={() => handleMessagePress(item)}
                key={index}
                style={[
                  styles.message,
                  item.sender === userId
                    ? styles.sentMessage
                    : styles.receivedMessage,
                ]}
              >
                {item.fileInfo ? (
                  <View style={styles.fileMessage}>
                    <FontAwesome name="file-o" size={24} color="red" />
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName}>
                        {item.fileInfo.originalName}
                      </Text>
                      <Text style={styles.fileSize}>
                        {(item.fileInfo.size / 1024).toFixed(2)} KB
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={
                      item.sender === userId
                        ? styles.messageContent
                        : styles.receivedMessageContent
                    }
                  >
                    {item.content}
                  </Text>
                )}
                <Text style={styles.messageTime}>
                  {formatTime(item.timestamp)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        <View style={styles.inputContainer}>
          <FontAwesome
            onPress={handleFileSelection}
            name="file-pdf-o"
            size={24}
            color="gray"
            style={styles.fileIcon}
          />
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

          <Pressable
            style={styles.sendButton}
            onPress={() => debouncedSendMessage(message)}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
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
    height: 60, // Increased height
    width: "100%", // Ensure full width
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
    flex: 1, // Take up remaining space
    justifyContent: "center",
  },
  headerName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 50, // Ensure text doesn't overlap with right side of header
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
  fileIcon: {
    marginRight: 10,
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
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#3777f0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    // marginBottom: 4,
  },
  fileMessage: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileInfo: {
    marginLeft: 10,
  },
  fileName: {
    color: "white",
    fontSize: 14,
  },
  fileSize: {
    color: "#b0b0b0",
    fontSize: 12,
  },
});

export default ChatRoom;
