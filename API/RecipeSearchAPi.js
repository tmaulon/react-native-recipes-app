export const APP_ID = "365b729d";
export const APP_KEY = "ae6aed4ed3889cfcc1c6ebb8c36c19af";

/**
 * Documentation url : https://developer.edamam.com/edamam-docs-recipe-api
 *
 * Exemple  "https://api.edamam.com/search?q=chicken&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&from=0&to=3&calories=591-722&health=alcohol-free";
 *
 */
export const RecipesSearchURLBase = "https://api.edamam.com/search";

export async function getRecipesFromApiWithSearchedText(
  query,
  minPageNumber,
  lastPageNumber
) {
  const url =
    minPageNumber && lastPageNumber
      ? `${RecipesSearchURLBase}?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&from=${minPageNumber}&to=${lastPageNumber}`
      : `${RecipesSearchURLBase}?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`;
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return console.error(error);
  }
}

export async function getRecipesFromApiWithSearchedTextAndMaxCalories(
  query,
  maximumCalories,
  minPageNumber,
  lastPageNumber
) {
  const url = `${RecipesSearchURLBase}?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&calories=0-${maximumCalories}&from=${minPageNumber}&to=${lastPageNumber}`;
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return console.error(error);
  }
}

/**
 *
 * @param {string} uri
 * https://api.edamam.com/search?r=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_b79327d05b8e5b838ad6cfd9576b30b6&app_id=365b729d&app_key=ae6aed4ed3889cfcc1c6ebb8c36c19af
 */
export async function getRecipeDetailFromApi(uri) {
  const url = `https://api.edamam.com/search?r=${encodeURIComponent(
    uri
  )}&app_id=${APP_ID}&app_key=${APP_KEY}`;

  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return console.error(error);
  }
}
