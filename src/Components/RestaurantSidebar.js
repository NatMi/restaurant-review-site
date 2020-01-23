import React, { Component } from "react";
import RestaurantItem from "./RestaurantItem.js";
import ItemReviews from "./ItemReviews.js";
import "../Styles/restaurantSidebar.css";

class RestaurantSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRestaurantList: [],
      activeRestaurant: {
        name: "No active restaurant"
      }
    };
    this.receiveActiveStatusRequest = restaurant => {
      this.setState({ activeRestaurant: restaurant });
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // only update if the data has changed
    // update check on restaurant list:
    if (prevProps.getVisibleRestaurants !== this.props.getVisibleRestaurants) {
      this.setState({
        currentRestaurantList: this.props.getVisibleRestaurants
      });
    }
    //update check on
    if (prevState.activeRestaurant !== this.state.activeRestaurant) {
      this.props.requestForActiveStatusToApp(this.state.activeRestaurant);
      console.log(
        "sidebar active restaurant: " + this.state.activeRestaurant.name
      );
    }
  }

  render() {
    if (this.props.getVisibleRestaurants.length > 0) {
      return (
        <div id="restaurantList">
          <h3>Restaurants found: {this.props.getVisibleRestaurants.length}</h3>
          {this.props.getVisibleRestaurants.map(restaurant => (
            <RestaurantItem
              restaurant={restaurant}
              key={restaurant.place_id}
              requestForActiveStatusToSidebar={this.receiveActiveStatusRequest}
            />
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
