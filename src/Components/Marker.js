import React, { Component } from "react";
import "../Styles/ItemReview.css";

class Marker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false
    };
  }
  markerColor() {
    if (this.state.isActive === true) {
      return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    } else if (this.props.type === "restaurant") {
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    }
  }

  renderMarker() {
    console.log("render marker function fired!");
    let newmarker = new window.google.maps.Marker({
      position: this.props.position,
      map: this.props.map,
      title: this.props.name,
      isActive: this.props.isActive,
      icon: this.markerColor
    });
    return newmarker;
  }

  render() {
    return this.renderMarker;
  }
}

export default Marker;
