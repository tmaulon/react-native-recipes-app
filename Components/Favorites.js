import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity
} from "react-native";
import FadeIn from "../Animations/FadeIn";
import { connect } from "react-redux";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { colors } from "../Helpers/Colors";
import { ScrollView } from "react-native-gesture-handler";
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
