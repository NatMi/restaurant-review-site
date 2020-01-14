import React, { Component } from "react";
import "../Styles/restaurantItem.css";

class RestaurantItem extends Component {
  componentDidUpdate() {
    let newRestaurantCard = () => {
      this.props.visibleRestaurants.map(restaurant => {
        console.log(restaurant.name);
      });
    };
    newRestaurantCard();
  }
  render() {
    return (
      <div id="restaurantList">
        <h3>Restaurants found: {this.props.visibleRestaurants.length}</h3>
        {/* restaurant card start: */}
        <div className="restaurantCard">
          <div className="restaurantCardInfo">
            <h4 className="restaurantName">Piecebox</h4>
            <p className="restaurantRating">5/5</p>
            <p className="restaurantAddress">Polwarth Crescent 123</p>
            <div className="restaurantBtnContainer">
              <button className="btnRestaurantReviews">Read reviews</button>{" "}
              <button className="btnAddRestaurantReviews">Add review</button>
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
        {/* restaurant card finish */}
      </div>
    );
  }
}
export default RestaurantItem;
