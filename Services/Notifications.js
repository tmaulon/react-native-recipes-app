import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import axios from "axios";

export const suscribeToPushNotifications = () => {
  Permissions.getAsync(Permissions.NOTIFICATIONS).then(existingPermission => {
    if (existingPermission.status !== "granted") {
      Permissions.askAsync(Permissions.NOTIFICATIONS).then(permission => {
        if (permission.status !== "granted") {
          console.log("====================================");
          console.log("nope permission.status !", permission.status);
          console.log("====================================");
          return;
        } else {
          Notifications.getExpoPushTokenAsync().then(token => {
            axios
              .get(
                "https://u-meteo-map-notifications.herokuapp.com/?token=" +
                  token
              )
              .then(axiosResponse => {
                console.log("====================================");
                console.log("axiosResponse.data => ", axiosResponse.data);
                console.log("====================================");
              });
          });
        }
      });
    } else {
      Notifications.getExpoPushTokenAsync().then(token => {
        axios
          .get(
            "https://u-meteo-map-notifications.herokuapp.com/?token=" + token
          )
          .then(axiosResponse => {
            console.log("====================================");
            console.log("axiosResponse.data => ", axiosResponse.data);
            console.log("====================================");
          });
      });
    }
  });
};
