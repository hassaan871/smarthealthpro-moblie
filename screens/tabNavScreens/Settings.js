import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image,Dimensions } from 'react-native';
import { Divider } from 'react-native-paper';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons'; // assuming you're using expo
import signupLogo from "../../assets/signupLogo.jpg"
const SettingScreen = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["60%", "70%"], []);
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  // State for light/dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
    // Additional logic to toggle app theme to dark/light mode
  };

  const handleLogout = () => {
    // Logic to handle user logout
  };

  const handleProfile = () => {
    // Logic to navigate to the profile screen
  };

  const handleAppointments = () => {
    // Logic to navigate to the appointments screen
  };

  const handleMedicalRecords = () => {
    // Logic to navigate to the medical records screen
  };

  const handleMessages = () => {
    // Logic to navigate to the messages screen
  };

  const handleSettings = () => {
    // Logic to navigate to the settings screen
  };

  return (
    <View style={styles.container}>
       <Image
            source={signupLogo}
            resizeMode="contain"
            style={{ width:"auto", height: "53%" }}
          />
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
      >
        <BottomSheetView style={styles.contentContainer}>
          <TouchableOpacity style={styles.item} onPress={handleProfile}>
            <Ionicons name="person" size={24} color="#007BFF" />
            <Text style={styles.itemText}>Profile</Text>
          </TouchableOpacity>
          <Divider bold style={{ marginVertical: "4%" }} />
          <TouchableOpacity style={styles.item} onPress={handleAppointments}>
            <Ionicons name="calendar" size={24} color="#007BFF" />
            <Text style={styles.itemText}>Appointments</Text>
          </TouchableOpacity>
          <Divider bold style={{ marginVertical: "4%" }} />
          <TouchableOpacity style={styles.item} onPress={handleMedicalRecords}>
            <Ionicons name="folder" size={24} color="#007BFF" />
            <Text style={styles.itemText}>Medical Records</Text>
          </TouchableOpacity>
          <Divider bold style={{ marginVertical: "4%" }} />
          <TouchableOpacity style={styles.item} onPress={handleMessages}>
            <Ionicons name="mail" size={24} color="#007BFF" />
            <Text style={styles.itemText}>Messages</Text>
          </TouchableOpacity>
          <Divider bold style={{ marginVertical: "4%" }} />
          <TouchableOpacity style={styles.item} onPress={handleSettings}>
            <Ionicons name="settings" size={24} color="#007BFF" />
            <Text style={styles.itemText}>Settings</Text>
          </TouchableOpacity>
          <Divider bold style={{ marginVertical: "4%" }} />
          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color="red" />
            <Text style={styles.itemText}>Logout</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default SettingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    // backgroundColor:"#CDF5FD"
    
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  itemText:{
    paddingLeft:12,
    fontSize:16,
  }
})