import React, { useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Context from "../Helper/context";

const ScheduleCard = ({ item }) => {
  const { userInfo } = useContext(Context);

  useEffect(() => {
    // console.log("userInfo from context: ", userInfo);
    // console.log("item from schedule: ", item);
  }, [item, userInfo]);

  function formatDateAndTime(isoString) {
    const options = {
      timeZone: "Asia/Karachi",
      hour12: true,
      month: "long",
      day: "numeric",
      year: "numeric",
    };

    const date = new Date(isoString);
    return date.toLocaleString("en-US", options);
  }
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
      {item ? (
        <View style={styles.scheduleCard}>
          <Image
            source={{
              uri:
                item?.doctor?.avatar?.url?.length > 0
                  ? item?.doctor?.avatar?.url
                  : item?.doctor?.avatar,
            }}
            style={styles.doctorImage}
          />
          <View style={styles.scheduleInfo}>
            <Text style={styles.doctorName}>
              {userInfo?.role === "doctor"
                ? item?.patient?.name
                : item?.doctor?.name}
            </Text>
            {userInfo?.role === "patient" && (
              <Text style={styles.doctorSpecialty}>
                {item?.doctor?.specialization}
              </Text>
            )}
            <View style={styles.scheduleTimeContainer}>
              <Icon name="location" size={16} color="#fff" />
              <Text style={styles.scheduleTime}>{item.location}</Text>
            </View>
            <View style={styles.scheduleTimeContainer}>
              <Icon name="calendar-outline" size={16} color="#fff" />
              <Text style={styles.scheduleTime}>
                {formatDateAndTime(item?.date) + " at " + item?.time}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.scheduleCard2}>
          <Text style={styles.noAppointment}>No Appointments Booked</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  scheduleCard2: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
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
  noAppointment: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    padding: 20,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  scheduleTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  scheduleTime: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
});

export default ScheduleCard;
