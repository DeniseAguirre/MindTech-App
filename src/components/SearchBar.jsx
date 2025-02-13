import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Searchbar } from "react-native-paper";
import { StyleSheet } from "react-native";

const SearchBar = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = React.useState("");
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
    <Searchbar
      style={styles.search}
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}
      onSubmitEditing={handleSearch}
    />
  );
};

const styles = StyleSheet.create({
  search: {
    margin: 4,
  },
});

export default SearchBar;
