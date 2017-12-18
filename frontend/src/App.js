import React, { Component } from "react";
import openSocket from "socket.io-client";
import "./App.css";

class App extends Component {
  state = {
    nickname: localStorage.getItem("nickname"),
    hasNickName: localStorage.getItem("nickname") ? true : false,
    connected: false
  };
  componentDidMount() {
    const { hasNickName } = this.state;
    if (hasNickName) {
      this._logUserIn();
    }
  }
  render() {
    const { nickname, hasNickName } = this.state;
    return (
      <div className="App">
        {!hasNickName && (
          <form onSubmit={this._submit} className="loginForm">
            <input
              type="text"
              value={nickname || ""}
              onChange={this._updateNickname}
              placeholder={"Write your nickname"}
              className="login__input"
              required={true}
              maxLength={50}
            />
            <button className="login__button">
              <span role="img" aria-label="go">
                👍🏻
              </span>
            </button>
          </form>
        )}
      </div>
    );
  }
  _submit = e => {
    e.preventDefault();
    const { nickname } = this.state;
    if (!nickname) {
      return alert("Enter a nickname");
    }
    localStorage.setItem("nickname", nickname);
    this.setState({
      hasNickName: true
    });
    this._logUserIn();
  };
  _updateNickname = e => {
    const { target: { value } } = e;
    this.setState({
      nickname: value
    });
  };
  _logUserIn = () => {
    const { nickname } = this.state;
    this.socket = openSocket("http://localhost:3000");
    this.socket.on("connect", () => {
      this.setState({
        connected: true
      });
      this.socket.emit("login", nickname);
    });
  };
}

export default App;
