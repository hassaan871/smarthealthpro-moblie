// components/DialogflowModal.js
import React, { useState } from 'react';
import { View, Modal, Button, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DialogflowModal = ({ visible, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {isMinimized ? (
          <View style={styles.minimizedContainer}>
            <Button title="Open Chat" onPress={() => setIsMinimized(false)} />
          </View>
        ) : (
          <View style={styles.expandedContainer}>
            <WebView
              style={styles.webview}
              source={{
                uri: "https://console.dialogflow.com/api-client/demo/embedded/42f9c66a-25fd-4cf0-8ef7-126ae78c38a1",
              }}
            />
            <Button title="Close" onPress={onClose} />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  expandedContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  minimizedContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
});

export default DialogflowModal;
