import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export const requestCameraPermission = async () => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant access to the camera to proceed.');
    }
  }
};

export const pickImageFromGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.cancelled) {
        // Access the URI from the first asset in the assets array
        const uri = result.assets[0].uri;
        console.log("Gallery Image URI:", uri);
        return uri;
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'An error occurred while picking an image from the gallery.');
    }
  };

  
export const takePicture = async () => {
  try {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
        const uri = result.assets[0].uri;
        console.log("taken Image URI:", uri);
        return uri;
    }
  } catch (error) {
    console.error('Error taking picture:', error);
    Alert.alert('Error', 'An error occurred while taking a picture.');
  }
};
