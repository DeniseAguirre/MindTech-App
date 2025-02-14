import React from "react";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import SignIn from "../screens/SignIn";
import Search from "../screens/Search";
import MyTabBar from "../components/TabBarCustom";
import Favorites from "../screens/Favorites";
import Store from "../screens/Store";

// Definimos el tipo para las propiedades de nuestro Tab.Navigator si es necesario.
const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props: BottomTabBarProps) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Store"
        component={Store}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="User"
        component={SignIn}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
