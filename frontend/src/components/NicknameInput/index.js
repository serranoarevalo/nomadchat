import React from "react";
import PropTypes from "prop-types";
import "./styles.css";

const NicknameInput = props => (
  <form onSubmit={props.onSubmit} className="loginForm">
    <input
      type="text"
      value={props.value}
      onChange={props.onChange}
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
);

NicknameInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default NicknameInput;
