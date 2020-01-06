import React, { Component } from "react";
import { Text, View, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import { facebookLogin, setToken } from "../Store/Actions/Index";
import { withNavigation } from "react-navigation";
import { suscribeToPushNotifications } from "../Services/Notifications";

class Index extends Component {
  componentDidMount() {
    suscribeToPushNotifications();
    // verify if we already have a token
    AsyncStorage.getItem("fbToken").then(token => {
      if (token) {
        this.props.setToken(token);
        this.goToSearch();
      } else {
        this.props.facebookLogin(this.goToSearch);
      }
    });
  }

  goToSearch = () => {
    this.props.navigation.push("Search");
  };

  render() {
    return <View />;
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = {
  facebookLogin,
  setToken
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(Index)
);
