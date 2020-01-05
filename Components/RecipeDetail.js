// Components/RecipeDetail.js

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Platform,
  Animated
} from "react-native";
import { getRecipeDetailFromApi } from "../API/RecipeSearchAPi";
import { connect } from "react-redux";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { colors } from "../Helpers/Colors";
import { ProgressChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

class RecipeDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    // On accède à la fonction shareRecipe et à la recette via les paramètres qu'on a ajouté à la navigation
    if (params.recipe != undefined && Platform.OS === "ios") {
      return {
        // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
        headerRight: (
          <TouchableOpacity
            style={styles.share_touchable_header_right_button}
            onPress={() => params.shareRecipe()}
          >
            <Image
              style={styles.share_image}
              source={require("../Images/ic_share.png")}
            />
          </TouchableOpacity>
        )
      };
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      recipe: undefined,
      isLoading: true,
      scrollOffset: new Animated.Value(0),
      ingredientsListOpacityValue: new Animated.Value(0),
      showIngredientsList: false
    };
    this._shareRecipe = this._shareRecipe.bind(this);
  }

  _updateNavigationParams() {
    this.props.navigation.setParams({
      shareRecipe: this._shareRecipe,
      recipe: this.state.recipe
    });
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }

  _calcTimeServing = time => {
    const hour = parseInt(time / 60);
    const minutes = time % 60;
    return (
      <Text style={styles.indicators_text}>
        {hour !== 0 ? `${hour}h ` : ""}
        {minutes !== 0 ? `${minutes}mn` : ""}
      </Text>
    );
  };
  _calcNutritionalValuesPerServing = (quantity, portion) =>
    parseInt(quantity / portion);
  _calcDailyNutritionalValuesPerServing = (quantity, portion) =>
    parseInt(quantity / portion) > 100 ? 100 : parseInt(quantity / portion);
  _displayNutritionalValuesPerServing = (label, quantity, unit, portion) => {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.nutritional_value_label}>{label}</Text>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={styles.nutritional_value_result}>
            {this._calcNutritionalValuesPerServing(quantity, portion)}
          </Text>
          <Text style={styles.nutritional_value_unit}>{unit}</Text>
        </View>
      </View>
    );
  };
  _displayDailyNutritionalValuesPerServingChart = (
    quantity,
    portion,
    nutritionalValuesPerServingLabel,
    nutritionalValuesPerServingQuantity,
    nutritionalValuesPerServingUnit
  ) => {
    const chartConfig = {
      backgroundGradientFrom: "#fff",
      backgroundGradientTo: "#fff",
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 1 // optional, default 3
    };
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}
      >
        <ProgressChart
          data={[
            this._calcDailyNutritionalValuesPerServing(quantity, portion) / 100
          ]}
          width={220}
          height={220}
          chartConfig={chartConfig}
        />
        <View
          style={{ position: "absolute", left: 0, right: 0, marginLeft: -40 }}
        >
          {this._displayNutritionalValuesPerServing(
            nutritionalValuesPerServingLabel,
            nutritionalValuesPerServingQuantity,
            nutritionalValuesPerServingUnit,
            portion
          )}
        </View>
      </View>
    );
  };
  _displayRecipeLabels = labels =>
    labels.map((label, index) => {
      return (
        <View key={index} style={styles.label_tag}>
          <Text style={styles.label_tag_text}>{label}</Text>
        </View>
      );
    });
  _displayIngredients = ingredients =>
    ingredients.map((ingredient, index) => {
      return (
        <View key={index}>
          <Text style={styles.ingredients_header}>{ingredient.text}</Text>
          <Text style={styles.ingredients_item}>
            {parseInt(ingredient.weight)}g
          </Text>
        </View>
      );
    });
  _openIngredientsList = () => {
    Animated.timing(this.state.ingredientsListOpacityValue, {
      toValue: 1,
      duration: 1000
    }).start();
    this.setState({ showIngredientsList: !this.state.showIngredientsList });
  };

  _toggleFavorite() {
    // type de l'action à passer : "TOGGLE_FAVORITE" et la valeur de l'action est la recette affichée
    const action = { type: "TOGGLE_FAVORITE", value: this.state.recipe };
    this.props.dispatch(action);
  }

  _displayFavoriteImage() {
    console.log(
      "in _display favorite image : ",
      this.props.favoritesRecipe,
      this.state.recipe
    );

    return this.props.favoritesRecipe.findIndex(
      item => item.uri === this.state.recipe.uri
    ) !== -1 ? (
      <FontAwesomeIcon
        name="heart"
        fontSize={35}
        size={35}
        color={colors.turquoiseGreen}
      />
    ) : (
      <FontAwesomeIcon
        name="heart-o"
        fontSize={35}
        size={35}
        color={colors.turquoiseGreen}
      />
    );
  }

  _shareRecipe() {
    Share.share({ title: this.state.recipe.label, url: this.state.recipe.url });
  }

  _displayFloatingActionButton() {
    if (this.state.recipe != undefined && Platform.OS === "android") {
      // Uniquement sur Android et lorsque le film est chargé
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this._shareRecipe()}
        >
          <Image
            style={styles.share_image}
            source={require("../Images/ic_share.png")}
          />
        </TouchableOpacity>
      );
    }
  }

  _displayRecipe() {
    const { scrollOffset } = this.state;
    const expandedHeaderHeight = 400;
    const collapsedHeaderHeight = 100;
    const titleHeight = 50;
    const scrollSpan = expandedHeaderHeight - collapsedHeaderHeight;
    // Utilisation d'Animated.event pour mettre à jour scrollOffset lors de l'évènement onScroll
    const scrollEvent = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.state.scrollOffset } } }],
      { useNativeDriver: true }
    );

    if (this.state.recipe != undefined) {
      return (
        <Animated.ScrollView
          // Mis à jour de scrollOffset sur l'évènement onScroll
          onScroll={scrollEvent}
          // scrollEventThrottle={1} est nécessaire afin d'être notifié de tous les évènements de défilement
          scrollEventThrottle={1}
        >
          <Animated.View
            style={{
              height: expandedHeaderHeight,
              zIndex: 100,
              overflow: "hidden",
              position: "relative",
              // Déplacement du header vers le haut afin de réduire sa hauteur
              transform: [
                {
                  translateY: Animated.subtract(
                    scrollOffset,
                    scrollOffset.interpolate({
                      inputRange: [0, scrollSpan],
                      outputRange: [0, scrollSpan],
                      extrapolate: "clamp"
                    })
                  )
                }
              ]
            }}
          >
            <Animated.Image
              style={[
                styles.image_header,
                {
                  transform: [
                    {
                      translateY: scrollOffset.interpolate({
                        inputRange: [0, scrollSpan],
                        outputRange: [0, scrollSpan / 2],
                        extrapolate: "clamp"
                      })
                    }
                  ]
                }
              ]}
              source={{ uri: this.state.recipe.image }}
            />
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: "black",
                  // Apparition d'un overlay noir semi-transparent
                  opacity: scrollOffset.interpolate({
                    inputRange: [scrollSpan / 2, scrollSpan],
                    outputRange: [0, 0.85],
                    extrapolate: "clamp"
                  })
                }
              ]}
            />
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                flex: 1,
                width: screenWidth,
                paddingHorizontal: 30,
                paddingVertical: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                // Déplacement du titre vers le haut afin de le faire apparaitre progressivement
                transform: [
                  {
                    translateY: scrollOffset.interpolate({
                      inputRange: [scrollSpan, scrollSpan + titleHeight],
                      outputRange: [0, 0],
                      // outputRange: [titleHeight, 0],
                      extrapolate: "clamp"
                    })
                  }
                ]
              }}
            >
              <Animated.Text
                style={{
                  fontSize: 35,
                  fontWeight: "bold",
                  color: "white"
                }}
              >
                {this.state.recipe.label}
              </Animated.Text>
              <TouchableOpacity
                style={styles.favorite_container}
                onPress={() => this._toggleFavorite()}
              >
                {this._displayFavoriteImage()}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
          <View
            style={{
              width: screenWidth,
              paddingTop: 20,
              flex: 1
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                width: screenWidth,
                paddingHorizontal: 30,
                flex: 1
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={styles.subtitle_text}>Préparation</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AntDesignIcon
                    name="clockcircleo"
                    size={12}
                    color={colors.turquoiseGreen}
                    style={{ marginRight: 5 }}
                  />
                  {this._calcTimeServing(this.state.recipe.totalTime)}
                </View>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.subtitle_text}>Calories</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialCommunityIcon
                    name="fire"
                    size={16}
                    color={colors.turquoiseGreen}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.indicators_text}>
                    {this._calcNutritionalValuesPerServing(
                      this.state.recipe.calories,
                      this.state.recipe.yield
                    )}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.subtitle_text}>Portions</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5Icon
                    name="utensils"
                    size={16}
                    color={colors.turquoiseGreen}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.indicators_text}>
                    {this.state.recipe.yield}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.ingredients_container}>
              <Text style={styles.ingredients_section_title}>
                Régimes alimentaires
              </Text>
              {/* tags list with dietLabels */}
              <View
                style={{
                  flex: 1,
                  width: screenWidth,
                  flexDirection: "row",
                  flexWrap: "wrap"
                }}
              >
                {this._displayRecipeLabels([
                  ...this.state.recipe.dietLabels,
                  ...this.state.recipe.healthLabels
                ])}
              </View>
            </View>
            <View style={{ alignItems: "center", width: screenWidth, flex: 1 }}>
              <Text
                style={[
                  styles.subtitle_text,
                  {
                    paddingHorizontal: 30
                  }
                ]}
              >
                Valeurs nutritionnelles par portion
              </Text>
              <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }} horizontal>
                  <View style={{ flex: 1 }}>
                    {this._displayDailyNutritionalValuesPerServingChart(
                      this.state.recipe.totalDaily.CHOCDF.quantity,
                      this.state.recipe.yield,
                      this.state.recipe.totalNutrients.CHOCDF.label,
                      this.state.recipe.totalNutrients.CHOCDF.quantity,
                      this.state.recipe.totalNutrients.CHOCDF.unit
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    {this._displayDailyNutritionalValuesPerServingChart(
                      this.state.recipe.totalDaily.PROCNT.quantity,
                      this.state.recipe.yield,
                      this.state.recipe.totalNutrients.PROCNT.label,
                      this.state.recipe.totalNutrients.PROCNT.quantity,
                      this.state.recipe.totalNutrients.PROCNT.unit
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    {this._displayDailyNutritionalValuesPerServingChart(
                      this.state.recipe.totalDaily.FAT.quantity,
                      this.state.recipe.yield,
                      this.state.recipe.totalNutrients.FAT.label,
                      this.state.recipe.totalNutrients.FAT.quantity,
                      this.state.recipe.totalNutrients.FAT.unit
                    )}
                  </View>
                </ScrollView>
              </View>
            </View>

            <View style={styles.ingredients_container}>
              <Text style={styles.ingredients_section_title}>
                Liste des ingrédients
              </Text>
              <Animated.View
                style={{
                  opacity: this.state.ingredientsListOpacityValue,
                  flex: 1,
                  overflow: "hidden"
                }}
              >
                {this.state.showIngredientsList &&
                  this._displayIngredients(this.state.recipe.ingredients)}
              </Animated.View>
              <TouchableOpacity
                style={styles.ingredients_list_btn}
                onPress={() => this._openIngredientsList()}
              >
                <Text style={styles.ingredients_list_text_Btn}>
                  {!this.state.showIngredientsList
                    ? "Voir la liste des ingrédients"
                    : "Cacher la liste des ingrédients"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.ScrollView>
      );
    }
  }

  componentDidMount() {
    console.log(
      "Component RecipeDetail monté",
      this.props.navigation.state.params
    );
    const favoriteRecipeIndex = this.props.favoritesRecipe.findIndex(
      item => item.uri === this.props.navigation.state.params.uri
    );
    if (favoriteRecipeIndex !== -1) {
      this.setState(
        {
          recipe: this.props.favoritesRecipe[favoriteRecipeIndex]
        },
        () => {
          this._updateNavigationParams();
        }
      );
      return;
    }

    this.setState({ isLoading: true });
    getRecipeDetailFromApi(this.props.navigation.getParam("uri")).then(data => {
      console.log("Component RecipeDetail monté et data :", data);
      this.setState(
        {
          recipe: data[0], // return an array : [{...}] with the recipe object inside
          isLoading: false
        },
        () => {
          this._updateNavigationParams();
        }
      );
    });
  }

  render() {
    console.log("Component RecipeDetail rendu");
    console.log(
      "Component RecipeDetail rendu Recipe détail props.navigation : ",
      this.props.navigation
    );
    console.log(
      "Component RecipeDetail rendu Recipe détail données du state global : ",
      this.props
    );

    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayRecipe()}
        {this._displayFloatingActionButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  loading_container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  scrollview_container: {
    flex: 1
  },
  image_header: {
    width: "100%",
    height: "100%"
  },
  image: {
    height: 500,
    margin: 5
  },
  title_text: {
    fontWeight: "bold",
    fontSize: 35,
    flex: 1,
    flexWrap: "wrap",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    color: "#000000",
    textAlign: "center"
  },
  subtitle_text: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 20,
    marginBottom: 10,
    color: colors.turquoiseGreen
  },
  indicators_text: {
    color: colors.turquoiseGreen
  },
  nutritional_value_label: {
    color: colors.grey,
    fontSize: 12
  },
  nutritional_value_result: {
    color: colors.turquoiseGreen,
    fontSize: 16
  },
  nutritional_value_unit: {
    color: colors.turquoiseGreen,
    fontSize: 16
  },
  ingredients_container: {
    flex: 1,
    paddingHorizontal: 20
  },
  ingredients_section_title: {
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.turquoiseGreen
  },
  ingredients_header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: colors.lightGreen,
    color: colors.turquoiseGreen
  },
  ingredients_item: {
    fontSize: 14,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 10,
    color: colors.turquoiseGreen
  },
  label_tag: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginRight: 20,
    marginBottom: 10,
    backgroundColor: colors.turquoiseGreen,
    borderRadius: 5
  },
  label_tag_text: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "bold"
  },
  favorite_container: {
    alignItems: "center"
  },
  ingredients_list_btn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginRight: 20,
    marginBottom: 10,
    backgroundColor: colors.turquoiseGreen,
    borderRadius: 5
  },
  ingredients_list_text_Btn: {
    textAlign: "center",
    fontSize: 14,
    color: colors.white,
    fontWeight: "bold"
  },
  description_text: {
    fontStyle: "italic",
    color: "#666666",
    margin: 5,
    marginBottom: 15
  },
  default_text: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5
  },
  favorite_image: {
    flex: 1,
    width: null,
    height: null
  },
  share_touchable_floatingactionbutton: {
    position: "absolute",
    width: 60,
    height: 60,
    right: 30,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: "#e91e63",
    justifyContent: "center",
    alignItems: "center"
  },
  share_image: {
    width: 30,
    height: 30
  },
  share_touchable_header_right_button: {
    marginRight: 8
  }
});

const mapStateToProps = state => {
  return {
    favoritesRecipe: state.favoritesRecipe
  };
};

export default connect(mapStateToProps)(RecipeDetail);
