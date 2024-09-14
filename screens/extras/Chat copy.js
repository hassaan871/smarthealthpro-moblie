import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Context from "../../Helper/context";

const Chat = ({ item, isSearch, isBotChat }) => {
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

  //     const response = await axios.get("http://192.168.100.133:8000/messages", {
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

  const handleChatPress = async (item) => {
    try {
      const currentUserId = userInfo?._id;
      const otherUserId = item?._id;

      console.log("current user: ", userInfo);
      console.log("other user: ", item);

      console.log(`creating chat btw ${currentUserId} and ${otherUserId}`);
      // Make a POST request to create or retrieve a conversation
      const response = await axios.post(
        "http://192.168.100.133:5000/conversations",
        {
          currentUserId,
          otherUserId,
          currentUserObjectIdAvatar: userInfo?.avatar,
          otherUserObjectIdAvatar: item?.avatar,
          currentUserObjectIdName: userInfo?.fullName,
          otherUserObjectIdName: item?.name,
        }
      );

      const conversationId = response.data?._id;
      console.log("convo created successfully with id: ", conversationId);
      // Navigate to the ChatScreen with the conversationId
      navigation.navigate("ChatRoom", {
        name: item?.name,
        image: item?.avatar,
        convoID: conversationId,
      });
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
        console.log("item clicked on: ", item);
        console.log("item's recieverid: ", item?.receiverId);

        if (isBotChat) {
          console.log("Entering bot chat");
          navigation.navigate("BotChattingScreen");
        } else {
          navigation.navigate("ChatRoom", {
            name: item?.name,
            image: item?.avatar,
            convoID: item?.convoID,
            receiverId: item?.receiverId,
          });
        }
      }}
      style={{ marginVertical: 15 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Pressable>
          <Image
            source={{ uri: item?.avatar }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.name}</Text>
          <Text style={{ marginTop: 4, color: "gray" }}>
            {isSearch ? item.specialization : item.lastMessage}
          </Text>
        </View>
        {isSearch && (
          <Pressable
            style={styles.chatButton}
            onPress={() => {
              console.log("item clicked on: ", item);
              handleChatPress(item);
            }}
          >
            <Text style={styles.chatButtonText}>Chat</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default Chat;

const styles = StyleSheet.create({
  chatButton: {
    backgroundColor: "blue",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 20,
  },
  chatButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
