import React, { Component } from "react";
import "../Styles/AddRestaurantForm.css";

class AddRestaurantForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantName: ""
    };
  }
  handleSubmit = event => {
    event.preventDefault();
    let newRestaurant = {
      place_id: "randomPlaceId",
      name: this.state.restaurantName,
      vicinity: "235 Morningside Rd, Edinburgh EH10 4QT",
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
  };

  closeFormNoSave = event => {
    event.preventDefault();

    this.setState(
      {
        showNewRestaurantForm: false
      },
      () => {
        this.props.requestSetIsActive(this.state.showNewRestaurantForm);
      }
    );
  };
  handleChangeRestaurantName = event => {
    this.setState({
      restaurantName: event.target.value
    });
  };

  render() {
    return (
      <div
        id="newRestaurantFormModal"
        style={{ display: this.props.isActive === true ? "block" : "none" }}
      >
        <form onSubmit={this.handleSubmit}>
          <label>
            Restaurant name:
            <input
              type="text"
              value={this.state.restaurantName}
              onChange={this.handleChangeRestaurantName}
            />
          </label>
          <button type="submit" type="submit">
            Add new restaurant
          </button>
          <button onClick={this.closeFormNoSave}>Close this form</button>
        </form>
      </div>
    );
  }
}

export default AddRestaurantForm;
