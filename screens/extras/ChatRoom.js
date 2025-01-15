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
import messaging from "@react-native-firebase/messaging";
import { encrypt, decrypt } from "./EncryptionUtils";
import { useFocusEffect } from "@react-navigation/native";

// OnlineStatusIndicator component
const OnlineStatusIndicator = ({ userId, onStatusChange }) => {
  const [isOnline, setIsOnline] = useState(false);
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket || !userId) {
      console.log("Missing socket or userId:", { socket: !!socket, userId });
      return;
    }

    // Check initial status
    socket.emit("checkOnlineStatus", userId);

    // Listen for status updates
    const handleUserStatus = (data) => {
      if (data.userId === userId) {
        setIsOnline(data.isOnline);
        onStatusChange(data.isOnline); // Pass the status back to the parent
      }
    };

    socket.on("userStatus", handleUserStatus);

    return () => {
      socket.off("userStatus", handleUserStatus);
    };
  }, [socket, userId, onStatusChange]);

  return (
    <View style={styles.onlineStatusContainer}>
      <View
        style={[
          styles.statusDot,
          isOnline ? styles.onlineDot : styles.offlineDot,
        ]}
      />
      <Text style={styles.headerSubtext}>
        {isOnline ? "Online" : "Offline"}
      </Text>
    </View>
  );
};

