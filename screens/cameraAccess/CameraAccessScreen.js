import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TouchableOpacity, Alert ,Platform} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {  requestCameraPermission, pickImageFromGallery, takePicture } from "./components/CameraAccess"; // Import camera access functions
import { saveImage } from './components/SaveImage'; // Import save image function

const CameraAccessScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [labeledImage, setLabeledImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await requestCameraPermission(); // Call camera permission function
      }
    })();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant access to the camera roll to proceed.');
    }
  };

  const sendImageToServer = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    try {
      const response = await axios.post('YOUR_FLASK_SERVER_URL', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLabeledImage(response.data.labeledImage);
    } catch (error) {
      console.error('Error sending image to server:', error);
      Alert.alert('Error', 'An error occurred while sending the image to the server.');
    }
  };

  const handleSaveImage = async () => {
    if (labeledImage) {
      await saveImage(labeledImage); // Call save image function
    } else {
      Alert.alert('No image to save', 'Please label an image first.');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Selected Image:</Text>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
      ) : (
        <Text>No image selected</Text>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
      <Button title="Pick from Gallery" onPress={() => {
        pickImageFromGallery().then(uri => {
            console.log("Gallery Image URI:", uri);
            setSelectedImage(uri);
        })
        }} />
        <Button title="Take Picture" onPress={() => {
        takePicture().then(uri => {
            console.log("Camera Image URI:", uri);
            setSelectedImage(uri);
        })
        }} />
      </View>
      {selectedImage && (
        <TouchableOpacity style={{ marginTop: 20 }} onPress={sendImageToServer}>
          <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Send Image to Server</Text>
        </TouchableOpacity>
      )}
      {labeledImage && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 10 }}>Labeled Image:</Text>
          <Image source={{ uri: labeledImage }} style={{ width: 200, height: 200 }} />
          <TouchableOpacity style={{ marginTop: 10 }} onPress={handleSaveImage}>
            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Save Labeled Image</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CameraAccessScreen;
