import React, { Component } from "react";
import "../Styles/restaurantSidebar.css";
import googleMapsKey from "../Data/googleMapsKey.json";

class RestaurantItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReviewFormActive: false
    };
    this.requestReviewsForItem = () => {
      this.props.requestForActiveStatusToSidebar(this.props.restaurant);
    };
    this.requestNewReviewForm = () => {
      this.setState({ isReviewFormActive: true }, () => {
        this.props.requestForActiveStatusToSidebar(this.props.restaurant);
        this.props.requestForActiveReviewForm(this.state.isReviewFormActive);
      });
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
      return "No reviews added";
    } else {
      return `${restaurant.rating} ★`;
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
        <div className="restaurantCardStreetView">
          <p className="restaurantItemRating">
            {this.checkRating(this.props.restaurant)}
          </p>
          <img
            alt={this.props.restaurant.name}
            className="streetViewImg"
            src={this.streetViewUrl()}
          ></img>
        </div>
        <div className="restaurantCardInfo">
          <h4 className="restaurantName">{this.props.restaurant.name}</h4>
          <p className="restaurantAddress">{this.props.restaurant.vicinity}</p>
          <div className="restaurantBtnContainer">
            <button
              className={
                this.props.isActive
                  ? "btnRestaurantReviews btnDisabled"
                  : "btnRestaurantReviews btnActive"
              }
              onClick={this.requestReviewsForItem}
            >
              Read reviews
            </button>
            <button
              className={
                this.state.isReviewFormActive
                  ? "btnAddRestaurantReviews btnDisabled"
                  : "btnAddRestaurantReviews btnActive"
              }
              onClick={this.requestNewReviewForm}
            >
              Add review
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default RestaurantItem;
