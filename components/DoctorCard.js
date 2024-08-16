import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import lightTheme from "../Themes/LightTheme";

const DoctorCard = ({ item, closeModal, isBook }) => {
  const navigation = useNavigation();

  useEffect(() => {
    console.log("Data from doctor card: ", item);
  });

  return (
    <Pressable
      onPress={() => {
        closeModal();
        navigation.navigate("DoctorDetail", {
          item: item,
        });
      }}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item?.user?.avatar }} style={styles.image} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.user.fullName}</Text>
            <Text style={styles.specialty}>{item.specialization}</Text>
          </View>
          {isBook ? (
            <Text style={styles.valueText}>$350</Text>
          ) : (
            <Pressable
              style={styles.button}
              onPress={() => {
                closeModal();
                navigation.navigate("BookingScreen", {
                  item: item,
                });
              }}
            >
              <Text style={styles.buttonText}>Book Appointment</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    flexDirection: "row", // Ensure the image, text, and button are in a row
    width: "100%",
    backgroundColor: "#FFF",
  },
  imageContainer: {
    flex: 1, // Take up one third of the card width
    justifyContent: "center",
  },
  image: {
    width: 80, // Adjust as needed
    height: 80, // Adjust as needed
    borderRadius: 40, // Adjust as needed
    alignSelf: "center",
  },
  textContainer: {
    flex: 2, // Take up two thirds of the card width
    paddingLeft: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  specialty: {
    fontSize: 12,
    color: "#666",
  },
  button: {
    backgroundColor: lightTheme.colors.secondaryBtn,
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  valueText: {
    fontSize: 30,
    fontWeight: "bold",
    color: lightTheme.colors.secondaryBtn,
    alignSelf: "center",
  },
});

export default DoctorCard;
