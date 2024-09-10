import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import DoctorCard from "../../components/DoctorCard";
import ReusableModal from "../../components/ReusableModal";
import checked from "../../assets/checked.png";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import Context from "../../Helper/context";

const DAYS_OF_WEEK = [
  "sunday", // 0
  "monday", // 1
  "tuesday", // 2
  "wednesday", // 3
  "thursday", // 4
  "friday", // 5
  "saturday", // 6
];

export default function BookingScreen({ route, navigation }) {
  const [selected, setSelected] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const priority = route?.params?.priority ?? "low";
  const navigate = useNavigation();

  const { userInfo } = useContext(Context);

  const item = route.params.item;
  const officeHours = item.officeHours;

  const initDate = new Date();
  const minimumDate = new Date();

  const today = minimumDate.toLocaleDateString("en-US", {
    timeZone: "Asia/Karachi",
    weekday: "long",
  });

  useEffect(() => {
    getDisabledDays(initDate.getMonth(), initDate.getFullYear());
  }, []);

  const getDisabledDays = (month, year) => {
    let pivot = moment().month(month).year(year).startOf("month");
    const end = moment().month(month).year(year).endOf("month");
    let dates = {};
    const disabled = { disabled: true, disableTouchEvent: true };

    while (pivot.isBefore(end)) {
      DAYS_OF_WEEK.forEach((day, index) => {
        if (officeHours[day] === "Closed" && day !== today) {
          const copy = moment(pivot).day(index);
          dates[copy.format("YYYY-MM-DD")] = disabled;
        }
      });
      pivot.add(1, "weeks");
    }

    setMarkedDates(dates);
    return dates;
  };

  const onDayPress = (day) => {
    if (!markedDates[day.dateString]?.disabled) {
      setSelected(day.dateString);
    }
  };

  const onMonthChange = (date) => {
    getDisabledDays(date.month - 1, date.year);
  };

  const getOfficeHoursForSelectedDate = () => {
    if (selected) {
      const date = new Date(selected);
      const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
      return officeHours[dayOfWeek] || "Closed";
    }
    return "Not selected";
  };

  const createAppointment = async () => {
    if (!selected) {
      Alert.alert("Error", "Please select a date for the appointment");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.18.124:5000/appointment/postAppointment",
        {
          doctor: {
            id: item.user._id,
            name: item.user.fullName,
            avatar: item.avatar,
            specialization: item.specialization,
          },
          patient: userInfo._id, // You need to replace this with the actual patient ID
          date: "",
          appointmentStatus: "tbd",
          description: "Appointment with " + item.user.fullName,
          location: item.office,
          priority: priority,
          bookedOn: selected,
        }
      );

      setLoading(false);
      if (response.status === 201) {
        setModalVisible(true);
      } else {
        Alert.alert("Error", "Failed to create appointment. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error creating appointment:", error);
      Alert.alert(
        "Error",
        "An error occurred while creating the appointment. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, marginHorizontal: 20 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.navigate("HomeScreen");
            }}
          >
            <Icon name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Your Appointment</Text>
          <TouchableOpacity style={styles.moreButton}></TouchableOpacity>
        </View>

        <DoctorCard item={item} isBook={true} />

        <View
          style={{
            backgroundColor: "#1E1E1E",
            borderRadius: 10,
            padding: 20,
            marginBottom: 20,
            marginTop: 40,
          }}
        >
          <Calendar
            theme={{
              backgroundColor: "#1E1E1E",
              calendarBackground: "#1E1E1E",
              textSectionTitleColor: "#FFFFFF",
              selectedDayBackgroundColor: "#3498db",
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: "#3498db",
              dayTextColor: "#FFFFFF",
              textDisabledColor: "#4D4D4D",
              monthTextColor: "#FFFFFF",
              arrowColor: "#3498db",
              textSectionTitleDisabledColor: "#d9e1e8",
            }}
            markedDates={{
              ...markedDates,
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: "#3498db",
              },
            }}
            current={initDate}
            minDate={minimumDate}
            onDayPress={onDayPress}
            firstDay={1}
            enableSwipeMonths={true}
            onMonthChange={onMonthChange}
          />
        </View>

        <View
          style={{
            alignSelf: "center",
            padding: 16,
            backgroundColor: "#1E1E1E",
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: 20,
          }}
        >
          <View style={{ alignItems: "center", marginLeft: 40 }}>
            <Text style={{ fontSize: 14, color: "#7C8A97" }}>Date</Text>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#3B82F6" }}
            >
              {selected ? selected.substring(8, 10) : "--"}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 8 }}>
            <Text style={{ fontSize: 30, color: "#4D4D4D" }}>|</Text>
          </View>
          <View style={{ alignItems: "center", marginRight: 40 }}>
            <Text style={{ fontSize: 14, color: "#7C8A97" }}>Time</Text>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#3B82F6" }}
            >
              {getOfficeHoursForSelectedDate()}
            </Text>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          {/* NEW: Update the TouchableOpacity for the Continue button */}
          <TouchableOpacity
            style={{
              backgroundColor: loading ? "#cccccc" : "#3498db",
              borderRadius: 10,
            }}
            onPress={() => {
              createAppointment();
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                style={{ paddingVertical: 15 }}
              />
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  paddingVertical: 15,
                }}
              >
                Continue
              </Text>
            )}
          </TouchableOpacity>
          <ReusableModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            title={"Appointment Booked"}
            message={
              priority === "low"
                ? "You have successfully booked your appointment. By default, your priority is low. If you think you have a high priority case, kindly chat with our ChatBot."
                : `You have successfully booked your appointment. Your priority has been set to ${priority}`
            }
            imageSource={checked}
            onClose={() => navigation.navigate("HomeScreen")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  moreButton: {
    padding: 5,
  },
});
