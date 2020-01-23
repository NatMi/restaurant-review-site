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
    };

    //sets sendRestaurantData property to contain restaurant data from current state
    this.sendData = () => {
      this.props.sendRestaurantData(this.state.getVisibleRestaurants);
    };
  }

  componentDidMount = () => {
    this.drawGoogleMap();

    let service = new window.google.maps.places.PlacesService(this.state.map);
    // updating  map state property with user's position once geolocation query is succesfully resolved

    let getNearbyRestaurants = (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(place => {
          //update state with visible restaurants
          this.setState(prevState => ({
            getVisibleRestaurants: [...prevState.getVisibleRestaurants, place]
          }));
          this.renderMarkers();
        });
      }
      // send updated restaurant data to App component
      this.sendData();
    };

    let onPositionReceived = position => {
      this.setState({
        usersPosition: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      });

      //centre map component on user's position and update map bounds:
      this.state.map.setCenter(this.state.usersPosition);
      this.setState({
        mapBounds: this.state.map.getBounds
      });

      // GOOGLE PLACES API
      let searchBounds = {
        bounds: this.state.mapBounds,
        type: ["restaurant"]
      };

      service.nearbySearch(searchBounds, getNearbyRestaurants);
      this.renderMarkers();

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

      // getting coordinates on click. TODO: show info window
      this.state.map.addListener("click", function(event) {
        let newMapClick = new window.google.maps.Point(
          event.latLng.lat(),
          event.latLng.lng()
        );

        console.log("clicked! " + newMapClick);
      });
    };

    // TEST FOR GEOLOCATION
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onPositionReceived);
    } else {
      console.log("geolocation unavailable");
    }

    //MAP EVENT: "idle"
    this.state.map.addListener("idle", () => {
      this.setMapOnMarkers(null);
      this.setState({ getVisibleRestaurants: [], restaurantMarkerList: [] });

      let searchBounds = {
        bounds: this.state.map.getBounds(),
        type: ["restaurant"]
      };
      service.nearbySearch(searchBounds, getNearbyRestaurants);

      // create markers from json file list of restaurants
      restaurantList.forEach(place => {
        let check = this.state.map
          .getBounds()
          .contains(place.geometry.location);
        if (check)
          this.setState(prevState => ({
            getVisibleRestaurants: [...prevState.getVisibleRestaurants, place]
          }));
        this.renderMarkers();
      });
    });
  };

  setMapOnMarkers(mapName) {
    for (let i = 0; i < this.state.restaurantMarkerList.length; i++) {
      this.state.restaurantMarkerList[i].setMap(mapName);
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
