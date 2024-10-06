import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Context from "../../Helper/context";
import {
  GestureHandlerRootView,
  GestureDetector,
  Swipeable,
} from "react-native-gesture-handler";

const Chat = ({ item, isBotChat }) => {
  const navigation = useNavigation();
  const { userInfo } = useContext(Context);

  const handleChatPress = async () => {
    try {
      // Navigate to your chatbot screen
      navigation.navigate("BotChattingScreen", {
        botName: "ChatBot",
      });
    } catch (error) {
      console.error("Error navigating to bot chat:", error);
    }
  };

  const handleDelete = async () => {
    console.log(`Attempting to delete conversation with ID: ${item.convoID}`);
    try {
      const response = await axios.delete(
        `http://192.168.1.35:5000/chats/deleteChat/${item.convoID}`
      );
      if (response.status === 200) {
        console.log("Conversation deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      Alert.alert(
        "Error",
        "Failed to delete conversation. Please try again later."
      );
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this conversation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Delete", onPress: handleDelete },
      ]
    );
  };

  const renderRightActions = () => {
    return (
      <Pressable onPress={confirmDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <Pressable
          onPress={() => {
            if (isBotChat) {
              handleChatPress();
            } else {
              navigation.navigate("ChatRoom", {
                item,
                convoID: item?.convoID,
                receiverId: item?.receiverId,
              });
            }
          }}
        >
          <View style={styles.container}>
            <Image
              source={{
                uri:
                  item?.avatar?.url?.length > 0
                    ? item?.avatar?.url
                    : item?.avatar,
              }}
              style={styles.avatar}
            />
            <View style={styles.chatInfo}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            <Text style={styles.timestamp}>{item?.time}</Text>
          </View>
        </Pressable>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2C2C2E",
    borderRadius: 13,
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  lastMessage: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "80%",
    marginHorizontal: 4,
    borderRadius: 12,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Chat;
