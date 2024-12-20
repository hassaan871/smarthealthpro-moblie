import { StyleSheet } from "react-native";

// Configuration object that matches web project colors
const APPOINTMENT_CONFIGS = {
  priority: {
    low: {
      backgroundColor: "#17a2b8", // info color
      textColor: "#ffffff",
    },
    moderate: {
      backgroundColor: "#28a745", // success color
      textColor: "#ffffff",
    },
    severe: {
      backgroundColor: "#ffc107", // warning color
      textColor: "#000000",
    },
    "high severe": {
      backgroundColor: "#dc3545", // danger color
      textColor: "#ffffff",
    },
  },
  status: {
    tbd: {
      backgroundColor: "#6c757d", // badge-secondary
      textColor: "#ffffff",
    },
    pending: {
      backgroundColor: "#ffc107", // badge-warning
      textColor: "#000000",
    },
    visited: {
      backgroundColor: "#198754", // badge-success
      textColor: "#ffffff",
    },
    cancelled: {
      backgroundColor: "#dc3545", // badge-danger
      textColor: "#ffffff",
    },
  },
};

// Helper function to get style based on priority
export const getPriorityStyle = (priority) => {
  const normalizedPriority = priority.toLowerCase();
  const config = APPOINTMENT_CONFIGS.priority[normalizedPriority];
  if (!config) return {};

  return {
    backgroundColor: config.backgroundColor,
    color: config.textColor,
  };
};

// Helper function to get style based on status
export const getStatusStyle = (status) => {
  const normalizedStatus = status.toLowerCase();
  const config = APPOINTMENT_CONFIGS.status[normalizedStatus];
  if (!config) return {};

  return {
    backgroundColor: config.backgroundColor,
    color: config.textColor,
  };
};

// Combined styles object
export const styles = StyleSheet.create({
  // Main Container
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

  // Update/add these styles in your StyleSheet
  // Update these styles in your StyleSheet
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Changed to flex-start
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderTopColor: "#333333",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70, // Added minimum width
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  actionButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Filter Section
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

  // List and Appointment Cards
  listContainer: {
    padding: 20,
  },
  appointmentCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    marginBottom: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  appointmentInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: "#B0B0B0",
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: "#B0B0B0",
  },

  // Status and Priority
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },

  noteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  prescriptionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },

  // Modal Base Styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalView: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#3C3C3E",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  modalText: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },

  // Notes Modal Specific
  notesList: {
    width: "100%",
  },
  noteCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#4A90E2",
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },
  noteText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
  },
  noteDivider: {
    height: 1,
    backgroundColor: "#3C3C3E",
    marginVertical: 15,
  },

  // Prescription Modal Specific
  prescriptionScrollView: {
    width: "100%",
  },
  prescriptionCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#32CD32",
  },
  prescriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  prescriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  prescriptionDetailsContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  prescriptionDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  prescriptionDetailLabel: {
    color: "#888",
    fontSize: 14,
  },
  prescriptionDetailText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  // Review Modal Specific
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  reviewInput: {
    width: "100%",
    height: 120,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 15,
    color: "#fff",
    textAlignVertical: "top",
    marginBottom: 20,
    fontSize: 15,
  },

  // Common Input Styles
  inputContainer: {
    width: "100%",
    marginTop: 15,
  },
  textInput: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 15,
    color: "#fff",
    fontSize: 15,
  },

  // Button Styles
  submitButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  button: {
    borderRadius: 12,
    padding: 15,
    minWidth: 120,
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: "#FF6B6B",
  },
  buttonConfirm: {
    backgroundColor: "#4A90E2",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Empty States
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#1C1C1E",
    margin: 15,
    borderRadius: 12,
  },
  emptyStateText: {
    color: "#888",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },

  // Loading State
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  // Enhanced Modal Styles
  enhancedModalView: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    padding: 20,
  },
  enhancedNotesList: {
    padding: 16,
  },
  enhancedNoteCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#4A90E2",
  },
  enhancedNoteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  enhancedNoteDate: {
    color: "#4A90E2",
    fontSize: 14,
    marginLeft: 6,
  },
  enhancedNoteText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
  },
});

export default {
  styles,
  getPriorityStyle,
  getStatusStyle,
  APPOINTMENT_CONFIGS,
};
