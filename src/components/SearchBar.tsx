import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Searchbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";

// Definir el tipo de los props que recibe el componente de navegación
type NavigationProp = {
  navigate: (screen: string, params?: { searchQuery: string } | string) => void;
};

const SearchBar: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Search">>();
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const handleSearch = () => {
    console.log(searchQuery);
    if (searchQuery !== "") {
      navigation.navigate("Search", { searchQuery: searchQuery });
    } else {
      navigation.navigate("Search", { searchQuery: "" });
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
