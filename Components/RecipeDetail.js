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
import EnlargeShrink from "../Animations/EnlargeShrink";

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
      scrollOffset: new Animated.Value(0)
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

  _displayRecipe() {
    const { scrollOffset } = this.state;
    const expandedHeaderHeight = 400;
    const collapsedHeaderHeight = 64;
    const titleHeight = 44;
    const scrollSpan = expandedHeaderHeight - collapsedHeaderHeight;
    // Utilisation d'Animated.event pour mettre à jour scrollOffset lors de l'évènement onScroll
    const scrollEvent = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.state.scrollOffset } } }],
      { useNativeDriver: true }
    );

    if (this.state.recipe != undefined) {
      const hour = parseInt(this.state.recipe.totalTime / 60);
      const minutes = this.state.recipe.totalTime % 60;
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
                left: 30,
                bottom: 100,
                flex: 1,
                width: "80%",
                // Déplacement du titre vers le haut afin de le faire apparaitre progressivement
                transform: [
                  {
                    translateY: scrollOffset.interpolate({
                      inputRange: [scrollSpan, scrollSpan + titleHeight],
                      outputRange: [titleHeight, 0],
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
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingTop: 50,
              paddingHorizontal: 30
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 10,
                  color: "#40B89F"
                  // color: "#58FFC0"
                }}
              >
                Temps de préparation
              </Text>
              <Text>
                {hour !== 0 ? `${hour}h ` : ""}
                {minutes !== 0 ? `${minutes}mn` : ""}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 10,
                  color: "#40B89F"
                  // color: "#58FFC0"
                }}
              >
                Nombre de parts
              </Text>
              <Text>{this.state.recipe.yield}</Text>
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
  favorite_container: {
    alignItems: "center"
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
