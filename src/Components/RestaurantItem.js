import React, { Component } from "react";
import "../Styles/restaurantItem.css";

class RestaurantItem extends Component {
  render() {
    return (
      <div id="restaurantList">
        <h3>Restaurants found: {this.props.getVisibleRestaurants.length}</h3>

        {this.props.getVisibleRestaurants.map(restaurant => {
          return (
            /*restaurant card: */
            <div className="restaurantCard">
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
                  alt="piecebox restaurant"
                  className="streetViewImg"
                  src="https://s.nimbusweb.me/attachment/3650970/w1r1sl67ldnrf8fpioly/B3uOd5nTS73LnLOL/screenshot-www.google.com-2019.12.16-19_52_09.jpg"
                ></img>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
export default RestaurantItem;
