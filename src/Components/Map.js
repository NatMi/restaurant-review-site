import React, { Component } from "react";
// import { render } from "react-dom";
// import Marker from "./Marker.js";
import restaurantList from "../Data/restaurantList.json";
import googleMapsKey from "../Data/googleMapsKey.json";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersPosition: { lat: 51.509865, lng: -0.118092 }, // London coordinates by default, updated once user shares their location
      mapCenter: "",
      mapBounds: "",
      visibleRestaurants: [],
      restaurantMarkerList: []
    };
    this.sendData = () => {
      this.props.sendRestaurantData(this.state.visibleRestaurants);
    };
    this.onScriptLoad = this.onScriptLoad.bind(this);
  }

  onScriptLoad() {
    // DRAW MAP with id attribute specified in App component
    let newMap = new window.google.maps.Map(
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

    // function which updates  map state property for user's position once geolocation query is succesfully resolved
    let onPositionReceived = position => {
      this.setState({
        usersPosition: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      });

      //centre map on user's position:
      newMap.setCenter(this.state.usersPosition);
      // save new map bounds:
      this.setState({
        mapBounds: newMap.getBounds
      });

      //create marker with user's location details
      let usersLocationMarker = new window.google.maps.Marker({
        position: this.state.usersPosition,
        map: newMap,
        title: "Your current location"
      });

      // GOOGLE PLACES API
      let service = new window.google.maps.places.PlacesService(newMap);

      let searchBounds = {
        bounds: this.state.mapBounds,
        type: ["restaurant"]
      };

      let showNearbyRestaurants = (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            let place = results[i];
            //update state with visible restaurants
            this.setState(prevState => ({
              visibleRestaurants: [...prevState.visibleRestaurants, place]
            }));
            this.sendData();
            //add restaurant marker
            let restaurantMarker = new window.google.maps.Marker({
              position: place.geometry.location,
              map: newMap,
              title: place.name,
              icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            });
            // update state with marker of new restaurant
            this.setState(prevState => ({
              restaurantMarkerList: [
                ...prevState.restaurantMarkerList,
                restaurantMarker
              ]
            }));
          }
          console.log(
            `number of restaurants found: ` +
              this.state.restaurantMarkerList.length
          );
        }
        if (
          status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
        ) {
          console.log("no restaurants found in this area");
        }
      };

      service.nearbySearch(searchBounds, showNearbyRestaurants);

      let setMapOnMarkers = map => {
        for (var i = 0; i < this.state.restaurantMarkerList.length; i++) {
          this.state.restaurantMarkerList[i].setMap(map);
        }
      };
      //MAP EVENT: "idle"

      newMap.addListener("idle", () => {
        setMapOnMarkers(null);
        this.setState({ visibleRestaurants: [], restaurantMarkerList: [] });

        searchBounds = {
          bounds: newMap.getBounds(),
          type: ["restaurant"]
        };

        service.nearbySearch(searchBounds, showNearbyRestaurants);
      });

      // getting coordinates on click. TODO: show info window
      newMap.addListener("click", function(event) {
        let newMapClick = new window.google.maps.Point(
          event.latLng.lat(),
          event.latLng.lng()
        );
        // let infowindow = new window.google.maps.InfoWindow({
        //   content: "want to add new restaurant?"
        // });
        // infowindow.open(newMap, event.target);

        console.log("clicked! " + newMapClick);
      });

      // create markers from json file list of restaurants

      restaurantList.map(item => {
        return new window.google.maps.Marker({
          position: item.position,
          map: newMap,
          title: item.restaurantName,
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        });
      });
    };

    // TEST FOR GEOLOCATION
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onPositionReceived);
    } else {
      console.log("geolocation unavailable");
    }
  }

  componentDidMount() {
    if (!window.google) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        googleMapsKey.apiKey +
        "&libraries=places";
      var x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(script, x);
      // Once google.maps API finished loading, launch onScriptLoad() function to access it:
      script.addEventListener("load", e => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }
  }

  render() {
    return <div style={{ width: "100%", height: "100%" }} id={this.props.id} />;
  }
}
export default Map;
