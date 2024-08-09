import React, { useState } from "react";
import LoginScreen from "./screens/authScreens/LoginScreen";
import SignUpScreen from "./screens/authScreens/SignUpScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabScreensContainer from "./screens/tabNavScreens/TabScreensContainer";
import BotChattingScreen from "./screens/chattingUIScreens/BotChattingScreen";
import ChattingList from "./screens/chattingUIScreens/ChattingList";
import CameraAccessScreen from "./screens/cameraAccess/CameraAccessScreen";
import OnBoardingScreen from "./screens/extras/OnBoarding";
import ViewAllScreen from "./screens/extras/ViewAllScreen";
import DoctorDetailPage from "./screens/extras/DoctorDetailPage";
import BookingScreen from "./screens/extras/BookingScreen";
import { ResultsScreen } from "./screens/extras/ResultsScreen";
import ChatRoom from "./screens/extras/ChatRoom";

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
        name="TabScreensContainer"
        options={{ headerShown: false }}
        component={TabScreensContainer}
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
        name="ViewAll"
        options={{ headerShown: false }}
        component={ViewAllScreen}
      />

      <Stack.Screen
        name="DoctorDetail"
        options={{ headerShown: false }}
        component={DoctorDetailPage}
      />

      <Stack.Screen
        name="ChatList"
        options={{ headerShown: false }}
        component={ChattingList}
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
