import axios from 'axios';

const sendQueryToFlask = async (query) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000', { query });
    console.log('Response:', response.data.response);
    return response.data.response;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const getFlaskResponse = async () => {
  try {
      const response = await axios.get("http://192.168.100.144");
      console.log("Response:", response.data);
      return response.data;
  } catch(error) {
      console.error("Error:", error);
      return null;
  }
}

export { sendQueryToFlask, getFlaskResponse };
