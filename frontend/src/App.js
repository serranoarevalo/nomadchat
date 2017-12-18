import React, { Component } from "react";
import openSocket from "socket.io-client";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  componentDidMount() {
    this.socket = openSocket("http://localhost:3000");
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
