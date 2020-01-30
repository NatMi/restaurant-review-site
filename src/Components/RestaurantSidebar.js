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
      filteredRestaurantList: false,
      activeRestaurant: false
    };
    this.loadReviewsFromApp = false;
    this.receiveActiveStatusRequest = restaurant => {
      this.setState({ activeRestaurant: restaurant });
    };
    this.getFilteredReviews = filteredData => {
      this.setState({
        filteredRestaurantList: filteredData
      });
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // only update if the data has changed
    // update check on restaurant list:
    if (prevProps.getVisibleRestaurants !== this.props.getVisibleRestaurants) {
      this.setState({
        currentRestaurantList: this.props.getVisibleRestaurants,
        filteredRestaurantList: false
      });
    }
    //update check on
    if (prevState.activeRestaurant !== this.state.activeRestaurant) {
      this.props.requestForActiveStatusToApp(this.state.activeRestaurant);
    }
    if (
      prevProps.receiveActiveStatusFromApp !==
      this.props.receiveActiveStatusFromApp
    ) {
      this.setState({
        activeRestaurant: this.props.receiveActiveStatusFromApp
      });
    }
  }

  handleBackToResults = () => {
    this.setState({
      activeRestaurant: false
    });
  };

  renderActiveNoReviews() {
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
      </div>
    );
  }
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
        <div id="restaurantList">
          <ItemReview
            key={this.state.activeRestaurant.name}
            loadReviews={this.props.loadReviewsFromApp}
          />
        </div>
      </div>
    );
  }
  renderFilteredResults() {
    return (
      <div>
        <h3>
          {"Showing filtered results: "}
          {this.state.filteredRestaurantList.length}
        </h3>
        <Filter
          restaurantsToFilter={this.state.currentRestaurantList}
          filteredRestaurantList={this.getFilteredReviews}
          filterIsActive={false}
        />
        <div id="restaurantList">
          {this.state.filteredRestaurantList.map(restaurant => (
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
  renderResults() {
    return (
      <div>
        <h3>Restaurants found: {this.props.getVisibleRestaurants.length}</h3>
        <Filter
          restaurantsToFilter={this.state.currentRestaurantList}
          filteredRestaurantList={this.getFilteredReviews}
        />
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
    if (
      this.state.activeRestaurant !== false &&
      this.props.loadReviewsFromApp !== undefined
    ) {
      return this.renderActive();
    } else if (
      this.state.activeRestaurant !== false &&
      this.props.loadReviewsFromApp === undefined
    ) {
      return this.renderActiveNoReviews();
    } else if (
      this.props.getVisibleRestaurants.length > 0 &&
      this.state.filteredRestaurantList === false
    ) {
      return this.renderResults();
    } else if (this.state.filteredRestaurantList !== false) {
      return this.renderFilteredResults();
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
