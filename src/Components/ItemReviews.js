import React, { Component } from "react";
import "../Styles/ItemReview.css";

class ItemReviews extends Component {
  render() {
    /*{this.props.reviewItem.author_name}*/
    // console.log(this.props.reviewItem);
    return (
      <div className="restaurantReviewCard">
        <div className="authorName"> Blah </div>
        <div className="reviewHeader">
          <div className="restaurantRating">5 stars</div>
        </div>
        <div className="reviewBody">
          <p className="reviewText"> Amazing dining experience!</p>
        </div>
      </div>
    );
  }
}

export default ItemReviews;
