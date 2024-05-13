import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, LocaleConfig } from "react-native-calendars";
import DoctorCard from "../../components/DoctorCard";

export default function BookingScreen({ route }) {
  const [selected, setSelected] = useState("");
  const item = route.params.item;
  return (
    <SafeAreaView style={{ marginHorizontal: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 20,
        }}
      >
        <TouchableOpacity>
          <Text style={{ color: "#3498db", fontSize: 20 }}>&lt;</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000000" }}>
          Booking Your Date
        </Text>
        <TouchableOpacity>
          <Text style={{ color: "#3498db", fontSize: 20 }}>&gt;</Text>
        </TouchableOpacity>
      </View>

      <DoctorCard item={item} isBook={true} />

      <View
        style={{
          backgroundColor: "#ffffff",
          shadowColor: "#000000",
          shadowOpacity: 0.2,
          shadowRadius: 5,
          borderRadius: 10,
          padding: 20,
          marginBottom: 20,
          marginTop: 40,
        }}
      >
        <Calendar
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: "orange",
            },
          }}
        />
      </View>

      <View
        style={{
          alignSelf: "center",
          padding: 16,
          backgroundColor: "#FFF",
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
          <Text style={{ fontSize: 14, color: "#7C8A97" }}>Data</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#3B82F6" }}>
            {selected.substring(10, 8)}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 30, color: "#CBD5E0" }}>|</Text>
        </View>
        <View style={{ alignItems: "center", marginRight: 40 }}>
          <Text style={{ fontSize: 14, color: "#7C8A97" }}>Time</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#3B82F6" }}>
            Cox's Bazar
          </Text>
        </View>
      </View>
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          style={{ backgroundColor: "#3498db", borderRadius: 10 }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              color: "#FFF",
              paddingVertical: 15,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
