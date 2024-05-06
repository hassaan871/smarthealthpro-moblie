import React from "react";
import { View, Text, Image, Pressable } from "react-native";

const DoctorDetailPage = ({ route }) => {
  const item = route.params.item;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f0f4f7",
        marginTop: 50,
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: "https://via.placeholder.com/300x300" }}
        style={{ width: 120, height: 120, borderRadius: 60 }}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>
        {item.name}
      </Text>
      <Text style={{ color: "#666", marginBottom: 10 }}>{item.specialty}</Text>
      <Text style={{ padding: 15 }}>
        Dr. John Doe has over 10 years of experience in cardiology, specializing
        in treating heart conditions and promoting heart health.
      </Text>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Contact Information:
        </Text>
        <Text>Phone: (123) 456-7890</Text>
        <Text>Email: johndoe@example.com</Text>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Office Hours:</Text>
        <Text>Mon - Fri: 9 AM - 5 PM</Text>
      </View>
      <Pressable
        style={{
          backgroundColor: "#007bff",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Book Appointment
        </Text>
      </Pressable>
    </View>
  );
};

export default DoctorDetailPage;
