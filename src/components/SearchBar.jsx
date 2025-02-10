import React, { useState } from "react";
import { Searchbar } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SearchBar = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  const handleSearch = () => {
    console.log(searchQuery);
    if (searchQuery !== undefined) {
      navigation.navigate("Search", { searchQuery: searchQuery });
    } else {
      navigation.navigate("Search", "");
    }
  };

  return (
    <View style={{ flex: 1, marginBottom: 16 }}>
      <Searchbar
        style={styles.search}
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        inputStyle={styles.inputStyle}
        onSubmitEditing={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    top: 10,
    width: "100%",
    backgroundColor: "#fff",
  },
});

export default SearchBar;
