import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import useStore from "../store/store";
import { Icon, IconButton } from "react-native-paper";
import { Border, Color, FontFamily, FontSize } from "../../GlobalStyles";
import CartHeader from "../components/CartHeader";
import { Product } from "../interfaces/IProduct";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";

type SearchScreenRouteProp = RouteProp<
  { Details: { item: Product } },
  "Details"
>;
const Details = () => {
  const route = useRoute<SearchScreenRouteProp>();
  const { item } = route.params;
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "MyCart">>();
  const { addToCart, toggleFavorite, favorites, isLoading } = useStore();

  const isFavorite = favorites.some((fav) => fav._id === item._id);

  const handleAddToCart = () => {
    addToCart(item);
    navigation.navigate("MyCart");
  };

  const handleToggleFavorite = async () => {
    toggleFavorite(item);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <IconButton
          style={styles.backIcon}
          icon="arrow-left"
          iconColor={"#000"}
          size={20}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.categoryName}>{item.category.name}</Text>
        <CartHeader />
      </View>
      <ScrollView>
        <Image style={styles.image} source={{ uri: item.images[0] }} />
        <View style={styles.productDetail}>
          <Text style={styles.productName}>{item?.name}</Text>
          <Text style={styles.productBrand}>{item.brand.name}</Text>
          <Text style={styles.productPrice}>{item.price.toFixed(2)} €</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleToggleFavorite()}
          >
            <Icon
              source={isFavorite ? "heart" : "heart-outline"}
              size={28}
              color={isFavorite ? "red" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonAddToBag}
            onPress={handleAddToCart}
          >
            <Text style={styles.textButtonAddToBag}>ADD TO BAG</Text>
          </TouchableOpacity>
          <Text style={styles.productDescription}>{item.description}</Text>
        </View>
      </ScrollView>
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
    height: 360,
    marginVertical: 20,
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
    right: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    width: Dimensions.get("window").width,
    top: 60,
    paddingLeft: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignContent: "center",
  },
  backIcon: {
    top: -15,
    left: -15,
  },
  categoryName: {
    letterSpacing: 8,
    width: 238,
    height: 79,
    fontSize: FontSize.size_base,
    color: Color.black,
    fontWeight: 700,
    textAlign: "center",
  },

  productDetail: {
    backgroundColor: Color.black,
    height: "100%",
    padding: 20,
    borderTopEndRadius: 60,
  },
  productName: {
    color: Color.white,
    fontSize: FontSize.size_mid,
    letterSpacing: 4,
    paddingBottom: 10,
    fontWeight: "bold",
    width: "80%",
    fontFamily: FontFamily.montserratSemibold,
  },
  productPrice: {
    color: Color.white,
    fontSize: 30,
    letterSpacing: 4,
    paddingBottom: 20,
    fontFamily: FontFamily.montserratSemibold,
  },
  buttonAddToBag: {
    backgroundColor: "#00a524da",
    height: 40,
    width: "95%",
    borderRadius: Border.br_4xl_1,
    justifyContent: "center",
    alignItems: "center",
  },
  textButtonAddToBag: {
    color: "white",
    letterSpacing: 4,
    textAlign: "center",
    fontSize: FontSize.size_xs,
    fontWeight: 700,
  },
  productDescription: {
    marginHorizontal: 5,
    color: "#fff",
    marginVertical: 40,
    fontFamily: FontFamily.montserratLight,
    lineHeight: 23,
  },
  productBrand: {
    color: "gray",
    fontSize: 12,
  },
});

export default Details;
