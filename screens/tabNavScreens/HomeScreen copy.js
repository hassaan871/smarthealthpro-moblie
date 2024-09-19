import React, { useState, useRef, useEffect, useContext } from "react";
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
  ImageBackground,
  TouchableOpacity,
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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DialogflowModal from "../../components/DialogFlowModal";
import Context from "../../Helper/context";

const HomeScreen2 = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const { userInfo, setUserInfo, popularDoctors, setPopularDoctors } =
    useContext(Context);

  const modalSearchInputRef = useRef(null);

  useEffect(() => {
    console.log("use effect from homesceen ");
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem("userToken");
      console.log("user id is from async: ", userID);
      if (userID !== null) {
        const response = await axios.get(
          `http://10.135.88.124:5000/user/getUserInfo/${userID}`
        );

        console.log("response users data: ", response.data.user);
        setUserInfo(response.data.user);
      } else {
        console.log("User token not available");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAppointment = async () => {
      const userID = await AsyncStorage.getItem("userToken");
      console.log("user id is from async: ", userID);
      if (userID !== null) {
        const response = await axios.get(
          `http://10.135.88.124:5000/appointment/getAllAppointments?PatientId=${userID}`
        );

        console.log("response appointment: ", response.data.appointments);
        appointmentInfo = response.data.appointments;
        setUpcomingSchedule(appointmentInfo);
      } else {
        console.log("User token not available");
      }
    };

    fetchAppointment();
  }, []);

  useEffect(() => {
    const fetchPopularDoctors = async () => {
      try {
        const response = await axios.get(
          `http://10.135.88.124:5000/user/getDoctorsBySatisfaction`
        );

        console.log("response doctors: ", response.data.doctors);
        const doctorsInfo = response.data.doctors;

        // Fetch detailed info for the top 2 popular doctors
        const popularDoctorIds = doctorsInfo.slice(0, 2); // Getting only the top 2
        const popularDoctorsPromises = popularDoctorIds.map((doctor) =>
          axios.get(
            `http://10.135.88.124:5000/user/getDoctorById/${doctor.id}`
          )
        );

        const doctorResponses = await Promise.all(popularDoctorsPromises);
        const detailedDoctorsInfo = doctorResponses.map(
          (response) => response.data
        );
        console.log("final popular doctor: ", detailedDoctorsInfo);
        setPopularDoctors(detailedDoctorsInfo);
        setSearchResults(detailedDoctorsInfo);
      } catch (error) {
        console.error("Error fetching popular doctors:", error);
      }
    };

    fetchPopularDoctors();
  }, []);

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

    const filteredResults = popularDoctors.filter((item) => {
      // Convert the fullName and specialization to lowercase strings
      const fullName = item.user.fullName.toLowerCase();
      const specialization = item.specialization.toLowerCase();

      // Check if either the fullName or specialization includes the search query
      return (
        fullName.includes(query.toLowerCase()) ||
        specialization.includes(query.toLowerCase())
      );
    });

    setSearchResults(filteredResults);
  };

  return (
    // <View style={styles.container}>
    <View style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* <StatusBar barStyle="dark-content" /> */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome back, Samantha</Text>
            <Text style={styles.headerTitle}>Keep Healthy!</Text>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={{ ...styles.searchInput, paddingLeft: 40 }}
              placeholder="Search for doctors"
              placeholderTextColor="#999"
              onFocus={openModal}
            />
            <Icon
              name="search"
              size={24}
              color="#999"
              style={{ position: "absolute", top: 27, left: 27 }}
            />
          </View>
          <View style={styles.menuContainer}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate("ResultsScreen");
              }}
            >
              <Icon name="assessment" size={24} color={"black"} />
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
                color={"black"}
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
            <View
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                // elevation: 5,
                margin: 2,
              }}
            >
              <ScheduleCard item={upcomingSchedule[0]} />
            </View>
          </View>
          <View style={styles.scheduleContainer2}>
            <View style={styles.scheduleHeader}>
              <Text style={styles.scheduleTitle}>Popular Doctors</Text>
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
                  style={{ ...styles.modalSearchInput, paddingLeft: 40 }}
                  placeholder="Search for doctors"
                  placeholderTextColor="#999"
                  onChangeText={handleSearch}
                />
                <Icon
                  name="search"
                  size={24}
                  color="#718096"
                  style={{ position: "absolute", left: 60 }}
                />
              </View>
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <DoctorCard item={item} closeModal={closeModal} />
                )}
              />
            </SafeAreaView>
          </Modal>
        </ScrollView>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setModalVisible2(true)}
        >
          <Icon name="chat" size={30} color="#fff" />
        </TouchableOpacity>
        <DialogflowModal
          visible={modalVisible2}
          onClose={() => setModalVisible2(false)}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: lightTheme.colors.defaultBackground,
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
  header: {
    // backgroundColor: lightTheme.colors.defaultBackground,
    paddingTop: Platform.OS === "ios" ? 40 : 0,
    padding: 16,
  },
  welcomeText: {
    // color: lightTheme.colors.homeWelcomeTextColor,
    color: "black",
    fontSize: 26,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    // color: lightTheme.colors.homeWelcomeTextColor,
    color: "black",
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
    // backgroundColor: lightTheme.colors.primaryCard,
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    margin: 5,
    padding: 10,
  },
  menuText: {
    marginTop: 4,
    // color: lightTheme.colors.primaryText,
    color: "#007fff",
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
    color: "black",
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
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalSearchInput: {
    flex: 1,
    height: 40,
    backgroundColor: lightTheme.colors.homeSearchInputColor,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginLeft: 10,
  },
  chatButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#007bff",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default HomeScreen2;
