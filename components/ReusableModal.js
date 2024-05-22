import React from "react";
import { Modal, View, Text, Image, Pressable, StyleSheet } from "react-native";

const ReusableModal = ({
  modalVisible,
  setModalVisible,
  title,
  message,
  imageSource,
  onClose,
  IsBtn,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={imageSource}
            style={{ width: 100, height: 100, marginBottom: 20 }}
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{message}</Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(false);
              onClose && onClose(); // Call onClose if provided
            }}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#64C5B1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a5568",
    textAlign: "center",
    marginBottom: 25,
  },
});

export default ReusableModal;
