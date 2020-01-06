import { combineReducers } from "redux";
import AuthentificationReducer from "./AuthentificationReducer";

const rootReducer = combineReducers({
  authentification: AuthentificationReducer
});

export default rootReducer;
