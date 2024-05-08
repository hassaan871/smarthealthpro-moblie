import React, { useState, useRef, useContext } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Text
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import loginLogo from "../../assets/loginLogo.jpg";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/AntDesign";
// import CookieManager from 'react-native-cookies';
import Context from "../../Helper/context";
import lightTheme from "../../Themes/LightTheme";
import Alert from "../../components/Alert";

const LoginScreen = () => {
  const { setToken,setUserName,setEmailGlobal,setAvatar,setId } = useContext(Context);

  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // success or error

  const handleDismissAlert = () => {
    setShowAlert(false);
  };

  const navigateToHomeTab = () => {
    navigation.navigate("TabScreensContainer");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://192.168.100.81/user/login", {
        email,
        password,
      });
      // console.log("red", res);
      if (res.status === 200) {
        const data = res.data;
        const {name, token, email, role, avatar, id} = data;

        setId(id);
        setEmailGlobal(email);
        setToken(token);
        setUserName(name);
        setAvatar(avatar);

        setShowAlert(true);
        setAlertType("success");
        setAlertMessage("Login successful!");

        if (res.data.role === "doctor") {
          // await navigate('/admin');
          await navigateToHomeTab();
        } else if (res.data.role === "patient") {
          // await navigate('/');
          await navigateToHomeTab();
        }
      }
    } catch (error) {
      // alert(error.response.data.error);
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage("Login failed. Please try again.");
     
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
                navigation.navigate("SignUp");
              }}
            >
              <Text style={styles.forgotPassword}>Forgot?</Text>
            </Pressable>
          </View>
        </View>

        <Alert visible={showAlert} onDismiss={handleDismissAlert} message={alertMessage} type={alertType} />
        
        <Pressable style={styles.loginButton} onPress={handleSubmit}>
          <Text style={styles.loginText}>Login</Text>
        </Pressable>
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
    backgroundColor: "#f0f4f8",
  },
  card: {
    backgroundColor: "#fff",
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
    color: "#4a5568",
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
    backgroundColor: "#edf2f7",
    borderColor: "#cbd5e0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#2d3748",
  },
  iconButton: {
    position: "absolute",
    right: 10,
    top: "13%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#3182ce",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: lightTheme.colors.primaryBtn,
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
    color: "#718096",
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
