import React, { Component } from "react";
import restaurantList from "../Data/restaurantList.json";

class Map extends Component {
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
    this.sendReviews = () => {
      this.props.sendReviewsForActiveItem(this.state.loadReviewsForActiveItem);
    };
    this.drawGoogleMap = () => {
      this.map = new window.google.maps.Map(
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
        return new window.google.maps.places.PlacesService(this.map);
      };
    };
  }

  geolocationApi() {
    // if geolocation object exist and user's position details are provided, update state
    let onPositionReceived = position => {
      this.setState(
        {
          usersPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        },
        //centre google map object on user's position:
        () => {
          this.map.setCenter(this.state.usersPosition);
        }
      );
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
      bounds: this.map.getBounds(),
      type: ["restaurant"]
    };

    let handleSearchresults = (results, status) => {
      this.setState({
        getVisibleRestaurants: []
      });
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(place => {
          this.setState(prevState => ({
            getVisibleRestaurants: [...prevState.getVisibleRestaurants, place]
          }));
        });
      }

      // Check if any restaurant from json file is contained within current google map bounds. If yes, add to visible restaurants list.
      this.state.locallyStoredRestaurants.forEach(place => {
        if (this.map.getBounds().contains(place.geometry.location))
          this.setState(prevState => ({
            getVisibleRestaurants: [...prevState.getVisibleRestaurants, place]
          }));
      });

      this.props.sendRestaurantData(this.state.getVisibleRestaurants);

      this.renderMarkers();
    };
    // Call nearbySearch from google Places Service
    this.service().nearbySearch(searchBounds, handleSearchresults);
  };

  componentDidUpdate(prevProps, prevState) {
    // 1. When user's position changed (i.e. geolocation API provided position details), search for restaurants based on new map bounds
    if (prevState.usersPosition !== this.state.usersPosition) {
      this.nearbySearch();
    }
    // 2. check if new activeRestaurant and old activeMarker exist, if there's no new restaurant change old activeMarker's icon to green and replace it with false value
    if (prevProps.activeRestaurant !== this.props.activeRestaurant) {
      if (
        this.props.activeRestaurant === false &&
        this.state.activeMarker !== false
      ) {
        this.setState({ activeMarker: false });
        this.nearbySearch();
        // this.renderMarkers();
        //-- works when clicked from marker, not from a sidebar
        // below is not needed when nearbySearch is performed, though it's not the best option(more requests to google api)
        // this.state.activeMarker.setIcon(
        //   "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        // );
      }

      // set new active restaurant and set active marker for it
      this.setState({ activeRestaurant: this.props.activeRestaurant });
      this.state.restaurantMarkerList.forEach(marker => {
        if (marker.place_id === this.props.activeRestaurant.place_id) {
          this.setState({
            activeMarker: marker
          });
        }
      });
      // Get details for new active restaurant
      if (this.props.activeRestaurant !== false) {
        this.detailsRequest();
      }
    }
    if (
      prevState.activeMarker !== this.state.activeMarker &&
      this.state.activeMarker !== false
    ) {
      this.state.activeMarker.setIcon(
        "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
      );
    }
    if (
      prevProps.restaurantsAddedByUser !== this.props.restaurantsAddedByUser &&
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
      prevProps.isNewRestaurantFormActive !==
      this.props.isNewRestaurantFormActive
    ) {
      this.setState(
        {
          showNewRestaurantForm: this.props.isNewRestaurantFormActive
        },
        () => {
          if (this.state.showNewRestaurantForm === false) {
            this.nearbySearch();
          }
        }
      );
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
    this.map.addListener("idle", () => {
      this.setState({ activeRestaurant: false });
      this.nearbySearch();
    });

    // -------> MAP EVENT: New restaurant form on right click <---------
    this.map.addListener("rightclick", event => {
      if (this.state.showNewRestaurantForm === false) {
        let newRestaurant = new window.google.maps.Marker({
          position: event.latLng,
          map: this.map,
          title: "New restaurant",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });

        this.setState(
          prevState => ({
            showNewRestaurantForm: true,
            activeMarker: newRestaurant,
            restaurantMarkerList: [
              ...prevState.restaurantMarkerList,
              newRestaurant
            ]
          }),
          () => {
            this.props.showNewRestaurantForm(this.state.showNewRestaurantForm);
            this.props.newRestaurantMarker(newRestaurant);
          }
        );
      }
    });
  };

  setMapOnMarkers = mapName => {
    this.state.restaurantMarkerList.forEach(marker => {
      marker.setMap(mapName);
    });
  };

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
      map: this.map,
      title: "Your current location"
    });
    //add restaurant markers
    let markerColor = restaurant => {
      if (restaurant.place_id === this.props.activeRestaurant.place_id) {
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      } else {
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      }
    };

    this.state.getVisibleRestaurants.forEach(restaurant => {
      let restaurantMarker = new window.google.maps.Marker({
        place_id: restaurant.place_id,
        position: restaurant.geometry.location,
        map: this.map,
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
          // 1. If there is any active restaurant in state, and it's not the same as the one clicked, change its icon back to blue
          if (
            this.state.activeMarker !== false &&
            this.state.activeRestaurant.place_id !== marker.place_id
          ) {
            this.state.activeMarker.setIcon(
              "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            );
          }
          // 2. If the marker which was clicked is not set as active yet, update state and change its icon to green
          if (marker.place_id !== this.state.activeRestaurant.place_id) {
            this.setState({
              activeMarker: marker
            });
            marker.setIcon(
              "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            );
            // 3. pass place_id of the clicked marker to App
            this.requestForActiveStatusFromMarker(marker.place_id);
          }
        });
      });
    });
  }

  render() {
    return <div className="googleMap" id={this.props.id} />;
  }
}
export default Map;
