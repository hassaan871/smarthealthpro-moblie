import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Icon from react-native-vector-icons
import Icon2 from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import favicon from "../../assets/favicon.png";
import lightTheme from "../../Themes/LightTheme";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("home");
  return (
    <SafeAreaView style={styles.container}>
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
          <Button
            title="View all"
            color={lightTheme.colors.homeViewBtnTextColor}
            onPress={() => {}}
          />
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.headerContainer}>
            <Image source={favicon} style={styles.image} />
            <View style={styles.detailsContainer}>
              <Text style={styles.nameText}>Dr. Emily Davis</Text>
              <Text style={styles.specialtyText}>Dermatologist</Text>
            </View>
          </View>
          <View style={styles.appointmentContainer}>
            <Text style={styles.appointmentText}>
              Thu, May 18, 09:00 am - 10:00 am
            </Text>
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
    backgroundColor: lightTheme.colors.homeHeadColor,
    paddingTop: Platform.OS === "ios" ? 40 : 0,
    padding: 16,
  },
  welcomeText: {
    color: lightTheme.colors.homeWelcomeTextColor,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 24,
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
    paddingHorizontal: 16,
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
    marginHorizontal: 5,
    paddingVertical: 10,
  },
  menuText: {
    marginTop: 4,
    color: lightTheme.colors.homeMenuText,
    fontSize: 14,
  },
  scheduleContainer: {
    flex: 1,
    padding: 10,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  scheduleTitle: {
    fontSize: 20,
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
    marginBottom: 10,
  },
  headerContainer: {
    backgroundColor: lightTheme.colors.homeCardContainerMain,
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
    backgroundColor: lightTheme.colors.homeCardContainerSecondry,
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 14,
    color: lightTheme.colors.homeCardContainerText,
    textAlign: "center",
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
