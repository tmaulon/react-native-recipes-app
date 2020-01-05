// Components/RecipeCard.js

import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import FadeIn from "../Animations/FadeIn";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { colors } from "../Helpers/Colors";

class RecipeCard extends React.Component {
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
    const { recipe, displayDetailForRecipe } = this.props;
    console.log("in recipe card : ", this.props);

    return (
      <FadeIn>
        <TouchableOpacity
          style={styles.main_container}
          onPress={() => displayDetailForRecipe(recipe.uri)}
        >
          <Image style={styles.image} source={{ uri: recipe.image }} />
          <View style={styles.content_container}>
            <View style={styles.header_container}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Text style={styles.title_text}>{recipe.label}</Text>
                <View style={styles.heart_wrapper}>
                  {this._displayFavoriteImage()}
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 10
                  }}
                >
                  <MaterialCommunityIcon
                    name="fire"
                    size={16}
                    color={colors.white}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={{ color: colors.white }}>
                    {parseInt(recipe.calories)}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5Icon
                    name="utensils"
                    size={16}
                    color={colors.white}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={{ color: colors.white }}>{recipe.yield}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </FadeIn>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    alignSelf: "center",
    position: "relative",
    flex: 1,
    height: 200,
    flexDirection: "row",
    marginVertical: 15,
    elevation: 1, // only for android
    shadowOffset: { width: 1, height: 1 }, //only for ios
    shadowColor: "#000", //only for ios
    width: wp("90%"),
    shadowOpacity: 0.7,
    backgroundColor: "#fff",
    borderRadius: 50,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  content_container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  header_container: {
    flex: 1
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center"
  },
  title_text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
    flex: 3
  },
  heart_wrapper: {
    flex: 1
  },
  vote_text: {
    fontWeight: "bold",
    fontSize: 26,
    color: "#666666"
  },
  description_container: {
    flex: 7
  },
  description_text: {
    fontStyle: "italic",
    color: "#666666"
  },
  date_container: {
    flex: 1
  },
  date_text: {
    textAlign: "right",
    fontSize: 14
  },
  favorite_image: {
    width: 25,
    height: 25,
    marginRight: 5
  }
});

export default RecipeCard;
