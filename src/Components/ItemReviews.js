import React, { Component } from "react";
import "../Styles/ItemReview.css";

class ItemReview extends Component {
  render() {
    if (this.props.loadReviews !== false) {
      return (
        <div>
          {this.props.loadReviews.map(review => (
            <div
              className="restaurantReviewCard"
              key={review.place_id + review.author_name}
            >
              <div className="authorName"> {review.author_name} </div>
              <div className="reviewHeader">
                <div className="restaurantRating">{review.rating}</div>
              </div>
              <div className="reviewBody">
                <p className="reviewText"> {review.text}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
}

export default ItemReview;
