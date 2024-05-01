import React, { useState } from "react";
import LoginScreen from "./screens/authScreens/LoginScreen";
import SignUpScreen from "./screens/authScreens/SignUpScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabScreensContainer from "./screens/tabNavScreens/TabScreensContainer";


const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen 
        name="Login" 
        options={{ headerShown: false }}
        component={LoginScreen} />

        <Stack.Screen 
        name="SignUp" 
        options={{ headerShown: false }}
        component={SignUpScreen} 
        />
        <Stack.Screen 
        name="TabScreensContainer"
        options={{ headerShown: false }}
        component={TabScreensContainer} />
      </Stack.Navigator>
  )
};

export default AppNavigator;
