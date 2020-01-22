import React, { Component } from "react";
import "./Styles/App.css";
import Header from "./Components/Header.js";
import Footer from "./Components/Footer.js";
// import Map from "./Components/Map.js";
import TestMap from "./Components/TestMap.js";
import RestaurantSidebar from "./Components/RestaurantSidebar.js";
import googleMapsKey from "./Data/googleMapsKey.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      googleMapsLoaded: false,
      visibleRestaurants: [],
      restaurantMarkerList: []
    };
    this.getRestaurantData = mapData => {
      this.setState({ visibleRestaurants: mapData });
    };
  }

  googleMapsScriptLoaded = () => {
    this.setState({ googleMapsLoaded: true });
  };

  componentDidMount = () => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        googleMapsKey.apiKey +
        "&libraries=places";
      script.id = "googleMaps";
      document.body.appendChild(script);
      script.addEventListener("load", e => {
        this.googleMapsScriptLoaded();
      });
    } else {
      this.googleMapsScriptLoaded();
    }
  };

  render() {
    if (!this.state.googleMapsLoaded) {
      return <p>Loading...</p>;
    } else {
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
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export default App;
