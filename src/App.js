import React, { Component } from "react";
import "./Styles/App.css";
import Header from "./Components/Header.js";
import Footer from "./Components/Footer.js";
// import Map from "./Components/Map.js";
import TestMap from "./Components/TestMap.js";
import RestaurantSidebar from "./Components/RestaurantSidebar.js";
import AddRestaurantForm from "./Components/AddRestaurantForm.js";
import googleMapsKey from "./Data/googleMapsKey.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      googleMapsLoaded: false,
      visibleRestaurants: [],
      restaurantsAddedByUser: [],
      restaurantMarkerList: [],
      activeRestaurant: [],
      activeRestaurantReviews: [],
      isNewRestaurantFormActive: false,
      newRestaurantMarker: null
    };
    this.getRestaurantData = mapData => {
      this.setState({ visibleRestaurants: mapData });
    };
    this.openNewRestaurantForm = data => {
      this.setState({ isNewRestaurantFormActive: data });
    };
    this.handleNewRestaurantData = formData => {
      this.setState({
        restaurantsAddedByUser: formData
      });
    };
    this.passNewRestaurantMarkerData = mapData => {
      this.setState({ newRestaurantMarker: mapData }, () => {});
    };
    this.getReviewsForActiveItem = reviewsData => {
      this.setState({ activeRestaurantReviews: reviewsData });
    };
    this.receiveActiveStatusRequest = restaurant => {
      this.setState({ activeRestaurant: restaurant });
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
              <TestMap
                id="googleMap"
                restaurantsAddedByUser={this.state.restaurantsAddedByUser}
                sendRestaurantData={this.getRestaurantData}
                sendReviewsForActiveItem={this.getReviewsForActiveItem}
                requestForActiveStatusToApp={this.receiveActiveStatusRequest}
                showNewRestaurantForm={this.openNewRestaurantForm}
                newRestaurantMarker={this.passNewRestaurantMarkerData}
                activeRestaurant={this.state.activeRestaurant}
              />
              <div>Right-click on the map to add a new restaurant</div>
              <AddRestaurantForm
                isActive={this.state.isNewRestaurantFormActive}
                getMarkerData={this.state.newRestaurantMarker}
                requestSetIsActive={this.openNewRestaurantForm}
                newRestaurantData={this.handleNewRestaurantData}
              />
            </section>
            <section id="restaurantListArea">
              <RestaurantSidebar
                getVisibleRestaurants={this.state.visibleRestaurants}
                requestForActiveStatusToApp={this.receiveActiveStatusRequest}
                receiveActiveStatusFromApp={this.state.activeRestaurant}
                loadReviewsFromApp={this.state.activeRestaurantReviews.reviews}
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
