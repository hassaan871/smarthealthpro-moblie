import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const items = [
  {
    title: "Chat with Real Doctors Instantly!",
    description:
      "Connect with qualified doctors anytime, anywhere! Use our chat feature to ask questions, share documents. Get immediate support for your health concerns with personalized advice at your fingertips!",
    image: require("../../assets/Chat bot-rafiki.png"),
  },
  {
    title: "Personal Health Assistant!",
    description:
      "Get instant answers to health questions with our AI bot! It prioritizes you by asking smart questions, helping you understand your symptoms and guiding you to the right care!",
    image: require("../../assets/Medical prescription-rafiki.png"),
  },
  {
    title: "Book Appointments with Ease!",
    description:
      "Scheduling health appointments has never been easier! Simply choose preferred doctor, select a time, and book your visit from the comfort of home. Let us handle the rest so you can focus on what matters, your health!",
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

  useEffect(() => {
    const checkUserToken = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        console.log("auto logging in: ", userToken);
        navigation.navigate("HomeScreen");
      } else {
        console.log("no user token found");
      }
    };

    console.log("entering useeffect");
    checkUserToken();
    console.log("exiting useeffect");
  }, []);

  return (
    <View
      source={require("../../assets/bg.png")}
      style={{ flex: 1, backgroundColor: "#1E1E1E" }}
    >
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
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "#4A90E2", fontWeight: "600", top: 40 }}>
              skip
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={{ flex: 0.6 }}>
        <View style={{}}>
          <Image
            source={items[currentItemIndex].image}
            resizeMode="contain"
            style={{ width: "100%", height: "85%" }}
          />
        </View>
        <View style={{ alignItems: "center", paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            {items[currentItemIndex].title}
          </Text>
          <Text style={{ fontSize: 14, color: "#fff", marginTop: 10 }}>
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
                    index === currentItemIndex ? "#4A90E2" : "#E5E7EB",
                  marginHorizontal: 1,
                }}
              />
            ))}
          </View>
        </View>
      </View>
      <View style={{ flex: 0.2, top: 80, padding: 20 }}>
        <Pressable
          style={{
            backgroundColor: "#4A90E2",
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
        </Pressable>
      </View>
    </View>
  );
};

export default OnBoardingScreen;
