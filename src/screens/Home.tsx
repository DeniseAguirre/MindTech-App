import { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import useStore from "../store/store";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CarouselHeader from "../components/CarouselHeader";
import FeaturedProducts from "../components/FeaturedProducts";
import ProductList from "../components/ProductList";

const Home = () => {
  const { allProducts, getAllProducts } = useStore();

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const featuredProducts = allProducts.slice(0, 6);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SearchBar />
        <CarouselHeader />
        <FeaturedProducts />
        <ProductList products={featuredProducts} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
  },
});

export default Home;
