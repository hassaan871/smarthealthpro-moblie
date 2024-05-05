import React from "react";
import { View, Text, Image } from "react-native";
import lightTheme from "../Themes/LightTheme";

const ScheduleCard = ({ item }) => {
  return (
    <View
      style={{
        backgroundColor: lightTheme.colors.homeCardContainerMain,
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowRadius: 10,
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
          <Text style={{ fontSize: 14, color: "#888", marginBottom: 3 }}>
            Next Appointment:
          </Text>
          <Text style={{ fontSize: 14, color: "black", marginBottom: 8 }}>
            {item.date} at {item.time}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 14, color: "#666", marginBottom: 3 }}>
            Appointment Details:
          </Text>
          <Text style={{ fontSize: 14, color: "black", marginBottom: 8 }}>
            {item.detail}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, marginLeft: 30 }}>
        <Text style={{ fontSize: 14, color: "#666", marginBottom: 3 }}>
          Location:
        </Text>
        <Text style={{ fontSize: 14, color: "black", marginBottom: 8 }}>
          {item.location}
        </Text>
        <Text style={{ fontSize: 14, color: "#666", marginBottom: 3 }}>
          Fees:
        </Text>
        <Text style={{ fontSize: 14, color: "black" }}>${item.fees}.00</Text>
      </View>
    </View>
  );
};

export default ScheduleCard;
