//My favourites
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontSize, FontFamily, Color } from "../../GlobalStyles";
import { Card, IconButton } from "react-native-paper";
import useStore from "../store/store";
import Header from "./../components/Header";
import { useRoute, useNavigation } from "@react-navigation/native";

function Favorites() {
  const navigation = useNavigation();
  const { favorites, handleFavorite, removeFavorite, allProducts} =
  useStore();
  const numColumns = 2;
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const maxLength = 40;

  const shortenText = (text) => {
    if (text.length <= maxLength) {
      return text; 
    } else {
      return text.substring(0, maxLength) + "..."; 
    }
  };


  const toggleFavorite = (itemId) => {
    if (favoriteItems.includes(itemId)) {
      setFavoriteItems(favoriteItems.filter((item) => item !== itemId));
    } else {
      setFavoriteItems([...favoriteItems, itemId]);
    }
    
  };

  const handleCoverPress = (item) => {
    console.log(item);
    navigation.navigate("Details", { item: filterProductId(item._id) });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  };

  const filterProductId = (id) => {
    return allProducts?.filter(x => x._id == id)[0]
  };

  const renderItem = ({ item }) => {
    const isFavorite = favoriteItems?.includes(item._id);
    console.log(isFavorite)
    console.log(favorites)
    return (
      <View style={styles.item}>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.coverTouchable}
            onPress={() => handleCoverPress(item)}
          >
            <Card.Cover style={styles.cover} source={{ uri: item?.images }} />
          </TouchableOpacity>
          <Card.Content style={styles.title}>
            <Text style={styles.name}>{shortenText(item?.name)}</Text>
          </Card.Content>
          <View>
            <Text style={styles.price}>{formatPrice(item?.price)}</Text>
            <IconButton
              style={styles.heartIcon}
              icon={"heart"}
              color={isFavorite ? "#FF0000" : "#000000"}
              size={20}
              onPress={() => {toggleFavorite(item._id); 
                removeFavorite(item._id)
              }}
            />
          </View>
        </Card>
      </View>
    );
  };

  return (
    <View >
      <Header />
      <View style={styles.containerFavoritesHeader}>
        <Text style={styles.titleFavorites}>MY FAVOURITES</Text>
      </View>
      {!loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.gridContainer}
          key={`flatlist-${numColumns}`}
          numColumns={numColumns}
        />
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  titleFavorites: {
    letterSpacing: 8,
    width: Dimensions.get("window").width,
    height: 79,
    fontSize: FontSize.size_base,
    color: Color.white,
    fontWeight: 700,
    top: 35,
    textAlign: "center",
  },
  containerFavoritesHeader: {
    height: 90,
    width: Dimensions.get("window").width,
    backgroundColor: "black",
    
  },
  iconHeart: {
    textAlign: "right",
    top: -100,
    left: 25,
  },
  containerFavorites: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    alignItems: "center",
  },

  card: {
    height: 210,
    width: 154,
  },
  container: {
    marginBottom: 140,
    paddingTop: 10,
    alignItems: "center",
    width: Dimensions.get("window").width,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  gridContainer: {
    padding: 1,
    alignItems: "center",
  },
  item: {
    width: Dimensions.get("window").width / 2 - 30,
    height: 210,
    margin: 10,
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

export default Favorites;
