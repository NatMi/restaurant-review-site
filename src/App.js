import React, { Component } from "react";
import "./Styles/App.css";
import Header from "./Components/Header.js";
import Footer from "./Components/Footer.js";
import Map from "./Components/Map.js";
import TestMap from "./Components/TestMap.js";
import RestaurantSidebar from "./Components/RestaurantSidebar.js";
// import Clock from "../Components/Clock.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleRestaurants: [],
      restaurantMarkerList: []
    };
    this.getRestaurantData = mapData => {
      this.setState({ visibleRestaurants: mapData });
    };
  }

  render() {
    return (
      <div className="App-body">
        <Header />
        <div className="App-main">
          <section id="mapArea">
            {/* <Map id="googleMap" sendRestaurantData={this.getRestaurantData} /> */}
            <TestMap
              id="googleMap"
              sendRestaurantData={this.getRestaurantData}
            />
          </section>
          <section id="restaurantListArea">
            <RestaurantSidebar
              getVisibleRestaurants={this.state.visibleRestaurants}
            />
          </section>

          {/* <Clock /> */}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
