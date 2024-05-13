import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
  SafeAreaView,
  Modal,
  FlatList,
  ScrollView,
  ImageBackground
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Icon from react-native-vector-icons
import Icon2 from "react-native-vector-icons/Feather";
import Icon3 from "react-native-vector-icons/FontAwesome";
import Icon4 from "react-native-vector-icons/MaterialCommunityIcons";
import ScheduleCard from "../../components/ScheduleCard";
import PopularCard from "../../components/PopularCard";
import DoctorCard from "../../components/DoctorCard";

import favicon from "../../assets/favicon.png";
import lightTheme from "../../Themes/LightTheme";

import { useNavigation, useRoute } from "@react-navigation/native";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const modalSearchInputRef = useRef(null);

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

  const openModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      modalSearchInputRef.current.focus();
    }, 200); // Delay focusing to ensure modal animation is complete
  };

  const closeModal = () => {
    setSearchQuery("");
    setSearchResults([]);
    setModalVisible(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Perform search based on query
    const filteredResults = popularDoctors.filter((item) => {
      // Convert each object's values to lowercase strings
      const values = Object.entries(item).map(([key, value]) => {
        // Check if the key is pictureUrl or id, if so, return an empty string
        // Otherwise, return the lowercase string value
        return key !== "pictureUrl" && key !== "id"
          ? value.toString().toLowerCase()
          : "";
      });
      // Check if any value (excluding pictureUrl and id) includes the search query
      return values.some((val) => val.includes(searchQuery.toLowerCase()));
    });
    setSearchResults(filteredResults);
  };

  return (
    // <View style={styles.container}>
    // <ImageBackground source={require("../../assets/bg.png")} style={{width: '100%', height: '100%'}}>
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* <StatusBar barStyle="dark-content" /> */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back, Samantha</Text>
          <Text style={styles.headerTitle}>Keep Healthy!</Text>
        </View>
        <View style={styles.searchContainer}>
          {/* <Icon name="search" size={24} color="#999" style={{}} /> */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search for doctors"
            placeholderTextColor="#999"
            onFocus={openModal}
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
              color={"#007fff"}
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
              // color={lightTheme.colors.primaryText}
              color={"#007fff"}
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
                  // color: "#1B2060",
                  color:"#007fff",
                }}
              >
                View All
              </Text>
            </Pressable>
          </View>
          <View style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            // elevation: 5,
            // margin: 2,
          }}>
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
              <Text style={{ fontSize: 16, color:"#007fff" }}>View All</Text>
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
        <Modal visible={modalVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Pressable onPress={closeModal}>
                <Icon name="arrow-back" size={24} color="#000" />
              </Pressable>
              <TextInput
                ref={modalSearchInputRef}
                style={styles.modalSearchInput}
                placeholder="Search for doctors"
                placeholderTextColor="#999"
                onChangeText={handleSearch}
              />
            </View>
            {searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <DoctorCard item={item} closeModal={closeModal} />
                )}
              />
            )}
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
    // </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: lightTheme.colors.defaultBackground,
    // marginTop: Platform.OS === "android" ? 40 : 0,
    // backgroundColor:"#CAF4FF"
    backgroundColor:"#E0F4FF"
  },
  header: {
    // backgroundColor: lightTheme.colors.defaultBackground,
    paddingTop: Platform.OS === "ios" ? 40 : 0,
    padding: 16,
  },
  welcomeText: {
    // color: lightTheme.colors.homeWelcomeTextColor,
    color:"#007fff",
    fontSize: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    // color: lightTheme.colors.homeWelcomeTextColor,
    color:"#007fff",
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    height: 48,
    // backgroundColor: lightTheme.colors.homeSearchInputColor,
    backgroundColor: "#F0F8FF",

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
    // backgroundColor: lightTheme.colors.primaryCard,
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    margin: 5,
    padding: 10,
  },
  menuText: {
    marginTop: 4,
    // color: lightTheme.colors.primaryText,
    color:"#007fff",
    fontSize: 14,
  },
  scheduleContainer: {
    paddingHorizontal: 10,
  },
  scheduleContainer2: {
    paddingHorizontal: 10,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color:"#007fff",
    // paddingBottom: 10,
  },
  detailsContainer: {
    flex: 1, 
    marginLeft: 16, 
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
  modalContainer: {
    flex: 1,
    // backgroundColor: "#fff",
    backgroundColor:"#E0F4FF",
    
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // backgroundColor: "#fff",
  },
  modalSearchInput: {
    flex: 1,
    height: 40,
    // backgroundColor: lightTheme.colors.homeSearchInputColor,
    backgroundColor:"#F0F8FF",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HomeScreen;
