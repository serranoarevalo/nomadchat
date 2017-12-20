import React, { Component } from "react";
import io from "socket.io-client";
import "./styles.css";
import ConnectedUsers from "components/ConnectedUsers";
import Messages from "components/Messages";
const client = io("http://localhost:8000");

class App extends Component {
  constructor(props) {
    super(props);
    client.on("room change", msg => {
      this._updateNomads(msg.connected);
    });
    client.on("new message", msg => {
      this._updateMessages(msg.newMessage);
    });
    this.state = {
      nickname: localStorage.getItem("nickname") || "",
      hasNickName: localStorage.getItem("nickname") ? true : false,
      loggedIn: false,
      nomads: [],
      messages: [],
      message: ""
    };
  }
  componentDidMount() {
    const { hasNickName } = this.state;
    if (hasNickName) {
      this._logUserIn();
    }
  }
  render() {
    const {
      nickname,
      hasNickName,
      nomads,
      loggedIn,
      messages,
      message
    } = this.state;
    return (
      <div className={`App ${loggedIn && "Chat"}`}>
        {!hasNickName &&
          !loggedIn && (
            <form onSubmit={this._submit} className="loginForm">
              <input
                type="text"
                value={nickname}
                onChange={this._updateNickname}
                placeholder={"Write your nickname"}
                className="login__input"
                required={true}
                maxLength={50}
                minLength={2}
              />
              <button className="login__button">
                <span role="img" aria-label="go">
                  👍🏻
                </span>
              </button>
            </form>
          )}
        {loggedIn && <ConnectedUsers users={nomads} />}
        {loggedIn && (
          <div className="Chat__Column">
            <Messages messages={messages} />
            <form onSubmit={this._sendMessage}>
              <input
                placeholder="Write your message"
                className="u-card login__input typeMessage"
                onChange={this._controllMessage}
                value={message}
              />
            </form>
          </div>
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
    client.emit("login", { nickname, loggedIn: true }, messages => {
      this.setState({
        messages
      });
      this._scrollToBottom();
    });
    this.setState({ loggedIn: true });
  };
  _updateNomads = nomads => {
    this.setState({ nomads: nomads });
  };
  _controllMessage = e => {
    const { target: { value } } = e;
    this.setState({
      message: value
    });
  };
  _sendMessage = e => {
    e.preventDefault();
    const { message } = this.state;
    client.emit("send message", { message });
    this.setState({
      message: ""
    });
  };
  _updateMessages = message => {
    this.setState(prevState => {
      return {
        ...prevState,
        messages: [...prevState.messages, message.message]
      };
    }, this._scrollToBottom);
  };
  _scrollToBottom = () => {
    const element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
  };
}

export default App;
