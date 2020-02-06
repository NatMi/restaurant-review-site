import React, { Component } from "react";
import "../Styles/AddRestaurantForm.css";

class AddRestaurantForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantName: "",
      place_id: "",
      formattedAdress: false
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

  componentDidUpdate(prevProps) {
    if (prevProps.getMarkerData !== this.props.getMarkerData) {
      if (this.props.getMarkerData !== null) {
        let geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: this.props.getMarkerData.position },
          (results, status) => {
            if (status === "OK") {
              this.setState({
                place_id:
                  results[0].place_id + this.props.getMarkerData.position.lat(),
                formattedAdress: results[0].formatted_address
              });
            } else {
              console.log(status);
            }
          }
        );
      }
    }
  }

  clearFormData() {
    this.props.getMarkerData(null);
    this.closeFormNoSave();
  }

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
      rating: 0,
      user_ratings_total: 0,
      reviews: []
    };
    this.props.newRestaurantData(newRestaurant);

    this.resetForm();
  };

  closeFormNoSave = event => {
    event.preventDefault();
    this.props.newRestaurantData(false);
    this.resetForm();
  };
  handleChangeRestaurantName = event => {
    this.setState({
      restaurantName: event.target.value
    });
  };
  handleChangeFormattedAddress = event => {
    this.setState({
      formattedAdress: event.target.value
    });
  };

  render() {
    return (
      <div
        id="newRestaurantFormCard"
        className={
          this.props.isActive === true
            ? "restaurantFormDisplayed"
            : "restaurantFormDisabled"
        }
      >
        <h3>New restaurant form</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="restaurantName"> Restaurant name:</label>
          <input
            id="restaurantName"
            type="text"
            value={this.state.restaurantName}
            onChange={this.handleChangeRestaurantName}
            required
          />
          <label htmlFor="restaurantAddress"> Address:</label>
          <input
            idfor="restaurantAddress"
            type="text"
            value={this.state.formattedAdress}
            onChange={this.handleChangeFormattedAddress}
            required
          />
          <div id="formButtons">
            <input type="submit" value="Add restaurant" />
            <button id="closeForm" onClick={this.closeFormNoSave}>
              Close form
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default AddRestaurantForm;
