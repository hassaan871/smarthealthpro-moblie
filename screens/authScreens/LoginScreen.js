import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Text,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import loginLogo from "../../assets/loginLogo.jpg";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/AntDesign";
import Context from "../../Helper/context";
import lightTheme from "../../Themes/LightTheme";
import Alert from "../../components/Alert";
import showAlertMessage from "../../Helper/AlertHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import DeviceInfo from "react-native-device-info";

const LoginScreen = () => {
  const { setToken, setUserName, setEmailGlobal, setAvatar, setId } =
    useContext(Context);

  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false); // Corrected typo
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // success or error
  const [alertActions, setAlertActions] = useState([]); // actions for alert buttons

  const handleDismissAlert = () => {
    setShowAlert(false);
  };

  const navigateToHomeTab = () => navigation.replace("HomeScreen");

  const getDeviceId = async () => {
    return await DeviceInfo.getUniqueId();
  };

  async function sendFcmTokenToServer(email, fcmToken, device) {
    try {
      const response = await axios.post(
        "http://192.168.1.160:5000/update-fcm-token",
        {
          email,
          fcmToken,
          device,
        }
      );
      console.log("FCM token update response:", response.data);
    } catch (error) {
      console.error("Error sending FCM token to server:", error);
    }
  }

  async function getFcmTokenAndSendToServer(email, device) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log("FCM Token:", fcmToken);
        await sendFcmTokenToServer(email, fcmToken, device);
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      showAlertMessage(
        setShowAlert,
        setAlertMessage,
        setAlertType,
        setAlertActions,
        "Please fill in both email and password.",
        "error"
      );
      setLoading(false); // Stop loading since validation failed
      return;
    }

    console.log("Entering handle submit");
    try {
      const res = await axios.post("http://192.168.1.160:5000/user/login", {
        email,
        password,
      });
      // console.log("red", res.data);
      if (res.status === 200) {
        const data = res.data;
        const { name, token, email, role, avatar, id } = data;

        // Save token to AsyncStorage
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userToken", id);
        console.log("user token: ", id);

        setId(id);
        setEmailGlobal(email);
        setToken(token);
        setUserName(name);
        setAvatar(avatar);

        const device = await getDeviceId();

        // Get FCM token and send to server
        await getFcmTokenAndSendToServer(email, device);

        showAlertMessage(
          setShowAlert,
          setAlertMessage,
          setAlertType,
          setAlertActions,
          "Login Success",
          "success",
          [{ text: "OK", onPress: navigateToHomeTab }]
        );
      }
    } catch (error) {
      // alert(error.response.data.error);
      showAlertMessage(
        setShowAlert,
        setAlertMessage,
        setAlertType,
        setAlertActions,
        "Login failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={loginLogo} style={styles.image} />
        </View>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={"#666"}
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={styles.input}
              secureTextEntry={!passwordVisible}
              placeholder="Enter your password"
              placeholderTextColor={"#666"}
              autoCapitalize="none"
              onChangeText={(text) => setPassword(text)}
            />
            <Pressable
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.iconButton}
            >
              <Ionicons
                name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#718096"
              />
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate("ForgotScreen");
              }}
            >
              <Text style={styles.forgotPassword}>forgot?</Text>
            </Pressable>
          </View>
        </View>

        <Alert
          visible={showAlert}
          onDismiss={handleDismissAlert}
          message={alertMessage}
          type={alertType}
          actions={alertActions}
        />

        <Pressable
          style={styles.loginButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </Pressable>
        {/*
        <Pressable onPress={() => navigateToHomeTab()}>
          <Text style={styles.orText}>Or, login with</Text>
        </Pressable>
        <View style={styles.socialButtons}>
          <Pressable style={styles.socialButton}>
 <Image
              source={{ uri: "https://placehold.co/32x32" }}
              style={styles.socialIcon}
            />
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Image
              source={{ uri: "https://placehold.co/32x32" }}
              style={styles.socialIcon}
            />
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Image
              source={{ uri: "https://placehold.co/32x32" }}
              style={styles.socialIcon}
            /> 
          </Pressable>
        </View>
        */}
        <Pressable
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text style={styles.registerText}>
            New to this platform? Register
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#E0F4FF",
    backgroundColor: "#000",
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 8,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: "#000",
    shadowOffset: { height: 0, width: 0 },
    width: "90%",
    maxWidth: 340,
  },
  imageContainer: {
    // marginBottom: 16,
    alignItems: "center",
  },
  image: {
    height: Dimensions.get("window").height / 2.8,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#4a5568",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderColor: "#cbd5e0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#fff",
  },
  iconButton: {
    position: "absolute",
    right: 10,
    top: "13%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#4A90E2",
    fontSize: 14,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  socialButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#edf2f7",
    marginHorizontal: 8,
  },
  socialIcon: {
    width: 32,
    height: 32,
  },
  registerText: {
    textAlign: "center",
    color: "#3182ce",
    fontSize: 14,
  },
});

export default LoginScreen;
