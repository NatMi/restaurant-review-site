import React, { Component } from "react";
import Marker from "./Marker.js";
import restaurantList from "../Data/restaurantList.json";

class TestMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersPosition: { lat: 51.509865, lng: -0.118092 }, // London coordinates by default, updated once user shares their location
      mapCenter: [],
      mapBounds: [],
      getVisibleRestaurants: [],
      restaurantMarkerList: []
    };
    this.sendData = () => {
      this.props.sendRestaurantData(this.state.getVisibleRestaurants);
    };
    this.drawGoogleMap = () => {
      this.state.map = new window.google.maps.Map(
        document.getElementById(this.props.id),
        {
          center: this.state.usersPosition,
          zoom: 17,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        }
      );
      this.service = () => {
        return new window.google.maps.places.PlacesService(this.state.map);
      };
    };
  }

  geolocationApi() {
    // use position details from callback
    let onPositionReceived = position => {
      this.setState({
        usersPosition: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      });
      //centre map component on user's position and update map bounds:
      this.state.map.setCenter(this.state.usersPosition);
    };

    // TEST FOR GEOLOCATION
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onPositionReceived);
    } else {
      return <p>Geolocation unavailable.</p>;
    }
  }

  nearbySearchRequest() {}

  componentDidMount = () => {
    this.geolocationApi();
    this.drawGoogleMap();

    // GOOGLE PLACES API
    let searchBounds = {
      bounds: this.state.mapBounds,
      type: ["restaurant"]
    };

    let handleSearchresults = (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(place => {
          //update state with each restaurant found
          this.setState(prevState => ({
            getVisibleRestaurants: [...prevState.getVisibleRestaurants, place]
          }));
        });
      }

      // check if any restaurant from json file is contained within current google map bounds, if yes, add to state and create marker
      restaurantList.forEach(place => {
        if (this.state.map.getBounds().contains(place.geometry.location))
          this.setState(prevState => ({
            getVisibleRestaurants: [...prevState.getVisibleRestaurants, place]
          }));
      });
      this.sendData();
      this.renderMarkers();
    };

    this.service().nearbySearch(searchBounds, handleSearchresults);

    //MAP EVENT: "idle"
    this.state.map.addListener("idle", () => {
      this.setMapOnMarkers(null);
      this.setState({ getVisibleRestaurants: [], restaurantMarkerList: [] });

      let searchBounds = {
        bounds: this.state.map.getBounds(),
        type: ["restaurant"]
      };
      this.service().nearbySearch(searchBounds, handleSearchresults);
    });

    // getting coordinates on click. TODO: show info window
    this.state.map.addListener("click", function(event) {
      let newMapClick = new window.google.maps.Point(
        event.latLng.lat(),
        event.latLng.lng()
      );

      console.log("clicked! " + newMapClick);
    });

    //   /// TEST - getting reviews for each found restaurant
    //   let requestPlaceDetails = {
    //     placeId: place.place_id
    //   };

    //   service.getDetails(requestPlaceDetails, function(place, status) {
    //     if (status === window.google.maps.places.PlacesServiceStatus.OK) {
    //       console.log(place.reviews);
    //     }
    //   });
    //   /////////////////// test finish
  };

  setMapOnMarkers(mapName) {
    for (let i = 0; i < this.state.restaurantMarkerList.length; i++) {
      this.state.restaurantMarkerList[i].setMap(mapName);
    }
  }
  componentDidUpdate() {
    if (this.props.activeRestaurant) {
      console.log("Map active restaurant: " + this.props.activeRestaurant.name);
    } else {
      console.log("Map didn't receive the active restaurant info");
    }
  }

  renderMarkers() {
    //user's location marker
    new window.google.maps.Marker({
      position: this.state.usersPosition,
      map: this.state.map,
      title: "Your current location"
    });

    this.state.getVisibleRestaurants.forEach(restaurant => {
      //add restaurant marker
      let restaurantMarker = new window.google.maps.Marker({
        position: restaurant.geometry.location,
        map: this.state.map,
        title: restaurant.name,
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
      });
      // update state with marker of new restaurant
      this.setState(prevState => ({
        restaurantMarkerList: [
          ...prevState.restaurantMarkerList,
          restaurantMarker
        ]
      }));
    });
  }

  render() {
    return <div style={{ width: "100%", height: "100%" }} id={this.props.id} />;
  }
}
export default TestMap;
