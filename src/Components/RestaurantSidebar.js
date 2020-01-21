import React, { Component } from "react";
import RestaurantItem from "./RestaurantItem.js";
import ItemReviews from "./ItemReviews.js";
import "../Styles/restaurantSidebar.css";

class RestaurantSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRestaurantList: []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // only update if the data has changed
    if (prevProps.getVisibleRestaurants !== this.props.getVisibleRestaurants) {
      this.setState({
        currentRestaurantList: this.props.getVisibleRestaurants
      });
    }
  }

  render() {
    if (this.props.getVisibleRestaurants.length > 0) {
      return (
        <div id="restaurantList">
          <h3>Restaurants found: {this.props.getVisibleRestaurants.length}</h3>
          {this.props.getVisibleRestaurants.map(restaurant => (
            <RestaurantItem restaurant={restaurant} key={restaurant.place_id} />
          ))}
        </div>
      );
    } else {
      return (
        <div id="restaurantList">
          <h3>No restaurants found in this area.</h3>
          <ItemReviews />
        </div>
      );
    }
  }
}
export default RestaurantSidebar;
