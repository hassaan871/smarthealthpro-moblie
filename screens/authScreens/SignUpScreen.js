import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  TextInput,
  Modal,
} from "react-native";
import signupLogo from "../../assets/signupLogo.jpg";
import checked from "../../assets/checked.png";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Context from "../../Helper/context";
import lightTheme from "../../Themes/LightTheme";
import Alert from "../../components/Alert";
import showAlertMessage from "../../Helper/AlertHelper";
import Ionicons from "react-native-vector-icons/Ionicons";
import ReusableModal from "../../components/ReusableModal";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const SignUpScreen = ({ navigation }) => {
  // const { setToken, setUser } = useContext(Context);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [role, setRole] = useState("patient");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [birthday, setBirthday] = useState(new Date());
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // success or error
  const [selectedBlood, setSelectedBlood] = useState();

  const navigate = useNavigation();

  const handleDismissAlert = () => {
    setShowAlert(false);
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setBirthday(selectedDate);
    }
    setShowDateTimePicker(false);
  };

  const bloodGroups = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
  ];

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return ""; // Return an empty string if the date is invalid
    }

    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-indexed
    let year = date.getFullYear();

    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    return `${month}/${day}/${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.length < 3 || name.length > 20) {
      showAlertMessage(
        setShowAlert,
        setAlertMessage,
        setAlertType,
        "Name should be between 3 and 20 characters",
        "error"
      );
      return;
    }

    if (!email || !emailRegex.test(email)) {
      showAlertMessage(
        setShowAlert,
        setAlertMessage,
        setAlertType,
        "Please enter a valid email address",
        "error"
      );
      return;
    }

    if (password?.length < 8 && password != confirmPassword) {
      showAlertMessage(
        setShowAlert,
        setAlertMessage,
        setAlertType,
        "Password should be at least 8 characters or Passwords do not match",
        "error"
      );
      return;
    }

    console.log("Form data:", {
      name,
      email,
      password,
      role,
      birthday,
      selectedBlood,
    });

    axios
      .post("http://10.135.53.252:5000/user/register", {
        fullName: name,
        email: email,
        password: password,
        role: role,
        dateOfBirth: birthday,
        bloodType: selectedBlood,
      })
      .then((res) => {
        console.log("Response:", res);
        // setUser(res.data);
        setModalVisible(true);
      })
      .catch((error) => {
        console.log("Error:", error);
        showAlertMessage(
          setShowAlert,
          setAlertMessage,
          setAlertType,
          "Email Already Exists!",
          "Failed"
        );
        if (error.response) {
          console.log("Server Error:", error.response.data);
          showAlertMessage(
            setShowAlert,
            setAlertMessage,
            setAlertType,
            "Email Already exists",
            "Failed"
          );
        } else if (error.request) {
          console.log("Request Error:", error.request);
        } else {
          console.log("Error Message:", error.message);
        }
      });
  };

  const showDateTimePickerHandler = () => {
    setShowDateTimePicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* <View style={styles.imageContainer}>
          <Image source={signupLogo} style={styles.image} />
        </View> */}
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor={"#666"}
            onChangeText={(text) => setName(text)}
            style={styles.input}
          />
          {/* <TextInput placeholder="Date of Birth" style={styles.input} /> */}
          <TextInput
            placeholder="Email address"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor={"#666"}
            onChangeText={(text) => setEmail(text)}
          />

          <View style={[styles.input, { padding: 0 }]}>
            <Picker
              selectedValue={selectedBlood}
              onValueChange={(itemValue) => setSelectedBlood(itemValue)}
              style={{ color: "#fff" }}
            >
              <Picker.Item
                style={{ color: "#666" }}
                label="Blood Group..."
                value=""
              />
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="A-" value="A-" />
              <Picker.Item label="B+" value="B+" />
              <Picker.Item label="B-" value="B-" />
              <Picker.Item label="O+" value="O+" />
              <Picker.Item label="O-" value="O-" />
              <Picker.Item label="AB+" value="AB+" />
              <Picker.Item label="AB-" value="AB-" />
            </Picker>
          </View>

          <TextInput
            placeholder="Select Birthday"
            onPress={showDateTimePickerHandler}
            value={formatDate(birthday)}
            // mode="outlined"
            style={styles.input}
            // left={<TextInput.Icon icon="cake" color={"#8C52FF"} paddingTop={4} />}
            // right={<TextInput.Icon onPress={showDateTimePickerHandler} icon="calendar" color={"#8C52FF"} paddingTop={4} />}
            // outlineStyle={{ borderRadius: 15, borderColor: "#F4F4F4" }}
          />

          <View>
            {showDateTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={birthday}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View>
            <TextInput
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              placeholderTextColor={"#666"}
              style={styles.input}
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
          </View>
          <View>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!passwordVisible2}
              placeholderTextColor={"#666"}
              style={styles.input}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <Pressable
              onPress={() => setPasswordVisible2(!passwordVisible2)}
              style={styles.iconButton}
            >
              <Ionicons
                name={passwordVisible2 ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#718096"
              />
            </Pressable>
          </View>
        </View>

        <Alert
          visible={showAlert}
          onDismiss={handleDismissAlert}
          message={alertMessage}
          type={alertType}
        />

        <Pressable onPress={handleSubmit} style={styles.loginButton}>
          <Text style={styles.loginText}>Sign Up</Text>
        </Pressable>
        <Text style={styles.orText}>Or, sign up with</Text>
        <View style={styles.socialButtons}>
          <Pressable style={styles.socialButton}>
            {/* <Image
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
            /> */}
          </Pressable>
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 5 }}>
            Already have an account?{" "}
            <Text style={{ fontWeight: "bold", color: "#4A90E2" }}>Login</Text>
          </Text>
        </Pressable>
      </View>
      <ReusableModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={"Sign Up Successful"}
        message={
          "You have successfully signed up for an account. Welcome aboard!"
        }
        imageSource={checked}
        onClose={() => navigation.navigate("Login")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  card: {
    // backgroundColor: "#fff",
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
    height: Dimensions.get("window").height / 4,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
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
    // backgroundColor: "#edf2f7",
    backgroundColor: "#2C2C2E",
    color: "#fff",
    borderColor: "#cbd5e0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 10,
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
    backgroundColor: "#4A90E2",
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
    color: "#fff",
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
