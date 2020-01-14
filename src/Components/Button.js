import React, { Component } from "react";

class Button extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick();
  }

  render() {
    return <button onClick={this.handleClick}>Change txt color</button>;
  }
}

export default Button;
