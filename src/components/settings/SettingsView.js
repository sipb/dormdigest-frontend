import React, { Component } from "react";
import { Navigate } from "react-router-dom";

import Users from "../../api/users";
import "./SettingsView.css";

import FrequencyView from "./frequency/FrequencyView";
import PreferencesView from "./preferences/PreferencesView";

class SettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentItem: "Preferences",
      loading: true,
      redirect: null,
    };

    Users.getCurrentUser().then(response => {
      this.setState({
        loading: false,
        user: response.data
      });
    });

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleUserUpdate = this.handleUserUpdate.bind(this);
  }

  handleItemClick(event) {
    const self = this;

    if (event.target.getAttribute("item") === "Log Out") {
      Users.logout().then(response => {
        self.setState({
          redirect: "/",
        });
      });
    }

    this.setState({
      currentItem: event.target.getAttribute("item")
    });
  }

  handleUserUpdate(data) {
    this.setState({
      user: data
    });
  }

  render() {
    if (this.state.redirect !== null) {
      return <Navigate to={this.state.redirect} />;
    } else if (this.state.loading === true) {
      return <div />;
    }

    let settingsItems = ["Preferences", "Frequency", "Log Out"];
    let settingsItemTags = settingsItems.map(item => (
      <li className={item === this.state.currentItem ? "active" : ""} key={item} item={item} onClick={this.handleItemClick}>{item}</li>
    ));

    return (
      <div className="SettingsView">
        <div className="right column">
          <FrequencyView hidden={this.state.currentItem !== "Frequency"} onUserUpdate={this.handleUserUpdate} user={this.state.user} />
          <PreferencesView hidden={this.state.currentItem !== "Preferences"} onUserUpdate={this.handleUserUpdate} user={this.state.user} />
        </div>
        <div className="left column">
          <div className="headertop">
            <a href="/">
              <img src="/img/back.svg" alt="Settings" />
              <br />
              <img className="logo" src="/img/dormdigest.svg" alt="Logo" />
            </a>
          </div>
          <ul>
            {settingsItemTags}
          </ul>
        </div>
      </div>
    );
  }
}

export default SettingsView;
