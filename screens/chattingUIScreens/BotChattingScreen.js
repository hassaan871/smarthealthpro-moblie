import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
  Button,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Context from "../../Helper/context";
import { BottomSheet, ListItem } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import QuestionnaireModal from "../../components/QuestionnaireModal";
import * as Speech from "expo-speech";

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

const BotChattingScreen = ({ route }) => {
  const { popularDoctors } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [conversationEnd, setConversationEnd] = useState(false);
  const [prioriryData, setPriorityData] = useState("");
  const [docsSheet, setDocsSheet] = useState("");
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);

  const chatbot = { id: "06c33e8b-e899-4736-80f4-63f44b66666c" };
  const scrollViewRef = useRef();
  const navigation = useNavigation();
  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem("userToken");
      setPatientId(userID);
    };
    fetchUser();
  }, []);

  const formatTextWithBold = (text) => {
    const parts = text?.split(/(\*\*.*?\*\*)/);
    return parts?.map((part, index) => {
      if (part?.startsWith("**") && part?.endsWith("**")) {
        return (
          <Text key={index} style={{ fontWeight: "bold" }}>
            {part?.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const addMessage = (message) => {
    if (message.text) {
      speak(message);
    }
    setMessages((prevMessages) => [...prevMessages, message]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleMessagePress = async (item) => {
    if (item.type === "file" && item.mimeType === "application/pdf") {
      const fileInfo = await FileSystem.getInfoAsync(item.uri);
      if (!fileInfo.exists) {
        Alert.alert("Error", "The file does not exist.");
        return;
      }
      navigation.navigate("PdfViewer", { uri: item.uri });
    } else {
      Alert.alert("Message", "This is not a PDF file.");
    }
  };

  const formatTime = (time) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      timeZone: "Asia/Karachi",
      hour12: true,
    };
    return new Date(time).toLocaleString("en-US", options);
  };

  const speak = (message) => {
    if (message.author === chatbot && message.text) {
      // Extra safety check
      Speech.speak(message.text);
    }
  };

  const handleSendPress = async () => {
    if (!message.trim()) return;

    const sentMessage = {
      author: patientId,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message,
      type: "text",
    };
    addMessage(sentMessage);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("message", message); // Replace 'message' with your message variable
      formData.append("patient_id", patientId); // Replace 'patientId' with your patient ID variable

      const response = await axios.post(
        "http://10.135.16.49:5000/chat",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const respData = response?.data?.response;

      if (respData?.toLowerCase()?.includes("[priority]")) {
        const priorityMatch = respData
          .toLowerCase()
          .match(/\[priority\](.*?)(?=\[disease\])/s);
        if (priorityMatch) {
          const priorityData = priorityMatch[1]?.trim();
          setPriorityData(priorityData);
        }
      }

      const diseaseMatch = respData.toLowerCase().match(/\[disease\](.*)/s);
      if (diseaseMatch) {
        let diseaseSection = diseaseMatch[1].trim();
        const doubleNewlineIndex = diseaseSection.indexOf("\n\n");
        if (doubleNewlineIndex !== -1) {
          diseaseSection = diseaseSection
            .substring(0, doubleNewlineIndex)
            .trim();
        }

        diseaseSection = diseaseSection
          .replace(/[*]/g, "")
          .replace(/\*\*/g, "");

        const diseaseData = {
          diabetes: 0,
          kidney: 0,
          hypertension: 0,
        };

        const diseaseLines = diseaseSection?.split("\n");
        diseaseLines.forEach((line) => {
          const match = line.match(/\s*([a-zA-Z\s]+):\s*(\d+)%/);
          if (match) {
            const disease = match[1].trim();
            const percentage = parseFloat(match[2].trim());
            if (disease && !isNaN(percentage)) {
              if (disease in diseaseData) {
                diseaseData[disease] = percentage;
              }
            }
          }
        });

        const payload = {
          specializations: diseaseData,
        };

        const doctorResponse = await axios.post(
          "http://192.168.1.160:5000/appointment/getAvailableDoctors",
          payload
        );

        setDocsSheet(doctorResponse.data.data);
        setConversationEnd(true);
      }

      const receivedMessage = {
        author: chatbot,
        createdAt: Date.now(),
        id: uuidv4(),
        text: response.data.response,
        type: "text",
      };
      addMessage(receivedMessage);
    } catch (error) {
      console.error("Error sending message to backend:", error);
    }
  };

  const handleFileSelection = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.type === "cancel") {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        if (file.uri && file.name && file.mimeType) {
          const fileMessage = {
            author: patientId,
            createdAt: Date.now(),
            id: uuidv4(),
            mimeType: file.mimeType,
            name: file.name,
            size: file.size,
            type: "file",
            uri: file.uri,
          };

          addMessage(fileMessage);

          const fileUri = FileSystem.documentDirectory + file.name;
          await FileSystem.copyAsync({
            from: file.uri,
            to: fileUri,
          });

          const formData = new FormData();
          formData.append("file", {
            uri: fileUri,
            type: file.mimeType,
            name: file.name,
          });

          const chatResponse = await axios.post(
            "http://10.135.16.49:5000/chat",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const receivedMessage = {
            author: chatbot,
            createdAt: Date.now(),
            id: uuidv4(),
            text: chatResponse.data.response,
            type: "text",
          };

          addMessage(receivedMessage);
        } else {
          Alert.alert("Error", "Invalid file. Please try again.");
        }
      } else {
        Alert.alert("Error", "No file was selected.");
      }
    } catch (error) {
      console.error("Error in handleFileSelection:", error);
      Alert.alert(
        "Error",
        "An error occurred while selecting or uploading the file."
      );
    }
  };

  const handleQuestionnaireComplete = async (summary) => {
    try {
      setShowQuestionnaire(false);
      setLoading(true);

      const formattedSummary = `Initial Patient Assessment:
Diagnosis Status: ${summary.diagnosis}
Vital Signs:
- BMI: ${summary.vitals.bmi || "N/A"}
- Blood Pressure: ${
        summary.vitals.bloodPressure
          ? `${summary.vitals.bloodPressure.systolic}/${summary.vitals.bloodPressure.diastolic}`
          : "N/A"
      }
- Blood Sugar: ${summary.vitals.sugarLevel || "N/A"} mg/dL
- HbA1c: ${summary.vitals.hbA1c || "N/A"}%

Risk Factors:
- Smoking Status: ${summary.lifestyle.smoking}
- Previous Stroke: ${summary.medicalHistory.heartStroke}
- Family History: ${summary.medicalHistory.familyHistory}
${
  summary.medicalHistory.coexistingDiseases
    ? `- Coexisting Conditions: ${summary.medicalHistory.coexistingDiseases.join(
        ", "
      )}`
    : ""
}

Please analyze this data and provide an initial assessment.`;

      const summaryMessage = {
        author: patientId,
        createdAt: Date.now(),
        id: uuidv4(),
        text: formattedSummary,
        type: "text",
      };
      addMessage(summaryMessage);

      const formData = new FormData();
      formData.append("message", formattedSummary);
      formData.append("patient_id", patientId);

      const response = await axios.post(
        "http://10.135.16.49:5000/chat",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const respData = response?.data?.response;

      // Process priority and disease data
      if (respData?.toLowerCase()?.includes("[priority]")) {
        const priorityMatch = respData
          .toLowerCase()
          .match(/\[priority\](.*?)(?=\[disease\])/s);
        if (priorityMatch) {
          setPriorityData(priorityMatch[1]?.trim());
        }
      }

      const diseaseMatch = respData.toLowerCase().match(/\[disease\](.*)/s);
      if (diseaseMatch) {
        let diseaseSection = diseaseMatch[1].trim();
        const doubleNewlineIndex = diseaseSection.indexOf("\n\n");
        if (doubleNewlineIndex !== -1) {
          diseaseSection = diseaseSection
            .substring(0, doubleNewlineIndex)
            .trim();
        }

        diseaseSection = diseaseSection
          .replace(/[*]/g, "")
          .replace(/\*\*/g, "");

        const diseaseData = {
          diabetes: 0,
          kidney: 0,
          hypertension: 0,
        };

        const diseaseLines = diseaseSection?.split("\n");
        diseaseLines.forEach((line) => {
          const match = line.match(/\s*([a-zA-Z\s]+):\s*(\d+)%/);
          if (match) {
            const disease = match[1].trim();
            const percentage = parseFloat(match[2].trim());
            if (disease && !isNaN(percentage) && disease in diseaseData) {
              diseaseData[disease] = percentage;
            }
          }
        });

        const doctorResponse = await axios.post(
          "http://192.168.1.160:5000/appointment/getAvailableDoctors",
          { specializations: diseaseData }
        );

        setDocsSheet(doctorResponse.data.data);
        setConversationEnd(true);
      }

      const receivedMessage = {
        author: chatbot,
        createdAt: Date.now(),
        id: uuidv4(),
        text: response.data.response,
        type: "text",
      };
      addMessage(receivedMessage);
    } catch (error) {
      console.error("Error processing questionnaire results:", error);
      Alert.alert(
        "Error",
        "There was an error processing your responses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDoctorItem = ({ item }) => (
    <ListItem
      onPress={() => console.log(item)}
      containerStyle={styles.listItemContainer}
      bottomDivider
    >
      <ListItem.Content style={styles.listItemContent}>
        <View style={styles.textContainer}>
          <ListItem.Title style={styles.listItemTitle}>
            {/* {item?.user?.fullName} */}
          </ListItem.Title>
          <ListItem.Subtitle style={styles.listItemSubtitle}>
            <Icon
              name="stethoscope"
              type="font-awesome"
              color="white"
              size={16}
            />
            {"  "}
            {item.specialization}
          </ListItem.Subtitle>
          <Text style={styles.listItemText}>
            <Icon name="star" type="font-awesome" color="gold" size={16} />
            {"  "}
            Rating: {item.rating}
          </Text>
        </View>
        <Button
          title="Book Me"
          buttonStyle={styles.bookButton}
          onPress={() =>
            navigation.navigate("BookingScreen", {
              priority: prioriryData,
              doctorInfo: item,
            })
          }
        />
      </ListItem.Content>
    </ListItem>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.headerContainer}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        />
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerName}>ChatBot</Text>
          <Text style={styles.headerSubtext}>Online</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages?.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.message,
                item?.author === patientId
                  ? styles.sentMessage
                  : styles.receivedMessage,
              ]}
              onPress={() => handleMessagePress(item)}
            >
              {item.type === "file" ? (
                <View style={styles.fileMessage}>
                  <FontAwesome name="file-pdf-o" size={24} color="red" />
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{item.name}</Text>
                    <Text style={styles.fileSize}>
                      {(item.size / 1024).toFixed(2)} KB
                    </Text>
                  </View>
                </View>
              ) : (
                <Text
                  style={
                    item?.author === patientId
                      ? styles.messageContent
                      : styles.receivedMessageContent
                  }
                >
                  {formatTextWithBold(item?.text)}
                </Text>
              )}
              <Text style={styles.messageTime}>
                {formatTime(item?.createdAt)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <FontAwesome
          onPress={handleFileSelection}
          name="file-pdf-o"
          size={24}
          color="gray"
        />
        <TextInput
          aria-disabled={conversationEnd ? true : false}
          placeholder="Type your message..."
          placeholderTextColor="#aaaaaa"
          value={message}
          onChangeText={setMessage}
          style={styles.textInput}
        />
        <View style={styles.iconContainer}>
          <Feather name="mic" size={24} color="gray" />
        </View>
        <Pressable style={styles.sendButton} onPress={handleSendPress}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>

      <BottomSheet isVisible={conversationEnd}>
        <FlatList
          data={docsSheet}
          scrollEnabled={false}
          keyExtractor={(item) => item._id}
          renderItem={renderDoctorItem}
        />
      </BottomSheet>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#1f1f1f",
  },
  backIcon: {
    marginRight: 15,
  },
  profileImageContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#cccccc", // Placeholder color
  },
  headerTextContainer: {
    justifyContent: "center",
  },
  headerName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtext: {
    color: "#aaaaaa",
    fontSize: 14,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 20,
    maxWidth: "75%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#3777f0",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#2e2e2e",
  },
  messageContent: {
    fontSize: 15,
    color: "white",
  },
  receivedMessageContent: {
    fontSize: 15,
    color: "white",
  },
  messageTime: {
    textAlign: "right",
    fontSize: 11,
    color: "#b0b0b0",
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: "#1f1f1f",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#333333",
    color: "white",
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: "#3777f0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    textAlign: "center",
    color: "white",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  listItemContainer: {
    backgroundColor: "#2e2e2e",
    borderRadius: 10,
    padding: 10,
  },
  listItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  listItemTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  listItemSubtitle: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  listItemText: {
    color: "white",
    fontSize: 14,
    marginTop: 5,
  },
  bookButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  fileMessage: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  fileInfo: {
    marginLeft: 10,
  },
  fileName: {
    fontWeight: "bold",
    color: "white",
  },
  fileSize: {
    color: "#b0b0b0",
    fontSize: 12,
  },
});

export default BotChattingScreen;
