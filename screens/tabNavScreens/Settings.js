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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CutomBottomBar from "./CutomBottomBar";
import Context from "../../Helper/context";

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { userInfo, popularDoctors } = useContext(Context);
  const [isTopFiveDoctor, setIsTopFiveDoctor] = useState(false);

  useEffect(() => {
    console.log("user from setting: ", userInfo);
    checkIfTopFiveDoctor();
  }, [userInfo, popularDoctors]);

  const checkIfTopFiveDoctor = () => {
    const topFiveDoctors = popularDoctors.slice(0, 5);
    const isTop = topFiveDoctors.some(
      (doctor) => doctor.user.fullName === userInfo.fullName
    );
    setIsTopFiveDoctor(isTop);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.userInfo}>
          <Image source={{ uri: userInfo.avatar }} style={styles.userImage} />
          <Text style={styles.userName}>{userInfo.fullName}</Text>
          <Text style={styles.userEmail}>{userInfo.email}</Text>
          {isTopFiveDoctor && (
            <View style={styles.topDoctorBadge}>
              <Icon name="star" size={20} color="#FFD700" />
              <Text style={styles.topDoctorText}>Top 5 Doctor</Text>
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
              onValueChange={setNotificationsEnabled}
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

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="log-out-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Logout</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#B0B0B0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
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
    marginBottom: 15,
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
