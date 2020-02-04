import React, { Component } from "react";
import logo from "../Images/logo.png";

class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <img id="headerLogo" src={logo} alt="Restaurant Review Site Logo"></img>
        <h1>Restaurant Reviews</h1>
      </header>
    );
  }
}
export default Header;
