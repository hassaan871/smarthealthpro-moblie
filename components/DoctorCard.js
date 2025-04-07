import React, { useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Context from "../Helper/context";
import axios from "axios";

const DoctorCard = ({ item, isBook, closeModal }) => {
  const navigation = useNavigation();
  const { userInfo } = useContext(Context);

  useEffect(() => {
    // console.log("Data from doctor card: ", item);
    // console.log("item rating is not null: ", item?.rating);
  }, [item]);

  const renderStars = (rating) => {
    // Convert rating to a number and ensure it is valid
    const sanitizedRating = Number(rating);

    if (isNaN(sanitizedRating) || sanitizedRating < 0) {
      // If rating is invalid, return empty stars
      console.warn(`Invalid rating value: ${rating}`);
      return (
        <View style={styles.ratingContainer}>
          {Array.from({ length: 0 }, (_, index) => (
            <Icon
              key={`empty-${index}`}
              name="star-outline"
              size={16}
              color="#FFD700"
            />
          ))}
        </View>
      );
    }

    const fullStars = Math.floor(sanitizedRating); // Number of full stars
    const halfStar = sanitizedRating % 1 !== 0; // Determine if there is a half star
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0)); // Remaining empty stars

    // console.log(
    //   `Sanitized Rating: ${sanitizedRating}, Full Stars: ${fullStars}, Half Star: ${halfStar}, Empty Stars: ${emptyStars}`
    // );

    return (
      <View style={styles.ratingContainer}>
        {/* Render full stars */}
        {Array.from({ length: fullStars }, (_, index) => (
          <Icon key={`full-${index}`} name="star" size={16} color="#FFD700" />
        ))}

        {/* Render half star */}
        {halfStar && <Icon name="star-half" size={16} color="#FFD700" />}

        {/* Render empty stars */}
        {Array.from({ length: emptyStars }, (_, index) => (
          <Icon
            key={`empty-${index}`}
            name="star-outline"
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const handleChatPress = async (item) => {
    console.log("item from doctor card: ", item);

    try {
      const response = await axios.get(
        `http://192.168.18.40:5000/check-conversation/${userInfo._id}/${item.user._id}`
      );

      let conversationId = response.data.conversationId;

      navigation.navigate("ChatRoom", {
        item: item.user,
        convoID: conversationId,
      });
    } catch (error) {
      console.error("Error finding conversation: ", error);
    }
  };

  return (
    <Pressable
      onPress={() => {
        if (closeModal) {
          closeModal();
        }
        navigation.navigate("DoctorDetail", {
          item: item,
        });
      }}
    >
      <View style={styles.doctorCard}>
        <Image
          source={{
            uri:
              item?.user.avatar?.url?.length > 0
                ? item?.user.avatar?.url
                : item?.user?.avatar,
          }}
          style={styles.doctorCardImage}
        />
        <View style={styles.doctorCardInfo}>
          <Text style={styles.doctorCardName}>{item?.user?.fullName}</Text>
          <Text style={styles.doctorCardSpecialty}>{item?.specialization}</Text>
          <View style={styles.ratingContainer}>
            {renderStars(item?.rating)}
            <Text style={styles.reviewCount}>
              {item?.reviewCount || 0} reviews
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => {
            handleChatPress(item);
          }}
        >
          {!isBook && (
            <Icon
              name="chatbubble-ellipses-outline"
              size={24}
              color="#4A90E2"
            />
          )}
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  doctorCard: {
    flexDirection: "row",
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  doctorCardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  doctorCardInfo: {
    flex: 1,
  },
  doctorCardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  doctorCardSpecialty: {
    fontSize: 14,
    color: "#B0B0B0",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  reviewCount: {
    fontSize: 12,
    color: "#B0B0B0",
    marginLeft: 5,
  },
  chatButton: {
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DoctorCard;
