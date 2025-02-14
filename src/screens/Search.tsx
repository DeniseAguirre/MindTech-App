import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

import useStore from "../store/store";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ProductList from "../components/ProductList";
import { Product } from "../interfaces/IProduct";

type SearchScreenRouteProp = RouteProp<
  { Search: { searchQuery?: string } },
  "Search"
>;

const Search = () => {
  const { allProducts, getAllProducts } = useStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const route = useRoute<SearchScreenRouteProp>();

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    const query = route.params?.searchQuery;
    if (query) {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [route.params?.searchQuery, allProducts]);

  return (
    <View style={styles.container}>
      <Header />
      <SearchBar />
      <ProductList products={filteredProducts} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Search;
