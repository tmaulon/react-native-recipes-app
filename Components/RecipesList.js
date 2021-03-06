// Components/RecipesList.js

import React from "react";
import { FlatList } from "react-native";
import RecipeCard from "./RecipeCard";
import { connect } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class RecipesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };
  }

  _displayDetailForRecipe = uri => {
    console.log("display recipe with uri : ", uri);
    this.props.navigation.navigate("RecipeDetail", { uri: uri });
  };

  render() {
    return (
      <FlatList
        style={{
          flex: 1,
          height: "100%",
          width: screenWidth,
          paddingTop: !this.props.favoriteList ? hp("13%") : 20
        }}
        data={this.props.recipes}
        extraData={this.props.favoritesRecipe}
        keyExtractor={(item, index) => `${item.uri}-${index}`}
        renderItem={({ item }) => {
          return (
            <RecipeCard
              recipe={this.props.favoriteList === true ? item : item.recipe}
              isFavoriteRecipe={
                this.props.favoriteList !== true
                  ? this.props.favoritesRecipe.findIndex(
                      recipe => recipe.uri === item.recipe.uri
                    ) !== -1
                    ? true
                    : false
                  : this.props.favoritesRecipe.findIndex(
                      recipe => recipe.uri === item.uri
                    ) !== -1
                  ? true
                  : false
              }
              displayDetailForRecipe={this._displayDetailForRecipe}
            />
          );
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!this.props.favoriteList) {
            this.props.loadMoreRecipes();
          }
        }}
      />
    );
  }
}
const mapStateToProps = state => {
  return {
    favoritesRecipe: state.favoritesRecipe
  };
};

export default connect(mapStateToProps)(RecipesList);
