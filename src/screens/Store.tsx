import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar, Button } from "react-native-paper";
import useStore from "../store/store";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../components/Header";
import ProductList from "../components/ProductList";

const Store = () => {
  const {
    allProducts,
    getAllProducts,
    categories,
    brands,
    getCategories,
    getBrands,
  } = useStore();
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [orderPrice, setOrderPrice] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);

  useEffect(() => {
    getAllProducts();
    getCategories();
    getBrands();
  }, [getAllProducts, getCategories, getBrands]);

  useEffect(() => {
    const filtered = allProducts
      .filter(
        (product) =>
          (!selectedCategory || product.category._id === selectedCategory) &&
          (!selectedBrand || product.brand._id === selectedBrand) &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (orderPrice === "descendent") return a.price - b.price;
        if (orderPrice === "ascendent") return b.price - a.price;
        return 0;
      });
    setFilteredProducts(filtered);
  }, [allProducts, selectedCategory, selectedBrand, searchQuery, orderPrice]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSearchQuery("");
    setOrderPrice("");
  };

  return (
    <View style={styles.container}>
      <Header />
      <View>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <View style={{ zIndex: 1 }}>
          <View style={styles.containerDropdown}>
            <View style={{ flex: 1, zIndex: openCategory ? 30 : 1 }}>
              <DropDownPicker
                items={[
                  { label: "All categories", value: null },
                  ...categories.map((cat) => ({
                    label: cat.name,
                    value: cat._id,
                  })),
                ]}
                value={selectedCategory}
                setValue={setSelectedCategory}
                open={openCategory}
                setOpen={setOpenCategory}
                placeholder="Select Category"
                containerStyle={styles.dropdownContainer}
              />
            </View>

            <View style={{ flex: 1, zIndex: openBrand ? 30 : 1 }}>
              <DropDownPicker
                items={[
                  { label: "All brands", value: null },
                  ...brands.map((brand) => ({
                    label: brand.name,
                    value: brand._id,
                  })),
                ]}
                value={selectedBrand}
                setValue={setSelectedBrand}
                open={openBrand}
                setOpen={setOpenBrand}
                placeholder="Select Brand"
                containerStyle={styles.dropdownContainer}
              />
            </View>
          </View>

          {/* Botones de ordenamiento con mayor zIndex */}
          <View style={styles.orderContainer}>
            <Button
              mode="contained"
              onPress={() => setOrderPrice("descendent")}
              style={[
                styles.orderButton,
                orderPrice === "descendent" && styles.activeButton,
              ]}
            >
              Price: Low to High
            </Button>
            <Button
              mode="contained"
              onPress={() => setOrderPrice("ascendent")}
              style={[
                styles.orderButton,
                orderPrice === "ascendent" && styles.activeButton,
              ]}
            >
              Price: High to Low
            </Button>
          </View>
        </View>

        <Button
          mode="outlined"
          onPress={clearFilters}
          style={styles.clearButton}
        >
          Clear filters
        </Button>

        <ProductList products={filteredProducts} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    margin: 8,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  searchbar: {
    marginVertical: 8,
  },
  activeButton: {
    backgroundColor: "black",
  },
  clearButton: {
    margin: 4,
  },
  containerDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dropdownContainer: {
    height: "auto",
    width: "95%",
    margin: 4,
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    zIndex: 20, // ✅ Asegurar que los botones estén encima
  },
  orderButton: {
    flex: 1,
    margin: 4,
  },
});

export default Store;
