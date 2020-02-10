import React, { Component } from "react";
import restaurantList from "../Data/restaurantList.json";
let activeRestaurantIcon =
  "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
let defaultRestaurantIcon =
  "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersPosition: { lat: 51.509865, lng: -0.118092 }, // London coordinates by default, updated once user shares their location
      mapCenter: [],
      mapBounds: [],
      activeRestaurant: {},
      activeMarker: false,
      getNearbySearchResults: [],
      locallyStoredRestaurants: [],
      restaurantMarkerList: [],
      loadReviewsForActiveItem: []
    };
    this.sendReviews = () => {
      this.props.sendReviewsForActiveItem(this.state.loadReviewsForActiveItem);
    };
    this.requestForActiveStatusFromMarker = requestedPlaceId => {
      this.props.restaurantsToShow.forEach(restaurant => {
        if (restaurant.place_id === requestedPlaceId) {
          this.setState({
            activeRestaurant: restaurant
          });
          this.props.requestForActiveStatusToApp(this.state.activeRestaurant);
        }
      });
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
        },
        () => {
          this.props.mapObject(this.state.map);
        }
      );

      this.service = () => {
        return new window.google.maps.places.PlacesService(this.state.map);
      };
    };
  }
  componentDidMount = () => {
    this.geolocationApi();
    this.drawGoogleMap();

    //Load restaurants from json
    restaurantList.forEach(place => {
      this.setState(prevState => ({
        locallyStoredRestaurants: [...prevState.locallyStoredRestaurants, place]
      }));
    });

    //MAP EVENT: "idle"
    this.state.map.addListener("idle", () => {
      this.nearbySearch();
    });

    // MAP EVENT: "right click" show new restaurant form
    this.state.map.addListener("rightclick", event => {
      if (this.props.isNewRestaurantFormActive === false) {
        let newRestaurant = new window.google.maps.Marker({
          position: event.latLng,
          map: this.state.map,
          title: "New restaurant",
          icon: defaultRestaurantIcon
        });

        this.setState(
          prevState => ({
            activeMarker: newRestaurant,
            restaurantMarkerList: [
              ...prevState.restaurantMarkerList,
              newRestaurant
            ]
          }),
          () => {
            this.props.showNewRestaurantForm(true);
            this.props.newRestaurantMarker(newRestaurant);
          }
        );
      }
    });
  };

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
          this.state.map.setCenter(this.state.usersPosition, () => {
            this.nearbySearch();
          });
        }
      );
    };

    // TEST FOR GEOLOCATION
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onPositionReceived);
    } else {
      window.alert("Geolocation not available.");
    }
  }

  nearbySearch = () => {
    // Set search bounds and callback to deal with nearbySearch results.
    let searchBounds = {
      bounds: this.state.map.getBounds(),
      type: ["restaurant"]
    };

    let handleSearchresults = (results, status) => {
      let handleAllRestaurants = [];
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        handleAllRestaurants = results;
      }
      // Check if any locally stored restaurant is contained within current google map bounds. If yes, add to visible restaurants list.
      this.state.locallyStoredRestaurants.forEach(place => {
        if (this.state.map.getBounds().contains(place.geometry.location))
          handleAllRestaurants.push(place);
      });
      this.setState({
        getNearbySearchResults: handleAllRestaurants
      });

      this.props.sendRestaurantData(this.state.getNearbySearchResults);
    };
    // Call nearbySearch from google Places Service
    this.service().nearbySearch(searchBounds, handleSearchresults);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.restaurantsToShow !== this.props.restaurantsToShow) {
      this.renderMarkers();
    }
    // 2. check if new activeRestaurant and old activeMarker exist, if there's no new restaurant change old activeMarker's icon to not active and replace it with false value
    // this applies when user clicks "back to results"
    if (prevProps.activeRestaurant !== this.props.activeRestaurant) {
      if (
        this.props.activeRestaurant === false &&
        this.state.activeMarker !== false
      ) {
        this.state.activeMarker.setIcon(defaultRestaurantIcon, () => {
          this.setState({ activeMarker: false });
        });
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
    //3. If active marker changed (on sidebar request), and it is not false, update marker pin to active
    if (
      prevState.activeMarker !== this.state.activeMarker &&
      this.state.activeMarker !== false
    ) {
      this.state.activeMarker.setIcon(activeRestaurantIcon);
    }
    //4. If user added a new restaurant, add it to the locally stored restaurants array
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
    // 5.
    if (
      prevProps.isNewRestaurantFormActive !==
        this.props.isNewRestaurantFormActive &&
      this.props.isNewRestaurantFormActive === false
    ) {
      this.nearbySearch();
    }
  }

  detailsRequest() {
    /// Getting Places reviews for the active restaurant
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
        // if place_id was not recognised, check json:
        let filterLocallyStoredRestaurants = () => {
          let results = this.state.locallyStoredRestaurants.filter(
            restaurant =>
              restaurant.place_id === this.props.activeRestaurant.place_id
          );
          return results[0];
        };

        this.setState(
          {
            loadReviewsForActiveItem: filterLocallyStoredRestaurants()
          },
          () => {
            this.sendReviews();
          }
        );
      }
    };

    this.service().getDetails(requestPlaceDetails, handleDetailsResults);
  }

  renderMarkers() {
    this.state.restaurantMarkerList.forEach(marker => {
      marker.setMap(null);
    });
    this.setState({
      restaurantMarkerList: []
    });

    //user's location marker
    new window.google.maps.Marker({
      position: this.state.usersPosition,
      map: this.state.map,
      title: "Your current location"
    });
    //add restaurant markers
    let markerColor = restaurant => {
      if (restaurant.place_id === this.props.activeRestaurant.place_id) {
        return activeRestaurantIcon;
      } else {
        return defaultRestaurantIcon;
      }
    };

    this.props.restaurantsToShow.forEach(restaurant => {
      let restaurantMarker = new window.google.maps.Marker({
        place_id: restaurant.place_id,
        position: restaurant.geometry.location,
        map: this.state.map,
        title: restaurant.name,
        icon: markerColor(restaurant)
      });
      // update state with marker of new restaurant
      this.setState(
        prevState => ({
          restaurantMarkerList: [
            ...prevState.restaurantMarkerList,
            restaurantMarker
          ]
        }),
        () => {
          // --------> CLICK EVENT: restaurant marker <--------
          this.state.restaurantMarkerList.forEach(marker => {
            marker.addListener("click", () => {
              // 1. If there is any active restaurant in state, and it's not the same as the one clicked, change its icon back to default
              if (
                this.state.activeMarker !== false &&
                this.state.activeRestaurant.place_id !== marker.place_id
              ) {
                this.state.activeMarker.setIcon(defaultRestaurantIcon);
              }
              // 2. If the marker which was clicked is not set as active yet, update state and change its icon to active
              if (marker.place_id !== this.state.activeRestaurant.place_id) {
                this.setState({
                  activeMarker: marker
                });
                marker.setIcon(activeRestaurantIcon);
                // 3. pass place_id of the clicked marker to App
                this.requestForActiveStatusFromMarker(marker.place_id);
              }
            });
          });
        }
      );
    });
  }

  render() {
    return <div className="googleMap" id={this.props.id} />;
  }
}
export default Map;
