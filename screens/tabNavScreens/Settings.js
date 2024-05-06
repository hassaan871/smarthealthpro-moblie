import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image,Dimensions } from 'react-native';
import { Avatar, Divider, Switch } from 'react-native-paper';
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
      <View style={{alignItems:"center",top:24}}>
      <Avatar.Icon size={144} icon="" />
      
      <Text style={styles.itemText}>Name</Text>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
      >
        <BottomSheetView style={styles.contentContainer}>
          {/* <TouchableOpacity style={styles.item} onPress={handleProfile}>
            <Ionicons name="person" size={32} color="#007BFF" />
            <Text style={styles.itemText}>Profile</Text>
          </TouchableOpacity> */}
          {/* <Divider bold style={{ marginVertical: "4%" }} /> */}
          {/* <TouchableOpacity style={styles.item} onPress={handleAppointments}>
            <Ionicons name="calendar" size={32} color="#007BFF" />
            <Text style={styles.itemText}>Appointments</Text>
          </TouchableOpacity> */}
          <Divider bold style={{ marginVertical: "4%" }} />
          <TouchableOpacity style={styles.item} onPress={handleMedicalRecords}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="notifications" size={32} color="#007BFF" />
                <Text style={styles.itemText}>Notifications</Text>
              </View>
              <Switch />
            </View>
          </TouchableOpacity>
          <Divider bold style={{ marginVertical: "4%" }} />
          {/* <TouchableOpacity style={styles.item} onPress={handleMessages}>
            <Ionicons name="mail" size={32} color="#007BFF" />
            <Text style={styles.itemText}>Messages</Text>
          </TouchableOpacity>
          <Divider bold style={{ marginVertical: "4%" }} /> */}

          <TouchableOpacity style={styles.item} onPress={handleSettings}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="moon" size={32} color="#007BFF" />
                <Text style={styles.itemText}>Dark Mode</Text>
              </View>
              <Switch />
            </View>
          </TouchableOpacity>

          <Divider bold style={{ marginVertical: "4%" }} />
          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <Ionicons name="bag-remove" size={32} color="#007BFF" />
            <Text style={styles.itemText}>Clear Cache</Text>
          </TouchableOpacity>

          <Divider bold style={{ marginVertical: "4%" }} />
          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <Ionicons name="log-out" size={32} color="red" />
            <Text style={styles.itemText}>Logout</Text>
          </TouchableOpacity>

          <Divider bold style={{ marginVertical: "4%" }} />
          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <Ionicons name="trash" size={32} color="red" />
            <Text style={styles.itemText}>Delete Account</Text>
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
      borderBottomColor: '#CCCCCC',
  },
  itemText:{
    paddingLeft:12,
    fontSize:20,
  }
})