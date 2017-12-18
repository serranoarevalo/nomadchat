import React, { Component } from "react";
import io from "socket.io-client";
import "./App.css";
const socket = io("http://localhost:3000");

class App extends Component {
  constructor(props) {
    super(props);
    socket.on("room change", msg => {
      this._updateNomads(msg.connected);
    });
    this.state = {
      nickname: localStorage.getItem("nickname"),
      hasNickName: localStorage.getItem("nickname") ? true : false,
      loggedIn: false,
      nomads: []
    };
  }
  componentDidMount() {
    const { hasNickName } = this.state;
    if (hasNickName) {
      this._logUserIn();
    }
  }
  render() {
    const { nickname, hasNickName, nomads, loggedIn } = this.state;
    return (
      <div className="App">
        {!hasNickName &&
          !loggedIn && (
            <form onSubmit={this._submit} className="loginForm">
              <input
                type="text"
                value={nickname || ""}
                onChange={this._updateNickname}
                placeholder={"Write your nickname"}
                className="login__input"
                required={true}
                maxLength={50}
                minLength={5}
              />
              <button className="login__button">
                <span role="img" aria-label="go">
                  👍🏻
                </span>
              </button>
            </form>
          )}
        {loggedIn && (
          <ul>{nomads.map(nomad => <li key={nomad}>{nomad}</li>)}</ul>
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
    socket.emit("login", { nickname, loggedIn: true });
    this.setState({ loggedIn: true });
  };
  _updateNomads = nomads => {
    this.setState({ nomads: nomads });
  };
}

export default App;
