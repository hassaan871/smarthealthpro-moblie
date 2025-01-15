import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the back button icon
import ReusableModal from "../../components/ReusableModal"; // Import ReusableModal

const ForgotScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const response = await axios.post(
        "http://192.168.18.124:5000/user/forgot-password",
        {
          email,
        }
      );

      const resetLink = response.data.link; // Extracting the reset link from the response

      // Parse the user ID and token from the link
      const [userId, token] = resetLink.split("/").slice(-2); // Assuming the last two segments are user ID and token

      // Show success modal
      setModalVisible(true);

      // Alert.alert(
      //   "Password Reset",
      //   response.data.msg ||
      //     "A password reset link has been sent to your email."
      // );
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data.error || "Something went wrong."
        );
      } else {
        Alert.alert("Error", "Failed to send request. Please try again.");
      }
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.instructions}>
        Please enter your email address to receive a password reset link.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor={"#666"}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          try {
            await handlePasswordReset();
          } catch (error) {
            Alert.alert(
              "Error",
              "An unexpected error occurred. Please try again."
            );
          }
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>

      <ReusableModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={"Password Reset Link Sent"}
        message={
          "A password reset link has been sent to your email. Please check your inbox."
        }
        onClose={() => navigation.navigate("Login")} // Navigate to login on modal close
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    width: "80%",
    backgroundColor: "#2C2C2E",
    borderColor: "#cbd5e0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    width: "80%",
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotScreen;
