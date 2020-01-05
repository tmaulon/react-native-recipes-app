// Components/RecipesList.js

import React from "react";
import { StyleSheet, FlatList, Text, View } from "react-native";
import RecipeCard from "./RecipeCard";
import { connect } from "react-redux";

class RecipesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };
  }

  _displayDetailForRecipe = uri => {
    this.props.navigation.navigate("RecipeDetail");
  };

  render() {
    return (
      <FlatList
        style={styles.list}
        data={this.props.recipes}
        extraData={this.props.favoritesRecipe}
        keyExtractor={(item, index) => `${item.uri}-${index}`}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item.recipe}
            isRecipeFavorite={
              this.props.favoritesRecipe.findIndex(
                recipe => recipe.uri === item.recipe.uri
              ) !== -1
                ? true
                : false
            } // Bonus pour différencier les recipes déjà présent dans notre state global et qui n'ont donc pas besoin d'être récupérés depuis l'API
            displayDetailForRecipe={this._displayDetailForRecipe}
          />
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (
            !this.props.favoriteList &&
            this.props.lastPageNumber < this.props.totalPages
          ) {
            this.props.loadrecipes();
          }
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
});

const mapStateToProps = state => {
  return {
    favoritesRecipe: state.favoritesRecipe
  };
};

export default connect(mapStateToProps)(RecipesList);
