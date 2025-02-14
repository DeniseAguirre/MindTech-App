import React, { useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import {
  useSharedValue,
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

interface ImageItem {
  id: number;
  source: ImageSourcePropType | undefined;
}

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const CarouselHeader: React.FC = () => {
  const ref = React.useRef<ICarouselInstance>(null);
  const images: ImageItem[] = [
    {
      id: 1,
      source: {
        uri: "https://i.imgur.com/n7ck05j.jpeg",
      },
    },
    { id: 2, source: { uri: "https://i.imgur.com/NvmuzGk.jpeg" } },
    {
      id: 3,
      source: {
        uri: "https://i.imgur.com/BKHmdyY.jpeg",
      },
    },
    {
      id: 4,
      source: {
        uri: "https://i.imgur.com/KdkaIXF.jpeg",
      },
    },
  ];

  const scrollOffsetValue = useSharedValue(0);
  const width = Dimensions.get("window").width;

  const renderItem = useCallback(({ item }: { item: ImageItem }) => {
    return (
      <View style={{ flex: 1, top: 10 }} key={item.id}>
        <Image source={item.source} style={styles.image} />
      </View>
    );
  }, []);

  return (
    <View style={{ flex: 1, width }}>
      <Carousel<ImageItem>
        ref={ref}
        testID="carousel"
        loop
        width={width}
        height={200}
        snapEnabled
        pagingEnabled
        autoPlayInterval={2000}
        data={images}
        defaultScrollOffsetValue={scrollOffsetValue}
        style={{ width: "100%", margin: 4 }}
        // onScrollStart={() => console.log("Inicio de Scroll")}
        // onScrollEnd={() => console.log("Fin de Scroll")}
        // onConfigurePanGesture={(g: PanGesture) => {
        //   "worklet";
        //   g.enabled(false);
        // }}
        onSnapToItem={(index) => console.log("Índice actual:", index)}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get("window").width - 30,
    height: 180,
    borderRadius: 18,
  },
});

export default CarouselHeader;
