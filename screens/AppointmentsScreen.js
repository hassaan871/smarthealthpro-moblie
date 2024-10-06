import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Context from "../Helper/context";
import CutomBottomBar from "./tabNavScreens/CutomBottomBar";
import { appBarClasses } from "@mui/material";

const AppointmentsScreen = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [seeNotesModalVisible, setSeeNotesModalVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [note, setNotes] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const { userInfo, setUserInfo, popularDoctors, setPopularDoctors } =
    useContext(Context);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllAppointments();
  }, [userInfo]);

  useEffect(() => {
    filterAppointments();
  }, [allAppointments, filterStatus]);

  const fetchAllAppointments = async () => {
    try {
      const userID = userInfo._id;
      console.log("user id is from all appointments: ", userID);
      const link = `http://192.168.1.35:5000/appointment/getAllAppointments?${
        userInfo.role === "doctor" ? "doctorId" : "patientId"
      }=${userID}`;

      if (userID) {
        const response = await axios.get(link);
        setAllAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const filterAppointments = () => {
    let filtered = allAppointments;
    if (filterStatus !== "all") {
      filtered = allAppointments.filter(
        (app) => app.appointmentStatus === filterStatus
      );
    }
    const sorted = sortAppointments(filtered);
    setFilteredAppointments(sorted);
  };

  const sortAppointments = (apps) => {
    const statusPriority = { tbd: 3, pending: 2, visited: 1, cancelled: 0 };
    const priorityOrder = { high: 2, medium: 1, low: 0 };
    return apps.sort((a, b) => {
      if (a.appointmentStatus !== b.appointmentStatus) {
        return (
          statusPriority[b.appointmentStatus] -
          statusPriority[a.appointmentStatus]
        );
      }
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.date) - new Date(a.date);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAllAppointments().then(() => setRefreshing(false));
  }, []);

  const cancelAppointment = async (appointmentId) => {
    setCancelConfirmation(true);
    setSelectedAppointment({ _id: appointmentId });
  };

  const confirmCancellation = async () => {
    try {
      await axios.delete(
        `http://192.168.1.35:5000/appointment/cancelAppointment/${selectedAppointment._id}`
      );
      fetchAllAppointments(); // Refresh the list
      setCancelConfirmation(false);
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
  };

  const submitReview = async () => {
    try {
      await axios.post("http://192.168.1.35:5000/review/addReview", {
        appointmentId: selectedAppointment._id,
        rating,
        comment: review,
      });
      setModalVisible(false);
      setReview("");
      setRating(0);
      fetchAllAppointments(); // Refresh the list to show updated review status
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  const submitNotes = async () => {
    console.log("appointment id is: ", selectedAppointment._id);
    try {
      await axios.post("http://192.168.1.35:5000/user/addNotes", {
        appointmentId: selectedAppointment._id,
        note: note,
      });
      setNotesModalVisible(false);
      setNotes("");
      fetchAllAppointments(); // Refresh the list to show updated review status
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const fetchNotes = async (appointment) => {
    console.log("fetchNotes called");
    console.log("selectedAppointment:", appointment);

    if (!appointment || !appointment.patient || !appointment.patient.id) {
      console.error("Invalid selectedAppointment structure");
      return;
    }

    const patientId = appointment.patient.id;
    console.log("fetching notes for patient ID:", patientId);

    const link = `http://192.168.1.35:5000/user/getUserInfo/${patientId}`;
    console.log("API request URL:", link);

    setIsLoading(true);
    try {
      const response = await axios.get(link);
      console.log("API response:", response.data.user.notes);
      const notes = response.data.user.notes;

      console.log("notes doctor id: ", notes[0].doctorId);
      console.log("user id: ", userInfo._id);
      const doctorNote = notes.find((note) => note.doctorId === userInfo._id);
      console.log("doctor note: ", doctorNote.note);
      setNotes(doctorNote.note); // Assuming the notes are in the response data
      // fetchAllAppointments(); // This line seems unnecessary here
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: item.patient.avatar }} style={styles.avatar} />
        <View style={styles.appointmentInfo}>
          <Text style={styles.name}>
            {userInfo.role === "doctor" ? item.patient.name : item.doctor.name}
          </Text>
          {item.appointmentStatus === "tbd" ? (
            <Text style={styles.location}></Text>
          ) : (
            <>
              <Text style={styles.date}>{`${item.date} at ${item.time}`}</Text>
              <Text style={styles.location}>{item.location}</Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            styles[
              `status${
                item.appointmentStatus.charAt(0).toUpperCase() +
                item.appointmentStatus.slice(1)
              }`
            ],
          ]}
        >
          {item.appointmentStatus.toUpperCase()}
        </Text>
        <Text
          style={[
            styles.priorityText,
            styles[
              `priority${
                item.priority.charAt(0).toUpperCase() + item.priority.slice(1)
              }`
            ],
          ]}
        >
          {item.priority.toUpperCase()}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        {item.appointmentStatus === "visited" && (
          <>
            <TouchableOpacity
              style={styles.noteButton}
              onPress={async () => {
                console.log("Notes button pressed");
                setSelectedAppointment(item);
                console.log("Selected appointment:", item);

                try {
                  await fetchNotes(item);
                  console.log("fetchNotes completed");

                  if (userInfo.role === "doctor") {
                    // console.log(
                    //   "Setting notesModalVisible to true: ",
                    //   selectedAppointment
                    // );
                    setNotesModalVisible(true);
                  } else {
                    console.log("Setting seeNotesModalVisible to true");
                    setSeeNotesModalVisible(true);
                  }
                } catch (error) {
                  console.error("Error in notes button press handler:", error);
                }
              }}
            >
              <Icon2 name="edit-note" size={30} color="#4A90E2" />
              <Text style={{ ...styles.actionButtonText, top: 8 }}>Notes</Text>
            </TouchableOpacity>

            {userInfo.role === "patient" && (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => {
                  setSelectedAppointment(item);
                  setReviewModalVisible(true);
                }}
              >
                <Icon name="star-outline" size={20} color="#FFD700" />
                <Text style={{ ...styles.actionButtonText, top: 6 }}>
                  Review
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
        {(item.appointmentStatus === "tbd" ||
          item.appointmentStatus === "pending") && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => cancelAppointment(item._id)}
          >
            <Icon name="close-outline" size={30} color="#FF6B6B" />
            <Text style={{ ...styles.actionButtonText }}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {["all", "tbd", "pending", "visited", "cancelled"].map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.filterButton,
            filterStatus === status && styles.activeFilterButton,
          ]}
          onPress={() => setFilterStatus(status)}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === status && styles.activeFilterButtonText,
            ]}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color="#4A90E2" />}
      <View style={styles.header}>
        <Text style={styles.headerText}>All Appointments</Text>
      </View>
      {renderFilterButtons()}
      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPress={() => setReviewModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalView}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Review</Text>

            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Icon
                    name={star <= rating ? "star" : "star-outline"}
                    size={30}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder={"Write your review here"}
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              value={review}
              onChangeText={setReview}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitReview}
            >
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={seeNotesModalVisible}
        onRequestClose={() => setSeeNotesModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPress={() => setSeeNotesModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalView}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Notes</Text>
            <Text style={styles.modalText}>{note}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={notesModalVisible}
        onRequestClose={() => setNotesModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPress={() => setNotesModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalView}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Add Notes</Text>

            <TextInput
              style={styles.reviewInput}
              placeholder={"Write your note here"}
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              value={note}
              onChangeText={setNotes}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                submitNotes();
              }}
            >
              <Text style={styles.submitButtonText}>Submit Notes</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={cancelConfirmation}
        onRequestClose={() => setCancelConfirmation(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirm Cancellation</Text>
            <Text style={styles.modalText}>
              Are you sure you want to cancel this appointment?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setCancelConfirmation(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={confirmCancellation}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CutomBottomBar active={"appointments"} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#2C2C2E",
    margin: 4,
  },
  activeFilterButton: {
    backgroundColor: "#4A90E2",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  activeFilterButtonText: {
    fontWeight: "bold",
  },
  listContainer: {
    padding: 20,
  },
  appointmentCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    padding: 15,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center", // Center items vertically
    marginBottom: 10,
  },
  avatar: {
    width: 40, // Slightly smaller avatar
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  appointmentInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16, // Slightly smaller font
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2, // Reduced margin
  },
  date: {
    fontSize: 14,
    color: "#B0B0B0",
    marginBottom: 2, // Reduced margin
  },
  location: {
    fontSize: 14,
    color: "#B0B0B0",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  statusTbd: {
    backgroundColor: "#FFA500",
    color: "#000",
  },
  statusPending: {
    backgroundColor: "#4A90E2",
    color: "#FFF",
  },
  statusVisited: {
    backgroundColor: "#32CD32",
    color: "#FFF",
  },
  statusCancelled: {
    backgroundColor: "#FF6B6B",
    color: "#FFF",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  priorityHigh: {
    backgroundColor: "#FF6B6B",
    color: "#FFF",
  },
  priorityMedium: {
    backgroundColor: "#FFA500",
    color: "#000",
  },
  priorityLow: {
    backgroundColor: "#32CD32",
    color: "#FFF",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  actionButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 10,
  },
  noteButton: {
    flexDirection: "row",
    top: 10,
  },
  reviewButton: {
    flexDirection: "row",
    top: 13,
  },
  cancelButton: {
    flexDirection: "row",
    top: 3,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 10,
    color: "#fff",
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  reviewInput: {
    width: "100%",
    height: 100,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonCancel: {
    backgroundColor: "#FF6B6B",
  },
  buttonConfirm: {
    backgroundColor: "#4A90E2",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AppointmentsScreen;
