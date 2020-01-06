// Navigation/Navigations.js

import React from "react";
import { StyleSheet, Image } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Search from "../Components/Search";
import RecipeDetail from "../Components/RecipeDetail";
import Favorites from "../Components/Favorites";
import { colors } from "../Helpers/Colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SearchStackNavigator = createStackNavigator({
  Search: {
    screen: Search,
    navigationOptions: {
      title: "Rechercher une recette",
      headerStyle: {
        backgroundColor: colors.turquoiseGreen
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontSize: 20,
        color: colors.white,
        fontWeight: "bold"
      }
    }
  },
  RecipeDetail: {
    screen: RecipeDetail,
    navigationOptions: {
      title: "Détail de la recette",
      headerStyle: {
        backgroundColor: colors.turquoiseGreen
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontSize: 20,
        color: colors.white,
        fontWeight: "bold"
      }
    }
  }
});
const FavoritesStackNavigator = createStackNavigator({
  Favorites: {
    screen: Favorites,
    navigationOptions: {
      title: "Mes recettes",
      headerStyle: {
        backgroundColor: colors.turquoiseGreen
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontSize: 20,
        color: colors.white,
        fontWeight: "bold"
      }
    }
  },
  RecipeDetail: {
    screen: RecipeDetail,
    navigationOptions: {
      title: "Rechercher une recette",
      headerStyle: {
        backgroundColor: colors.turquoiseGreen
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontSize: 20,
        color: colors.white,
        fontWeight: "bold"
      }
    }
  }
});

const RecipesTabNavigator = createBottomTabNavigator(
  {
    Search: {
      screen: SearchStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <AntDesign name="search1" size={25} color={tintColor} />
        )
      }
    },
    Favorites: {
      screen: FavoritesStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <AntDesign name="heart" size={25} color={tintColor} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      activeBackgroundColor: colors.turquoiseGreen,
      inactiveBackgroundColor: colors.turquoiseGreen,
      showLabel: false,
      showIcon: true,
      activeTintColor: colors.white,
      inactiveTintColor: colors.lightGreen
    }
  }
);

export default createAppContainer(RecipesTabNavigator);
