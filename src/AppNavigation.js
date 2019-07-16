import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator  } from "react-navigation";
  // import Home from "./screens/Home";
  import Articles from "./Screens/Articles";
  import ArticleDetails from "./Screens/ArticleDetails";
  import React from "react";
  import Ionicons from "react-native-vector-icons/Ionicons";
  // import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
  
  const categoriesNavigation = createStackNavigator(
    {
      Articles: { screen: Articles },
      ArticleDetails: { screen: ArticleDetails }
    },
    { initialRouteName: "Articles" }
  );
  
  const latestNavigation = createStackNavigator(
    {
      Articles: { screen: Articles },
      ArticleDetails: { screen: ArticleDetails }
    },
    { initialRouteName: "Articles" }
  );
  
  
  
  
  const TabNavigator = createBottomTabNavigator(
    {
      // Home: { screen: Home },
      Latest: latestNavigation,
      Articles: categoriesNavigation,
  
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ tintColor }) => {
          const { routeName } = navigation.state;
          let IconComponent = Ionicons;
          let iconName;
          if (routeName === "Latest") {
            iconName = `ios-list`;
          }
          if (routeName === "Articles") {
            iconName = `ios-grid`;
          } 
  
          // You can return any component that you like here!
          return <IconComponent name={iconName} size={25} color={tintColor} />;
        }
      }),
      tabBarOptions: {
        activeTintColor: "#FFCF00",
        inactiveTintColor: "white",
        style: {
          backgroundColor: "#ADD8E6"
        }
      }
    }
  );
  
  export default createAppContainer(TabNavigator);