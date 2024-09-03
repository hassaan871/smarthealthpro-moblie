import axios from 'axios';
import baseUrl from '../../baseUrl';

const sendQueryToFlask = async (query) => {
  try {
    console.log("queru",query.text)
    const response = await axios.post(`${baseUrl}/query`, { query:query.text });
    console.log('Response:', response.data.answer);
    // console.log(response)
    return response.data.answer;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const getFlaskResponse = async () => {
  try {
      const response = await axios.get(baseUrl);
      console.log("Response:", response.data);
      return response.data;
  } catch(error) {
      console.error("Error:", error);
      return null;
  }
}

export { sendQueryToFlask, getFlaskResponse };
