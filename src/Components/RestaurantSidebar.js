import React, { Component } from "react";
import RestaurantItem from "./RestaurantItem.js";
import "../Styles/restaurantSidebar.css";

class RestaurantSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRestaurantList: []
    };
    // this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // only update if the data has changed
    if (prevProps.getVisibleRestaurants !== this.props.getVisibleRestaurants) {
      this.setState({
        currentRestaurantList: this.props.getVisibleRestaurants
      });
    }
    console.log("currentRest:" + this.state.currentRestaurantList.length);
  }

  render() {
    if (this.state.currentRestaurantList.length <= 0) {
      return (
        <div id="restaurantList">
          <h3>No restaurants found in this area.</h3>
        </div>
      );
    } else {
      return (
        <div id="restaurantList">
          <h3>Restaurants found: {this.state.currentRestaurantList.length}</h3>

          {this.state.currentRestaurantList.map(restaurant => (
            <RestaurantItem restaurant={restaurant} />
          ))}
        </div>
      );
    }
  }
}
export default RestaurantSidebar;
