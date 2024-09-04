import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import Chat from "./Chat";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Context from "../../Helper/context";
import CutomBottomBar from "../tabNavScreens/CutomBottomBar";
import DialogflowModal from "../../components/DialogFlowModal";

const ChatsScreen = () => {
  const [options, setOptions] = useState(["Chats"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [chats, setChats] = useState([]);
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const modalSearchInputRef = useRef(null);
  const { userInfo } = useContext(Context);
  const navigation = useNavigation();

  useEffect(() => {
    console.log("fetch chats");

    const fetchChats = async () => {
      console.log("userinfo id: ", userInfo);
      try {
        const response = await axios.get(
          `http://192.168.18.124:5000/conversations/${userInfo?._id}`
        );
        console.log("fetched chats 2332: ", response.data);

        const formattedChats = response.data.map((chat) => {
          const participantIndex = chat.participants.indexOf(userInfo?._id);
          const avatar =
            participantIndex === 0 ? chat.avatar[1] : chat.avatar[0];
          const name = participantIndex === 0 ? chat.name[1] : chat.name[0];

          const receiverID =
            participantIndex === 0
              ? chat.participants[1]
              : chat.participants[0];

          const formattedTime = new Date(chat.updatedAt).toLocaleString(
            "en-US",
            {
              timeZone: "Asia/Karachi",
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }
          );

          console.log("formatted time: ", formattedTime);

          return {
            convoID: chat._id,
            name: name,
            lastMessage: chat.lastMessage,
            avatar: avatar,
            receiverId: receiverID,
            time: formattedTime,
          };
        });

        console.log("for 0: ", formattedChats);
        setChats(formattedChats);
        setSearchResults(formattedChats);
      } catch (error) {
        console.log("error fetching chat: ", error);
      }
    };

    fetchChats();
  }, [userInfo?._id]);

  const chooseOption = (option) => {
    if (options.includes(option)) {
      setOptions(options.filter((c) => c !== option));
    } else {
      setOptions([...options, option]);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    console.log("chat ka 0th: ", chats[0]);
    const filteredResults = chats.filter((item) => {
      return item?.name?.toLowerCase()?.includes(query?.toLowerCase());
    });
    console.log("search result ka 0th: ", filteredResults[0]);
    console.log("filtered result ka pura: ", filteredResults);
    setSearchResults(filteredResults);
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable>
            <Image
              style={styles.avatar}
              source={{
                uri: "https://lh3.googleusercontent.com/ogw/AF2bZyi09EC0vkA0pKVqrtBq0Y-SLxZc0ynGmNrVKjvV66i3Yg=s64-c-mo",
              }}
            />
          </Pressable>

          <Text style={styles.headerTitle}>Chats</Text>

          <View style={styles.headerIcons}>
            <AntDesign name="camerao" size={26} color="white" />
            <MaterialIcons
              onPress={() => navigation.navigate("People")}
              name="person-outline"
              size={26}
              color="white"
            />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for chats"
            placeholderTextColor="#999"
            onFocus={() => setIsBottomBarVisible(false)}
            onBlur={() => setIsBottomBarVisible(true)}
            onChangeText={handleSearch}
          />

          <Icon
            name="search"
            size={24}
            color="#999"
            style={styles.searchIcon}
          />
        </View>
        {isBottomBarVisible && (
          <Chat
            item={{
              name: "ChatBot",
              avatar:
                "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
              lastMessage: "Chat with bot",
            }}
            isSearch={false}
            isBotChat={true}
          />
        )}

        <View style={styles.contentContainer}>
          <Pressable
            onPress={() => chooseOption("Chats")}
            style={styles.optionHeader}
          >
            <Text style={styles.optionText}>Chats</Text>
            <Entypo name="chevron-small-down" size={26} color="white" />
          </Pressable>

          <View>
            {options?.includes("Chats") && (
              <View>
                {chats.length > 0 ? (
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item?._id}
                    renderItem={({ item }) => (
                      <Chat item={item} isSearch={false} />
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }} // Optional padding
                  />
                ) : (
                  <View style={styles.emptyChatsContainer}>
                    <Text style={styles.emptyChatsText}>No Chats yet</Text>
                    <Text style={styles.emptyChatsSubText}>
                      Get started by messaging a friend
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setModalVisible2(true)}
        >
          <Icon name="chat" size={30} color="#fff" />
        </TouchableOpacity>

        <DialogflowModal
          visible={modalVisible2}
          onClose={() => setModalVisible2(false)}
        />
      </SafeAreaView>
      {isBottomBarVisible && <CutomBottomBar active={"chat"} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchContainer: {
    padding: 16,
    position: "relative",
  },
  searchInput: {
    height: 48,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    paddingLeft: 40,
    fontSize: 16,
    color: "white",
  },
  searchIcon: {
    position: "absolute",
    top: 27,
    left: 27,
  },
  contentContainer: {
    padding: 10,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  optionText: {
    color: "white",
  },
  emptyChatsContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyChatsText: {
    textAlign: "center",
    color: "gray",
  },
  emptyChatsSubText: {
    marginTop: 4,
    color: "gray",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  modalSearchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingLeft: 40,
    fontSize: 16,
    marginLeft: 10,
    color: "white",
  },
  modalSearchIcon: {
    position: "absolute",
    left: 60,
  },
  chatButton: {
    position: "absolute",
    bottom: 20,
    right: 10,
    backgroundColor: "#007bff",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default ChatsScreen;
