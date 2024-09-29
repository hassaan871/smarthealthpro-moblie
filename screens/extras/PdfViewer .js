// PdfViewer.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';

const PdfViewer = () => {
  const route = useRoute()
  const {uri} = route.params

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: uri, cache: true }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default PdfViewer;
