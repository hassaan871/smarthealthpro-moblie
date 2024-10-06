import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const ResetPasswordScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userId, token } = route.params; // Get userId and token from route params
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }

    try {
      const response = await axios.post(
        `http://192.168.1.35:5000/user/reset-password/${userId}/${token}`,
        {
          password: newPassword,
        }
      );

      Alert.alert(
        "Success",
        response.data.msg || "Password has been reset successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"), // Navigate back to the login screen
          },
        ]
      );
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data.error || "Something went wrong."
        );
      } else {
        Alert.alert("Error", "Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your new password"
        placeholderTextColor={"#666"}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
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

export default ResetPasswordScreen;
