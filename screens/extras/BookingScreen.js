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
import { useStripe } from "@stripe/stripe-react-native";

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
  const { userInfo, appointments } = useContext(Context);
  const priority = route?.params?.priority || "low";
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const checkExistingAppointment = () => {
    if (!appointments || !doctorInfo) return false;

    // console.log("appointments[4].doctor.id: ", appointments);
    // console.log("doctorInfo._id: ", doctorInfo.user._id);

    return appointments.some(
      (appointment) => appointment.doctor.id === doctorInfo.user._id
    );
  };

  const extractPriority = priority.toLowerCase().includes("mild")
    ? "mild"
    : priority.toLowerCase().includes("moderate")
    ? "moderate"
    : priority.toLowerCase().includes("severe")
    ? "severe"
    : priority.toLowerCase().includes("very severe")
    ? "very severe"
    : "low";

  const doctorInfo = route?.params?.doctorInfo;
  const navigate = useNavigation();

  const item = route?.params?.doctorInfo;
  const officeHours = item?.officeHours;
  // console.log("doc info", doctorInfo);
  // console.log("user", userInfo);

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

  const paymentProcess = async () => {
    try {
      const cart = [
        {
          doctorId: doctorInfo._id,
          quantity: 1,
        },
      ];
      const data = JSON.stringify(cart);
      const crypto = require("crypto-js"); // 📦 Install via npm if not installed
      const signature = crypto
        .HmacSHA256(data, process.env.HMAC_SECRET)
        .toString();

      // Send cart and signature to backend
      const response = await axios.post(
        "http://192.168.1.160:5000/payments/intents",
        {
          items: cart,
          signature: signature,
        }
      );

      const { clientSecret } = response.data;

      if (!clientSecret) {
        console.error("Client secret not received.");
        return { error: "Failed to retrieve payment intent." };
      }

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "YourApp Inc.",
        paymentIntentClientSecret: clientSecret,
      });

      if (initError) {
        console.error("Init Payment Sheet Error:", initError);
        return { error: initError };
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        console.error("Payment Error:", paymentError);
        return { error: paymentError };
      }

      return { clientSecret };
    } catch (error) {
      console.error("Payment process error:", error);
      return { error };
    }
  };

  const createAppointment = async () => {
    if (!selected) {
      Alert.alert("Error", "Please select a date for the appointment");
      return;
    }

    if (checkExistingAppointment()) {
      Alert.alert(
        "Existing Appointment",
        "You already have an appointment with this doctor. Please come back after your current appointment has been completed or cancelled.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
      return;
    }

    setLoading(true);

    // Step 1: Handle Payment
    const paymentResult = await paymentProcess();

    if (paymentResult.error) {
      Alert.alert(
        "Payment Error",
        paymentResult.error.message ||
          "Payment process failed. Please try again."
      );
      setLoading(false);
      return;
    }

    // Step 2: Create Appointment
    try {
      const body = {
        doctor: {
          id: doctorInfo._id,
          name: doctorInfo.user.fullName,
          avatar: doctorInfo.user.avatar,
          specialization: doctorInfo.specialization,
        },
        patient: {
          id: userInfo._id,
          name: userInfo.fullName,
          avatar: userInfo.avatar,
        },
        date: selected,
        appointmentStatus: "tbd",
        description: "Appointment for a check-up",
        location: doctorInfo.address,
        priority: extractPriority,
        bookedOn: selected,
      };

      const appointmentResponse = await axios.post(
        "http://192.168.1.160:5000/appointment/postAppointment",
        body
      );

      if (appointmentResponse.status === 201) {
        setModalVisible(true);
      } else {
        Alert.alert(
          "Error",
          "An error occurred while creating the appointment. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
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
            onPress={createAppointment}
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
