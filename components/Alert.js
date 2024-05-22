import React from "react";
import { Portal, Dialog, Text } from "react-native-paper";

const Alert = ({ visible, onDismiss, message, type }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{type === "success" ? "Success" : "Error"}</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Text onPress={onDismiss}>OK</Text>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default Alert;
