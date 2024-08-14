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
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import Chat from "./Chat";
import Icon from "react-native-vector-icons/MaterialIcons";
import lightTheme from "../../Themes/LightTheme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userInfo } from "../tabNavScreens/HomeScreen";

const ChatsScreen = () => {
  const [options, setOptions] = useState(["Chats"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [chats, setChats] = useState([]);
  const modalSearchInputRef = useRef(null);
  const navigation = useNavigation();

  // useEffect(() => {
  //   const fetchChats = async () => {
  //     try {
  //       const userId = await AsyncStorage.getItem("userToken");
  //       const response = await axios.get(
  //         `http://192.168.18.124:5000/chats/chats/user/${userId}`
  //       );
  //       const transformedChats = response.data.map((chat) => {
  //         const receiverId = chat.users[1];
  //         // console.log("reciever id: ", receiverId);
  //         // console.log("chat id: ", chat._id);
  //         // console.log("reciever avatar: ", chat.recieverAvatar);
  //         // console.log("receiver Name: ", chat.receiverName);
  //         // console.log("lastMessage: ", chat.lastMessage);
  //         // console.log("updatedAt: ", chat.updatedAt);
  //         return {
  //           chatId: chat._id,
  //           receiverId,
  //           receiverName: chat.receiverName,
  //           recieverAvatar: chat.recieverAvatar,
  //           lastMessage: chat.lastMessage,
  //           updatedAt: chat.updatedAt,
  //         };
  //       });
  //       setChats(transformedChats);
  //     } catch (error) {
  //       console.error("Error fetching chats:", error);
  //     }
  //   };

  //   fetchChats();
  // }, []);

  useEffect(() => {
    console.log("fetch chats");

    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `http://192.168.18.124:5000/conversations/${userInfo?._id}`
        );
        console.log("fetched chats: ", response.data[0]);

        const convoID = response.data[0]?._id;
        console.log("res; ", response.data);
        console.log("convo id: ", convoID);

        // Map the response data to the desired format
        const formattedChats = response.data.map((chat) => {
          // Find the index of userInfo._id in the participants array
          const participantIndex = chat.participants.indexOf(userInfo?._id);
          const avatar =
            participantIndex === 0 ? chat.avatar[1] : chat.avatar[0];
          const name = participantIndex === 0 ? chat.name[1] : chat.name[0];

          const receiverID =
            participantIndex === 0
              ? chat.participants[1]
              : chat.participants[0];

          // Return the formatted chat object
          return {
            convoID,
            name: name,
            lastMessage: chat.lastMessage,
            avatar: avatar,
            receiverId: receiverID,
          };
        });

        // Now set the formatted data to state
        console.log("for 0: ", formattedChats[0]);
        setChats(formattedChats);
      } catch (error) {
        console.log("error fetching chat: ", error);
      }
    };

    fetchChats();
  }, [userInfo?._id]);

  // useEffect(() => {
  //   // Fetch all doctors when the component mounts
  //   const fetchDoctors = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://192.168.18.124:5000/user/getAllDoctors"
  //       );
  //       const doctorsData = response.data.doctors.map((doctor) => ({
  //         numPatients: doctor.numPatients,
  //         rating: doctor.rating,
  //         specialization: doctor.specialization,
  //         _id: doctor.user?._id, // user id for the doctor rahter than doctor id
  //         avatar: doctor.user?.avatar,
  //         name: doctor.user?.fullName,
  //       }));

  //       console.log("all doctor: ", doctorsData[0]);
  //       setDoctors(doctorsData);
  //       setSearchResults(doctorsData);
  //     } catch (error) {
  //       console.error("Error fetching doctors:", error);
  //     }
  //   };

  //   fetchDoctors();
  // }, []);

  useEffect(() => {
    console.log("search results length: ", searchResults?.length);
    console.log("search results: ", searchResults);
  }, [searchResults]);

  const chooseOption = (option) => {
    if (options.includes(option)) {
      setOptions(options.filter((c) => c !== option));
    } else {
      setOptions([...options, option]);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      modalSearchInputRef.current.focus();
    }, 200); // Delay focusing to ensure modal animation is complete
  };

  const closeModal = () => {
    setSearchQuery("");
    setSearchResults([]);
    setModalVisible(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Perform search based on query
    const filteredResults = doctors.filter((item) => {
      // Convert the name to lowercase and check if it includes the search query
      return item?.name?.toLowerCase()?.includes(query?.toLowerCase());
    });
    setSearchResults(filteredResults);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <Pressable>
          <Image
            style={{ width: 30, height: 30, borderRadius: 15 }}
            source={{
              uri: "https://lh3.googleusercontent.com/ogw/AF2bZyi09EC0vkA0pKVqrtBq0Y-SLxZc0ynGmNrVKjvV66i3Yg=s64-c-mo",
            }}
          />
        </Pressable>

        <Text style={{ fontSize: 15, fontWeight: "500" }}>Chats</Text>

        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <AntDesign name="camerao" size={26} color="black" />
            <MaterialIcons
              onPress={() => navigation.navigate("People")}
              name="person-outline"
              size={26}
              color="black"
            />
          </View>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={{ ...styles.searchInput, paddingLeft: 40 }}
          placeholder="Search for doctors"
          placeholderTextColor="#999"
          onFocus={openModal}
        />
        <Icon
          name="search"
          size={24}
          color="#999"
          style={{ position: "absolute", top: 27, left: 27 }}
        />
      </View>
      <View style={{ padding: 10 }}>
        <Pressable
          onPress={() => chooseOption("Chats")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text>Chats</Text>
          </View>
          <Entypo name="chevron-small-down" size={26} color="black" />
        </Pressable>

        <View>
          {options?.includes("Chats") &&
            (chats.length > 0 ? (
              <View>
                {chats.map((item) => (
                  <Chat item={item} key={item?._id} isSearch={false} />
                ))}
              </View>
            ) : (
              <View
                style={{
                  height: 300,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ textAlign: "center", color: "gray" }}>
                    No Chats yet
                  </Text>
                  <Text style={{ marginTop: 4, color: "gray" }}>
                    Get started by messaging a friend
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </View>
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={closeModal}>
              <Icon name="arrow-back" size={24} color="#000" />
            </Pressable>

            <TextInput
              ref={modalSearchInputRef}
              style={{ ...styles.modalSearchInput, paddingLeft: 40 }}
              placeholder="Search for doctors"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <Icon
              name="search"
              size={24}
              color="#718096"
              style={{ position: "absolute", left: 60 }}
            />
          </View>

          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) => (
                <Chat item={item} key={item?._id} isSearch={true} />
              )}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    height: 48,
    backgroundColor: lightTheme.colors.homeSearchInputColor,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalSearchInput: {
    flex: 1,
    height: 40,
    backgroundColor: lightTheme.colors.homeSearchInputColor,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginLeft: 10,
  },
});
