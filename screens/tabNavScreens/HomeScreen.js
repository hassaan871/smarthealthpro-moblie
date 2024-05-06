import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Icon from react-native-vector-icons
import Icon2 from "react-native-vector-icons/Feather";
import Icon3 from "react-native-vector-icons/FontAwesome";
import Icon4 from "react-native-vector-icons/MaterialCommunityIcons";
import ScheduleCard from "../../components/ScheduleCard";
import PopularCard from "../../components/PopularCard";

import favicon from "../../assets/favicon.png";
import lightTheme from "../../Themes/LightTheme";

import { useNavigation, useRoute } from "@react-navigation/native";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("home");

  const [upcomingSchedule, setUpcomingSchedule] = useState([
    {
      id: "1",
      name: "Appointment 1",
      date: "May 10, 2024",
      time: "10:00 AM",
      detail: "Regular checkup",
      location: "Hospital A",
      fees: "50",
      pictureUrl: "https://placeholder.co/64x64",
    },
    {
      id: "2",
      name: "Appointment 2",
      date: "May 12, 2024",
      time: "11:30 AM",
      detail: "Dental checkup",
      location: "Dental Clinic B",
      fees: "80",
      pictureUrl: "https://placeholder.co/64x64",
    },
    {
      id: "3",
      name: "Appointment 1",
      date: "May 10, 2024",
      time: "10:00 AM",
      detail: "Regular checkup",
      location: "Hospital A",
      fees: "50",
      pictureUrl: "https://placeholder.co/64x64",
    },
    {
      id: "4",
      name: "Appointment 2",
      date: "May 12, 2024",
      time: "11:30 AM",
      detail: "Dental checkup",
      location: "Dental Clinic B",
      fees: "80",
      pictureUrl: "https://placeholder.co/64x64",
    },
    // Add more upcoming schedule items as needed
  ]);

  const [popularDoctors, setPopularDoctors] = useState([
    {
      id: "1",
      name: "Dr. John Doe",
      specialty: "Cardiologist",
      pictureUrl: "https://placeholder.co/64x64",
    },
    {
      id: "2",
      name: "Dr. Jane Smith",
      specialty: "Pediatrician",
      pictureUrl: "https://placeholder.co/64x64",
    },
    {
      id: "3",
      name: "Dr. John Doe",
      specialty: "Cardiologist",
      pictureUrl: "https://placeholder.co/64x64",
    },
    {
      id: "4",
      name: "Dr. Jane Smith",
      specialty: "Pediatrician",
      pictureUrl: "https://placeholder.co/64x64",
    },
    // Add more popular doctors as needed
  ]);

  const navigation = useNavigation();

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
        <Pressable
          style={styles.menuItem}
          onPress={() => {
            alert("Results");
          }}
        >
          <Icon
            name="assessment"
            size={24}
            color={lightTheme.colors.homeIconColor}
          />
          <Text style={styles.menuText}>Results</Text>
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate("CameraAccessScreen");
          }}
        >
          <Icon
            name="camera"
            size={24}
            color={lightTheme.colors.homeIconColor}
          />
          <Text style={styles.menuText}>Camera</Text>
        </Pressable>
      </View>

      <View style={styles.scheduleContainer}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Upcoming Schedule</Text>
          <Pressable
            onPress={() => {
              navigation.navigate("ViewAll", {
                data: upcomingSchedule,
                isPopular: false,
              }); // or false
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#1B2060",
              }}
            >
              View All
            </Text>
          </Pressable>
        </View>
        <View style={{}}>
          <ScheduleCard item={upcomingSchedule[0]} />
        </View>
      </View>
      <View style={styles.scheduleContainer2}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Popular Doctors</Text>
          <Pressable
            title="View All"
            color={lightTheme.colors.homeViewBtnTextColor}
            onPress={() => {
              navigation.navigate("ViewAll", {
                data: popularDoctors,
                isPopular: true,
              }); // or false
            }}
          >
            <Text style={{ fontSize: 16, color: "#1B2060" }}>View All</Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <PopularCard item={popularDoctors[0]} />
          </View>
          <View>
            <PopularCard item={popularDoctors[1]} />
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
    marginTop: Platform.OS === "android" ? 40 : 0,
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
  },
  scheduleContainer2: {
    padding: 10,
    marginTop: 15,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
