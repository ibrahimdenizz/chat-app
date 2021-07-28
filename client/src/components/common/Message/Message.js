import React from "react";
import "./Message.css";

const Message = ({ message, username }) => {
  return (
    <li
      key={message.id}
      className={`message${
        username === message.user ? "" : " message-reverse"
      }`}
    >
      <p className="message-text" key={message.id}>
        <strong>{message.user + " : "}</strong> <br />
        {message.data}
      </p>
    </li>
  );
};

export default Message;
