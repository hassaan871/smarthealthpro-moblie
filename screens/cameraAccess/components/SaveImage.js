import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

export const saveImage = async (uri) => {
  const filename = uri.split('/').pop();
  const destination = FileSystem.documentDirectory + filename;

  try {
    await FileSystem.copyAsync({
      from: uri,
      to: destination,
    });
    Alert.alert('Image Saved', 'The labeled image has been saved to your device.');
  } catch (error) {
    console.error('Error saving image:', error);
    Alert.alert('Error', 'An error occurred while saving the image.');
  }
};
