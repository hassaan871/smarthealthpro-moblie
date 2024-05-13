import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, Paragraph, Text } from "react-native-paper";

const ScheduleCard = ({ item }) => {
  const { pictureUrl, name, time, location, fee, date } = item;
  console.log(item);
  return (
    <Card style={styles.card}>
       <Card.Cover source={{ uri: pictureUrl }} style={styles.image} />
      <Card.Content style={{flex:1}}>
     
        <Text style={{ textAlign: "center", color: "gray", marginBottom: 4 }}>
          Dr. Xyz
        </Text>
        <Title style={styles.title}>{name}</Title>
        <Paragraph style={styles.text}>{time} {date}</Paragraph>
        <Paragraph style={styles.text}>{location}</Paragraph>
        <Paragraph style={styles.text}>Fee: ${fee}</Paragraph>
        <Paragraph style={styles.text}>Fee Status: pending</Paragraph>
        {/* <Paragraph style={styles.text}>this is some dummy description</Paragraph> */}
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
  },
  image: {
    flex: 1,
    // borderRadius: "50%",
    width: "40%",
    height: 100,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
  },
});

export default ScheduleCard;
