import React, { Component } from "react";
import "../Styles/restaurantItem.css";
import googleMapsKey from "../Data/googleMapsKey.json";

class RestaurantSidebar extends Component {
  componentDidUpdate() {
    if (this.props.getVisibleRestaurants.length <= 0) {
      return <h3>Sorry, no restaurants found in this area.</h3>;
    } else {
    }
  }
  render() {
    return (
      <div id="restaurantList">
        <h3>Restaurants found: {this.props.getVisibleRestaurants.length}</h3>

        {this.props.getVisibleRestaurants.map(restaurant => {
          let streetViewUrl =
            "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" +
            restaurant.geometry.location.lat() +
            "," +
            restaurant.geometry.location.lng() +
            "&fov=80&heading=70&pitch=0&key=" +
            googleMapsKey.apiKey;

          return (
            /*restaurant card: */
            <div className="restaurantCard" key={restaurant.place_id}>
              <div className="restaurantCardInfo">
                <h4 className="restaurantName">{restaurant.name}</h4>
                <p className="restaurantRating">
                  {restaurant.rating}/5 out of {restaurant.user_ratings_total}{" "}
                  reviews
                </p>
                <p className="restaurantAddress">{restaurant.vicinity}</p>
                <div className="restaurantBtnContainer">
                  <button className="btnRestaurantReviews">Read reviews</button>{" "}
                  <button className="btnAddRestaurantReviews">
                    Add review
                  </button>
                </div>
              </div>

              <div className="restaurantCardStreetView">
                <img
                  alt={restaurant.name}
                  className="streetViewImg"
                  src={streetViewUrl}
                ></img>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
export default RestaurantSidebar;
