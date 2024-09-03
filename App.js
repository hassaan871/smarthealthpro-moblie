import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeContext } from "./Helper/ThemeContext";
import { MyContextProvider } from "./Helper/context";
import { PaperProvider, adaptNavigationTheme } from "react-native-paper";
import darkTheme from "./Themes/DarkTheme";
import lightTheme from "./Themes/LightTheme";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from "deepmerge";
import { RootSiblingParent } from "react-native-root-siblings";
import LoginScreen from "./screens/authScreens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./Navigator"; // Import the AppNavigator
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SocketContextProvider } from "./SocketContext"; // Import your SocketContextProvider

export default function App() {
  const [isThemeDark, setIsThemeDark] = useState(false);

  let myTheme = isThemeDark ? darkTheme : lightTheme;
  let navTheme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = merge(lightTheme, LightTheme);
  const CombinedDarkTheme = merge(darkTheme, DarkTheme);

  useEffect(() => {
    const loadThemeFromStorage = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("isThemeDark");
        if (savedTheme !== null) {
          setIsThemeDark(savedTheme === "true");
        }
      } catch (error) {}
    };

    loadThemeFromStorage();
  }, []);

  const toggleTheme = useCallback(async () => {
    const newIsThemeDark = !isThemeDark;
    try {
      await AsyncStorage.setItem("isThemeDark", newIsThemeDark.toString());
      setIsThemeDark(newIsThemeDark);
    } catch (error) {}
  }, [isThemeDark]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  return (
    <RootSiblingParent>
      <ThemeContext.Provider value={preferences}>
        <SafeAreaProvider>
          <PaperProvider
            settings={{
              rippleEffectEnabled: true,
            }}
            theme={myTheme}
          >
            <MyContextProvider>
              <SocketContextProvider>
                <NavigationContainer theme={navTheme}>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <AppNavigator />
                  </GestureHandlerRootView>
                </NavigationContainer>
              </SocketContextProvider>
            </MyContextProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </ThemeContext.Provider>
    </RootSiblingParent>
  );
}
