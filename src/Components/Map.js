import React, { Component } from "react";
let activeRestaurantIcon =
  "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
let defaultRestaurantIcon =
  "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersPosition: { lat: 51.509865, lng: -0.118092 }, // London coordinates by default
      mapCenter: [],
      mapBounds: [],
      activeRestaurant: {},
      activeMarker: false,
      getNearbySearchResults: [],
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
    this.drawGoogleMap = callback => {
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
    this.drawGoogleMap(this.geolocationApi());
    //MAP EVENT: "idle"
    this.state.map.addListener("idle", () => {
      this.setState(
        {
          mapBounds: this.state.map.getBounds()
        },
        () => {
          this.nearbySearch();
        }
      );
    });

    // MAP EVENT: "right click" on map shows new restaurant form and creates temporary marker (which contains position data)
    this.state.map.addListener("rightclick", event => {
      if (this.props.isNewRestaurantFormActive === false) {
        let newRestaurant = new window.google.maps.Marker({
          position: event.latLng,
          map: this.state.map,
          title: "New restaurant",
          icon: defaultRestaurantIcon
        });

        if (this.state.activeMarker !== false) {
          this.state.activeMarker.setIcon(defaultRestaurantIcon);
          this.setState(
            {
              activeRestaurant: false,
              loadReviewsForActiveItem: false
            },
            () => {
              this.props.requestForActiveStatusToApp(
                this.state.activeRestaurant
              );
            }
          );
        }

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

  componentDidUpdate(prevProps, prevState) {
    // --> Filtered results change:
    if (prevProps.restaurantsToShow !== this.props.restaurantsToShow) {
      this.renderMarkers();
    }
    /* --> Sidebar active restaurant status change:
    Check if activeRestaurant and prev activeMarker are true. If new activeRestaurant is false, set prev activeMarker's icon to inactive and set it to false*/
    if (prevProps.activeRestaurant !== this.props.activeRestaurant) {
      if (
        this.props.activeRestaurant === false &&
        this.state.activeMarker !== false
      ) {
        this.state.activeMarker.setIcon(defaultRestaurantIcon);
        this.setState({
          activeMarker: false
        });
      }
      // Otherwise set new active restaurant and corresponding active marker for it if exists
      this.setState({ activeRestaurant: this.props.activeRestaurant }, () => {
        this.state.restaurantMarkerList.forEach(marker => {
          if (marker.place_id === this.props.activeRestaurant.place_id) {
            this.setState({
              activeMarker: marker
            });
          }
        });
      });

      // Get details for new active restaurant
      if (this.props.activeRestaurant !== false) {
        this.detailsRequest();
      }
    }
    // --> If active marker changed (on sidebar request), and it is not false, update marker pin to active
    if (
      prevState.activeMarker !== this.state.activeMarker &&
      this.state.activeMarker !== false
    ) {
      this.state.activeMarker.setIcon(activeRestaurantIcon);
    }
    // Re-render markers when new restaurant form closes
    if (
      prevProps.isNewRestaurantFormActive !==
        this.props.isNewRestaurantFormActive &&
      this.props.isNewRestaurantFormActive === false
    ) {
      this.nearbySearch();
    }
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
          this.state.map.setCenter(this.state.usersPosition);
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
      bounds: this.state.mapBounds,
      type: ["restaurant"]
    };

    let handleSearchresults = (results, status) => {
      let handleAllRestaurants = [];
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        handleAllRestaurants = results;
      }
      // Check if any locally stored restaurant is contained within current google map bounds. If yes, add to visible restaurants list.
      this.props.locallyStoredRestaurants.forEach(place => {
        if (this.state.map.getBounds().contains(place.geometry.location))
          handleAllRestaurants.push(place);
      });
      this.setState({
        getNearbySearchResults: handleAllRestaurants
      });

      this.props.sendNearbySearchData(this.state.getNearbySearchResults);
    };
    // Call nearbySearch from google Places Service
    this.service().nearbySearch(searchBounds, handleSearchresults);
  };

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
          let results = this.props.locallyStoredRestaurants.filter(
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

    this.props.restaurantsToShow.forEach(restaurant => {
      let restaurantMarker = new window.google.maps.Marker({
        place_id: restaurant.place_id,
        position: restaurant.geometry.location,
        map: this.state.map,
        title: restaurant.name,
        icon:
          restaurant.place_id === this.props.activeRestaurant.place_id
            ? activeRestaurantIcon
            : defaultRestaurantIcon
      });

      restaurantMarker.addListener("click", () => {
        // 1. If there is any active restaurant in state, and it's not the same as the one clicked, change its icon back to default
        if (
          this.state.activeMarker !== false &&
          this.state.activeRestaurant.place_id !== restaurantMarker.place_id
        ) {
          this.state.activeMarker.setIcon(defaultRestaurantIcon);
        }
        // 2. If the marker which was clicked is not set as active yet, update state and change its icon to active
        if (
          restaurantMarker.place_id !== this.state.activeRestaurant.place_id
        ) {
          this.setState({
            activeMarker: restaurantMarker
          });
          restaurantMarker.setIcon(activeRestaurantIcon);
          // 3. pass place_id of the clicked marker to App
          this.requestForActiveStatusFromMarker(restaurantMarker.place_id);
        }
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
    return <div className="googleMap" id={this.props.id} />;
  }
}
export default Map;
