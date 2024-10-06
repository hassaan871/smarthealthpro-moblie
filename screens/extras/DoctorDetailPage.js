import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

const DoctorDetailPage = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Get route object
  const { item } = route.params; // Access item from route params

  useEffect(() => {
    console.log("item from detail sceen: ", item);
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

    console.log(
      `Sanitized Rating: ${sanitizedRating}, Full Stars: ${fullStars}, Half Star: ${halfStar}, Empty Stars: ${emptyStars}`
    );

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

  const OfficeHoursComponent = ({ officeHours }) => {
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
      officeHours;

    // Determine if the weekday hours (Monday to Friday) are the same
    const weekdaysSame =
      monday === tuesday &&
      tuesday === wednesday &&
      wednesday === thursday &&
      thursday === friday;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Office Hours</Text>

        {weekdaysSame && (
          <View style={styles.officeHoursItem}>
            <Text style={styles.dayText}>Monday - Friday</Text>
            <Text style={styles.hoursText}>{monday}</Text>
          </View>
        )}

        {!weekdaysSame && (
          <>
            <View style={styles.officeHoursItem}>
              <Text style={styles.dayText}>Monday</Text>
              <Text style={styles.hoursText}>{monday}</Text>
            </View>
            <View style={styles.officeHoursItem}>
              <Text style={styles.dayText}>Tuesday</Text>
              <Text style={styles.hoursText}>{tuesday}</Text>
            </View>
            <View style={styles.officeHoursItem}>
              <Text style={styles.dayText}>Wednesday</Text>
              <Text style={styles.hoursText}>{wednesday}</Text>
            </View>
            <View style={styles.officeHoursItem}>
              <Text style={styles.dayText}>Thursday</Text>
              <Text style={styles.hoursText}>{thursday}</Text>
            </View>
            <View style={styles.officeHoursItem}>
              <Text style={styles.dayText}>Friday</Text>
              <Text style={styles.hoursText}>{friday}</Text>
            </View>
          </>
        )}

        <View style={styles.officeHoursItem}>
          <Text style={styles.dayText}>Saturday</Text>
          <Text style={styles.hoursText}>{saturday}</Text>
        </View>

        <View style={styles.officeHoursItem}>
          <Text style={styles.dayText}>Sunday</Text>
          <Text style={styles.hoursText}>{sunday}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.navigate("HomeScreen");
            }}
          >
            <Icon name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Doctor Profile</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Icon name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.doctorInfo}>
          <Image
            source={{
              uri:
                item?.user.avatar?.url?.length > 0
                  ? item?.user.avatar?.url
                  : item?.user?.avatar,
            }}
            style={styles.doctorImage}
          />
          <Text style={styles.doctorName}>{item.user.fullName}</Text>
          <Text style={styles.doctorSpecialty}>{item.specialization}</Text>
          <View style={styles.ratingContainer}>
            {renderStars(item?.rating)}
            <Text style={styles.reviewCount}>
              {item?.rating} ({item.reviewCount} reviews)
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionContent}>{item?.about}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Icon name="mail-outline" size={20} color="#4A90E2" />
            <Text style={styles.contactText}>{item?.user.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <OfficeHoursComponent officeHours={item?.officeHours} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {item.education.map((item) => (
            <View key={item._id} style={styles.educationItem}>
              <Text style={styles.degreeText}>{item.degree}</Text>
              <Text style={styles.schoolText}>{item.institution}</Text>
              <Text style={styles.yearText}>{item.year}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.bookAppointmentButton}
          onPress={() => {
            navigation.navigate("BookingScreen", {
              doctorInfo: item,
            });
          }}
        >
          <Text style={styles.bookAppointmentText}>Book Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  moreButton: {
    padding: 5,
  },
  doctorInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: "#B0B0B0",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewCount: {
    marginLeft: 5,
    color: "#B0B0B0",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: "#B0B0B0",
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contactText: {
    marginLeft: 10,
    color: "#B0B0B0",
  },
  officeHoursItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  dayText: {
    color: "#B0B0B0",
  },
  hoursText: {
    color: "#fff",
  },
  educationItem: {
    marginBottom: 15,
  },
  degreeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  schoolText: {
    fontSize: 14,
    color: "#B0B0B0",
  },
  yearText: {
    fontSize: 14,
    color: "#B0B0B0",
  },
  bookAppointmentButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  bookAppointmentText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DoctorDetailPage;
