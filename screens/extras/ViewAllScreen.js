import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TextInput , ImageBackground} from "react-native";
import ScheduleCard from "../../components/ScheduleCard";
import lightTheme from "../../Themes/LightTheme";
import PopularCard from "../../components/PopularCard";
import { SafeAreaView } from "react-native-safe-area-context";

const ViewAllScreen = ({ route }) => {
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [filteredData, setFilteredData] = useState(route.params.data); // State to store filtered data

  useEffect(() => {
    console.log("Navigation parameters:", route.params);
    console.log("data: ", route.params.data[0]);
    console.log("isPopular: ", route.params.isPopular);
  }, []);

  useEffect(() => {
    // Filter data based on search query and all fields except pictureUrl and id
    const filtered = route.params.data.filter((item) => {
      // Convert each object's values to lowercase strings
      const values = Object.entries(item).map(([key, value]) => {
        // Check if the key is pictureUrl or id, if so, return an empty string
        // Otherwise, return the lowercase string value
        return key !== "pictureUrl" && key !== "id"
          ? value.toString().toLowerCase()
          : "";
      });
      // Check if any value (excluding pictureUrl and id) includes the search query
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
    // <ImageBackground style={{flex:1}} source = {require("../../assets/bg.png")}>
    <SafeAreaView style={styles.container}>
      {!route.params.isPopular && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for doctors or anything"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery} // Update search query state on input change
          />
        </View>
      )}
      <FlatList
        data={filteredData} // Render filtered data
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={route.params.isPopular ? 2 : 1}
      />
    </SafeAreaView>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#E0F4FF"
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
});

export default ViewAllScreen;
