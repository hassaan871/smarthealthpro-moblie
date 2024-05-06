import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import lightTheme from "../Themes/LightTheme";

const ScheduleCard = ({ item }) => {
  return (
    <View
      style={{
        backgroundColor: lightTheme.colors.homeCardContainerMain,

        borderRadius: 10,
        marginTop: 5,
        padding: 10,
        flexDirection: "row",
      }}
    >
      <View style={{ justifyContent: "center" }}>
        <Image
          source={{ uri: item.pictureUrl }}
          style={{
            width: 70,
            height: 70,
            borderRadius: 32,
          }}
        />
      </View>
      <View
        style={{ flex: 1, justifyContent: "space-between", marginLeft: 20 }}
      >
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "black",
              marginBottom: 5,
            }}
          >
            {item.name}
          </Text>
          <Text style={styles.header}>Next Appointment:</Text>
          <Text style={styles.info}>
            {item.date} at {item.time}
          </Text>
        </View>
        <View>
          <Text style={styles.header}>Appointment Details:</Text>
          <Text style={styles.info}>{item.detail}</Text>
        </View>
      </View>
      <View style={{ flex: 1, marginLeft: 30 }}>
        <Text style={styles.header}>Location:</Text>
        <Text style={styles.info}>{item.location}</Text>
        <Text style={styles.header}>Fees:</Text>
        <Text style={styles.info}>${item.fees}.00</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { fontSize: 14, color: "#666", marginBottom: 3, fontWeight: "900" },
  info: { fontSize: 14, color: "black", marginBottom: 8 },
});
export default ScheduleCard;
