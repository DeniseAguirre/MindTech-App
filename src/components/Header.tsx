import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { Color, FontSize } from "../../GlobalStyles";
import CartHeader from "./CartHeader";

const Header: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.mindtech}>MINDTECH</Text>
      <CartHeader />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: Dimensions.get("window").width,
    top: 65,
    paddingLeft: 20,
    paddingBottom: 10,
  },
  mindtech: {
    letterSpacing: 8,
    width: 278,
    height: 79,
    fontSize: FontSize.size_base,
    color: Color.black,
    fontWeight: "700",
  },
});

export default Header;
