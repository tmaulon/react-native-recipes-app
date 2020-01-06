import axios from "axios";
import { FACEBOOK_APP_ID } from "../../API/FacebookAPI";
import { FACEBOOK_LOGIN_SUCCESS, FACEBOOK_LOGIN_ERROR } from "./ActionTypes";

// import { Facebook } from 'expo'
import * as Facebook from "expo-facebook";
import { AsyncStorage } from "react-native";

export const facebookLogin = (onSuccess, onError) => dispatch => {
  Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
    permissions: ["public_profil"]
  })
    .then(fbResponse => {
      if (fbResponse.type === "success") {
        //dispatcher onSuccess fbResponse.token
        setToken(fbResponse.token);
        // dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: fbResponse.token });
        AsyncStorage.setItem("fbToken", fbResponse.token);
        onSuccess && onSuccess();
      } else {
        //dispatcher une erreur
        dispatch({ type: FACEBOOK_LOGIN_ERROR });
        onError && onError();
      }
    })
    .catch(error => {
      // dispatcher erreur
      dispatch({ type: FACEBOOK_LOGIN_ERROR });
      onError && onError();
    });
};
// export const facebookLogin = (onSuccess, onError) => dispatch => {
//   Facebook.initializeAsync(FACEBOOK_APP_ID);
//   const {
//     type,
//     token,
//     expires,
//     permissions,
//     declinedPermissions
//   } = Facebook.logInWithReadPermissionsAsync({
//     permissions: ["public_profile"]
//   })
//     .then(fbResponse => {
//       if (fbResponse.type === "success") {
//         //dispatcher onSuccess fbResponse.token
//         setToken(fbResponse.token);
//         // dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: fbResponse.token })
//         AsyncStorage.setItem("fbToken", fbResponse.token);
//         onSuccess && onSuccess();
//       } else {
//         //dispatcher une erreur
//         dispatch({ type: FACEBOOK_LOGIN_ERROR });
//         onError && onError();
//       }
//     })
//     .catch(error => {
//       // dispatcher erreur
//       dispatch({ type: FACEBOOK_LOGIN_ERROR });
//       onError && onError();
//     });
// };

export const setToken = token => dispatch => {
  dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: token });
};
