// MessageStatus.js
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const MessageStatus = ({ message, userId, lastReadTimestamp, receiverId }) => {
  if (message.sender !== userId) return null;

  // Once a message is marked as read, it should stay that way
  const hasBeenRead =
    lastReadTimestamp &&
    lastReadTimestamp[receiverId] &&
    new Date(lastReadTimestamp[receiverId]) >= new Date(message.timestamp);

  // If message is read, show blue ticks regardless of online status
  if (hasBeenRead) {
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", marginLeft: 4 }}
      >
        <Text>
          <Ionicons name="checkmark-done" size={16} color="#34B7F1" />
        </Text>
      </View>
    );
  }

  // If message is delivered, show darker grey double tick
  if (message.isDelivered) {
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", marginLeft: 4 }}
      >
        <Text>
          <Ionicons name="checkmark-done" size={16} color="#666666" />
        </Text>
      </View>
    );
  }

  useEffect(() => {
    console.log("message content: ", message);
  }, [message]);

  // For just sent messages, show lighter grey single tick
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 4 }}>
      <Text>
        <Ionicons name="checkmark" size={16} color="#B0B0B0" />
      </Text>
    </View>
  );
};

export default MessageStatus;
