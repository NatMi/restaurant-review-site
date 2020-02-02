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
  }
  componentDidUpdate(prevProps) {
    if (prevProps.getMarkerData != this.props.getMarkerData) {
      if (
        this.state.formattedAdress === false &&
        this.props.getMarkerData != null
      ) {
        let geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: this.props.getMarkerData.position },
          (results, status) => {
            if (status == "OK") {
              this.setState({
                place_id: results[0].place_id,
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
    this.setState({}, () => {
      this.props.getMarkerData(null);
      this.props.getMarkerData(null);
      this.closeFormNoSave();
    });
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
      rating: null,
      user_ratings_total: null,
      reviews: []
    };
    this.props.newRestaurantData(newRestaurant);

    this.setState(
      {
        showNewRestaurantForm: false,
        restaurantName: "",
        formattedAdress: false
      },
      () => {
        this.props.requestSetIsActive(this.state.showNewRestaurantForm);
      }
    );
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
