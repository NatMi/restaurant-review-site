import React, { Component } from "react";
import "../Styles/AddReviewForm.css";

class AddReviewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorName: "",
      reviewText: "",
      place_id: ""
    };
    this.resetForm = () => {
      this.setState(
        {
          showNewRestaurantForm: false,
          restaurantName: "",
          formattedAdress: ""
        },
        () => {
          this.props.requestSetIsActive(this.state.showNewRestaurantForm);
        }
      );
    };
  }

  handleRatingChange = event => {
    this.setState({
      userRating: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    let newRestaurant = {
      place_id: this.state.place_id,
      name: this.state.restaurantName,
      vicinity: this.state.formattedAdress,
      geometry: {
        location: {
          lat: this.props.getMarkerData.position.lat(),
          lng: this.props.getMarkerData.position.lng()
        }
      },
      rating: null,
      user_ratings_total: null,
      reviews: []
    };
    this.props.newRestaurantData(newRestaurant);

    this.resetForm();
  };

  closeFormNoSave = event => {
    event.preventDefault();
    this.props.newReviewData(false);
    this.resetForm();
  };
  handleChangeAuthorName = event => {
    this.setState({
      authorName: event.target.value
    });
  };
  handleChangereviewText = event => {
    this.setState({
      reviewText: event.target.value
    });
  };

  render() {
    return (
      <div id="restaurantreviewFormCard">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="authorName"> Enter your name:</label>
          <input
            id="authorName"
            type="text"
            value={this.state.authorName}
            onChange={this.handleChangeAuthorName}
            required
          />
          <label htmlFor="userRating"> Your rating:</label>
          <div id="radioButtons">
            <label>
              1
              <input
                type="radio"
                name="restaurantReview"
                onChange={this.handleRatingChange}
              />
            </label>
            <label>
              2
              <input
                type="radio"
                name="restaurantReview"
                onChange={this.handleRatingChange}
              />
            </label>
            <label>
              3
              <input
                type="radio"
                name="restaurantReview"
                onChange={this.handleRatingChange}
              />
            </label>
            <label>
              4
              <input
                type="radio"
                name="restaurantReview"
                onChange={this.handleRatingChange}
              />
            </label>
            <label>
              5
              <input
                type="radio"
                name="restaurantReview"
                onChange={this.handleRatingChange}
              />
            </label>
          </div>
          <label htmlFor="reviewText"> Your review:</label>
          <textarea
            id="reviewText"
            type="text"
            value={this.state.reviewText}
            onChange={this.handleChangereviewText}
            required
          />
          <div id="reviewFormButtons">
            <input type="submit" value="Add review" />
            <button id="closeReviewForm" onClick={this.closeFormNoSave}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default AddReviewForm;
