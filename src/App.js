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
      restaurantMarkerList: [],
      activeRestaurant: [],
      activeRestaurantReviews: []
    };
    this.getRestaurantData = mapData => {
      this.setState({ visibleRestaurants: mapData });
    };
    this.getReviewsForActiveItem = reviewsData => {
      this.setState({ activeRestaurantReviews: reviewsData });
      console.log(
        "App reviews loaded: " + this.state.activeRestaurantReviews.name
      );
    };
    this.receiveActiveStatusRequest = restaurant => {
      this.setState({ activeRestaurant: restaurant });
    };
  }

  googleMapsScriptLoaded = () => {
    this.setState({ googleMapsLoaded: true });
  };

  componentDidUpdate(prevProps, prevState) {
    //update check on
    if (prevState.activeRestaurant !== this.state.activeRestaurant) {
      console.log("app active restaurant: " + this.state.activeRestaurant.name);
    }
  }

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
                sendReviewsForActiveItem={this.getReviewsForActiveItem}
                requestForActiveStatusToApp={this.receiveActiveStatusRequest}
                activeRestaurant={this.state.activeRestaurant}
              />
            </section>
            <section id="restaurantListArea">
              <RestaurantSidebar
                getVisibleRestaurants={this.state.visibleRestaurants}
                requestForActiveStatusToApp={this.receiveActiveStatusRequest}
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
