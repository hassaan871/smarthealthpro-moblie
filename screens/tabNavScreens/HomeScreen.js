import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/SimpleLineIcons";
import DialogflowModal from "../../components/DialogFlowModal";
import Context from "../../Helper/context";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import CutomBottomBar from "./CutomBottomBar";
import DoctorCard from "../../components/DoctorCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScheduleCard from "../../components/ScheduleCard";

const HomeScreen = () => {
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
      console.log("entering fetchuser from homescreen ");
      const userID = await AsyncStorage.getItem("userToken");
      console.log("user id is from async: ", userID);
      if (userID !== null) {
        const response = await axios.get(
          `http://192.168.18.124:5000/user/getUserInfo/${userID}`
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
          `http://192.168.18.124:5000/appointment/getAllAppointments?PatientId=${userID}`
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
      console.log("Fetching popular doctor");
      try {
        const response = await axios.get(
          `http://192.168.18.124:5000/user/getDoctorsBySatisfaction`
        );

        console.log("response doctors: ", response.data[0]);
        const doctorsInfo = response.data;

        setPopularDoctors(doctorsInfo);
        setSearchResults(popularDoctors);
        console.log("popular doctors: ", doctorsInfo);
      } catch (error) {
        console.error("Error fetching popular doctors:", error);
      }
    };

    fetchPopularDoctors();
  }, []);

  useEffect(() => {
    console.log("popular doctor: ", popularDoctors[0]);
    setSearchResults(popularDoctors);
  }, [searchQuery.length === 0 || searchResults === null]);

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Hello, {userInfo?.fullName} 👋</Text>
        </View>

        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search a doctor"
            placeholderTextColor="#666"
            onFocus={openModal}
          />
        </View>

        <ScheduleCard item={upcomingSchedule[0]} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Talk to a Doctor</Text>
          <View style={styles.categoryButtons}>
            <TouchableOpacity
              style={[styles.categoryButton, { backgroundColor: "#8E44AD" }]}
            >
              <Icon name="call-outline" size={16} color="#fff" />
              <Text style={styles.categoryButtonText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, { backgroundColor: "#E74C3C" }]}
            >
              <Icon2 name="drop" size={16} color="#fff" />
              <Text style={styles.categoryButtonText}>Diabities</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, { backgroundColor: "#3498DB" }]}
            >
              <Icon name="pulse-outline" size={16} color="#fff" />
              <Text style={styles.categoryButtonText}>Hypertension</Text>
            </TouchableOpacity>
          </View>

          <DoctorCard item={popularDoctors[0]} />
          <DoctorCard item={popularDoctors[1]} />
          <DoctorCard item={popularDoctors[2]} />
          <DoctorCard item={popularDoctors[0]} />
        </View>
        <Modal visible={modalVisible} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Pressable onPress={closeModal}>
                <Icon name="arrow-back" size={24} color="#666" />
              </Pressable>

              <TextInput
                ref={modalSearchInputRef}
                style={{ ...styles.modalSearchInput, paddingLeft: 40 }}
                placeholder="Search a doctor"
                placeholderTextColor="#666"
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

      <CutomBottomBar active={"home"} />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 10,
    marginLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  scheduleCard: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  scheduleInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#E0E0E0",
  },
  scheduleTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  scheduleTime: {
    fontSize: 12,
    color: "#E0E0E0",
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: "#2980B9",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  categoryButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  doctorCard: {
    flexDirection: "row",
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  doctorCardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  doctorCardInfo: {
    flex: 1,
  },
  doctorCardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  doctorCardSpecialty: {
    fontSize: 14,
    color: "#B0B0B0",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  reviewCount: {
    fontSize: 12,
    color: "#B0B0B0",
    marginLeft: 5,
  },
  chatButton: {
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#3C3C3E",
  },
  navItem: {
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  modalSearchInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginLeft: 10,
    backgroundColor: "#2C2C2E",
    color: "#666",
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

export default HomeScreen;
