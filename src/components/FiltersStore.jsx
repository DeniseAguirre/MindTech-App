import { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Card, IconButton, Searchbar, Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import useStore from "../store/store";
import { FontFamily } from "../../GlobalStyles";
import DropDownPicker from "react-native-dropdown-picker";

function FiltersStore() {
  const navigation = useNavigation();
  const {
    allProducts,
    getAllProducts,
    categories,
    brands,
    getCategories,
    getBrands,
    favorites,
    toggleFavorite,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderPrice, setOrderPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const [openCategory, setOpenCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllProducts(), getCategories(), getBrands()]);
      setLoading(false);
    };
    fetchData();
  }, [getAllProducts, getCategories, getBrands]);

  const categoryItems = useMemo(
    () => [
      { label: "Todas las categorías", value: null },
      ...categories.map((cat) => ({
        label: cat.name,
        value: cat._id,
      })),
    ],
    [categories]
  );

  const brandItems = useMemo(
    () => [
      { label: "Todas las marcas", value: null },
      ...brands.map((b) => ({
        label: b.name,
        value: b._id,
      })),
    ],
    [brands]
  );

  const filteredProducts = useMemo(() => {
    return allProducts
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
  }, [allProducts, selectedCategory, selectedBrand, searchQuery, orderPrice]);

  const handleCoverPress = (item) => {
    navigation.navigate("Details", { item: item });
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some((fav) => fav._id === item._id);

    return (
      <View style={styles.item}>
        <Card style={styles.card}>
          <Card.Cover
            style={styles.cover}
            source={{ uri: item.images[0] }}
            onPress={() => handleCoverPress(item)}
          />
          <Card.Content style={styles.title}>
            <Text style={styles.name}>
              {item.name.length > 40
                ? item.name.substring(0, 40) + "..."
                : item.name}
            </Text>
          </Card.Content>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {item.price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Text>
            <IconButton
              icon={isFavorite ? "heart" : "heart-outline"}
              color={isFavorite ? "#FF0000" : "#000000"}
              size={20}
              onPress={() => toggleFavorite(item)}
            />
          </View>
        </Card>
      </View>
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSearchQuery("");
    setOrderPrice("");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        <DropDownPicker
          open={openCategory}
          value={selectedCategory}
          items={categoryItems}
          setOpen={setOpenCategory}
          setValue={setSelectedCategory}
          placeholder="Selecciona una categoría"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={3000}
          zIndexInverse={1000}
        />
        <DropDownPicker
          open={openBrand}
          value={selectedBrand}
          items={brandItems}
          setOpen={setOpenBrand}
          setValue={setSelectedBrand}
          placeholder="Selecciona una marca"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={2000}
          zIndexInverse={2000}
        />
        <Searchbar
          placeholder="Buscar"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <View style={styles.orderContainer}>
          <Button
            mode="contained"
            onPress={() => setOrderPrice("descendent")}
            style={[
              styles.orderButton,
              orderPrice === "descendent" && styles.activeButton,
            ]}
            labelStyle={styles.orderButtonText}
          >
            Precio: Bajo a Alto
          </Button>
          <Button
            mode="contained"
            onPress={() => setOrderPrice("ascendent")}
            style={[
              styles.orderButton,
              orderPrice === "ascendent" && styles.activeButton,
            ]}
            labelStyle={styles.orderButtonText}
          >
            Precio: Alto a Bajo
          </Button>
        </View>
        <Button
          mode="outlined"
          onPress={clearFilters}
          style={styles.clearButton}
          labelStyle={styles.clearButtonText}
        >
          Limpiar filtros
        </Button>
      </View>
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />
      ) : (
        <Text style={styles.noResults}>No se encontraron productos</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filtersContainer: {
    padding: 16,
    zIndex: 1000,
  },
  dropdown: {
    marginBottom: 16,
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  searchbar: {
    marginBottom: 16,
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  orderButton: {
    flex: 1,
    marginRight: 8,
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  orderButtonText: {
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 12,
  },
  clearButton: {
    marginBottom: 16,
  },
  clearButtonText: {
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 14,
  },
  productList: {
    padding: 16,
  },
  item: {
    flex: 1,
    width: "50%",
    padding: 4,
  },
  card: {
    borderRadius: 8,
    overflow: "hidden",
  },
  cover: {
    height: 150,
  },
  title: {
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontFamily: FontFamily.poppinsRegular,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  price: {
    fontSize: 14,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResults: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 18,
    fontFamily: FontFamily.poppinsRegular,
  },
});

export default FiltersStore;
