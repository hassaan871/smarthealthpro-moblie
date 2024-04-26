import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React from 'react';
import BotChattingScreen from "./screens/chattingUI/BotChattingScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BotChattingScreen">
        <Stack.Screen name="BotChattingScreen" component={BotChattingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
