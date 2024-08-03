import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Icon from react-native-vector-icons
import lightTheme from "../../Themes/LightTheme";

const pdfs = [
  { id: "1", name: "Sample PDF Name 1", author: "John Doe" },
  { id: "2", name: "Sample PDF Name 2", author: "Jane Smith" },
  { id: "3", name: "Sample PDF Name 3", author: "Alex Johnson" },
];

export const ResultsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TextInput
          placeholder="Search PDFs..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </Appbar.Header>

      <FlatList
        data={pdfs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image
              source={{ uri: "https://placehold.co/50?text=PDF" }}
              style={styles.pdfIcon}
            />
            <View>
              <Text style={styles.pdfTitle}>{item.name}</Text>
              <Text style={styles.pdfAuthor}>Author: {item.author}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "hsl(0, 0%, 100%)",
  },
  header: {
    backgroundColor: "hsl(240, 5.9%, 10%)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  backButton: {
    backgroundColor: "hsl(240, 5.9%, 10%)",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  backButtonText: {
    color: "hsl(0, 0%, 98%)",
  },
  searchInput: {
    height: 40,
    width: 230,
    backgroundColor: lightTheme.colors.homeSearchInputColor,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: "hsl(240, 5.9%, 10%)",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  uploadButtonText: {
    color: "hsl(0, 0%, 98%)",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  pdfIcon: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  pdfTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "hsl(240, 5.9%, 10%)",
  },
  pdfAuthor: {
    fontSize: 14,
    color: "hsl(240, 3.8%, 46.1%)",
  },
  separator: {
    height: 1,
    backgroundColor: "hsl(240, 5.9%, 90%)",
    marginHorizontal: 16,
  },
});
