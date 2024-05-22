import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import lightTheme from "../Themes/LightTheme";

const PopularCard = ({ item }) => {
  const navigation = useNavigation();

  const screenWidth = Dimensions.get("window").width;

  // Calculate the width dynamically based on the screen size
  const cardWidth = (screenWidth - 32) / 2; // Adjust the width as needed

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("DoctorDetail", {
          item: item,
        });
      }}
    >
      <View style={styles.container}>
        <View style={{ ...styles.card, width: cardWidth }}>
          <Image source={{ uri: item.pictureUrl }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    // backgroundColor: lightTheme.colors.primaryCard,
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  name: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
    // color: lightTheme.colors.primaryText,
    color: "#007fff",
  },
  specialty: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "400",
    // color: lightTheme.colors.primaryText,
    color: "gray",
  },
});

export default PopularCard;
