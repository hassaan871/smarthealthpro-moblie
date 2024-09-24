import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OfflineScreen = () => {
  const [schedule, setSchedule] = useState(null);

  // Fetch upcoming schedule from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const storedSchedule = await AsyncStorage.getItem('upcomingSchedule');
        if (storedSchedule !== null) {
          setSchedule(JSON.parse(storedSchedule)); // Parse the schedule object
        } else {
          console.log("No schedule data found");
        }
      } catch (error) {
        console.error("Error fetching schedule from AsyncStorage: ", error);
      }
    };

    fetchSchedule();
  }, []);

  // If no schedule is found, show a fallback message
  if (!schedule) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noDataText}>No upcoming schedule available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Upcoming Schedule</Text>
        <Text style={styles.scheduleText}>{schedule.name}</Text>
        <Text style={styles.scheduleText}>{schedule.date}</Text>
        <Text style={styles.scheduleText}>{schedule.time}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scheduleText: {
    fontSize: 18,
    color: '#333',
    marginVertical: 5,
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
  },
});

export default OfflineScreen;
