import React, { Component } from "react";
import RestaurantItem from "./RestaurantItem.js";
import ItemReview from "./ItemReviews.js";
import Filter from "./Filter.js";
import "../Styles/restaurantSidebar.css";

class RestaurantSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRestaurantList: [],
      filteredRestaurantList: [],
      activeRestaurant: false
    };
    this.loadReviewsFromApp = false;
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
    if (
      prevProps.receiveActiveStatusFromApp !==
      this.props.receiveActiveStatusFromApp
    ) {
      this.setState({
        activeRestaurant: this.props.receiveActiveStatusFromApp
      });
      console.log(
        "sidebar active restaurant: " + this.state.activeRestaurant.name
      );
    }

    console.log("sidebar active reviews: " + this.props.loadReviewsFromApp);
  }

  handleBackToResults = () => {
    this.setState({
      activeRestaurant: false
    });
  };
  renderReviews = () => {
    if (this.props.loadReviewsFromApp !== undefined) {
      return (
        <ItemReview
          key={this.state.activeRestaurant.name}
          loadReviews={this.props.loadReviewsFromApp}
        />
      );
    }
  };

  renderActive() {
    return (
      <div>
        <button className="btnBackToResults" onClick={this.handleBackToResults}>
          Back to results
        </button>
        <RestaurantItem
          restaurant={this.state.activeRestaurant}
          key={this.state.activeRestaurant.place_id}
          requestForActiveStatusToSidebar={this.receiveActiveStatusRequest}
          isActive={true}
        />
        {this.renderReviews}
      </div>
    );
  }

  renderResults() {
    return (
      <div>
        <h3>Restaurants found: {this.props.getVisibleRestaurants.length}</h3>
        <Filter />
        <div id="restaurantList">
          {this.props.getVisibleRestaurants.map(restaurant => (
            <RestaurantItem
              restaurant={restaurant}
              key={restaurant.place_id}
              requestForActiveStatusToSidebar={this.receiveActiveStatusRequest}
            />
          ))}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.activeRestaurant !== false) {
      return this.renderActive();
    } else if (this.props.getVisibleRestaurants.length > 0) {
      return this.renderResults();
    } else {
      return (
        <div id="restaurantList">
          <h3>No restaurants found in this area.</h3>
        </div>
      );
    }
  }
}
export default RestaurantSidebar;
