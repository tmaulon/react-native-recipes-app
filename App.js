import React from "react";
import Navigation from "./Navigation/Navigation";
import { Provider } from "react-redux";
import Store from "./Store/configureStore";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Index from "./Components/Index";
import Search from "./Components/Search";
import RecipeDetail from "./Components/RecipeDetail";
import Favorites from "./Components/Favorites";

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        {/* <RoutesLogin /> */}
        <Navigation />
      </Provider>
    );
  }
}

// const StackNavigator = createStackNavigator(
//   {
//     Index: Index,
//     Search: Search,
//     Favorites: Favorites
//   },
//   {
//     initialRouteName: "Index"
//     // headerMode: "none"
//   }
// );
// const RoutesLogin = createAppContainer(StackNavigator);
