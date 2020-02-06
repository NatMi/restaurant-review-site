import React, { Component } from "react";
import "../Styles/Filter.css";

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectMinimumRating: 0,
      selectMaximumRating: 5,
      filteredRestaurants: [],
      clearFilter: false,
      errorMsg: ""
    };
  }
  //  Filters visible restaurant list as soon as they are loaded from app component (default filter settings show all results).
  componentDidUpdate(prevProps) {
    if (this.props.restaurantsToFilter !== prevProps.restaurantsToFilter) {
      this.props.filteredRestaurantList(this.props.restaurantsToFilter);
    }
  }

  filterRestaurants = () => {
    //  1. Checks if filter values are set correcltly. If not, error message is shown.
    if (this.state.selectMinimumRating <= this.state.selectMaximumRating) {
      //  2. Creates new array by filtering out restaurants matching filtering criteria.
      let filteredRestaurants = () => {
        return this.props.restaurantsToFilter.filter(
          restaurants =>
            restaurants.rating >= this.state.selectMinimumRating &&
            restaurants.rating <= this.state.selectMaximumRating
        );
      };
      //  3. Checks  filter values. If they are the same as default, "clear filter" button is not active.
      let checkClearFilter = () => {
        if (
          this.state.selectMinimumRating === 0 &&
          this.state.selectMaximumRating === 5
        ) {
          return false;
        }
        return true;
      };
      //  4. Clears error message if there was any, sets clear filter button and pushes filteredRestaurants array to props
      this.setState({ clearFilter: checkClearFilter(), errorMsg: "" }, () => {
        this.props.filteredRestaurantList(filteredRestaurants());
      });
    } else {
      this.setState({
        clearFilter: true,
        errorMsg:
          "Minimum rating value has to be smaller than maximum. Please adjust."
      });
    }
  };

  handleSubmit = event => {
    this.filterRestaurants();
    event.preventDefault();
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
  //  Sets filter to default settings
  clearFilter = event => {
    this.setState(
      {
        selectMinimumRating: 0,
        selectMaximumRating: 5,
        clearFilter: false,
        errorMsg: ""
      },
      () => {
        this.filterRestaurants();
      }
    );
    event.preventDefault();
  };

  render() {
    return (
      <div id="filterCard">
        <h4>Filter results:</h4>
        <form id="filterForm">
          <label htmlFor="minRatingSelect">Minimum: </label>
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
            className={
              this.state.clearFilter === true
                ? "clearFilterActive"
                : "clearFilterDisabled"
            }
          >
            Clear filter
          </button>
        </form>
        <div className="filterErrorMsg">{this.state.errorMsg}</div>
      </div>
    );
  }
}
export default Filter;
