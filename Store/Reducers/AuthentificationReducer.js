import {
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_ERROR
} from "../Actions/ActionTypes";

const initialState = {
  token: undefined
};

export default function AuthentificationReducer(state = initialState, action) {
  switch (action.type) {
    case FACEBOOK_LOGIN_SUCCESS:
      return {
        token: action.payload
      };
      break;
    case FACEBOOK_LOGIN_ERROR:
      return {
        token: action.payload
      };
      break;
    default:
      return state;
      break;
  }
}
