import React, { useCallback, useMemo, useRef, useState,useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image,Dimensions, SafeAreaView } from 'react-native';
import { Avatar, Divider, Switch } from 'react-native-paper';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons'; // assuming you're using expo
import signupLogo from "../../assets/signupLogo.jpg"
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Context from "../../Helper/context";
import Alert from '../../components/Alert';
import showAlertMessage from '../../Helper/AlertHelper';

const SettingScreen = () => {
  const { token,
    setToken,
    userName,
    setUserName,
    emailGlobal,
    setEmailGlobal,
    image,
    setImage,
    avatar,
    setAvatar,
    id,
    setId
  } = useContext(Context);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // success or error

  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["40%", "55%"], []);
  const handleSheetChanges = useCallback((index) => {
    // console.log('handleSheetChanges', index);
  }, []);

  // State for light/dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
    // Additional logic to toggle app theme to dark/light mode
  };

  const handleDismissAlert = () => {
    setShowAlert(false);
  };


  const handleDeleteAccount = async () => {
    try {
      const config = {
        headers: {
          'token': token
        }
      };
  
      const response = await axios.delete(`http://192.168.100.81/user/deleteUser/${id}`, config);
      
      // Check if the delete request was successful
      if (response.status === 200) {
        console.log('User account deleted successfully');
        showAlertMessage(setShowAlert, setAlertMessage, setAlertType, "Account Deleted!", "success");
        navigation.navigate("SignUp")
        // Optionally, perform any additional actions after successful deletion
      } else {
        console.error('Failed to delete user account');
      }
    } catch (error) {
      console.error('Error deleting user account:', error.message);
      showAlertMessage(setShowAlert, setAlertMessage, setAlertType, "Deletion failed. Please try again.", "error");
    }
  }

  const handleLogout = () => {
      axios.get('http://192.168.100.81/user/logout')
          .then(res => {
              showAlertMessage(setShowAlert, setAlertMessage, setAlertType, "Logout Success", "success");
              setAvatar("");
              setEmailGlobal("");
              setId("");
              setImage("");
              setToken("");
              setUserName("");
              navigation.navigate("Login")
            })
          .catch(error => {
            // console.error('Logout error:', error);
            showAlertMessage(setShowAlert, setAlertMessage, setAlertType, "Logout failed. Please try again.", "error");
          });
    };

  const handleSettings = () => {
    // Logic to navigate to the settings screen
  };

  return (
    <SafeAreaView style={styles.container}>
       <Alert visible={showAlert} onDismiss={handleDismissAlert} message={alertMessage} type={alertType} />
      <View style={{alignItems:"center",top:24}}>
      {/* <Avatar.Icon size={144} icon="" /> */}
      <Image source={image} style={styles.Image}/>
      
      <Text style={styles.itemText}>{userName}</Text>
      <Text style={styles.itemText}>{emailGlobal}</Text>

     

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
          {/* <Divider bold style={{ marginVertical: "4%" }} /> */}
          <TouchableOpacity style={styles.item}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="notifications" size={32} color="#007BFF" />
                <Text style={styles.itemText}>Notifications</Text>
              </View>
              <Switch />
            </View>
          </TouchableOpacity>
          <Divider bold style={{ marginVertical: "2%" }} />
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

          <Divider bold style={{ marginVertical: "2%" }} />
          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <Ionicons name="bag-remove" size={32} color="#007BFF" />
            <Text style={styles.itemText}>Clear Cache</Text>
          </TouchableOpacity>

          <Divider bold style={{ marginVertical: "2%" }} />
          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <Ionicons name="log-out" size={32} color="red" />
            <Text style={styles.itemText}>Logout</Text>
          </TouchableOpacity>

          <Divider bold style={{ marginVertical: "2%" }} />
          <TouchableOpacity style={styles.item} onPress={handleDeleteAccount}>
            <Ionicons name="trash" size={32} color="red" />
            <Text style={styles.itemText}>Delete Account</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
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
  },
  Image:{
    width: 200,
    height: 200,
    borderRadius: 100 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "black",
    margin: 12,
  }
})