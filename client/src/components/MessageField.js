import React from "react";
import Message from "./common/Message/Message";
import "./MessageField.css";

function MessageField({ messages, username, activeRoom, endOfChat, typer }) {
  return (
    <div className="message-field-wrapper">
      <ul className="message-field-list">
        {messages
          .filter((msg) => msg.room === activeRoom.id)
          .map((msg) => (
            <Message key={msg.id} message={msg} username={username} />
          ))}{" "}
        {typer && typer.user !== "" && typer.room === activeRoom.id ? (
          <p>{typer.user} typing</p>
        ) : null}
        <p ref={endOfChat}></p>
      </ul>
    </div>
  );
}

export default MessageField;
