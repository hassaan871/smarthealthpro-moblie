import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  PermissionsAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CutomBottomBar from "./CutomBottomBar";
import Context from "../../Helper/context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import updateProfilePic from "../../Helper/updateProfilePic";
import axios from "axios";
import Alert from "../../components/Alert";
import showAlertMessage from "../../Helper/AlertHelper";
import messaging from "@react-native-firebase/messaging";

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { userInfo, popularDoctors } = useContext(Context);
  const [isTopFiveDoctor, setIsTopFiveDoctor] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // success or error
  const [alertActions, setAlertActions] = useState([]); // actions for alert buttons

  const handlePickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });

      if (result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        setImageUri(pickedFile.uri);

        const file = {
          uri: pickedFile.uri,
          name: pickedFile.name,
          type: pickedFile.mimeType,
        };

        try {
          const response = await updateProfilePic(userInfo._id, file);
          setStatusMessage(response.message);
          navigation.navigate("HomeScreen");
        } catch (error) {
          console.error("Error updating profile picture:", error);
          setStatusMessage("Failed to update profile picture.");
        }
      } else {
        console.log("No file selected");
      }
    } catch (error) {
      console.error("Error in handlePickImage:", error);
      setStatusMessage("An error occurred while picking the image.");
    }
  };

  const checkIfTop = () => {
    const topFiveDoctors = popularDoctors.slice(0, 3);
    const isTop = topFiveDoctors.some(
      (doctor) => doctor?.user?.fullName === userInfo?.fullName
    );
    setIsTopFiveDoctor(isTop);
  };

  useEffect(() => {
    console.log("user from setting: ", userInfo);
    checkIfTop();
  }, [userInfo, popularDoctors]);

  const deleteUser = async () => {
    try {
      const deleteResponse = await axios.delete(
        `http://192.168.18.40:5000/user/deleteUser/${userInfo._id}`
      );
      console.log("User deleted successfully", deleteResponse.data);
      // You can handle further actions after deletion, like navigation or UI updates.
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const confirmDelete = () => {
    showAlertMessage(
      setShowAlert,
      setAlertMessage,
      setAlertType,
      setAlertActions,
      "Are you sure you want to delete your account? Your data will be deleted permanently.",
      "warning",
      [
        { text: "Cancel", onPress: () => setShowAlert(false) },
        { text: "Yes", onPress: deleteUser },
      ]
    );
  };

  const handleLogout = () => {
    showAlertMessage(
      setShowAlert,
      setAlertMessage,
      setAlertType,
      setAlertActions,
      "Are you sure you want to log out?",
      "warning",
      [
        {
          text: "Cancel",
          onPress: () => setShowAlert(false),
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("isThemeDark");
              await AsyncStorage.removeItem("authToken");
              await AsyncStorage.removeItem("userToken");
              setShowAlert(false); // Dismiss the alert before navigating
              navigation.navigate("Login");
            } catch (error) {
              showAlertMessage(
                setShowAlert,
                setAlertMessage,
                setAlertType,
                setAlertActions,
                "Logout Failed. Please try again.",
                "error"
              );
            }
          },
        },
      ]
    );
  };

  const checkNotificationPermission = async () => {
    try {
      let isEnabled = false;

      if (Platform.OS === "android" && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        isEnabled = granted;
      } else {
        const authStatus = await messaging().hasPermission();
        isEnabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      }

      setNotificationsEnabled(isEnabled);
      await AsyncStorage.setItem("notificationEnabled", String(isEnabled));
    } catch (error) {
      console.error("Error checking notification permission:", error);
    }
  };

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      try {
        let permissionGranted = false;

        if (Platform.OS === "android" && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          permissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const authStatus = await messaging().requestPermission();
          permissionGranted =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        }

        if (permissionGranted) {
          setNotificationsEnabled(true);
          await AsyncStorage.setItem("notificationEnabled", "true");
        } else {
          showAlertMessage(
            setShowAlert,
            setAlertMessage,
            setAlertType,
            setAlertActions,
            "Please enable notifications in your phone settings to receive important updates.",
            "warning",
            [{ text: "OK", onPress: () => setShowAlert(false) }]
          );
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    } else {
      showAlertMessage(
        setShowAlert,
        setAlertMessage,
        setAlertType,
        setAlertActions,
        "Are you sure you want to disable notifications?",
        "warning",
        [
          { text: "Cancel", onPress: () => setShowAlert(false) },
          {
            text: "Disable",
            onPress: async () => {
              await AsyncStorage.setItem("notificationEnabled", "false");
              setNotificationsEnabled(false);
              setShowAlert(false);
            },
          },
        ]
      );
    }
  };

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.userInfo}>
          <Image
            source={{
              uri:
                userInfo?.avatar?.url?.length > 0
                  ? userInfo?.avatar.url
                  : userInfo?.avatar,
            }}
            style={styles.userImage}
          />
          <Icon
            name="camera"
            size={16}
            color={"white"}
            onPress={handlePickImage}
            style={{
              marginLeft: 48,
              marginTop: -16,
              backgroundColor: "#4A90E2",
              padding: 6,
              borderRadius: 16,
            }}
          />

          <Text style={styles.userName}>{userInfo?.fullName}</Text>
          <Text style={styles.userEmail}>{userInfo?.email}</Text>
          {isTopFiveDoctor && (
            <View style={styles.topDoctorBadge}>
              <Icon name="star" size={20} color="#FFD700" />
              <Text style={styles.topDoctorText}>Top Doctor</Text>
            </View>
          )}
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="notifications-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: "#767577", true: "#4A90E2" }}
              thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="trash-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Clear Cache</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#B0B0B0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <Icon name="log-out-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Logout</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#B0B0B0" />
          </TouchableOpacity>

          <TouchableOpacity onPress={confirmDelete} style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="trash-bin-outline" size={24} color="#E74C3C" />
              <Text style={[styles.settingText, styles.deleteAccountText]}>
                Delete Account
              </Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#B0B0B0" />
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
      <CutomBottomBar active={"setting"} />
      <Alert
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        message={alertMessage}
        type={alertType}
        actions={alertActions}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    // marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#B0B0B0",
    marginBottom: 10,
  },
  topDoctorBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  topDoctorText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  settingsSection: {
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#3C3C3E",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#fff",
  },
  deleteAccountText: {
    color: "#E74C3C",
  },
  versionText: {
    textAlign: "center",
    color: "#B0B0B0",
    marginTop: 20,
  },
});

export default SettingsScreen;
