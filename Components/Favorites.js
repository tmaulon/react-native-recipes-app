import React from "react";
import { SafeAreaView } from "react-native";
import { connect } from "react-redux";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { colors } from "../Helpers/Colors";
import RecipesList from "./RecipesList";

class Favorites extends React.Component {
  _displayFavoriteImage() {
    console.log("in _display favorite image : ", this.props.favoritesRecipe);

    return this.props.isFavoriteRecipe ? (
      <FontAwesomeIcon
        name="heart"
        fontSize={35}
        size={35}
        color={colors.white}
      />
    ) : (
      <FontAwesomeIcon
        name="heart-o"
        fontSize={35}
        size={35}
        color={colors.white}
      />
    );
  }

  render() {
    console.log("in favorites, this.props", this.props);

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <RecipesList
          style={{ flex: 1 }}
          recipes={this.props.favoritesRecipe}
          navigation={this.props.navigation}
          favoriteList={true}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    favoritesRecipe: state.favoritesRecipe
  };
};

// export default Favorites;
export default connect(mapStateToProps)(Favorites);
