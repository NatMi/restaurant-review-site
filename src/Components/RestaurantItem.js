import React, { Component } from "react";
import "../Styles/restaurantSidebar.css";
import ItemReviews from "./ItemReviews.js";
import googleMapsKey from "../Data/googleMapsKey.json";

class RestaurantItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      reviews: []
    };
    this.requestReviewsForItem = () => {
      this.props.requestForActiveStatusToSidebar(this.props.restaurant);
      this.setState({
        isActive: true
      });
      console.log(this.props.restaurant.name + " is active!");
    };
  }
  streetViewUrl = () => {
    return (
      "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" +
      this.props.restaurant.geometry.location.lat +
      "," +
      this.props.restaurant.geometry.location.lng +
      "&fov=80&heading=70&pitch=0&key=" +
      googleMapsKey.apiKey
    );
  };

  render() {
    return (
      /*restaurant card: */
      <div className="restaurantCard" onClick={this.requestReviewsForItem}>
        <div className="restaurantCardInfo">
          <h4 className="restaurantName">{this.props.restaurant.name}</h4>
          <p className="restaurantRating">
            {this.props.restaurant.rating}/5 out of{" "}
            {this.props.restaurant.user_ratings_total} reviews
          </p>
          <p className="restaurantAddress">{this.props.restaurant.vicinity}</p>
          <div className="restaurantBtnContainer">
            <button
              className="btnRestaurantReviews"
              onClick={this.requestReviewsForItem}
            >
              Read reviews
            </button>{" "}
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
