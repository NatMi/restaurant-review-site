import React, { Component } from "react";
import "./Styles/App.css";
import Header from "./Components/Header.js";
import Footer from "./Components/Footer.js";
import Map from "./Components/Map.js";
import RestaurantItem from "./Components/RestaurantItem.js";
// import Clock from "../Components/Clock.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleRestaurants: [],
      restaurantMarkerList: []
    };
    this.mapCallback = mapData => {
      this.setState({ visibleRestaurants: mapData });
    };
  }

  // mapCallback = datafromMapComponent => {
  //   this.setState = {
  //     visibleRestaurants: datafromMapComponent
  //   };
  //   console.log(this.state.visibleRestaurants.length);
  // };

  render() {
    return (
      <div className="App-body">
        <Header />
        <div className="App-main">
          <section id="mapArea">
            <Map id="googleMap" sendRestaurantData={this.mapCallback} />
          </section>
          <section id="restaurantListArea">
            <RestaurantItem
              visibleRestaurants={this.state.visibleRestaurants}
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
