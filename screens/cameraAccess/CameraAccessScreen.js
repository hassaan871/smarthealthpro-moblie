import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { requestCameraPermission, pickImageFromGallery, takePicture } from "./components/CameraAccess";
import { saveImage } from './components/SaveImage';
import sendImageToServer from '../../Helper/sendImageToServer';

const CameraAccessScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLatestImage, setShowLatestImage] = useState(null);
  const FLASK_SERVER_URL = 'http://192.168.100.222';

  // useEffect(() => {
  //   console.log("useEffect");
  //   setShowLatestImage(null)
  // }, [selectedImage]);

  const serverSent = async () => {
    try {
      await sendImageToServer(selectedImage, FLASK_SERVER_URL);
      Alert.alert('Success', 'Image sent to server successfully!');
      setShowLatestImage(`http://192.168.100.222/display_latest_image?v=${Math.random()}`)
      
      // setTimeout(fetchLatestImage, 3000);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleCapture = async () => {
    const uri = await takePicture();
    if (!uri) {
      Alert.alert('Capture Failed', 'No image was captured.');
      return;
    }
    setSelectedImage(uri);
  };

  const handleUpload = async () => {
    const uri = await pickImageFromGallery();
    if (!uri) {
      Alert.alert('Upload Failed', 'No image was selected.');
      return;
    }
    setSelectedImage(uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Upload Image</Text>
      <View style={styles.imagePreview}>
        {selectedImage || showLatestImage ? (
          <Image source={{ uri: showLatestImage  ? showLatestImage : selectedImage }} style={styles.image} />
        ) : (
          <View>
          <MaterialIcons name="cloud-upload" size={50} color="#fff" />
          <Text style={styles.imagePlaceholder}>Upload</Text></View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <MaterialIcons name="photo-library" size={28} color="white" />
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCapture}>
          <MaterialIcons name="camera-alt" size={28} color="white" />
          <Text style={styles.buttonText}>Capture</Text>
        </TouchableOpacity>
      </View>
      {selectedImage && (
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={serverSent}>
          <MaterialIcons name="key" size={28} color="white" />
          <Text style={styles.buttonText}>Decipher</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={imageSaved}>
        <MaterialIcons name="key" size={28} color="white" />
        <Text style={styles.buttonText}>Save Image</Text>
        </TouchableOpacity> */}
        </View>
        
      )}
    </View>
  );
};

export default CameraAccessScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#CDE8E5'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff'
  },
  imagePreview: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#fff',
    borderWidth: 4,
    borderRadius: 10,
    backgroundColor: '#CDE8E5',
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#666',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePlaceholder: {
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#7AB2B2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 18,
    fontWeight: '500'
  }
});

