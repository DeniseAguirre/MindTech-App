import { View, StyleSheet, Text } from "react-native";

import useStore from "../store/store";
import Header from "../components/Header";
import ProductList from "../components/ProductList";

const Favorites = () => {
  const { favorites, toggleFavorite } = useStore();

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MY FAVORITES</Text>
      </View>
      <ProductList
        products={favorites}
        showFavorites={true}
        onToggleFavorite={toggleFavorite}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    backgroundColor: "black",
    padding: 16,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 4,
  },
});

export default Favorites;
