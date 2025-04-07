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
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Context from "../Helper/context";
import CutomBottomBar from "./tabNavScreens/CutomBottomBar";
import { appBarClasses } from "@mui/material";
import { encrypt, decrypt } from "./extras/EncryptionUtils";
import {
  getPriorityStyle,
  getStatusStyle,
  styles,
} from "./extras/appointment-styles";
import Alert from "../components/Alert";
import showAlertMessage from "../Helper/AlertHelper";

const AppointmentsScreen = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [seeNotesModalVisible, setSeeNotesModalVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const { userInfo, setUserInfo, popularDoctors, setPopularDoctors } =
    useContext(Context);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Add these new state variables at the top of your component
  const [prescriptionModalVisible, setPrescriptionModalVisible] =
    useState(false);
  const [prescription, setPrescription] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const [selectedNote, setSelectedNote] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // success or error
  const [alertActions, setAlertActions] = useState([]); // actions for alert buttons

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
      const link = `http://192.168.18.40:5000/appointment/getAllAppointments?${
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
    console.log("appointmentId: ", appointmentId);
    setCancelConfirmation(true);
    setSelectedAppointment({ _id: appointmentId });
    try {
      setIsLoading(true);
      await confirmCancellation(appointmentId);
    } catch (error) {
      console.error("Error canceling appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCancellation = async (appointmentId) => {
    try {
      await axios.patch(
        `http://192.168.18.40:5000/appointment/${appointmentId}/cancel`
      );
      fetchAllAppointments(); // Refresh the list
      setCancelConfirmation(false);
      showAlertMessage(
        setShowAlert,
        setAlertMessage,
        setAlertType,
        setAlertActions,
        "Appointment canceled successfully.",
        "success",
        [{ text: "OK", onPress: () => setShowAlert(false) }]
      );
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        showAlertMessage(
          setShowAlert,
          setAlertMessage,
          setAlertType,
          setAlertActions,
          `Error canceling appointment: ${error.response.data.message}`,
          "error",
          [{ text: "OK", onPress: () => setShowAlert(false) }]
        );
      } else if (error.request) {
        // Request was made but no response received
        showAlertMessage(
          setShowAlert,
          setAlertMessage,
          setAlertType,
          setAlertActions,
          "Error canceling appointment: No response received from server.",
          "error",
          [{ text: "OK", onPress: () => setShowAlert(false) }]
        );
        console.error(
          "Error canceling appointment: No response received",
          error.request
        );
      } else {
        // Something else happened while setting up the request
        showAlertMessage(
          setShowAlert,
          setAlertMessage,
          setAlertType,
          setAlertActions,
          `Error canceling appointment: ${error.message}`,
          "error",
          [{ text: "OK", onPress: () => setShowAlert(false) }]
        );
        console.error("Error canceling appointment:", error.message);
      }
    }
  };

  const submitReview = async () => {
    try {
      await axios.post("http://192.168.18.40:5000/review/addReview", {
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

  const fetchNotes = async (appointment) => {
    if (!appointment?.patient?.id) {
      console.error("Invalid appointment structure");
      return;
    }

    setIsLoading(true);
    try {
      const patientId = appointment.patient.id;
      let doctorId;

      if (userInfo.role === "doctor") {
        // Doctor sees only their own notes
        doctorId = userInfo._id;
      } else {
        // Patient sees notes only from the appointment's doctor
        doctorId = appointment.doctor.id;
      }

      const link = `http://192.168.18.40:5000/user/getMatchingNotes`;
      const response = await axios.get(link, {
        params: {
          doctorId,
          patientId,
          appointmentId: appointment._id, // Add this to filter notes by appointment
        },
      });

      const notes = response.data.notes || [];

      // Decrypt notes
      const decryptedNotes = await Promise.all(
        notes.map(async (note) => ({
          ...note,
          note: await decrypt(note?.note),
        }))
      );

      setNotes(decryptedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("Failed to fetch notes");
    } finally {
      setIsLoading(false);
    }
  };

  // Update fetchPrescriptions to use the correct endpoint
  // Update the fetchPrescriptions function
  const fetchPrescriptions = async (appointment) => {
    if (!appointment?.patient?.id) {
      console.error("Invalid appointment structure");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.18.40:5000/appointment/${appointment.patient.id}/prescription`
      );

      if (response.data.success) {
        // Filter prescriptions for current doctor and appointment
        const filteredPrescriptions = response.data.data.filter((record) => {
          return record.appointmentId === appointment._id;
        });

        // Decrypt prescriptions
        const decryptedPrescriptions = await Promise.all(
          filteredPrescriptions.map(async (record) => ({
            ...record,
            prescriptions: await Promise.all(
              record.prescriptions.map(async (prescription) => ({
                ...prescription,
                medication: await decrypt(prescription.medication),
                dosage: await decrypt(prescription.dosage),
                frequency: await decrypt(prescription.frequency),
                duration: await decrypt(prescription.duration),
                instructions: await decrypt(prescription.instructions),
              }))
            ),
          }))
        );
        console.log(
          "filteredPrescriptions: ",
          JSON.stringify(filteredPrescriptions)
        );
        // Set prescriptions
        setPrescriptions(decryptedPrescriptions);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      alert("Failed to fetch prescriptions");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a validation helper
  const validatePrescription = (prescription) => {
    return (
      prescription.medication &&
      prescription.dosage &&
      prescription.frequency &&
      prescription.duration &&
      prescription.instructions
    );
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri:
              item?.patient?.avatar?.url?.length > 0
                ? item?.patient?.avatar?.url
                : item?.patient?.avatar,
          }}
          style={styles.avatar}
        />
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
            {
              backgroundColor: getStatusStyle(item.appointmentStatus)
                .backgroundColor,
              color: getStatusStyle(item.appointmentStatus).color,
            },
          ]}
        >
          {item.appointmentStatus.toUpperCase()}
        </Text>
        <Text
          style={[
            styles.priorityText,
            {
              backgroundColor: getPriorityStyle(item.priority).backgroundColor,
              color: getPriorityStyle(item.priority).color,
            },
          ]}
        >
          {item.priority.toUpperCase()}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        {item.appointmentStatus === "pending" && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={async () => {
                setSelectedAppointment(item);
                try {
                  await fetchNotes(item);
                  if (userInfo.role === "doctor") {
                    setNotesModalVisible(true);
                  } else {
                    setSeeNotesModalVisible(true);
                  }
                } catch (error) {
                  console.error("Error in notes button press handler:", error);
                }
              }}
            >
              <Icon2 name="edit-note" size={20} color="#4A90E2" />
              <Text style={styles.actionButtonText}>Notes</Text>
            </TouchableOpacity>

            {userInfo.role === "doctor" ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={async () => {
                  setSelectedAppointment(item);
                  try {
                    await fetchPrescriptions(item);
                    setPrescriptionModalVisible(true);
                  } catch (error) {
                    console.error("Error fetching prescriptions:", error);
                  }
                }}
              >
                <Icon2 name="medical-services" size={20} color="#32CD32" />
                <Text style={styles.actionButtonText}>Prescription</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={async () => {
                    setSelectedAppointment(item);
                    try {
                      await fetchPrescriptions(item);
                      setPrescriptionModalVisible(true);
                    } catch (error) {
                      console.error("Error fetching prescriptions:", error);
                    }
                  }}
                >
                  <Icon2 name="medical-services" size={20} color="#32CD32" />
                  <Text style={styles.actionButtonText}>Prescription</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setSelectedAppointment(item);
                    setReviewModalVisible(true);
                  }}
                >
                  <Icon name="star-outline" size={20} color="#FFD700" />
                  <Text style={styles.actionButtonText}>Review</Text>
                </TouchableOpacity>
              </>
            )}

            {item.appointmentStatus === "pending" && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => cancelAppointment(item._id)}
              >
                <Icon name="close-outline" size={20} color="#FF6B6B" />
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </>
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

  // Enhanced Notes Modal (View Only)
  const NotesModal = ({
    visible,
    onClose,
    notes,
    userRole,
    selectedAppointment,
  }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.enhancedModalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {userRole === "doctor"
                ? `Notes for ${selectedAppointment?.patient?.name}`
                : `Notes from Dr. ${selectedAppointment?.doctor?.name}`}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.enhancedNotesList}>
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <View key={index} style={styles.enhancedNoteCard}>
                  <View style={styles.enhancedNoteHeader}>
                    <Text style={styles.enhancedNoteDate}>
                      {new Date(note.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.enhancedNoteText}>{note?.note}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Icon name="document-text-outline" size={48} color="#666" />
                <Text style={styles.emptyStateText}>No notes available</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Enhanced Prescription Modal (View Only)
  const PrescriptionModal = ({ visible, onClose, prescriptions }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.enhancedModalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Prescriptions</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.prescriptionScrollView}>
            {prescriptions.length > 0 ? (
              prescriptions.map((record, index) => (
                <View key={index} style={styles.prescriptionCard}>
                  <View style={styles.prescriptionHeader}>
                    <Text style={styles.prescriptionTitle}>
                      {record.doctorName}
                    </Text>
                    <Text style={styles.prescriptionDate}>{record.date}</Text>
                  </View>

                  {record.prescriptions.map((prescription, pIndex) => (
                    <View
                      key={pIndex}
                      style={styles.prescriptionDetailsContainer}
                    >
                      <Text style={styles.prescriptionTitle}>
                        {prescription.medication}
                      </Text>
                      <View style={styles.prescriptionDetail}>
                        <Text style={styles.prescriptionDetailLabel}>
                          Dosage:
                        </Text>
                        <Text style={styles.prescriptionDetailText}>
                          {prescription.dosage}
                        </Text>
                      </View>
                      <View style={styles.prescriptionDetail}>
                        <Text style={styles.prescriptionDetailLabel}>
                          Frequency:
                        </Text>
                        <Text style={styles.prescriptionDetailText}>
                          {prescription.frequency}
                        </Text>
                      </View>
                      <View style={styles.prescriptionDetail}>
                        <Text style={styles.prescriptionDetailLabel}>
                          Duration:
                        </Text>
                        <Text style={styles.prescriptionDetailText}>
                          {prescription.duration}
                        </Text>
                      </View>
                      <View style={styles.prescriptionDetail}>
                        <Text style={styles.prescriptionDetailLabel}>
                          Instructions:
                        </Text>
                        <Text style={styles.prescriptionDetailText}>
                          {prescription.instructions}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Icon name="medical" size={48} color="#666" />
                <Text style={styles.emptyStateText}>
                  No prescriptions available
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const ReviewModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={reviewModalVisible}
      onRequestClose={() => setReviewModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Write a Review</Text>
            <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
              <Icon name="close-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

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
            placeholder="Share your experience..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            value={review}
            onChangeText={setReview}
          />

          <TouchableOpacity
            style={[styles.submitButton, !rating && { opacity: 0.5 }]}
            onPress={submitReview}
            disabled={!rating}
          >
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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

      <NotesModal
        visible={notesModalVisible || seeNotesModalVisible}
        onClose={() => {
          if (userInfo.role === "doctor") {
            setNotesModalVisible(false);
          } else {
            setSeeNotesModalVisible(false);
          }
        }}
        notes={notes}
        userRole={userInfo.role}
        selectedAppointment={selectedAppointment}
      />

      <PrescriptionModal
        visible={prescriptionModalVisible}
        onClose={() => setPrescriptionModalVisible(false)}
        prescriptions={prescriptions}
        userRole={userInfo.role}
      />

      <ReviewModal />

      <CutomBottomBar active={"appointments"} />

      <Alert
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        message={alertMessage}
        type={alertType}
        actions={alertActions}
      />
    </SafeAreaView>
  );
};

export default AppointmentsScreen;
