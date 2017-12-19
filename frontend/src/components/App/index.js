import React, { Component } from "react";
import io from "socket.io-client";
import "./styles.css";
import NicknameInput from "components/NicknameInput";
import ConnectedUsers from "components/ConnectedUsers";
const socket = io("http://localhost:8000");

class App extends Component {
  constructor(props) {
    super(props);
    socket.on("room change", msg => {
      this._updateNomads(msg.connected);
    });
    this.state = {
      nickname: localStorage.getItem("nickname") || "",
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
      <div className={`App ${loggedIn && "Chat"}`}>
        {!hasNickName &&
          !loggedIn && (
            <NicknameInput
              onSubmit={this._submit}
              value={nickname}
              onChange={this._updateNickname}
            />
          )}
        {loggedIn && <ConnectedUsers users={nomads} />}
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
