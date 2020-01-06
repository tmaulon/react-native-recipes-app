// // Store/configureStore.js

// import { createStore } from "redux";
// import toggleFavorite from "./Reducers/favoriteReducer";

// export default createStore(toggleFavorite);

import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./Reducers/Index";

const composedEnhancer = composeWithDevTools(applyMiddleware(thunk));
const store = createStore(reducers, {}, composedEnhancer);

export default store;
