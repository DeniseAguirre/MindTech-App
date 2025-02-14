import type React from "react";
import { useCallback } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import useStore from "../store/store";
import { FontFamily } from "../../GlobalStyles";
import { Product } from "../interfaces/IProduct";
import type { RootStackParamList } from "../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";

interface ProductListProps {
  products: Product[];
  numColumns?: number;
  showFavorites?: boolean;
  onToggleFavorite?: (product: Product) => void;
}

const MAX_TEXT_LENGTH = 10;

const ProductList: React.FC<ProductListProps> = ({
  products,
  numColumns = 2,
  showFavorites = true,
  onToggleFavorite,
}) => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Details">>();
  const { favorites, toggleFavorite } = useStore();

  const shortenText = useCallback((text: string) => {
    return text.length <= MAX_TEXT_LENGTH
      ? text
      : `${text.substring(0, MAX_TEXT_LENGTH)}...`;
  }, []);

  const handleCoverPress = useCallback(
    (item: Product) => {
      navigation.navigate("Details", { item });
    },
    [navigation]
  );

  const formatPrice = useCallback((price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => {
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
                {showFavorites && (
                  <IconButton
                    icon={isFavorite ? "heart" : "heart-outline"}
                    iconColor={isFavorite ? "#FF0000" : "#000000"}
                    size={20}
                    onPress={() =>
                      onToggleFavorite
                        ? onToggleFavorite(item)
                        : toggleFavorite(item)
                    }
                  />
                )}
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
      shortenText,
      showFavorites,
      onToggleFavorite,
      toggleFavorite,
    ]
  );

  return (
    <FlatList<Product>
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      numColumns={numColumns}
      nestedScrollEnabled={true}
      ListFooterComponent={<View style={{ height: 80 }} />}
    />
  );
};

const styles = StyleSheet.create({
  coverTouchable: {
    flex: 1,
    margin: 4,
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
  name: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: FontFamily.poppinsRegular,
    marginTop: 5,
  },
  brand: {
    fontSize: 9,
    marginTop: 3,
    fontWeight: "800",
    color: "gray",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  price: {
    fontSize: 15,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "bold",
  },
});

export default ProductList;
