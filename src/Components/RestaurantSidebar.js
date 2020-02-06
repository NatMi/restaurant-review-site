import React, { Component } from "react";
import RestaurantItem from "./RestaurantItem.js";
import ItemReview from "./ItemReviews.js";
import AddReviewForm from "./AddReviewForm.js";
import "../Styles/restaurantSidebar.css";

class RestaurantSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRestaurantList: [],
      activeRestaurant: false,
      loadAllReviews: [],
      userReviews: [],
      isReviewFormActive: false
    };
    this.loadReviewsFromApp = false;
    this.receiveActiveStatusRequest = data => {
      this.setState({ activeRestaurant: data });
    };
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
    if (prevProps.getVisibleRestaurants !== this.props.getVisibleRestaurants) {
      this.setState({
        currentRestaurantList: this.props.getVisibleRestaurants
      });
    }
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
    // Checks if new reviews were loaded from App (for new active restaurant), or added by user from AddRestaurantForm. Updates list of reviews to render.
    if (
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
        <AddReviewForm
          place_id={this.state.activeRestaurant.place_id}
          requestSetIsReviewFormOpen={this.receiveActiveReviewFormRequest}
          newReviewData={this.handleNewReviewData}
        />
      </div>
    );
  }

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
          requestForActiveReviewForm={this.receiveActiveReviewFormRequest}
          isActive={true}
        />
      </div>
    );
  }
  renderActive() {
    return (
      <div>
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
        <div id="reviewList">
          <ItemReview
            key={this.state.activeRestaurant.name}
            loadReviews={this.state.loadAllReviews}
          />
        </div>
      </div>
    );
  }
  renderResults() {
    return (
      <div id="restaurantList">
        <h3>Restaurants found: {this.props.getVisibleRestaurants.length}</h3>
        {this.props.getVisibleRestaurants.map(restaurant => (
          <RestaurantItem
            restaurant={restaurant}
            isActive={false}
            key={restaurant.place_id}
            requestForActiveStatusToSidebar={this.receiveActiveStatusRequest}
            requestForActiveReviewForm={this.receiveActiveReviewFormRequest}
          />
        ))}
      </div>
    );
  }

  render() {
    if (
      this.state.activeRestaurant !== false &&
      this.state.isReviewFormActive !== false
    ) {
      return this.renderReviewForm();
    } else if (this.state.activeRestaurant !== false) {
      return this.renderActive();
    } else if (
      this.state.activeRestaurant !== false &&
      this.props.loadReviewsFromApp === undefined
    ) {
      return this.renderActiveNoReviews();
    } else if (this.props.getVisibleRestaurants.length > 0) {
      return this.renderResults();
    } else {
      return (
        <div id="restaurantList">
          <h3>No restaurants found in this area.</h3>
          <h4>What you can do? </h4>
          <p>
            1. Add a new restaurant by right-clicking place on a map and
            submitting new restaurant details.
          </p>
          <p></p>
          <p>2. Zoom out or move map to allow further search.</p>
        </div>
      );
    }
  }
}
export default RestaurantSidebar;
