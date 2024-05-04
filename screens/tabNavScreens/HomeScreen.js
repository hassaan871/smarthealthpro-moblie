import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Icon from react-native-vector-icons
import Icon2 from "react-native-vector-icons/Feather";
import Icon3 from "react-native-vector-icons/FontAwesome";
import Icon4 from "react-native-vector-icons/MaterialCommunityIcons";

import favicon from "../../assets/favicon.png";
import lightTheme from "../../Themes/LightTheme";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("home");
  return (
    // <View style={styles.container}>
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, Samantha</Text>
        <Text style={styles.headerTitle}>Keep Healthy!</Text>
      </View>
      <View style={styles.searchContainer}>
        {/* <Icon name="search" size={24} color="#999" style={{}} /> */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search for doctors or anything"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.menuItem}>
          <Icon
            name="assessment"
            size={24}
            color={lightTheme.colors.homeIconColor}
          />
          <Text style={styles.menuText}>Results</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon
            name="event-note"
            size={24}
            color={lightTheme.colors.homeIconColor}
          />
          <Text style={styles.menuText}>Booking</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon
            name="local-hospital"
            size={24}
            color={lightTheme.colors.homeIconColor}
          />
          <Text style={styles.menuText}>Doctors</Text>
        </View>
      </View>
      <View style={styles.scheduleContainer}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Upcoming Schedule</Text>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                color: "#1B2060",
              }}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.headerContainer}>
            <Image source={favicon} style={styles.image} />
            <View style={styles.detailsContainer}>
              <Text style={styles.nameText}>Dr. Emily Davis</Text>
              <Text style={styles.specialtyText}>Dermatologist</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon3 name="map-marker" size={20} color="#fff" />
                <Text style={{ ...styles.specialtyText, paddingLeft: 10 }}>
                  Shaukat Khanum
                </Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.appointmentContainer,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon2 name="clock" size={14} color="#fff" />
              <Text style={{ ...styles.appointmentText, marginLeft: 5 }}>
                Thu, May 18, 09:00 am - 10:00 am
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon4 name="cash" size={14} color="#fff" />
              <Text style={{ ...styles.appointmentText, marginLeft: 5 }}>
                Clinic Fees: Rs.200
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.scheduleContainer}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Popular Doctors</Text>
          <TouchableOpacity
            title="View All"
            color={lightTheme.colors.homeViewBtnTextColor}
          >
            <Text style={{ fontSize: 16, color: "#1B2060" }}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.headerContainer}>
            <Image source={favicon} style={styles.image} />
            <View style={styles.detailsContainer}>
              <Text style={styles.nameText}>Dr. Emily Davis</Text>
              <Text style={styles.specialtyText}>Dermatologist</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon3 name="map-marker" size={20} color="#fff" />
                <Text style={{ ...styles.specialtyText, paddingLeft: 10 }}>
                  Shaukat Khanum
                </Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.appointmentContainer,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon2 name="clock" size={10} color="#fff" />
              <Text style={{ ...styles.appointmentText, marginLeft: 5 }}>
                Thu, May 18, 09:00 am - 10:00 am
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon4 name="cash" size={10} color="#fff" />
              <Text style={{ ...styles.appointmentText, marginLeft: 5 }}>
                Clinic Fees: Rs.200
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.homeBackground,
  },
  header: {
    // backgroundColor: lightTheme.colors.homeBackground,

    paddingTop: Platform.OS === "ios" ? 40 : 0,
    padding: 16,
  },
  welcomeText: {
    color: lightTheme.colors.homeWelcomeTextColor,
    fontSize: 30,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: lightTheme.colors.homeWelcomeTextColor,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    height: 48,
    backgroundColor: lightTheme.colors.homeSearchInputColor,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
  },
  menuItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: lightTheme.colors.homeMenuItemColor,
    borderRadius: 12,
    margin: 5,
    padding: 10,
  },
  menuText: {
    marginTop: 4,
    color: lightTheme.colors.homeMenuText,
    fontSize: 14,
  },
  scheduleContainer: {
    padding: 10,
    marginBottom: 40,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1,
  },
  scheduleTitle: {
    fontSize: 23,
    fontWeight: "bold",
  },
  cardContainer: {
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: lightTheme.colors.homeCardContainerMain,
    top: 10,
  },
  headerContainer: {
    // backgroundColor: lightTheme.colors.homeCardContainerMain,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  detailsContainer: {
    flex: 1, // Take the remaining space after the image
    marginLeft: 16, // Adds left margin for spacing between the image and text
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: lightTheme.colors.homeCardContainerText,
  },
  specialtyText: {
    fontSize: 14,

    color: lightTheme.colors.homeCardContainerText,
  },
  appointmentContainer: {
    // backgroundColor: lightTheme.colors.homeCardContainerSecondry,
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 12,
    color: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: lightTheme.colors.homeTabContainerColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: lightTheme.colors.homeActiveTabColor,
  },
  activeTabText: {
    color: lightTheme.colors.homeActiveTabColor,
  },
});

export default HomeScreen;
