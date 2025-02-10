import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import useStore from "../store/store";
import LoginModal from "../components/LoginModal";
import { Icon } from "react-native-paper";

const Details = () => {
  const route = useRoute();
  const { item } = route.params;
  const navigation = useNavigation();
  const { addToCart, toggleFavorite, favorites, isLoading, error, user } =
    useStore();
  const [modalVisible, setModalVisible] = useState(false);

  const isFavorite = favorites.some((fav) => fav._id === item._id);

  const handleAddToCart = () => {
    const cartItem = {
      product_id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      images: item.images,
    };
    addToCart(cartItem);
    navigation.navigate("MyCart");
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      setModalVisible(true);
      return;
    }

    const result = await toggleFavorite(item);
    if (!result.success) {
      Alert.alert("Error", result.error || "No se pudo actualizar favoritos");
    }
  };

  const handleLogin = () => {
    setModalVisible(false);
    navigation.navigate("SignIn");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.images[0] }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price.toFixed(2)} €</Text>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleToggleFavorite}
      >
        <Icon
          source={isFavorite ? "heart" : "heart-outline"}
          size={28}
          color={isFavorite ? "red" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>AÑADIR AL CARRITO</Text>
      </TouchableOpacity>
      <LoginModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLogin={handleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Details;
