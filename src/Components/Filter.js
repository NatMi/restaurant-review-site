import React, { Component } from "react";
import "../Styles/Filter.css";

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectMinimumRating: 0,
      selectMaximumRating: 5,
      filteredRestaurants: [],
      filterIsActive: false,
      errorMsg: ""
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.restaurantsToFilter !== prevProps.restaurantsToFilter) {
      this.filterRestaurantsTest();
    }
  }

  clearFilter = () => {
    this.setState(
      {
        selectMinimumRating: 0,
        selectMaximumRating: 5,
        filteredRestaurants: false,
        filterIsActive: false,
        errorMsg: ""
      },
      () => {
        this.props.filteredRestaurantList(this.state.filteredRestaurants);
      }
    );
  };

  filterRestaurantsTest = () => {
    let filteredRestaurants = () => {
      return this.props.restaurantsToFilter.filter(
        restaurants =>
          restaurants.rating >= this.state.selectMinimumRating &&
          restaurants.rating <= this.state.selectMaximumRating
      );
    };

    if (this.state.selectMinimumRating <= this.state.selectMaximumRating) {
      this.setState(
        {
          filteredRestaurants: filteredRestaurants(),
          errorMsg: "",
          filterIsActive: true
        },
        () => {
          this.props.filteredRestaurantList(this.state.filteredRestaurants);
        }
      );
    } else {
      this.setState({
        errorMsg:
          "Minimum rating value has to be smaller than maximum. Please adjust."
      });
    }
  };
  handleSubmit = event => {
    event.preventDefault();
    this.filterRestaurantsTest();
  };
  handleChangeMinimumRating = event => {
    this.setState({
      selectMinimumRating: event.target.value
    });
  };
  handleChangeMaximumRating = event => {
    this.setState({
      selectMaximumRating: event.target.value
    });
  };

  renderMinimumSelect = () => {
    return (
      <select
        id="minRating"
        name="minRatingSelect"
        value={this.state.selectMinimumRating}
        onChange={this.handleChangeMinimumRating}
      >
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    );
  };

  render() {
    return (
      <div id="filterCard">
        <form id="filterForm">
          <h4>Filter results:</h4>
          <label htmlFor="minRatingSelect">Minimum: </label>
          {this.renderMinimumSelect()}

          <label htmlFor="maxRatingSelect">Maximum: </label>
          <select
            id="maxRating"
            name="maxRatingSelect"
            value={this.state.selectMaximumRating}
            onChange={this.handleChangeMaximumRating}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <input
            type="submit"
            value="Apply filter"
            onClick={this.handleSubmit}
          />
          <button
            id="btnClearFilterSearch"
            onClick={this.clearFilter}
            style={{
              opacity: this.state.filterIsActive === true ? 1 : 0.3,
              pointerEvents:
                this.state.filterIsActive === true ? "auto" : "none"
            }}
          >
            Clear filter
          </button>
        </form>

        <p className="filterErrorMsg">{this.state.errorMsg}</p>
      </div>
    );
  }
}
export default Filter;
