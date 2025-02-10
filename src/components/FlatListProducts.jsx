import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontFamily } from "../../GlobalStyles";
import { Card, IconButton, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import useStore from "../store/store";
import LoginModal from "./LoginModal";

const ListScrollProducts = () => {
  const { allProducts, getAllProducts, favorites, toggleFavorite, user } =
    useStore();
  const numColumns = 2;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const maxLength = 40;

  const shortenText = (text) => {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.substring(0, maxLength) + "...";
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    if (allProducts?.length > 0) {
      setLoading(false);
    }
  }, [allProducts]);

  const handleToggleFavorite = async (item) => {
    if (!user) {
      setSelectedProduct(item);
      setModalVisible(true);
    } else {
      await toggleFavorite(item);
    }
  };

  const handleCoverPress = (item) => {
    navigation.navigate("Details", { item: item });
  };

  const handleLogin = () => {
    setModalVisible(false);
    navigation.navigate("SignIn");
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some((fav) => fav._id === item._id);
    return (
      <View style={styles.item}>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.coverTouchable}
            onPress={() => handleCoverPress(item)}
          >
            <Card.Cover style={styles.cover} source={{ uri: item.images[0] }} />
          </TouchableOpacity>
          <Card.Content style={styles.title}>
            <Text style={styles.name}>{shortenText(item.name)}</Text>
          </Card.Content>
          <View>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
            <IconButton
              style={styles.heartIcon}
              icon={isFavorite ? "heart" : "heart-outline"}
              color={isFavorite ? "#FF0000" : "#000000"}
              size={20}
              onPress={() => handleToggleFavorite(item)}
            />
          </View>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={allProducts}
          horizontal={false}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.gridContainer}
          key={`flatlist-${numColumns}`}
          numColumns={numColumns}
        />
      )}
      <LoginModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLogin={handleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 210,
    width: 154,
  },
  container: {
    flex: 1,
    marginBottom: 60,
    paddingTop: 10,
    left: 8,
  },
  gridContainer: {
    padding: 1,
  },
  item: {
    marginBottom: 20,
    width: Dimensions.get("window").width / 2 - 16,
  },
  cover: {
    height: "60%",
  },
  heartIcon: {
    top: -52,
    left: 107,
  },
  title: {
    textAlign: "left",
    paddingBottom: 1,
    alignItems: "flex-start",
    position: "absolute",
    top: 124,
  },
  coverTouchable: {
    height: 200,
  },
  name: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: FontFamily.poppinsRegular,
    marginTop: 5,
  },
  price: {
    fontSize: 15,
    top: -18,
    left: 15,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "bold",
  },
});

export default ListScrollProducts;
