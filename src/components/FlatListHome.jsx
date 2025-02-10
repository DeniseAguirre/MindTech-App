import { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { FontFamily } from "../../GlobalStyles";
import { Card, IconButton, Text } from "react-native-paper";
import SearchBar from "./SearchBar";
import CarouselHeader from "./CarouselHome";
import FeaturedProducts from "./FeaturedProducts";
import { useNavigation } from "@react-navigation/native";
import useStore from "../store/store";
import LoginModal from "./LoginModal";

const MAX_TEXT_LENGTH = 20;

const ListScrollView = () => {
  const { allProducts, getAllProducts, favorites, toggleFavorite, user } =
    useStore();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    setLoading(!(allProducts && allProducts.length > 0));
  }, [allProducts]);

  const shortenText = useCallback((text) => {
    return text.length <= MAX_TEXT_LENGTH
      ? text
      : `${text.substring(0, MAX_TEXT_LENGTH)}...`;
  }, []);

  const handleCoverPress = useCallback(
    (item) => {
      navigation.navigate("Details", { item });
    },
    [navigation]
  );

  const handleToggleFavorite = useCallback(
    async (item) => {
      if (!user) {
        setSelectedProduct(item);
        setModalVisible(true);
      } else {
        await toggleFavorite(item);
      }
    },
    [user, toggleFavorite]
  );

  const handleLogin = useCallback(() => {
    setModalVisible(false);
    navigation.navigate("SignIn");
  }, [navigation]);

  const formatPrice = useCallback((price) => {
    return price?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  }, []);

  const featuredProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    const sortedProducts = [...allProducts].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    return sortedProducts.slice(0, 6);
  }, [allProducts]);

  const renderItem = useCallback(
    ({ item }) => {
      const isFavorite = favorites.some((fav) => fav._id === item._id);
      return (
        <TouchableOpacity
          style={styles.coverTouchable}
          onPress={() => handleCoverPress(item)}
        >
          <Card style={styles.card}>
            <Card.Cover style={styles.cover} source={{ uri: item.images[0] }} />
            <Card.Content style={styles.title}>
              <Text style={styles.name}>{shortenText(item.name)}</Text>
              <Text style={styles.brand}>{item.brand.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
                <IconButton
                  icon={isFavorite ? "heart" : "heart-outline"}
                  color={isFavorite ? "#FF0000" : "#000000"}
                  size={20}
                  onPress={() => handleToggleFavorite(item)}
                />
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    },
    [
      favorites,
      handleCoverPress,
      formatPrice,
      handleToggleFavorite,
      shortenText,
    ]
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginVertical: 10 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 10 }}>
        <SearchBar />
        <CarouselHeader />
        <FeaturedProducts />
        <View style={styles.itemsContainer}>
          {featuredProducts.map((item) => (
            <View key={item._id} style={styles.item}>
              {renderItem({ item })}
            </View>
          ))}
        </View>
      </ScrollView>
      <LoginModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLogin={handleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 60,
  },
  item: {
    width: "48%",
    marginBottom: 10,
  },
  card: {
    height: 250,
  },
  cover: {
    height: 150,
    resizeMode: "cover",
  },
  title: {
    padding: 5,
  },
  coverTouchable: {
    marginBottom: 10,
  },
  name: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: FontFamily.poppinsRegular,
    marginTop: 5,
  },
  price: {
    fontSize: 15,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "bold",
    marginTop: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    paddingHorizontal: 0,
  },
  brand: {
    fontSize: 9,
    marginTop: 3,
    fontWeight: "800",
    color: "gray",
  },
});

export default ListScrollView;
