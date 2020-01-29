import React, { Component } from "react";

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectMinimumRating: 1,
      selectMaximumRating: 5
    };
  }
  filterRestaurants() {
    let filteredResults = this.props.restaurantsToFilter.filter(
      restaurants => restaurants.rating > 4
    );
    console.log(filteredResults);
  }
  handleSubmit = event => {
    event.preventDefault();
    console.log(
      "Min: " +
        this.state.selectMinimumRating +
        " Max: " +
        this.state.selectMaximumRating
    );
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

  render() {
    return (
      <div id="filterDiv">
        <form onSubmit={this.handleSubmit}>
          <h4>Filter results:</h4>
          <label for="minRatingSelect">Min: </label>
          <select
            id="minRating"
            name="minRatingSelect"
            onChange={this.handleChangeMinimumRating}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <label for="maxRatingSelect">Max: </label>
          <select
            id="maxRating"
            name="maxRatingSelect"
            value="5"
            onChange={this.handleChangeMaximumRating}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <input type="submit" value="Apply filter" />
        </form>
      </div>
    );
  }
}
export default Filter;
