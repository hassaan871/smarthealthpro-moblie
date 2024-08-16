import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, Paragraph, Text } from "react-native-paper";

const ScheduleCard = ({ item }) => {
  console.log(item);

  const formatDateTime = (dateTime) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateTime).toLocaleString("en-US", options);
  };

  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item?.doctor?.avatar }} style={styles.image} />
      <Card.Content style={{ flex: 1 }}>
        <Text
          style={{
            textAlign: "center",
            color: "gray",
            marginBottom: 4,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Dr. {item?.doctor?.name}
        </Text>
        {/* captalizating first words */}
        <Title style={styles.title}>
          Description:{" "}
          {item?.description?.replace(/\b\w/g, (char) => char.toUpperCase())}
        </Title>

        <Paragraph style={styles.text}>
          Time: {formatDateTime(item?.date)}
        </Paragraph>
        <Paragraph style={styles.text}>
          Status: {item?.appointmentStatus}
        </Paragraph>
        <Paragraph style={styles.text}>{item?.location}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 12,
    borderRadius: 10,
    elevation: 4,
    padding: 12,
    // backgroundColor: "#1a3555",
    // backgroundColor: "#141b35",
    // backgroundColor: "#46466E",
    backgroundColor: "#04284B",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "gray",
  },
  text: {
    fontSize: 16,
    color: "gray",
  },
});

export default ScheduleCard;
