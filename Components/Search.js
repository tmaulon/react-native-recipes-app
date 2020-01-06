// Components/Search.js

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Slider,
  Button,
  ActivityIndicator,
  SafeAreaView,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import RecipesList from "./RecipesList";
import RecipeCard from "./RecipeCard";
import { getRecipesFromApiWithSearchedText } from "../API/RecipeSearchAPi";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { colors } from "../Helpers/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.searchedText = "";
    this.minPageNumber = 0;
    this.lastPageNumber = 0;
    this.totalPages = 0;
    this.state = {
      sliderValue: 0,
      recipes: [],
      isLoading: false,
      filterIsActive: false
    };
    this._loadRecipes = this._loadRecipes.bind(this);
    this._loadMoreRecipes = this._loadMoreRecipes.bind(this);
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
    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true });
      this.minPageNumber = this.lastPageNumber;
      this.lastPageNumber = this.lastPageNumber + 20;
      getRecipesFromApiWithSearchedText(
        this.searchedText,
        this.minPageNumber,
        this.lastPageNumber
      ).then(data => {
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
  _searchSliderInputChanged(val) {
    this.setState({ val });
    console.log(this.state.sliderValue);
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
    console.log(
      "Component Search rendu, données du state global : ",
      this.props
    );
    console.log("Component Search rendu, data : ", this.state.recipes);
    return (
      <SafeAreaView style={styles.main_container}>
        <View style={styles.text_input_wrapper}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesomeIcon
              name="search"
              fontSize={20}
              size={20}
              color={colors.turquoiseGreen}
            />
            <TextInput
              style={styles.text_input}
              placeholder="Nom d'un ingrédient"
              onChangeText={text => this._searchTextInputChanged(text)}
              onSubmitEditing={() => this._searchRecipes()}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: colors.turquoiseGreen,
              padding: 10,
              flexDirection: "row",
              width: "100%"
            }}
            onPress={() =>
              this.setState({ filterIsActive: !this.state.filterIsActive })
            }
          >
            <Text style={{ color: colors.white, marginRight: 20 }}>
              {this.state.filterIsActive
                ? "Cacher le filtre"
                : "Filtrer la recherche"}
            </Text>
            <FontAwesomeIcon
              name="filter"
              fontSize={20}
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>

          {this.state.filterIsActive && (
            <View style={styles.slider_input_wrapper}>
              <Text style={styles.slider_input_text}>
                Filtrer avec un nombre de calories maximum
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[styles.sliderLabels, styles.leftSliderLabel]}>
                  0
                </Text>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={0}
                  maximumValue={5000}
                  step={1}
                  value={this.state.sliderValue}
                  onValueChange={sliderValue => this.setState({ sliderValue })}
                  thumbTintColor="rgb(252, 228, 149)"
                  maximumTrackTintColor="#d3d3d3"
                  minimumTrackTintColor="rgb(252, 228, 149)"
                />
                <Text style={[styles.sliderLabels, styles.rightSliderLabel]}>
                  5000
                </Text>
              </View>
              <Text style={styles.sliderValue}>{this.state.sliderValue}</Text>
            </View>
          )}
        </View>

        <RecipesList
          recipes={this.state.recipes}
          navigation={this.props.navigation}
          loadMoreRecipes={this._loadMoreRecipes}
          minPageNumber={this.minPageNumber}
          lastPageNumber={this.lastPageNumber}
          totalPages={this.totalPages}
          favoriteList={false}
        />
        {this._displayLoading()}
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
  text_input_wrapper: {
    zIndex: 10,
    flex: 1,
    width: wp("95%"),
    position: "absolute",
    top: 0,
    // flexDirection: "row",
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
  text_input: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    width: "100%",
    paddingLeft: 5
  },
  slider_input_text: {
    marginBottom: 15
  },
  sliderInput: {
    width: "80%",
    height: 50,
    borderBottomColor: "rgb(252, 228, 149)",
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingLeft: 5
  },
  slider_input_wrapper: {
    zIndex: 10,
    width: wp("95%"),
    // position: "absolute",
    // top: 100,
    alignItems: "center",
    // marginHorizontal: 15,
    marginTop: 15
    // backgroundColor: colors.white,
    // borderRadius: 35,
    // paddingHorizontal: 25,
    // paddingVertical: 5,
    // elevation: 10,
    // shadowColor: colors.black,
    // shadowOffset: { width: 20, height: 20 },
    // shadowOpacity: 0.15,
    // shadowRadius: 10
  },
  sliderLabels: {
    color: "#d3d3d3"
  },
  leftSliderLabel: {
    marginRight: 15
  },
  rightSliderLabel: {
    marginRight: 15
  },
  sliderValue: {
    color: "rgb(252, 228, 149)",
    fontWeight: "bold",
    marginTop: 15
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

// On connecte le store Redux, ainsi que les recettes favoris du state de notre application, à notre component Search
// const mapStateToProps = state => {
//   return {
//     favoritesRecipe: state.favoritesRecipe
//   };
// };

// export default connect(mapStateToProps)(Search);
export default Search;
