// Update your existing file
import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import ScheduleCard from "../../components/ScheduleCard";
import lightTheme from "../../Themes/LightTheme";
import PopularCard from "../../components/PopularCard";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import DialogflowModal from "../../components/DialogFlowModal";

const ViewAllScreen = ({ route }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(route.params.data);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const filtered = route.params.data.filter((item) => {
      const values = Object.entries(item).map(([key, value]) => {
        return key !== "pictureUrl" && key !== "id"
          ? value.toString().toLowerCase()
          : "";
      });
      return values.some((val) => val.includes(searchQuery.toLowerCase()));
    });
    setFilteredData(filtered);
  }, [searchQuery]);

  const renderItem = ({ item }) => {
    if (route.params.isPopular) {
      return (
        <View style={{ padding: 8 }}>
          <PopularCard item={item} />
        </View>
      );
    } else {
      return (
        <View style={{ padding: 8 }}>
          <ScheduleCard item={item} />
        </View>
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <SafeAreaView style={styles.container}>
        {!route.params.isPopular && (
          <View style={styles.searchContainer}>
            <TextInput
              style={{ ...styles.searchInput, paddingLeft: 40 }}
              placeholder="Search..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Icon
              name="search"
              size={24}
              color="#999"
              style={{ position: "absolute", top: 27, left: 27 }}
            />
          </View>
        )}
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={route.params.isPopular ? 2 : 1}
        />

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="chat" size={30} color="#fff" />
        </TouchableOpacity>

        <DialogflowModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    marginTop: 20,
  },
  searchInput: {
    height: 48,
    backgroundColor: lightTheme.colors.homeSearchInputColor,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  chatButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default ViewAllScreen;
