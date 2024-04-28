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
    try{
        const response = await axios.get("http://127.0.0.1:5000/");
        console.log("Response:", response.data.response);
        return response.data.response;
    }
    catch(error){
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Error request:", error.request);
        } else {
            // Something happened in setting up the request that triggered an error
            console.error("Error message:", error.message);
        }
        console.error("Error config:", error.config);
        return null;
    }
}

export { sendQueryToFlask, getFlaskResponse };
