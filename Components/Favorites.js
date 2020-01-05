// Components/Favorites.js

import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import RecipesList from "./RecipesList";
import { connect } from "react-redux";

class Favorites extends React.Component {
  render() {
    return (
      <SafeAreaView>
        <Text>Favorites recipes</Text>
        {/* {this.props.favoritesRecipe.map(r => (
          <Text>{r.label}</Text>
        ))} */}
        {/* <RecipesList
          recipes={this.props.favoritesRecipe}
          navigation={this.props.navigation}
          favoriteList={true} // Ici on est bien dans le cas de la liste des recipes favoris. Ce booléen à true permettra d'empêcher de lancer la recherche de plus de recipes après un scroll lorsqu'on est sur la vue Favoris.
        /> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  return {
    favoritesRecipe: state.favoritesRecipe
  };
};

export default connect(mapStateToProps)(Favorites);
