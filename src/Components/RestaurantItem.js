import React, { Component } from "react";
import "../Styles/restaurantSidebar.css";
import googleMapsKey from "../Data/googleMapsKey.json";

class RestaurantItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemReviews: []
    };
    this.requestReviewsForItem = () => {
      this.setState(
        {
          isActive: true
        },
        () => {
          this.props.requestForActiveStatusToSidebar(this.props.restaurant);
        }
      );
    };
  }
  setLng(restaurant) {
    if (typeof restaurant.geometry.location.lng === "function") {
      return restaurant.geometry.location.lng();
    } else {
      return restaurant.geometry.location.lng;
    }
  }
  setLat(restaurant) {
    if (typeof restaurant.geometry.location.lat === "function") {
      return restaurant.geometry.location.lat();
    } else {
      return restaurant.geometry.location.lat;
    }
  }
  checkRating(restaurant) {
    if (restaurant.rating <= 0 || restaurant.rating === undefined) {
      return "No reviews found yet.";
    } else {
      return `${restaurant.rating} / 5`;
    }
  }

  streetViewUrl = () => {
    return (
      "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" +
      this.setLat(this.props.restaurant) +
      "," +
      this.setLng(this.props.restaurant) +
      "&fov=80&heading=70&pitch=0&key=" +
      googleMapsKey.apiKey
    );
  };

  render() {
    return (
      /*restaurant card: */
      <div className="restaurantCard">
        <div className="restaurantCardInfo">
          <h4 className="restaurantName">{this.props.restaurant.name}</h4>
          <p className="restaurantRating">
            {this.checkRating(this.props.restaurant)}
          </p>
          <p className="restaurantAddress">{this.props.restaurant.vicinity}</p>
          <div className="restaurantBtnContainer">
            <button
              style={{
                opacity: this.props.isActive === false ? 1 : 0.3,
                pointerEvents: this.props.isActive === false ? "auto" : "none"
              }}
              className="btnRestaurantReviews"
              onClick={this.requestReviewsForItem}
            >
              Read reviews
            </button>
            <button className="btnAddRestaurantReviews">Add review</button>
          </div>
        </div>

        <div className="restaurantCardStreetView">
          <img
            alt={this.props.restaurant.name}
            className="streetViewImg"
            src={this.streetViewUrl()}
          ></img>
        </div>
      </div>
    );
  }
}

export default RestaurantItem;
