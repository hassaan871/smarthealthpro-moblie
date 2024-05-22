import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import lightTheme from "../Themes/LightTheme";

const Alert2 = ({
  title,
  message,
  onDelete,
  modalVisible,
  setModalVisible,
  btnClicked,
}) => {
  const onCancel = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={modalVisible}
      onRequestClose={onCancel} // This handles Android's back button press
    >
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDelete}
              style={{
                ...styles.deleteButton,
                backgroundColor:
                  btnClicked === "Delete"
                    ? "red"
                    : lightTheme.colors.secondaryBtn,
              }}
            >
              <Text style={styles.buttonText}>{btnClicked}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    maxWidth: "90%",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 8,
  },
  message: {
    color: "#718096",
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: "#CBD5E0",
    marginRight: 8,
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default Alert2;
