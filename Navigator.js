import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/FontAwesome5";
import lightTheme from "./Themes/LightTheme";
import BotChattingScreen from "./screens/chattingUI/BotChattingScreen";
import HomeScreen from "./screens/chattingUI/HomeScreen";
import Settings from "./screens/chattingUI/Settings";
import { TouchableOpacity, View } from "react-native";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [active, setActive] = useState("Home"); // Initialize active tab to "Home"
  return (
    <NavigationContainer>
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
            } else if (route.name === "Chat") {
              iconName = "robot";
            } else if (route.name === "Settings") {
              iconName = "settings";
            }

            if (route.name === "Chat") {
              return <Icon2 name={iconName} size={size} color={color} />;
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chat" component={BotChattingScreen} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
