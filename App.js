import React, { useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import TabNavigator from "./src/navigations/TabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./src/screens/Register";
import Details from "./src/screens/Details";
import MyCart from "./src/components/MyCart";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useStore from "./src/store/store";

const App = () => {
  const { initializeStore } = useStore();

  useEffect(() => {
    initializeStore();
  }, []);
  const [fontsLoaded, error] = useFonts({
    Poppins_regular: require("./assets/fonts/Poppins_regular.ttf"),
    Poppins_medium: require("./assets/fonts/Poppins_medium.ttf"),
    Montserrat_light: require("./assets/fonts/Montserrat_light.ttf"),
    Montserrat_semibold: require("./assets/fonts/Montserrat_semibold.ttf"),
    Montserrat_bold: require("./assets/fonts/Montserrat_bold.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }
  const Stack = createStackNavigator();

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TabNavigator"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="MyCart" component={MyCart} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};
export default App;
