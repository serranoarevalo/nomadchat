import React from "react";
import PropTypes from "prop-types";
import "./styles.css";

const Messages = props => (
  <div className="messages">
    <ul className="messages__list">
      {props.messages.map(message => (
        <li key={message.created_at} className="messages__message u-card">
          <span className="message__user">{message.user}</span>
          <span className="message__text">{message.message}</span>
        </li>
      ))}
    </ul>
  </div>
);

Messages.propTypes = {
  messages: PropTypes.array.isRequired
};

export default Messages;
