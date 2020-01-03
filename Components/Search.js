// Components/Search.js

import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import RecipesList from "./RecipesList";
import { getRecipesFromApiWithSearchedText } from "../API/RecipeSearchAPi";

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
      getRecipesFromApiWithSearchedText(this.searchedText).then(data => {
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
        <View style={styles.main_container}>
          <TextInput
            style={styles.textinput}
            placeholder="Nom d'un ingrédient"
            onChangeText={text => this._searchTextInputChanged(text)}
            onSubmitEditing={() => this._searchRecipes()}
          />
          <Button title="Rechercher" onPress={() => this._searchRecipes()} />
          <RecipesList
            recipes={this.state.recipes}
            navigation={this.props.navigation}
            loadrecipes={this._loadRecipes}
            minPageNumber={this.minPageNumber}
            lastPageNumber={this.lastPageNumber}
            totalPages={this.totalPages}
            favoriteList={false}
          />
          {this._displayLoading()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: "#000000",
    borderWidth: 1,
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
