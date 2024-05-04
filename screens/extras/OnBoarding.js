import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const items = [
  {
    title: "Your Health, Simplified!",
    description:
      "Chat with our AI bot for instant medical support and appointment bookings. Snap a pic of your prescription, and we'll handle the rest. It's that easy!",
    image: require("../../assets/Chat bot-rafiki.png"),
  },
  {
    title: "Doctor in Your Pocket!",
    description:
      "Connect with real doctors in seconds for consultations, anytime, anywhere. Need a prescription decoded? We've got you covered – just snap and send!",
    image: require("../../assets/Medical prescription-rafiki.png"),
  },
  {
    title: "Healthcare, Made Effortless!",
    description:
      "Say goodbye to paperwork and confusion. Chat with our AI for all your health needs, and breeze through prescriptions with our image recognition tech. Welcome to hassle-free healthcare!",
    image: require("../../assets/Medicine-rafiki.png"),
  },
];

const OnBoardingScreen = () => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const navigation = useNavigation();

  const handleContinue = () => {
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 0.2 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View style={{ height: 24, width: 24 }}></View>
          <TouchableOpacity
            onPress={() => setCurrentItemIndex(items.length - 1)}
          >
            <Text style={{ color: "#007BFF", fontWeight: "600", top: 40 }}>
              skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 0.6 }}>
        <View style={{ paddingHorizontal: 20, marginTop: 40 }}>
          <Image
            source={items[currentItemIndex].image}
            resizeMode="contain"
            style={{ width: "100%", height: "75%" }}
          />
        </View>
        <View
          style={{ alignItems: "center", paddingHorizontal: 20, marginTop: 40 }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}>
            {items[currentItemIndex].title}
          </Text>
          <Text style={{ fontSize: 16, color: "#6B7280", marginTop: 10 }}>
            {items[currentItemIndex].description}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            {items.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 4,
                  width: 4,
                  borderRadius: 2,
                  backgroundColor:
                    index === currentItemIndex ? "#007BFF" : "#E5E7EB",
                  marginHorizontal: 1,
                }}
              />
            ))}
          </View>
        </View>
      </View>
      <View style={{ flex: 0.2, top: 80, padding: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#007BFF",
            borderRadius: 8,
            paddingVertical: 12,
          }}
          onPress={handleContinue}
        >
          <Text
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {currentItemIndex === items.length - 1 ? "Finish" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnBoardingScreen;
