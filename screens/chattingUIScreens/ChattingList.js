import React from 'react';
import { View, FlatList, Text, Image, StyleSheet,TouchableOpacity, ScrollView } from 'react-native';
import loginLogo from "../../assets/loginLogo.jpg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const ChatListItem = ({ name, lastMessage, time }) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
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
    </SafeAreaView>
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
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  avatarContainer: {
    marginRight: 6,
    paddingLeft: 10,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  time: {
    paddingRight: 16,
    marginTop:8,
    fontSize: 14,
  },
  messageContainer: {
    paddingTop: 1,
  },
  message: {
    fontSize: 16,
  },
});


export default ChatList;
