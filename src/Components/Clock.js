import React, { Component } from "react";
import Button from "./Button.js";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().toLocaleString(),
      color: "white"
    };
    this.changeColor = this.changeColor.bind(this);
  }

  componentDidMount() {
    this.intervalId = setInterval(() => this.updateClock(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  updateClock() {
    this.setState({
      time: new Date().toLocaleString()
    });
  }
  changeColor() {
    this.setState(prevState => {
      let newColor = prevState.color === "white" ? "blue" : "white";
      return { color: newColor };
    });
  }

  render() {
    return (
      <div style={{ color: this.state.color }}>
        <p className="red">Time is {this.state.time}</p>
        <Button onClick={this.changeColor} />
      </div>
    );
  }
}

export default Clock;
