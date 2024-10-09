import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text, Platform } from "react-native";
import Pdf from "react-native-pdf";
import RNFetchBlob from "rn-fetch-blob";

const PdfViewer = ({ route }) => {
  const { uri } = route.params;
  const [localUri, setLocalUri] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const downloadPdf = async () => {
      try {
        console.log("Downloading PDF from:", uri);
        const response = await RNFetchBlob.config({
          fileCache: true,
          appendExt: "pdf",
        }).fetch("GET", uri);
        console.log("PDF downloaded to:", response.path());
        setLocalUri(
          Platform.OS === "android"
            ? "file://" + response.path()
            : response.path()
        );
      } catch (err) {
        console.error("Error downloading PDF:", err);
        setError("Failed to download PDF: " + err.message);
      }
    };

    downloadPdf();
  }, [uri]);

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!localUri) {
    return <Text>Loading PDF...</Text>;
  }

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: localUri }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`PDF Loaded. Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log("PDF Error:", error);
          setError("Error loading PDF: " + error);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    padding: 20,
  },
});

export default PdfViewer;
