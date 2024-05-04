import axios from 'axios';

const sendImageToServer = async (selectedImage, FLASK_SERVER_URL) => {
  if (!selectedImage) {
    throw new Error('No image selected');
  }
  
  const formData = new FormData();
  formData.append('file', {
    uri: selectedImage,
    type: 'image/jpeg',
    name: 'image.jpg',
  });

  try {
    const response = await axios.post(`${FLASK_SERVER_URL}/predict_img`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('Response from server:', FLASK_SERVER_URL);
    // console.log('Response from server:', response);
    return 'Image has been sent successfully!';
  } catch (error) {
    console.error('Error sending image to server:', error);
    throw new Error('An error occurred while sending the image to the server.');
  }
};

export default sendImageToServer;
