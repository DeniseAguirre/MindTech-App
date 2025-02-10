import { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card, Icon, IconButton } from "react-native-paper";

import useStore from "../store/store";

import { FontFamily } from "../../GlobalStyles";

const MyCart = () => {
  const navigation = useNavigation();
  const {
    cart,
    user,
    addToCart,
    removeFromCart,
    clearCart,
    isLoading,
    error,
    clearError,
  } = useStore();

  useEffect(() => {
    if (error) {
      // Mostrar el error (puedes usar un componente de alerta o un toast)
      alert(error);
      clearError();
    }
  }, [error, clearError]); // Added clearError to dependencies

  const formatPrice = (price) => {
    return price?.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    });
  };

  const handleCheckout = () => {
    if (!user) {
      navigation.navigate("SignIn");
    } else {
      // Implementar lógica de checkout para usuarios registrados
      console.log("Procediendo al checkout");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.containerMyCart}>
      <Text style={styles.headerText}>CARRITO</Text>

      <ScrollView style={styles.drawerContent}>
        <View style={styles.drawerSide}>
          <View style={styles.sidebarContent}>
            {cart.items.map((item, index) => (
              <Card key={index} style={styles.cardItem}>
                <TouchableOpacity
                  onPress={() => removeFromCart(item.product_id)}
                >
                  <Icon
                    name={"delete-outline"}
                    size={28}
                    color={"#222"}
                    style={{ textAlign: "right", margin: 10 }}
                  />
                </TouchableOpacity>
                <Card.Content style={{ flexDirection: "row" }}>
                  <Card.Cover
                    style={{ width: 80, height: 80 }}
                    source={{ uri: item.images[0] }}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: "gray" }}>
                      PRECIO: {formatPrice(item.price)}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                      SUBTOTAL: {formatPrice(item.price * item.quantity)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IconButton
                      icon="minus"
                      onPress={() => removeFromCart(item.product_id)}
                    />
                    <Text style={{ fontSize: 16, marginHorizontal: 10 }}>
                      {item.quantity}
                    </Text>
                    <IconButton icon="plus" onPress={() => addToCart(item)} />
                  </View>
                </Card.Content>
              </Card>
            ))}

            <View style={styles.cartTotalContainer}>
              <Text style={styles.cartTotalText}>
                TOTAL: {formatPrice(cart.total)}
              </Text>
              <View style={styles.buttonsCart}>
                <TouchableOpacity
                  onPress={clearCart}
                  style={styles.clearCartButton}
                >
                  <Text style={styles.clearCartButtonText}>VACIAR CARRITO</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={handleCheckout}
                >
                  <Text style={styles.checkoutButtonText}>
                    {user ? "CONTINUAR AL PAGO" : "INICIAR SESIÓN PARA PAGAR"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerMyCart: {
    //va
    flex: 1,
  },

  sidebarContent: {
    //CONTENEDOR DE LAS CARDS ITEM
    width: Dimensions.get("window").width,
    padding: 10,
    marginVertical: 10,
  },

  cartTotalText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 10,
    fontFamily: FontFamily.montserratBold,
  },
  clearCartButton: {
    borderWidth: 2,
    borderColor: "black",
    padding: 10,
    borderRadius: 50,
    width: "90%",
    marginVertical: 10,
  },
  clearCartButtonText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    fontFamily: FontFamily.montserratBold,
    letterSpacing: 2,
  },
  checkoutButton: {
    borderWidth: 2,
    borderColor: "green",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 50,
    width: "90%",
  },
  checkoutButtonText: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    fontFamily: FontFamily.montserratBold,
    letterSpacing: 2,
  },

  buttonsCart: {
    alignItems: "center",
  },
  backIcon: {
    top: 10,
    left: 10,
    position: "absolute",
  },
  keepBuyingText: {
    color: "black",
    fontSize: 18,
    padding: 10,
  },
  cardItem: {
    marginBottom: 10,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyCart;
