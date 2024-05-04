import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

export const saveImage = async (uri) => {
  try {
    let localUri = uri;

    // Check if the URI is a remote URL
    if (!uri.startsWith('file://')) {
      // Download the remote image and save it locally
      const downloadResult = await FileSystem.downloadAsync(uri, FileSystem.cacheDirectory + 'temp_image');
      
      if (!downloadResult || downloadResult.status !== 200) {
        throw new Error('Failed to download image');
      }
      
      localUri = downloadResult.uri;
    }

    // Extract filename from the URI
    const filename = localUri.split('/').pop();
    const destination = FileSystem.documentDirectory + filename;

    // Copy the image to the document directory
    await FileSystem.copyAsync({
      from: localUri,
      to: destination,
    });

    Alert.alert('Image Saved', 'The image has been saved to your device.');
    return true; // Indicate success
  } catch (error) {
    console.error('Error saving image:', error);
    Alert.alert('Error', 'An error occurred while saving the image.');
    return false; // Indicate failure
  }
};
