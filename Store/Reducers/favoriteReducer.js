// Store/Reducers/favoriteReducer.js

const initialState = { favoritesRecipe: [] };

const toggleFavorite = (state = initialState, action) => {
  let nextState;
  switch (action.type) {
    case "TOGGLE_FAVORITE":
      const favoriteRecipeUri = state.favoritesRecipe.findIndex(
        item => item.uri === action.value.uri
      );
      if (favoriteRecipeUri !== -1) {
        // Le film est déjà dans les favoris, on le supprime de la liste
        nextState = {
          ...state,
          favoritesRecipe: state.favoritesRecipe.filter(
            (item, index) => index !== favoriteRecipeUri
          )
        };
      } else {
        // Le film n'est pas dans les recipes favoris, on l'ajoute à la liste
        nextState = {
          ...state,
          favoritesRecipe: [...state.favoritesRecipe, action.value]
        };
      }
      return nextState || state;
      break;

    default:
      return state;
      break;
  }
};

export default toggleFavorite;
