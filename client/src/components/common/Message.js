import React from "react";

const Message = ({ message, username }) => {
  return (
    <li
      key={message.id}
      className={`list-group-item m-2 w-100 d-flex flex-row${
        username === message.user ? "-reverse" : ""
      }`}
    >
      <p
        className={`w-75 text-break text-${
          username === message.user ? "right" : "left"
        }`}
        key={message.id}
      >
        <strong>{message.user + " : "}</strong> <br />
        {message.data}
      </p>
    </li>
  );
};

export default Message;
