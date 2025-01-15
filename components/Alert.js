import React from "react";
import { Portal, Dialog, Text, Button } from "react-native-paper";

const Alert = ({ visible, onDismiss, message, type, actions = [] }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{type === "success" ? "Success" : "Error"}</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {actions.length > 0 ? (
            actions.map((action, index) => (
              <Button
                key={index}
                onPress={action.onPress}
                style={{ marginRight: 10 }}
              >
                {action.text}
              </Button>
            ))
          ) : (
            <Button onPress={onDismiss}>OK</Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default Alert;
