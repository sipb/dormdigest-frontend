import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";

import EventView from "./components/event/EventView";
import HomeView from "./components/home/HomeView";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="DormspamApp">
          <Route exact path="/" component={HomeView} />
          <Route exact path="/event/:id" component={EventView} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
