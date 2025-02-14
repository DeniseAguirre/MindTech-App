import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { FontSize } from "../../GlobalStyles";

function FeaturedProducts() {
  return (
    <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 5 }}>
      <Text style={styles.textFeaturedProducts}>Featured Products</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textFeaturedProducts: {
    fontSize: FontSize.size_sm,
    letterSpacing: 6,
    color: "#1b1a1a",
    width: 300,
    height: 30,
    fontWeight: 600,
  },
});

export default FeaturedProducts;
