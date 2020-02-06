import React, { Component } from "react";
import "../Styles/AddReviewForm.css";

class AddReviewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReviewForm: false,
      authorName: "",
      rating: null,
      reviewText: ""
    };
    this.resetForm = () => {
      this.setState(
        {
          showReviewForm: false,
          authorName: "",
          userRating: null,
          reviewText: ""
        },
        () => {
          this.props.requestSetIsReviewFormOpen(this.state.showReviewForm);
        }
      );
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    let newReview = {
      place_id: this.props.place_id,
      review: {
        author_name: this.state.authorName,
        rating: this.state.userRating,
        text: this.state.reviewText
      }
    };
    this.props.newReviewData(newReview);

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
  handleRatingChange = event => {
    this.setState({
      userRating: parseInt(event.target.value)
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
              <input
                type="radio"
                value="1"
                name="restaurantReview"
                onChange={this.handleRatingChange}
                required
              />
              1
            </label>
            <label>
              <input
                type="radio"
                value="2"
                name="restaurantReview"
                onChange={this.handleRatingChange}
              />
              2
            </label>
            <label>
              <input
                type="radio"
                value="3"
                name="restaurantReview"
                onChange={this.handleRatingChange}
              />
              3
            </label>
            <label>
              <input
                type="radio"
                value="4"
                name="restaurantReview"
                onChange={this.handleRatingChange}
              />
              4
            </label>
            <label>
              <input
                type="radio"
                value="5"
                name="restaurantReview"
                onChange={this.handleRatingChange}
              />
              5
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
