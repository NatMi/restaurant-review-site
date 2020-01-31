import React, { Component } from "react";
import "../Styles/AddRestaurantForm.css";

class AddRestaurantForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <button type="submit">Submit</button>
          <button>Close the form</button>
        </form>
      </div>
    );
  }
}

export default AddRestaurantForm;
