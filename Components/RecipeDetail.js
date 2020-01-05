// Components/RecipeDetail.js

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  SectionList,
  Image,
  TouchableOpacity,
  Share,
  Platform,
  Animated,
  Button
} from "react-native";
import { getRecipeDetailFromApi } from "../API/RecipeSearchAPi";
import { connect } from "react-redux";
import EnlargeShrink from "../Animations/EnlargeShrink";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { colors } from "../Helpers/Colors";
import { ProgressChart } from "react-native-chart-kit";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class RecipeDetail extends React.Component {
  /*
   static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    // On accède à la fonction shareRecipe et au recipe via les paramètres qu'on a ajouté à la navigation
    if (params.recipe != undefined && Platform.OS === "ios") {
      return {
        // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
        headerRight: (
          <TouchableOpacity
            style={styles.share_touchable_headerrightbutton}
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
      recipe: { recipe: undefined },
      isLoading: false
    };
    // Ne pas oublier de binder la fonction _shareRecipe sinon, lorsqu'on va l'appeler depuis le headerRight de la navigation, this.state.recipe sera undefined et fera planter l'application
    this._shareRecipe = this._shareRecipe.bind(this);
    this._toggleFavorite = this._toggleFavorite.bind(this);
  }

  // Fonction pour faire passer la fonction _shareRecipe et le recipe aux paramètres de la navigation. Ainsi on aura accès à ces données au moment de définir le headerRight
  _updateNavigationParams() {
    this.props.navigation.setParams({
      shareRecipe: this._shareRecipe,
      recipe: { recipe: this.state.recipe.recipe }
    });
  }

  // Dès que le recipe est chargé, on met à jour les paramètres de la navigation (avec la fonction _updateNavigationParams) pour afficher le bouton de partage
  componentDidMount() {
    const favoriteRecipeUri = this.props.favoritesRecipe.findIndex(
      item => item.recipe.uri === this.props.navigation.state.params.uri
    );
    if (favoriteRecipeUri !== -1) {
      // recipe déjà dans nos favoris, on a déjà son détail
      // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
      this.setState(
        {
          recipe: this.props.favoritesRecipe[favoriteRecipeUri]
        },
        () => {
          this._updateNavigationParams();
        }
      );
      return;
    }
    // Le recipe n'est pas dans nos favoris, on n'a pas son détail
    // On appelle l'API pour récupérer son détail
    this.setState({ isLoading: true });
    getRecipeDetailFromApi(this.props.navigation.state.params.uri).then(
      data => {
        this.setState(
          {
            recipe: { recipe: data[0] },
            isLoading: false
          },
          () => {
            this._updateNavigationParams();
          }
        );
      }
    );
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

  _toggleFavorite() {
    const action = { type: "TOGGLE_FAVORITE", value: this.state.recipe.recipe };
    this.props.dispatch(action);
  }

  _displayFavoriteImage() {
    var sourceImage = require("../Images/ic_favorite_border.png");
    var shouldEnlarge = false;
    if (
      this.props.favoritesRecipe.findIndex(
        item => item.uri === this.state.recipe.recipe.uri
      ) !== -1
    ) {
      sourceImage = require("../Images/ic_favorite.png");
      shouldEnlarge = true;
    }
    return (
      <EnlargeShrink shouldEnlarge={shouldEnlarge}>
        <Image style={styles.favorite_image} source={sourceImage} />
      </EnlargeShrink>
    );
  }

  _displayrecipe() {
    const { recipe } = this.state.recipe;
    if (recipe != undefined) {
      return (
        <ScrollView style={styles.scrollview_container}>
          <Image style={styles.image} source={{ uri: recipe.image }} />
          <Text style={styles.title_text}>{recipe.label}</Text>
          <TouchableOpacity
            style={styles.favorite_container}
            onPress={() => this._toggleFavorite()}
          >
            {this._displayFavoriteImage()}
          </TouchableOpacity>
        </ScrollView>
      );
    }
  }

  _shareRecipe() {
    const { recipe } = this.state;
    Share.share({
      title: recipe.label,
      message: "message"
    });
  }

  _displayFloatingActionButton() {
    const { recipe } = this.state;
    if (recipe != undefined && Platform.OS === "android") {
      // uniquement sur android et lorsque le recipe est chargé
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

   */

  constructor(props) {
    super(props);
    this.state = {
      recipe: undefined,
      isLoading: true,
      scrollOffset: new Animated.Value(0),
      ingredientsListOpacityValue: new Animated.Value(0),
      showIngredientsList: false
    };
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
      console.log("test : ", this.state.recipe.totalNutrients);

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
                  {/* {this.state.recipe.digest.map(item => {
                    return (
                      <View style={{ flex: 1 }} key={item.label}>
                        {this._displayDailyNutritionalValuesPerServingChart(
                          item.daily,
                          this.state.recipe.yield,
                          item.label,
                          item.total,
                          item.unit
                        )}
                      </View>
                    );
                  })} */}
                </ScrollView>
              </View>
            </View>

            <View style={styles.ingredients_container}>
              {/* <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              > */}
              <Text style={styles.ingredients_section_title}>
                Liste des ingrédients
              </Text>

              {/* <TouchableOpacity
                  style={styles.ingredients_list_btn}
                  onPress={() => this._openIngredientsList()}
                >
                  <Text style={styles.ingredients_list_text_Btn}>Voir</Text>
                </TouchableOpacity> */}
              {/* </View> */}
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
    console.log("Component FilmDetail monté");
    getRecipeDetailFromApi(this.props.navigation.getParam("uri")).then(data => {
      console.log(data);
      this.setState({
        recipe: data[0], // return an array : [{...}] with the recipe object inside
        isLoading: false
      });
    });
  }

  render() {
    console.log("Component FilmDetail rendu");
    console.log("Film détail : ", this.props.navigation);

    return (
      <View style={styles.main_container}>
        {/* <Text> */}
        {/* Détail de la recette :
          {this.props.navigation.getParam("uri") */}
        {/* ou */}
        {/* this.props.navigation.state.params.uri */}
        {/* } */}
        {/* </Text> */}
        {this._displayLoading()}
        {this._displayRecipe()}
        {/*
        {this._displayrecipe()}
        {this._displayFloatingActionButton()} */}
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
  share_touchable_headerrightbutton: {
    marginRight: 8
  }
});

// const mapStateToProps = state => {
//   return {
//     favoritesRecipe: state.favoritesRecipe
//   };
// };

// export default connect(mapStateToProps)(RecipeDetail);
export default RecipeDetail;
