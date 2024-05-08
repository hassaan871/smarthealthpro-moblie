import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import lightTheme from "../../Themes/LightTheme";
import HomeScreen from "../tabNavScreens/HomeScreen";
import Settings from "../tabNavScreens/Settings";
import { Pressable, View } from "react-native";
import ChattingList from "../chattingUIScreens/ChattingList";
import CameraAccessScreen from "../cameraAccess/CameraAccessScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

const TabScreensContainer = ({ navigation }) => {
  const [active, setActive] = useState("Home"); // Initialize active tab to "Home"
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: lightTheme.colors.homeActiveTabColor,
        tabBarInactiveTintColor: lightTheme.colors.homeIconColor,
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: {
          display: active === route.name ? "flex" : "none",
        },
        tabBarStyle: {},
        tabBarButton: (props) => (
          <Pressable
            {...props}
            onPress={() => {
              navigation.navigate(route.name);
              setActive(route.name);
            }}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            activeOpacity={1} // Finish default opacity effect
          ></Pressable>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Chat") {
            iconName = "chat";
          } else if (route.name === "Settings") {
            iconName = "settings";
          } else if (route.name === "Camera") {
            iconName = "camera";
          }

          if (route.name === "Chat") {
            return <Icon name={iconName} size={size} color={color} />;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChattingList} />

      <Tab.Screen name="Settings" component={Settings} />
      {/* <Tab.Screen name="Camera" component={CameraAccessScreen} /> */}
    </Tab.Navigator>
  );
};

export default TabScreensContainer;
