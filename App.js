import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
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
import messaging from "@react-native-firebase/messaging";
import axios from "axios"; // Make sure to install axios if you haven't already
import { Platform, PermissionsAndroid, Alert } from "react-native";
import PushNotification from "react-native-push-notification";
import { createNavigationContainerRef } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {
  const [isThemeDark, setIsThemeDark] = useState(false);
  const navigationRef = createNavigationContainerRef();

  async function requestAndroidNotificationPermission() {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Android notification permission granted");
          return true;
        } else {
          console.log("Android notification permission denied");
          return false;
        }
      } catch (err) {
        console.warn("Error requesting Android notification permission:", err);
        return false;
      }
    }
    return true; // Return true for Android versions < 33 as permission is granted by default
  }

  async function checkNotificationPermissions() {
    // Firebase check
    const firebaseStatus = await messaging().hasPermission();
    console.log("Firebase permission status:", firebaseStatus);

    // Platform-specific checks
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      console.log("Android native permission granted:", granted);
    }

    // Detailed Firebase status
    switch (firebaseStatus) {
      case messaging.AuthorizationStatus.AUTHORIZED:
        console.log("Firebase: User has notification permissions enabled.");
        break;
      case messaging.AuthorizationStatus.PROVISIONAL:
        console.log("Firebase: User has provisional notification permissions.");
        break;
      case messaging.AuthorizationStatus.NOT_DETERMINED:
        console.log(
          "Firebase: User has not yet been asked for notification permissions."
        );
        break;
      case messaging.AuthorizationStatus.DENIED:
        console.log("Firebase: User has notification permissions disabled.");
        break;
    }
  }

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  async function requestUserPermission() {
    try {
      console.log("Requesting notification permissions...");

      if (Platform.OS === "ios") {
        const authStatus = await messaging().requestPermission({
          alert: true,
          announcement: false,
          badge: true,
          carPlay: false,
          provisional: false,
          sound: true,
        });
        if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
          console.log("User has notification permissions enabled.");
        } else if (authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
          console.log("User has provisional notification permissions.");
        } else {
          console.log("User has notification permissions disabled");
        }
      } else {
        if (Platform.OS === "android") {
          const androidPermissionGranted =
            await requestAndroidNotificationPermission();
          if (!androidPermissionGranted) {
            console.log("Android notification permission not granted");
            return false;
          }
        }

        const authStatus = await messaging().requestPermission();
        console.log("FCM authorization status:", authStatus);

        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      }
    } catch (error) {
      console.error("Error in requestUserPermission:", error);
      return false;
    }
  }

  PushNotification.configure({
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
    onNotification: async function (notification) {
      console.log("NOTIFICATION:", notification);

      if (notification.userInteraction) {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken && navigationRef.isReady()) {
          console.log("Navigating from onNotification handler");
          navigationRef.navigate("ChatsScreen");
        }
      }
    },
    popInitialNotification: true,
    requestPermissions: true,
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  });

  useEffect(() => {
    requestUserPermission();

    // For foreground notifications
    // Also modify your foreground notification:
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground message received:", remoteMessage);

      PushNotification.localNotification({
        channelId: "default",
        title: remoteMessage.notification?.title,
        message: remoteMessage.notification?.body,
        playSound: true,
        importance: "high",
        priority: "high",
        userInteraction: true,
        data: remoteMessage.data, // Pass through the data
        // Remove onPress from here as it's handled in onNotification above
      });
    });

    // For background notifications
    messaging().onNotificationOpenedApp((remoteMessage) => {
      AsyncStorage.getItem("userToken").then((userToken) => {
        if (userToken) {
          setTimeout(() => {
            if (navigationRef.isReady()) {
              navigationRef.navigate("ChatsScreen");
            }
          }, 1000);
        }
      });
    });

    // For quit state notifications
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          AsyncStorage.getItem("userToken").then((userToken) => {
            if (userToken) {
              setTimeout(() => {
                if (navigationRef.isReady()) {
                  navigationRef.navigate("ChatsScreen");
                }
              }, 1000);
            }
          });
        }
      });

    return unsubscribe;
  }, []);

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

  const STRIPE_KEY =
    "pk_test_51RAdPhFSalvX5ARZjMI5rckxLWIhQdVmyU3qjGKsSbarCJNgBeaEPBFBfPuvA50bnrNNSJMO7cPGBjlG2HUgKWO400zScCjlrg";

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
                <NavigationContainer ref={navigationRef} theme={navTheme}>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <StripeProvider publishableKey={STRIPE_KEY}>
                      <AppNavigator />
                    </StripeProvider>
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
