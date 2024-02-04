import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./HomeHeaderView.css";


class HomeHeaderView extends Component {
  render() {
    return (
      <div className="HomeHeaderView">
        <img src="/img/bars-solid.svg" alt="Menu" className="hamburger" onClick={this.props.onHamburgerClick} />
        <img className="logo" src="/img/dormdigest.svg" alt="Logo" />
        <Link to="/settings">
          {/*<img src="/img/settings.svg" alt="Settings" />*/}
        </Link>
      </div>
    );
  }
}

export default HomeHeaderView;
