import React, { Component } from "react";
import RestaurantItem from "./RestaurantItem.js";
import ItemReview from "./ItemReviews.js";
import AddReviewForm from "./AddReviewForm.js";
import "../Styles/restaurantSidebar.css";

class RestaurantSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRestaurant: false,
      loadAllReviews: [],
      userReviews: [],
      isReviewFormActive: false
    };
    // receives information on which restaurant item was clicked
    this.receiveActiveStatusRequest = data => {
      this.setState({ activeRestaurant: data });
    };
    // receives information on new review request
    this.receiveActiveReviewFormRequest = data => {
      this.setState({ isReviewFormActive: data });
    };
    this.handleNewReviewData = newReviewData => {
      if (newReviewData !== false) {
        this.setState(prevState => ({
          userReviews: [...prevState.userReviews, newReviewData]
        }));
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // When active restaurant changed on restaurantItem click, pass this information to App component.
    if (prevState.activeRestaurant !== this.state.activeRestaurant) {
      this.props.requestForActiveStatusToApp(this.state.activeRestaurant);
    }
    // When active restaurant changed on map marker click, receive this information.
    else if (
      prevProps.receiveActiveStatusFromApp !==
      this.props.receiveActiveStatusFromApp
    ) {
      this.setState({
        activeRestaurant: this.props.receiveActiveStatusFromApp,
        isReviewFormActive: false
      });
    }
    // Checks if new reviews are loaded from App (for new active restaurant), or added by user from AddRestaurantForm. Updates list of reviews to render.
    else if (
      prevState.userReviews !== this.state.userReviews ||
      prevProps.loadReviewsFromApp !== this.props.loadReviewsFromApp
    ) {
      // if no reviews were returned from App (google api, undefined), set an empty array which can be iterated through if there are any reviews from user.
      let checkReviewData = () => {
        if (this.props.loadReviewsFromApp !== undefined) {
          return this.props.loadReviewsFromApp;
        } else {
          return [];
        }
      };
      this.setState(
        {
          loadAllReviews: checkReviewData()
        },
        () => {
          this.state.userReviews.forEach(userReview => {
            if (userReview.place_id === this.state.activeRestaurant.place_id) {
              this.setState(prevState => ({
                loadAllReviews: [...prevState.loadAllReviews, userReview.review]
              }));
            }
          });
        }
      );
    }
  }

  handleBackToResults = () => {
    this.setState({
      activeRestaurant: false,
      isReviewFormActive: false
    });
  };
  renderReviewForm() {
    return (
      <div id="sidebar">
        <button className="btnBackToResults" onClick={this.handleBackToResults}>
          {"« Back to results"}
        </button>
        <RestaurantItem
          restaurant={this.state.activeRestaurant}
          key={this.state.activeRestaurant.place_id}
          requestForActiveStatusToSidebar={this.receiveActiveStatusRequest}
          isActive={true}
        />
        <AddReviewForm
          place_id={this.state.activeRestaurant.place_id}
          requestSetIsReviewFormOpen={this.receiveActiveReviewFormRequest}
          newReviewData={this.handleNewReviewData}
        />
      </div>
    );
  }

  renderActive() {
    return (
      <div id="sidebar">
        <button className="btnBackToResults" onClick={this.handleBackToResults}>
          {"« Back to results"}
        </button>
        <RestaurantItem
          restaurant={this.state.activeRestaurant}
          isActive={true}
          key={this.state.activeRestaurant.place_id}
          requestForActiveStatusToSidebar={this.receiveActiveStatusRequest}
          requestForActiveReviewForm={this.receiveActiveReviewFormRequest}
        />
        <ItemReview
          key={this.state.activeRestaurant.name}
          loadReviews={this.state.loadAllReviews}
        />
      </div>
    );
  }
  renderResults() {
    return (
      <div id="sidebar">
        <h3>Restaurants found: {this.props.getFilteredRestaurants.length}</h3>
        <div id="restaurantList">
          {this.props.getFilteredRestaurants.map(restaurant => (
            <RestaurantItem
              restaurant={restaurant}
              isActive={false}
              key={restaurant.place_id}
              requestForActiveStatusToSidebar={this.receiveActiveStatusRequest}
              requestForActiveReviewForm={this.receiveActiveReviewFormRequest}
            />
          ))}
        </div>
      </div>
    );
  }

  render() {
    if (
      this.state.activeRestaurant !== false &&
      this.state.isReviewFormActive !== false
    ) {
      return this.renderReviewForm();
    } else if (
      this.state.activeRestaurant !== false ||
      (this.state.activeRestaurant !== false &&
        this.props.loadReviewsFromApp === undefined)
    ) {
      return this.renderActive();
    } else if (this.props.getFilteredRestaurants.length > 0) {
      return this.renderResults();
    } else {
      return (
        <div id="sidebar">
          <h3>No restaurants with matching criteria were found.</h3>
          <div id="sidebarInfo">
            <h4>What you can do: </h4>
            <p>
              1. Add a new restaurant by right-clicking place on a map and
              submitting new restaurant details.
            </p>
            <p>2. Zoom out or move map to allow broader search.</p>
            <p>3. Modify filter criteria.</p>
          </div>
        </div>
      );
    }
  }
}
export default RestaurantSidebar;
