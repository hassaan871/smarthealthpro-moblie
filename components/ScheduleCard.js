import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph ,Text} from 'react-native-paper';

const ScheduleCard = ({item}) => {
  const { pictureUrl, name, time, location, fee, date } = item;
  console.log(item);
  return (
    <Card style={styles.card}>
      <Card.Cover  source={{ uri: pictureUrl }} style={styles.image} />
      <Card.Content>
        <Text style={{textAlign:"center",color:"gray",marginBottom:4}}>Dr. Xyz</Text>
        <Title style={styles.title}>{name}</Title>
        <Paragraph style={styles.text}>{time}  {date}</Paragraph>
        <Paragraph style={styles.text}>{location}</Paragraph>
        <Paragraph style={styles.text}>Fee: ${fee}</Paragraph>
        <Paragraph style={styles.text}>Fee Status: pending</Paragraph>
        <Paragraph style={styles.text}>this is some dummy description</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginHorizontal: 12,
    borderRadius: 10,
    elevation: 4,
  },
  image: {
    borderRadius: 30,
    width: '25%',
    height: "25%",
    alignSelf: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ScheduleCard;
