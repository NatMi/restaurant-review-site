import React, { Component } from "react";
import "../Styles/ItemReview.css";

class ItemReview extends Component {
  render() {
    return (
      <div>
        {this.props.loadReviews.map(review => (
          <div className="restaurantReviewCard">
            <div className="authorName"> {review.author_name} </div>
            <div className="reviewHeader">
              <div className="restaurantRating">{review.rating}</div>
            </div>
            <div className="reviewBody">
              <p className="reviewText"> {review.text}</p>
            </div>{" "}
          </div>
        ))}
      </div>
    );
  }
}

export default ItemReview;
