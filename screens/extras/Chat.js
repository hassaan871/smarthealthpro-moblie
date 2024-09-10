import React, { useEffect, useState, useContext } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Context from "../../Helper/context";

const Chat = ({ item, isBotChat }) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const { userInfo } = useContext(Context);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const userId = await AsyncStorage.getItem("userToken");
  //     setUserId(userId);
  //   };

  //   fetchUser();
  // }, []);

  // const fetchMessages = async () => {
  //   try {
  //     const senderId = userId;
  //     const receiverId = item?._id;

  //     console.log(senderId);
  //     console.log(receiverId);

  //     const response = await axios.get("http://192.168.18.124:8000/messages", {
  //       params: { senderId, receiverId },
  //     });

  //     setMessages(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // console.log("messages", item.lastMessage);

  // useEffect(() => {
  //   fetchMessages();
  // }, []);

  // const getLastMessage = () => {
  //   const n = messages.length;

  //   return messages[n - 1];
  // };
  // const lastMessage = getLastMessage();

  // useEffect(() => {
  //   console.log("coming from useeffect");
  //   console.log("reciever avatar: ", item.recieverAvatar);
  //   console.log("receiver Name: ", item.receiverName);
  //   console.log("lastMessage: ", item.lastMessage);
  //   console.log("updatedAt: ", item.updatedAt);
  // }, []);

  const handleChatPress = async () => {
    try {
      // const currentUserId = userInfo?._id;
      // const otherUserId = "ChatBot";

      // console.log("current user: ", currentUserId);
      // console.log("other user: ", otherUserId);

      console.log(`creating chat btw ${currentUserId} and ${otherUserId}`);
      // Make a POST request to create or retrieve a conversation
      const response = await axios.post(
        "http://192.168.18.124:5000/conversations",
        {
          currentUserId,
          otherUserId,
          currentUserObjectIdAvatar: userInfo?.avatar,
          otherUserObjectIdAvatar:
            "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
          currentUserObjectIdName: userInfo?.fullName,
          otherUserObjectIdName: "ChatBot",
        }
      );

      // const conversationId = response.data?._id;
      // console.log("convo created successfully with id: ", conversationId);
      navigation.navigate("BotChattingScreen");
      // Navigate to the ChatScreen with the conversationId
      // navigation.navigate("ChatRoom", {
      //   name: "ChatBot",
      //   image:
      //     "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
      //   convoID: conversationId,
      //   receiverId: "ChatBot",
      // });
    } catch (error) {
      console.error("Error creating or retrieving conversation:", error);
    }
  };

  useEffect(() => {
    console.log("item from chats234: ", item);
  }, [item]);

  return (
    <Pressable
      onPress={() => {
        console.log("Item clicked on 1: ", item);
        // console.log("item's recieverid: ", item?.receiverId);

        if (isBotChat) {
          console.log("Entering bot chat");
          handleChatPress();
        } else {
          navigation.navigate("ChatRoom", {
            name: item?.name,
            image: item?.avatar,
            convoID: item?.convoID,
            receiverId: item?.receiverId,
          });
        }
      }}
    >
      <View style={styles.container}>
        {/* Profile Picture */}
        <Image source={{ uri: item.avatar }} style={styles.avatar} />

        {/* Chat Info */}
        <View style={styles.chatInfo}>
          {/* Full Name */}
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          {/* Last Message */}
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>

        {/* Time */}
        <Text style={styles.timestamp}>{item?.time}</Text>
      </View>
    </Pressable>
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
});

export default Chat;
