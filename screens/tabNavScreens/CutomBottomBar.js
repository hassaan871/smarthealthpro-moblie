import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CutomBottomBar = ({ active }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          navigation.navigate("HomeScreen");
        }}
      >
        <Icon
          name="home"
          size={24}
          color={active === "home" ? "#4A90E2" : "#666"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          navigation.navigate("AppointmentsScreen");
        }}
      >
        <Icon
          name="calendar-outline"
          size={24}
          color={active === "appointments" ? "#4A90E2" : "#666"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          navigation.navigate("ChatsScreen");
        }}
      >
        <Icon
          name="chatbox-outline"
          size={24}
          color={active === "chat" ? "#4A90E2" : "#666"}
        />
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          navigation.navigate("SettingScreen");
        }}
      >
        <Icon
          name="camera"
          size={24}
          color={active === "setting" ? "#4A90E2" : "#666"}
        />
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          navigation.navigate("SettingScreen");
        }}
      >
        <Icon
          name="settings-outline"
          size={24}
          color={active === "setting" ? "#4A90E2" : "#666"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#3C3C3E",
  },
  navItem: {
    alignItems: "center",
  },
});

export default CutomBottomBar;
