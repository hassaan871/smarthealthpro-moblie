import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
} from "react-native";
import signupLogo from "../../assets/signupLogo.jpg";
import checked from "../../assets/checked.png";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Context from "../../Helper/context";
import lightTheme from "../../Themes/LightTheme";
import Alert from "../../components/Alert";

const SignUpScreen = ({ navigation }) => {
  // const { setToken, setUser } = useContext(Context);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [dateOfBirth, setdateOfBirth] = useState(12);
  const [bloodType, setBloodType] = useState("B+");
  const [role, setRole] = useState("patient");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // success or error

  const navigate = useNavigation();

  const handleDismissAlert = () => {
    setShowAlert(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage("Please Fill all fields");
      return;
    }
    console.log("Form data:", { name, email, password, role });

    axios
      .post("http://192.168.100.81/user/register", {
        name,
        email,
        password,
        dateOfBirth,
        bloodType,
        role,
      })
      .then((res) => {
        console.log("Response:", res);
        // setUser(res.data);
        setModalVisible(true);
      })
      .catch((error) => {
        console.log("Error:", error);
        setShowAlert(true);
        setAlertType("error");
        setAlertMessage("Some error occured during registration. Please try again later.");
        if (error.response) {
          console.log("Server Error:", error.response.data);
          alert(error.response.data.error);
        } else if (error.request) {
          console.log("Request Error:", error.request);
        } else {
          console.log("Error Message:", error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={signupLogo} style={styles.image} />
        </View>
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Full Name"
            onChangeText={(text) => setName(text)}
            style={styles.input}
          />
          {/* <TextInput placeholder="Date of Birth" style={styles.input} /> */}
          <TextInput
            placeholder="Email address"
            keyboardType="email-address"
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          {/* <TextInput
            placeholder="Blood Type"
            style={styles.input}
            onChangeText={(text) => setBloodType(text)}
          /> */}
          {/* <TextInput
            placeholder="Date of Birth"
            style={styles.input}
            onChangeText={(text) => setdateOfBirth(text)}
          /> */}
        </View>

        <Alert visible={showAlert} onDismiss={handleDismissAlert} message={alertMessage} type={alertType} />

        <Pressable
          // () => setModalVisible(true)
          onPress={handleSubmit}
          style={styles.loginButton}
        >
          <Text style={styles.loginText}>Sign Up</Text>
        </Pressable>
        <Text style={styles.orText}>Or, sign up with</Text>
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
            navigation.navigate("Login");
          }}
        >
          <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 5 }}>
            Already have an account?{" "}
            <Text style={{ fontWeight: "bold", color: "#3182ce" }}>Login</Text>
          </Text>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={checked}
              style={{ width: 100, height: 100, marginBottom: 20 }}
            />
            <Text style={styles.title}>Sign Up Successful</Text>
            <Text style={styles.text}>
              You have successfully signed up for an account. Welcome aboard!
            </Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E7ECF3",
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
    height: Dimensions.get("window").height / 4,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a5568",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 5,
  },
  label: {
    color: "#4a5568",
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#edf2f7",
    borderColor: "#cbd5e0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#2d3748",
    marginBottom: 14,
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
    marginBottom: 8,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    color: "#718096",
    marginBottom: 8,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#64C5B1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
