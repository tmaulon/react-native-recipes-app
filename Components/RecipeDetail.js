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
  Platform
} from "react-native";
import { getRecipeDetailFromApi } from "../API/RecipeSearchAPi";
import { connect } from "react-redux";
import EnlargeShrink from "../Animations/EnlargeShrink";

class RecipeDetail extends React.Component {
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

  render() {
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayrecipe()}
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
  image: {
    height: 169,
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

const mapStateToProps = state => {
  return {
    favoritesRecipe: state.favoritesRecipe
  };
};

export default connect(mapStateToProps)(RecipeDetail);
