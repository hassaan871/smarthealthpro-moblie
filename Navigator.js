import React, { useState } from "react";
import LoginScreen from "./screens/authScreens/LoginScreen";
import SignUpScreen from "./screens/authScreens/SignUpScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BotChattingScreen from "./screens/chattingUIScreens/BotChattingScreen";
import CameraAccessScreen from "./screens/cameraAccess/CameraAccessScreen";
import OnBoardingScreen from "./screens/extras/OnBoarding";
import DoctorDetailPage from "./screens/extras/DoctorDetailPage";
import BookingScreen from "./screens/extras/BookingScreen";
import { ResultsScreen } from "./screens/extras/ResultsScreen";
import ChatRoom from "./screens/extras/ChatRoom";
import HomeScreen from "./screens/tabNavScreens/HomeScreen";
import CutomBottomBar from "./screens/tabNavScreens/CutomBottomBar";
import ChatsScreen from "./screens/extras/ChatScreen";
import SettingScreen from "./screens/tabNavScreens/Settings";
import AppointmentsScreen from "./screens/AppointmentsScreen";

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OnBoarding"
        options={{ headerShown: false }}
        component={OnBoardingScreen}
      />

      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
        component={LoginScreen}
      />

      <Stack.Screen
        name="SignUp"
        options={{ headerShown: false }}
        component={SignUpScreen}
      />
      <Stack.Screen
        name="HomeScreen"
        options={{ headerShown: false, animationEnabled: false }}
        component={HomeScreen}
      />
      <Stack.Screen
        name="CutomBottomBar"
        options={{ headerShown: false }}
        component={CutomBottomBar}
      />
      <Stack.Screen
        name="ResultsScreen"
        options={{ headerShown: false }}
        component={ResultsScreen}
      />
      <Stack.Screen
        name="BookingScreen"
        options={{ headerShown: false }}
        component={BookingScreen}
      />


      <Stack.Screen
        name="DoctorDetail"
        options={{ headerShown: false }}
        component={DoctorDetailPage}
      />

      <Stack.Screen
        name="BotChattingScreen"
        options={{ headerShown: false }}
        component={BotChattingScreen}
      />

      <Stack.Screen
        name="CameraAccessScreen"
        options={{ headerShown: false }}
        component={CameraAccessScreen}
      />

      <Stack.Screen
        name="ChatRoom"
        options={{ headerShown: true }}
        component={ChatRoom}
      />
      <Stack.Screen
        name="ChatsScreen"
        options={{ headerShown: false, animationEnabled: false }}
        component={ChatsScreen}
      />
      <Stack.Screen
        name="SettingScreen"
        options={{ headerShown: false, animationEnabled: false }}
        component={SettingScreen}
      />
      <Stack.Screen
        name="AppointmentsScreen"
        options={{ headerShown: false, animationEnabled: false }}
        component={AppointmentsScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
