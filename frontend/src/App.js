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
          <form onSubmit={this._submit}>
            <input
              type="text"
              value={nickname || ""}
              onChange={this._updateNickname}
            />
          </form>
        )}
      </div>
    );
  }
  _submit = e => {
    e.preventDefault();
    const { nickname } = this.state;
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
