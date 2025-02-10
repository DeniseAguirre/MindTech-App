import React, { useCallback } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

import Image1 from "./../../assets/images/gamer.png";
import Image2 from "./../../assets/images/pc.png";
import Image3 from "./../../assets/images/rectangle-32.png";
import {
  useSharedValue,
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function CarouselHeader() {
  const images = [
    { id: 1, source: Image1 },
    { id: 2, source: Image2 },
    { id: 3, source: Image3 },
  ];

  const scrollOffsetValue = useSharedValue(0);
  const width = Dimensions.get("window").width;

  const renderItem = useCallback(({ index, item }) => {
    return (
      <View style={{ flex: 1, top: 10 }} key={item.id}>
        <Image source={item.source} style={styles.image} />
      </View>
    );
  }, []);

  return (
    <View
      id="carousel-component"
      dataSet={{ kind: "basic-layouts", name: "normal" }}
      style={{ flex: 1, width: width }}
    >
      <Carousel
        testID="carousel"
        loop={true}
        width={width}
        height={200}
        snapEnabled={true}
        pagingEnabled={true}
        autoPlayInterval={2000}
        data={images}
        defaultScrollOffsetValue={scrollOffsetValue}
        style={{ width: "100%" }}
        onScrollStart={() => console.log("Inicio de Scroll")}
        onScrollEnd={() => console.log("Fin de Scroll")}
        onConfigurePanGesture={(g) => {
          "worklet";
          g.enabled(false);
        }}
        onSnapToItem={(index) => console.log("Índice actual:", index)}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "95%",
    height: "90%",
    borderRadius: 18,
  },
});

export default CarouselHeader;
