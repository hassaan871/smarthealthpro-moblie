import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/FontAwesome5";
import lightTheme from "../../Themes/LightTheme";
import BotChattingScreen from '../chattingUIScreens/BotChattingScreen';
import HomeScreen from "../tabNavScreens/HomeScreen";
import Settings from "../tabNavScreens/Settings";
import { TouchableOpacity, View } from "react-native";
import ChattingList from "../chattingUIScreens/ChattingList";
const Tab = createBottomTabNavigator();
const TabScreensContainer = ({ navigation }) => {
  const [active, setActive] = useState("Home"); // Initialize active tab to "Home"
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarActiveTintColor: lightTheme.colors.homeActiveTabColor,
        tabBarInactiveTintColor: lightTheme.colors.homeIconColor,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {},
        tabBarButton: (props) => (
          <TouchableOpacity
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
          >
            {props.children}
            {active === route.name && (
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor: "black",
                  marginTop: 4,
                }}
              />
            )}
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "ChatList") {
            iconName = "robot";
          } else if (route.name === "Settings") {
            iconName = "settings";
          }

          if (route.name === "ChatList") {
            return <Icon2 name={iconName} size={size} color={color} />;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ChatList" component={ChattingList} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default TabScreensContainer;
