import React, { Component } from "react";
import "../Styles/ItemReview.css";

class Marker extends Component {
  render() {
    return new window.google.maps.Marker({
      position: this.props.restaurant.geometry.location,
      map: this.props.map,
      title: this.props.restaurant.name,
      icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    });
  }
}

export default Marker;
