import axios from "axios";

const sendQueryToFlask = async (query) => {
  try {
    console.log("queru", query.text);
    const response = await axios.post("http://192.168.1.35/query", {
      query: query.text,
    });
    console.log("Response:", response.data.answer);
    // console.log(response)
    return response.data.answer;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const getFlaskResponse = async () => {
  try {
    const response = await axios.get("http://192.168.1.35");
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export { sendQueryToFlask, getFlaskResponse };
