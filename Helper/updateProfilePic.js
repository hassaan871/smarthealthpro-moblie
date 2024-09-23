import axios from 'axios';

const updateProfilePic = async (userId, file) => {
  try {
    console.log('Preparing to upload file:', file);

    const formData = new FormData();
    formData.append('id', userId);
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type
    });

    console.log('FormData created:', formData);

    const response = await axios.put('http://192.168.18.9:5000/user/updateProfile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

export default updateProfilePic;