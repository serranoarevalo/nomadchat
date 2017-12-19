import React from "react";
import PropTypes from "prop-types";
import "./styles.css";

const ConnectedUsers = props => (
  <div className="connectedUsers">
    <h3 className="connectedUsers__title">Connected Users</h3>
    <ul className="connectedUsers__list u-card">
      {props.users.map(user => (
        <li key={user} className="connectedUsers__user">
          {user}
        </li>
      ))}
    </ul>
  </div>
);

ConnectedUsers.propTypes = {
  users: PropTypes.array.isRequired
};

export default ConnectedUsers;
