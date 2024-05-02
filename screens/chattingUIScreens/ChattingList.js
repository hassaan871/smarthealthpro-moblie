import React from 'react';
import { View, FlatList, Text, Image, StyleSheet,TouchableOpacity, ScrollView,TextInput } from 'react-native';
import loginLogo from "../../assets/loginLogo.jpg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import lightTheme from "../../Themes/LightTheme";
import ChatHeader from './components/ChatHeader';


const ChatListItem = ({ name, lastMessage, time }) => {
  const navigation = useNavigation();
  return (
      <TouchableOpacity onPress={() => navigation.navigate("BotChattingScreen")}>
          <View style={styles.itemContainer}>
          <View style={styles.avatarContainer}>
            <Image source={loginLogo} style={styles.avatar} />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.nameTimeContainer}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.time}>{time}</Text>
            </View>
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{lastMessage}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
  );
};

const ChatList = () => {
  const data = [
    { id: '1', name: 'John', lastMessage: 'Hey there!', time: '10:00 AM' },
    { id: '2', name: 'Jane', lastMessage: 'How are you?', time: '11:30 AM' },
    { id: '3', name: 'John', lastMessage: 'Hey there!', time: '10:00 AM' },
    { id: '4', name: 'Jane', lastMessage: 'How are you?', time: '11:30 AM' },
    // Add more data as needed
  ];

  return (
    <SafeAreaView>
      <ChatHeader icons={false} title={"dummy title"} />
      <TextInput
      style={styles.searchInput}
      placeholder="Search for conversations"
      placeholderTextColor="#999"
    />
      <Text style={styles.title}>Messages</Text>

      <ScrollView>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <ChatListItem
              name={item.name}
              lastMessage={item.lastMessage}
              time={item.time}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight:"700",
    // marginLeft: 16,
    margin: 16,

  },
  itemContainer: {
    flexDirection: 'row',
    padding:12
  },
  avatarContainer: {
    marginRight: 6,
    // paddingLeft: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  textContainer: {
    flex: 1,
  },
  nameTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    // paddingRight: 16,
    marginTop:8,
    fontSize: 12,
    color: '#999',
  },
  messageContainer: {
    paddingTop: 1,
  },
  message: {
    fontSize: 16,
    color: '#999',
  },
  searchInput: {
    height: 48,
    backgroundColor: lightTheme.colors.homeSearchInputColor,
    alignSelf:"center",
    borderRadius: 12,
    marginTop: 10,
    paddingHorizontal: 20,
    width: "92%",
    // backgroundColor:"red",
    fontSize: 16,
  },
});


export default ChatList;
