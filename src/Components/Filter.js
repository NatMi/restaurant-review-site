import React, { Component } from "react";

class Filter extends Component {
  render() {
    return (
      <div id="filterDiv">
        <h4>Filter results:</h4>
        <label for="minRatingSelect">Min: </label>
        <select id="minRating" name="minRatingSelect" label>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <label for="maxRatingSelect">Min</label>
        <select id="maxRating" name="maxRatingSelect" label>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    );
  }
}
export default Filter;