const ChatRoom = ({ route }) => {
  const { item, convoID, receiverId } = route.params;
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageReadStatus, setMessageReadStatus] = useState({});
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const [sentMessageIds] = useState(new Set());
  const { userInfo } = useContext(Context);
  const { socket, connectSocket } = useSocketContext();
  const prevMessagesLength = useRef(messages.length);

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
    if (!socket || !userInfo?._id) return;

    const handleConnect = () => {
      console.log("Socket connected");
      // Emit online status when socket connects
      socket.emit("userOnline", {
        userId: userInfo._id,
        timestamp: new Date().toISOString(),
      });
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Initial online status emission
    if (socket.connected) {
      socket.emit("userOnline", {
        userId: userInfo._id,
        timestamp: new Date().toISOString(),
      });
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      // Emit offline status when component unmounts
      socket.emit("userOffline", {
        userId: userInfo._id,
        timestamp: new Date().toISOString(),
      });
    };
  }, [socket, userInfo?._id]);

  useEffect(() => {
    joinRoom();
    return () => leaveRoom();
  }, [joinRoom, leaveRoom]);

  // Add this effect to mark messages as read when entering chat
  useEffect(() => {
    if (convoID && userInfo?._id) {
      axios
        .post(
          `http://192.168.18.124:5000/conversations/${convoID}/mark-messages-read`,
          {
            conversationId: convoID,
            userId: userInfo._id,
          }
        )
        .catch((error) => {
          console.error("Error marking messages as read:", error);
        });

      // Reset unread count
      axios
        .post(
          `http://192.168.18.124:5000/conversations/${convoID}/read/${userInfo._id}`
        )
        .catch((error) => {
          console.error("Error resetting unread count:", error);
        });
    }
  }, [convoID, userInfo?._id]);
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
      const handleMessageRead = (data) => {
        console.log("Received message read event:", data);

        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((msg) =>
            msg._id === data.messageId
              ? {
                  ...msg,
                  readStatus: data.readStatus,
                  status: data.status,
                }
              : msg
          );

          // Only update state if messages have changed
          if (
            JSON.stringify(prevMessages) !== JSON.stringify(updatedMessages)
          ) {
            return updatedMessages;
          }
          return prevMessages;
        });
      };

      socket.on("messageRead", handleMessageRead);
      return () => socket.off("messageRead", handleMessageRead);
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const handleMessageReceive = (newMessage) => {
        console.log("Received message:", newMessage);

        // If this is our own message and we already have it, skip
        if (
          newMessage.sender === userInfo._id &&
          messages.some(
            (msg) =>
              msg._id === newMessage._id || msg._id === Date.now().toString()
          )
        ) {
          return;
        }

        // For messages from others, check if we already have it
        if (
          newMessage.sender !== userInfo._id &&
          messages.some((msg) => msg._id === newMessage._id)
        ) {
          return;
        }

        if (newMessage.sender !== userInfo._id) {
          // Immediately mark message as read since we're in the chat room
          socket.emit("messageRead", {
            messageId: newMessage._id,
            conversationId: convoID,
            userId: userInfo._id,
          });
        }

        const decryptedMessage = decryptMessage(newMessage);
        if (decryptedMessage) {
          setMessages((prevMessages) => {
            // One final check to prevent duplicates
            if (prevMessages.some((msg) => msg._id === decryptedMessage._id)) {
              return prevMessages;
            }
            return [
              ...prevMessages,
              {
                ...decryptedMessage,
                readStatus: {
                  [userInfo._id]: true,
                  [receiverId]: otherUserOnline,
                },
              },
            ];
          });
        }
      };

      socket.on("newMessage", handleMessageReceive);
      return () => socket.off("newMessage", handleMessageReceive);
    }
  }, [socket, userInfo._id, receiverId, messages, otherUserOnline]);

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

  const scrollViewRef = useRef();

  // console.log("Receiver ID:", receiverId);

  const handleMessagePress = async (item) => {
    console.log("Message pressed:", item);

    if (item.fileInfo && item.fileInfo.mimetype === "application/pdf") {
      try {
        const pdfUrl = item.fileInfo.url;
        console.log("Attempting to open PDF:", pdfUrl);

        // Make sure the URL uses http://192.168.18.124:5000 for Android emulator
        const adjustedUrl = pdfUrl.replace(
          "http://192.168.18.124:5000",
          "http://192.168.18.124:5000"
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
            <OnlineStatusIndicator
              userId={receiverId}
              onStatusChange={setOtherUserOnline}
            />
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
          `http://192.168.18.124:5000/upload`,
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
        "http://192.168.18.124:5000/send-notification",
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
    if (!socket || (!textMessage?.trim() && !fileInfo) || isSending) {
      return;
    }

    setIsSending(true);
    const messageId = Date.now().toString();

    try {
      const newMessage = {
        _id: messageId,
        content: textMessage ? encrypt(textMessage) : encrypt("File shared"),
        sender: userInfo._id,
        conversationId: convoID,
        timestamp: new Date(),
        fileInfo: fileInfo || null,
        readStatus: {
          [userInfo._id]: true,
        },
      };

      // Clear input immediately
      setMessage("");

      // Send to server first
      const messageResponse = await axios.post(
        `http://192.168.18.124:5000/conversations/${convoID}/messages`,
        newMessage
      );

      // After server confirms, emit to socket
      socket?.emit("newMessage", {
        ...newMessage,
        _id: messageResponse.data._id,
      });

      // Update lastMessage in background
      axios
        .put(
          `http://192.168.18.124:5000/conversations/${convoID}/lastMessage`,
          {
            lastMessage: textMessage || "File shared",
          }
        )
        .catch(console.error);

      // Send notification in background
      sendNotification(
        receiverId,
        userInfo.fullName,
        textMessage || "New file shared"
      ).catch(console.error);
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Please try again.");
      console.error("Send message error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const markMessageAsRead = async (messageId) => {
    if (socket && messageId) {
      console.log("Attempting to mark message as read:", messageId);
      socket.emit("messageRead", {
        messageId,
        conversationId: convoID,
        userId: userInfo._id,
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0 && !loading) {
      const lastMessage = messages[messages.length - 1];

      // Only mark as read if it's not the current user's message
      if (lastMessage.sender !== userInfo._id) {
        console.log("Attempting to mark last message as read:", lastMessage);
        markMessageAsRead(lastMessage._id);
      }
    }

    // Update the ref with the current messages length
    prevMessagesLength.current = messages.length;
  }, [messages, loading, userInfo._id]);

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
            {messages.map((item, index) => {
              const isLastMessage = index === messages.length - 1;

              return (
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
                  <View style={styles.messageFooter}>
                    <Text style={styles.messageTime}>
                      {formatTime(item.timestamp)}
                      {item.sender === userId && isLastMessage && (
                        <Text style={styles.messageStatus}>
                          {" • "}
                          {item.readStatus && item.readStatus[receiverId]
                            ? "Read"
                            : "Delivered"}
                        </Text>
                      )}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
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
            editable={!isSending}
            onSubmitEditing={() => {
              if (!isSending && message.trim()) {
                sendMessage(message);
              }
            }}
            returnKeyType="send"
          />

          <Pressable
            style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
            onPress={() => {
              if (!isSending && message.trim()) {
                sendMessage(message);
              }
            }}
            disabled={isSending}
          >
            <Text style={styles.sendButtonText}>
              {isSending ? "Sending..." : "Send"}
            </Text>
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
    padding: 8,
    marginVertical: 2,
    marginHorizontal: 8,
    borderRadius: 16,
    maxWidth: "75%",
  },

  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0084ff", // Facebook Messenger blue
  },

  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#3a3b3c", // Darker gray for dark theme
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
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 2,
  },

  messageTime: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
  },

  messageStatus: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
  },
  sendButtonDisabled: {
    backgroundColor: "#2a5aa9",
    opacity: 0.7,
  },

  onlineStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  onlineDot: {
    backgroundColor: "#4CAF50", // Green for online
  },
  offlineDot: {
    backgroundColor: "#9e9e9e", // Grey for offline
  },
  headerSubtext: {
    color: "#aaaaaa",
    fontSize: 14,
  },

  onlineStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  onlineDot: {
    backgroundColor: "#4CAF50",
  },
  offlineDot: {
    backgroundColor: "#9e9e9e",
  },
  headerSubtext: {
    color: "#aaaaaa",
    fontSize: 14,
  },
});

export default ChatRoom;
