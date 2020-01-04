// Components/Search.js

import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  SafeAreaView,
  FlatList
} from "react-native";
import RecipesList from "./RecipesList";
import RecipeItem from "./RecipeItem";
import { getRecipesFromApiWithSearchedText } from "../API/RecipeSearchAPi";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import AntDesignIcon from "react-native-vector-icons/AntDesign";

import { colors } from "../Helpers/Colors";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.searchedText = "";
    this.minPageNumber = 0;
    this.lastPageNumber = 0;
    this.totalPages = 0;
    this.state = {
      recipes: [],
      isLoading: false
    };
    this._loadRecipes = this._loadRecipes.bind(this);
  }

  _loadRecipes() {
    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true });
      console.log(this.searchedText);
      getRecipesFromApiWithSearchedText(
        this.searchedText,
        this.minPageNumber,
        this.lastPageNumber + 10
      ).then(data => {
        this.minPageNumber = data.from;
        this.lastPageNumber = data.to;
        this.totalPages = data.count;
        this.setState({
          recipes: [...this.state.recipes, ...data.hits],
          isLoading: false
        });
      });
    }
  }
  _loadMoreRecipes() {
    console.log(
      "end reachend, lastpagenumber, recipes : ",
      this.lastPageNumber,
      this.state.recipes
    );

    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true });
      this.minPageNumber = this.lastPageNumber;
      this.lastPageNumber = this.lastPageNumber + 20;
      getRecipesFromApiWithSearchedText(
        this.searchedText,
        this.minPageNumber,
        this.lastPageNumber
      ).then(data => {
        // this.minPageNumber = data.from;
        // this.lastPageNumber = data.to;
        // this.totalPages = data.count;
        this.setState({
          recipes: [...this.state.recipes, ...data.hits],
          isLoading: false
        });
      });
      console.log(
        "new minPageNumber, new lastpagenumber, new recipes : ",
        this.minPageNumber,
        this.lastPageNumber,
        this.state.recipes
      );
    }
  }

  _searchTextInputChanged(text) {
    this.searchedText = text;
  }

  _searchRecipes() {
    this.minPageNumber = 0;
    this.lastPageNumber = 0;
    this.totalPages = 0;
    this.setState(
      {
        recipes: []
      },
      () => {
        this._loadRecipes();
      }
    );
  }

  _displayDetailForRecipe = uri => {
    console.log("display recipe with uri : ", uri);
    this.props.navigation.navigate("RecipeDetail", { uri: uri });
  };

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.main_container}>
        {/* <View style={styles.main_container}> */}
        <View style={styles.textinput_wrapper}>
          {/* <SearchIcon fontSize={30} style={{ color: "#40B89F" }} /> */}
          <FontAwesomeIcon
            name="search"
            fontSize={30}
            color={colors.turquoiseGreen}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Nom d'un ingrédient"
            onChangeText={text => this._searchTextInputChanged(text)}
            onSubmitEditing={() => this._searchRecipes()}
          />
          {/* <Button title="Rechercher" onPress={() => this._searchRecipes()} /> */}
        </View>
        <FlatList
          style={{ flex: 1, width: "100%", paddingTop: hp("13%") }}
          data={this.state.recipes}
          // extraData={this.props.favoritesRecipe}
          keyExtractor={(item, index) => `${item.uri}-${index}`}
          renderItem={({ item }) => (
            <RecipeItem
              recipe={item.recipe}
              // isRecipeFavorite={
              //   this.props.favoritesRecipe.findIndex(
              //     recipe => recipe.uri === item.recipe.uri
              //   ) !== -1
              //     ? true
              //     : false
              // }
              // Bonus pour différencier les recipes déjà présent dans notre state global et qui n'ont donc pas besoin d'être récupérés depuis l'API
              displayDetailForRecipe={this._displayDetailForRecipe}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            // if (
            // !this.props.favoriteList &&
            // this.props.lastPageNumber < this.props.totalPages
            // ) {
            this._loadMoreRecipes();
            // }
          }}
        />
        {/* <RecipesList
            recipes={this.state.recipes}
            navigation={this.props.navigation}
            loadrecipes={this._loadRecipes}
            minPageNumber={this.minPageNumber}
            lastPageNumber={this.lastPageNumber}
            totalPages={this.totalPages}
            favoriteList={false}
          /> */}
        {this._displayLoading()}
        {/* </View> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    position: "relative",
    alignItems: "center"
  },
  textinput_wrapper: {
    zIndex: 10,
    width: wp("95%"),
    position: "absolute",
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 15,
    backgroundColor: colors.white,
    borderRadius: 35,
    paddingHorizontal: 25,
    paddingVertical: 5,
    elevation: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 10
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    width: "100%",
    // borderColor: "#000000",
    // borderWidth: 1,
    paddingLeft: 5
  },
  loading_container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Search;
