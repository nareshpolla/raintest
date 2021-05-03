import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
} from "react-navigation";
// import Home from "./screens/Home";
import Home from "./Screens/Home";
import Checkout from "./Screens/Checkout";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

const latestNavigation = createStackNavigator(
  {
    Home: { screen: Home },
    Checkout: { screen: Checkout },
  },
  { initialRouteName: "Home" }
);

export default createAppContainer(latestNavigation);
