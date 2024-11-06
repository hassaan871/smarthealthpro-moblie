import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

const QuestionnaireModal = ({ onComplete }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValues, setInputValues] = useState({
    systolic: "",
    diastolic: "",
    bmi: "",
    sugarLevel: "",
    hbA1c: "",
  });

  // Question validation rules
  const validationRules = {
    // bmi: { min: 15, max: 40 },
    // systolic: { min: 70, max: 200 },
    // diastolic: { min: 40, max: 130 },
    // hbA1c: { min: 1, max: 15 },
    // sugarLevel: { min: 50, max: 500 },
  };

  const questionsData = {
    initial: {
      question: "What diseases are you diagnosed with?",
      options: ["Diabetes & blood pressure", "Blood pressure", "Not diagnosed"],
      type: "options",
      next: ["diabetesBP", "bloodPressure", "notDiagnosed"],
    },
    diabetesBP: [
      {
        question: "Have you ever faced a heart stroke?",
        options: ["Yes", "No"],
        type: "options",
      },
      {
        question: "Do you smoke?",
        options: ["Yes", "No"],
        type: "options",
      },
      {
        question: "What is your BMI?",
        type: "input",
        inputType: "number",
        validation: validationRules.bmi,
      },
      {
        question: "What was your last fasting sugar level?",
        type: "input",
        inputType: "number",
        validation: validationRules.sugarLevel,
      },
      {
        question: "When did you take your last HbA1c test?",
        options: [
          "This week",
          "Last week",
          "Last month",
          "A while ago",
          "Never taken the test",
        ],
        type: "options",
        next: ["hbA1cResult", "skipHbA1c"],
      },
    ],
    hbA1cResult: [
      {
        question: "What was your HbA1c test value?",
        type: "input",
        inputType: "number",
        validation: validationRules.hbA1c,
      },
      {
        question: "What is your current blood pressure?",
        type: "dualInput",
        fields: ["Systolic", "Diastolic"],
        validation: {
          Systolic: validationRules.systolic,
          Diastolic: validationRules.diastolic,
        },
      },
      {
        question: "Do you have any other coexisting diseases?",
        options: [
          "Heart Disease",
          "Kidney Disease",
          "Eye Problems",
          "Stroke",
          "Peripheral Artery Disease (PAD)",
          "Nerve Damage (Neuropathy)",
        ],
        type: "multiSelect",
      },
    ],
    skipHbA1c: [
      {
        question: "What is your current blood pressure?",
        type: "dualInput",
        fields: ["Systolic", "Diastolic"],
        validation: {
          Systolic: validationRules.systolic,
          Diastolic: validationRules.diastolic,
        },
      },
      {
        question: "Do you have any other coexisting diseases?",
        options: [
          "Heart Disease",
          "Kidney Disease",
          "Eye Problems",
          "Stroke",
          "Peripheral Artery Disease (PAD)",
          "Nerve Damage (Neuropathy)",
        ],
        type: "multiSelect",
      },
    ],
    bloodPressure: [
      {
        question: "Have you ever faced a heart stroke?",
        options: ["Yes", "No"],
        type: "options",
      },
      {
        question: "Do you smoke?",
        options: ["Yes", "No"],
        type: "options",
      },
      {
        question: "What is your BMI?",
        type: "input",
        inputType: "number",
        validation: validationRules.bmi,
      },
      {
        question: "What is your current blood pressure?",
        type: "dualInput",
        fields: ["Systolic", "Diastolic"],
        validation: {
          Systolic: validationRules.systolic,
          Diastolic: validationRules.diastolic,
        },
      },
      {
        question: "Do you have any other coexisting diseases?",
        options: [
          "Heart Disease",
          "Kidney Disease",
          "Eye Problems",
          "Stroke",
          "Peripheral Artery Disease (PAD)",
          "Nerve Damage (Neuropathy)",
        ],
        type: "multiSelect",
      },
      {
        question: "Do you have a family history of heart disease or diabetes?",
        options: ["Yes", "No"],
        type: "options",
      },
    ],
    notDiagnosed: [
      {
        question: "Have you ever faced a heart stroke?",
        options: ["Yes", "No"],
        type: "options",
      },
      {
        question: "Do you smoke?",
        options: ["Yes", "No"],
        type: "options",
      },
      {
        question: "What is your BMI?",
        type: "input",
        inputType: "number",
        validation: validationRules.bmi,
      },
      {
        question: "Are you experiencing frequent urination?",
        options: ["Yes", "No"],
        type: "options",
      },
      {
        question: "Are you experiencing visual blurring?",
        options: ["Yes", "No"],
        type: "options",
      },
      {
        question:
          "Are you easily annoyed or angered; experiencing mood disturbances?",
        options: ["Yes", "No"],
        type: "options",
      },
      {
        question: "Are you experiencing slow recovery of wounds or injuries?",
        options: ["Yes", "No"],
        type: "options",
      },
      {
        question:
          "Are you experiencing weakness or partial loss of voluntary movement (Partial Paresis)?",
        options: ["Yes", "No"],
        type: "options",
      },
      {
        question: "Do you have a family history of heart disease or diabetes?",
        options: ["Yes", "No"],
        type: "options",
      },
    ],
  };

  const generateAISummary = () => {
    let summary = {
      diagnosis: "",
      vitals: {},
      lifestyle: {},
      symptoms: {},
      medicalHistory: {},
    };

    answers.forEach((answer) => {
      const q = answer.question.toLowerCase();
      const a = answer.answer;

      // Categorize diagnosis
      if (q.includes("diagnosed with")) {
        summary.diagnosis = a;
      }

      // Categorize vitals
      if (q.includes("bmi")) {
        summary.vitals.bmi = a;
      }
      if (q.includes("blood pressure")) {
        summary.vitals.bloodPressure = a;
      }
      if (q.includes("sugar level")) {
        summary.vitals.sugarLevel = a;
      }
      if (q.includes("hba1c")) {
        summary.vitals.hbA1c = a;
      }

      // Categorize lifestyle factors
      if (q.includes("smoke")) {
        summary.lifestyle.smoking = a;
      }

      // Categorize symptoms
      if (
        q.includes("frequent urination") ||
        q.includes("visual blurring") ||
        q.includes("mood disturbances") ||
        q.includes("slow recovery") ||
        q.includes("partial paresis")
      ) {
        summary.symptoms[q] = a;
      }

      // Categorize medical history
      if (q.includes("heart stroke")) {
        summary.medicalHistory.heartStroke = a;
      }
      if (q.includes("family history")) {
        summary.medicalHistory.familyHistory = a;
      }
      if (q.includes("coexisting diseases")) {
        summary.medicalHistory.coexistingDiseases = a;
      }
    });

    return summary;
  };

  // Initialize the questionnaire
  useEffect(() => {
    setCurrentPath([questionsData.initial]);
    setCurrentQuestionIndex(0);
  }, []);

  // Validation helper function
  const validateInput = (value, rules) => {
    if (!rules) return true;
    const numValue = Number(value);
    if (rules.min && numValue < rules.min) return false;
    if (rules.max && numValue > rules.max) return false;
    return true;
  };

  const handleAnswer = (answer) => {
    const currentQuestion = currentPath[currentQuestionIndex];

    if (!currentQuestion) {
      console.error("No current question found!");
      return;
    }

    // Validate input if needed
    if (currentQuestion.type === "input" && currentQuestion.validation) {
      if (!validateInput(answer, currentQuestion.validation)) {
        Alert.alert(
          "Invalid Input",
          `Please enter a value between ${currentQuestion.validation.min} and ${currentQuestion.validation.max}`
        );
        return;
      }
    }

    // Handle multi-select answers
    if (currentQuestion.type === "multiSelect") {
      const updatedSelection = selectedOptions.includes(answer)
        ? selectedOptions.filter((item) => item !== answer)
        : [...selectedOptions, answer];
      setSelectedOptions(updatedSelection);
      return;
    }

    // Save the answer
    const newAnswers = [
      ...answers,
      {
        question: currentQuestion.question,
        answer:
          currentQuestion.type === "multiSelect" ? selectedOptions : answer,
        isValid: true,
      },
    ];
    setAnswers(newAnswers);

    // Clear multi-select options for next question
    if (currentQuestion.type === "multiSelect") {
      setSelectedOptions([]);
    }

    // Handle path navigation
    if (currentQuestion.next) {
      let nextPathKey = "";
      if (answer === "Diabetes & blood pressure") {
        nextPathKey = "diabetesBP";
      } else if (answer === "Blood pressure") {
        nextPathKey = "bloodPressure";
      } else if (answer === "Not diagnosed") {
        nextPathKey = "notDiagnosed";
      } else if (answer === "Never taken the test") {
        nextPathKey = "skipHbA1c";
      } else {
        nextPathKey = "hbA1cResult";
      }

      const nextPath = questionsData[nextPathKey];
      if (nextPath) {
        setCurrentPath(nextPath);
        setCurrentQuestionIndex(0);
      }
    } else if (currentQuestionIndex < currentPath.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Questionnaire completed
      handleSubmission();
    }
  };

  // Handle final submission
  const handleSubmission = async () => {
    const allValid = answers.every((answer) => answer.isValid);
    if (allValid) {
      const aiSummary = generateAISummary();

      Alert.alert(
        "Questionnaire Complete",
        "Thank you for completing the questionnaire. Generating initial analysis...",
        [
          {
            text: "OK",
            onPress: () => {
              if (onComplete) {
                onComplete(aiSummary); // Pass the summary to parent
                setModalVisible(false); // Close the modal after sending data
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Invalid Answers",
        "Please check your answers and try again."
      );
    }
  };

  const handleDualInputSubmit = (field, value) => {
    const currentQuestion = currentPath[currentQuestionIndex];
    const validation = currentQuestion.validation?.[field];

    if (validation && !validateInput(value, validation)) {
      Alert.alert(
        "Invalid Input",
        `Please enter a ${field} value between ${validation.min} and ${validation.max}`
      );
      return;
    }

    const newInputValues = { ...inputValues, [field.toLowerCase()]: value };
    setInputValues(newInputValues);

    // If both fields are filled, proceed to next question
    if (newInputValues.systolic && newInputValues.diastolic) {
      handleAnswer({
        systolic: newInputValues.systolic,
        diastolic: newInputValues.diastolic,
      });
      setInputValues({ ...inputValues, systolic: "", diastolic: "" });
    }
  };

  const renderQuestion = () => {
    const currentQuestion = currentPath[currentQuestionIndex];

    if (!currentQuestion || !currentQuestion.question) {
      return null;
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {/* Render different question types */}
        {renderQuestionContent(currentQuestion)}

        {/* Navigation buttons */}
        <View style={styles.navigationButtons}>
          {currentQuestionIndex > 0 && (
            <Button
              title="Previous"
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            />
          )}
          {currentQuestion.type !== "dualInput" &&
            currentQuestion.type !== "multiSelect" && (
              <Button
                title="Next"
                onPress={() => handleAnswer("")}
                disabled={currentQuestionIndex >= currentPath.length - 1}
              />
            )}
        </View>
      </ScrollView>
    );
  };

  const renderQuestionContent = (currentQuestion) => {
    switch (currentQuestion.type) {
      case "options":
        return renderOptions(currentQuestion);
      case "input":
        return renderInput(currentQuestion);
      case "dualInput":
        return renderDualInput(currentQuestion);
      case "multiSelect":
        return renderMultiSelect(currentQuestion);
      default:
        return null;
    }
  };

  const renderOptions = (question) => (
    <View style={styles.optionsContainer}>
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => handleAnswer(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderInput = (question) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        keyboardType={question.inputType === "number" ? "numeric" : "default"}
        placeholder="Enter your answer"
        placeholderTextColor={"white"}
        onSubmitEditing={(e) => handleAnswer(e.nativeEvent.text)}
      />
      {question.validation && (
        <Text style={styles.validationText}>
          Value should be between {question.validation.min} and{" "}
          {question.validation.max}
        </Text>
      )}
    </View>
  );

  const renderDualInput = (question) => (
    <View style={styles.dualInputContainer}>
      {question.fields.map((field, index) => (
        <View key={index} style={styles.dualInputField}>
          <Text style={styles.fieldLabel}>{field}</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter ${field}`}
            keyboardType="numeric"
            value={inputValues[field.toLowerCase()]}
            onChangeText={(value) => handleDualInputSubmit(field, value)}
          />
          {question.validation?.[field] && (
            <Text style={styles.validationText}>
              {field} should be between {question.validation[field].min} and{" "}
              {question.validation[field].max}
            </Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderMultiSelect = (question) => (
    <View style={styles.multiSelectContainer}>
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.multiSelectButton,
            selectedOptions.includes(option) &&
              styles.multiSelectButtonSelected,
          ]}
          onPress={() => handleAnswer(option)}
        >
          <Text
            style={[
              styles.multiSelectText,
              selectedOptions.includes(option) &&
                styles.multiSelectTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
      <Button
        title="Confirm Selection"
        onPress={() => handleAnswer(selectedOptions)}
        style={styles.confirmButton}
      />
    </View>
  );

  // Main render
  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>{renderQuestion()}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
    borderColor: "#333",
    borderWidth: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "500",
    color: "#ffffff",
  },
  optionsContainer: {
    width: "100%",
  },
  optionButton: {
    backgroundColor: "#2a2a2a",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#404040",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#ffffff",
  },
  inputContainer: {
    width: "100%",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#404040",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginVertical: 5,
    fontSize: 16,
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
  },
  dualInputContainer: {
    width: "100%",
  },
  dualInputField: {
    marginVertical: 10,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#ffffff",
  },
  validationText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    fontStyle: "italic",
  },
  multiSelectContainer: {
    width: "100%",
  },
  multiSelectButton: {
    backgroundColor: "#2a2a2a",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#404040",
  },
  multiSelectButtonSelected: {
    backgroundColor: "#1a365d",
    borderColor: "#2b4f81",
  },
  multiSelectText: {
    fontSize: 16,
    textAlign: "center",
    color: "#ffffff",
  },
  multiSelectTextSelected: {
    color: "#60a5fa",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: "#2b4f81",
  },
});

export default QuestionnaireModal;
