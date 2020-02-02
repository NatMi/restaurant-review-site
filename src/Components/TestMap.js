import React, { Component } from "react";
import Marker from "./Marker.js";
import restaurantList from "../Data/restaurantList.json";
import AddRestaurantForm from "./AddRestaurantForm.js";

class TestMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersPosition: { lat: 51.509865, lng: -0.118092 }, // London coordinates by default, updated once user shares their location
      mapCenter: [],
      mapBounds: [],
      activeRestaurant: {
        name: "Map: no active restaurant"
      },
      activeMarker: false,
      getVisibleRestaurants: [],
      locallyStoredRestaurants: [],
      restaurantMarkerList: [],
      loadReviewsForActiveItem: [],
      showNewRestaurantForm: false
    };
    this.sendData = () => {
      this.props.sendRestaurantData(this.state.getVisibleRestaurants);
    };
    this.sendReviews = () => {
      this.props.sendReviewsForActiveItem(this.state.loadReviewsForActiveItem);
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

    this.requestForActiveStatusFromMarker = this.requestForActiveStatusFromMarker.bind(
      this
    );
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
  nearbySearch = () => {
    this.setMapOnMarkers(null);

    this.setState({ getVisibleRestaurants: [], restaurantMarkerList: [] });
    // GOOGLE PLACES API
    let searchBounds = {
      bounds: this.state.map.getBounds(),
      type: ["restaurant"]
    };

    let handleSearchresults = (results, status) => {
      this.setState({
        getVisibleRestaurants: []
      });
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(place => {
          //update state with each restaurant found
          this.setState(prevState => ({
            getVisibleRestaurants: [...prevState.getVisibleRestaurants, place]
          }));
        });
      }

      // check if any restaurant from json file is contained within current google map bounds, if yes, add to state and create marker
      this.state.locallyStoredRestaurants.forEach(place => {
        if (this.state.map.getBounds().contains(place.geometry.location))
          this.setState(prevState => ({
            getVisibleRestaurants: [...prevState.getVisibleRestaurants, place]
          }));
      });
      this.sendData();

      this.renderMarkers();
    };

    this.service().nearbySearch(searchBounds, handleSearchresults);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.activeRestaurant !== this.props.activeRestaurant) {
      console.log("Map active restaurant: " + this.props.activeRestaurant.name);
      // check if new activeRestaurant and old activeMarker exist, if there's no new restaurant change old activeMarker's icon to green
      if (
        this.props.activeRestaurant === false &&
        this.state.activeMarker !== false
      ) {
        this.state.activeMarker.setIcon(
          "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        );
        this.setState({ activeMarker: false });
      }

      // set new state
      this.setState({ activeRestaurant: this.props.activeRestaurant });
      this.state.restaurantMarkerList.forEach(marker => {
        if (marker.place_id === this.props.activeRestaurant.place_id) {
          this.setState({
            activeMarker: marker
          });
        }
      });
      // get details for new active restaurant
      if (this.props.activeRestaurant !== false) {
        this.detailsRequest();
      }
    }

    if (
      prevState.activeMarker != this.state.activeMarker &&
      this.state.activeMarker !== false
    ) {
      this.state.activeMarker.setIcon(
        "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      );
    }
    if (
      prevProps.restaurantsAddedByUser != this.props.restaurantsAddedByUser &&
      this.props.restaurantsAddedByUser !== false
    ) {
      this.setState(
        prevState => ({
          locallyStoredRestaurants: [
            ...prevState.locallyStoredRestaurants,
            this.props.restaurantsAddedByUser
          ]
        }),
        () => {
          this.nearbySearch();
        }
      );
    }
    if (
      prevProps.isNewRestaurantFormActive !=
      this.props.isNewRestaurantFormActive
    ) {
      this.setState({
        showNewRestaurantForm: this.props.isNewRestaurantFormActive
      });
      if (this.state.showNewRestaurantForm === false) {
        this.props.newRestaurantMarker[0].setMap(null);
      }
    }
  }

  componentDidMount = () => {
    this.geolocationApi(() => {
      this.nearbySearch();
    });
    this.drawGoogleMap();
    // load restaurants from json
    restaurantList.forEach(place => {
      this.setState(prevState => ({
        locallyStoredRestaurants: [...prevState.locallyStoredRestaurants, place]
      }));
    });

    //MAP EVENT: "idle"
    this.state.map.addListener("idle", () => {
      this.nearbySearch();
    });

    // -------> MAP EVENT: New restaurant form on right click <---------
    this.state.map.addListener("rightclick", event => {
      if (this.state.showNewRestaurantForm === false) {
        let newMapClick = new window.google.maps.Point(event.latLng);

        let newRestaurant = new window.google.maps.Marker({
          position: event.latLng,
          map: this.state.map,
          title: "New restaurant",
          draggable: true,
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        });
        this.setState(
          {
            showNewRestaurantForm: true
          },
          () => {
            this.props.showNewRestaurantForm(this.state.showNewRestaurantForm);
            this.props.newRestaurantMarker(newRestaurant);
          }
        );
      }
    });
  };

  setMapOnMarkers(mapName) {
    for (let i = 0; i < this.state.restaurantMarkerList.length; i++) {
      this.state.restaurantMarkerList[i].setMap(mapName);
    }
  }

  detailsRequest() {
    let handleJsonList = () => {
      // if place_id was not recognised, check json:
      let filterLocallyStoredRestaurants = () => {
        let results = this.state.locallyStoredRestaurants.filter(
          restaurant =>
            restaurant.place_id === this.props.activeRestaurant.place_id
        );
        return results[0];
        //reurns array with objects
      };

      this.setState(
        {
          loadReviewsForActiveItem: filterLocallyStoredRestaurants()
        },
        () => {
          this.sendReviews();
        }
      );
    };

    /// Getting Places reviews for active restaurant
    let requestPlaceDetails = {
      placeId: this.props.activeRestaurant.place_id
    };

    let handleDetailsResults = (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        this.setState(
          {
            loadReviewsForActiveItem: results
          },
          () => {
            this.sendReviews();
          }
        );
      } else {
        handleJsonList();
      }
    };

    this.service().getDetails(requestPlaceDetails, handleDetailsResults);
  }

  requestForActiveStatusFromMarker(requestedPlaceId) {
    this.state.getVisibleRestaurants.forEach(restaurant => {
      if (restaurant.place_id === requestedPlaceId) {
        this.setState({
          activeRestaurant: restaurant
        });
        this.props.requestForActiveStatusToApp(this.state.activeRestaurant);
      }
    });
  }

  renderMarkers() {
    //user's location marker
    new window.google.maps.Marker({
      position: this.state.usersPosition,
      map: this.state.map,
      title: "Your current location"
    });
    //add restaurant markers
    let markerColor = restaurant => {
      if (restaurant.place_id === this.props.activeRestaurant.place_id) {
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      } else {
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      }
    };

    this.state.getVisibleRestaurants.forEach(restaurant => {
      let restaurantMarker = new window.google.maps.Marker({
        place_id: restaurant.place_id,
        position: restaurant.geometry.location,
        map: this.state.map,
        title: restaurant.name,
        icon: markerColor(restaurant)
      });
      // update state with marker of new restaurant
      this.setState(prevState => ({
        restaurantMarkerList: [
          ...prevState.restaurantMarkerList,
          restaurantMarker
        ]
      }));

      // --------> CLICK EVENT: restaurant marker <--------
      this.state.restaurantMarkerList.forEach(marker => {
        marker.addListener("click", () => {
          // 1. If there is any active restaurant in state, and it's not the same as the one clicked, change its icon back to green
          if (
            this.state.activeMarker !== false &&
            this.state.activeRestaurant.place_id !== marker.place_id
          ) {
            this.state.activeMarker.setIcon(
              "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            );
          }
          // 2. If the marker which was clicked is not set as active yet, update state and change its icon to blue
          if (marker.place_id !== this.state.activeRestaurant.place_id) {
            this.setState({
              activeMarker: marker
            });
            marker.setIcon(
              "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            );
            // 3. pass place_id of the clicked marker to App
            this.requestForActiveStatusFromMarker(marker.place_id);
          }
        });
      });
    });
  }

  render() {
    return <div style={{ width: "100%", height: "100%" }} id={this.props.id} />;
  }
}
export default TestMap;
