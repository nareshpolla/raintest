import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
} from "react-navigation";
// import Home from "./screens/Home";
import Home from "./Screens/Home";
import ArticleDetails from "./Screens/ArticleDetails";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

const latestNavigation = createStackNavigator(
  {
    Home: { screen: Home },
    ArticleDetails: { screen: ArticleDetails },
  },
  { initialRouteName: "Home" }
);

export default createAppContainer(latestNavigation);
