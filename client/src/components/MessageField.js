import React from "react";
import Message from "./common/Message";

function MessageField({ messages, username, room, endOfChat, typer }) {
  return (
    <div className="container border border-black w-100 h-75 overflow-auto">
      <ul className="list-group w-100 h-100 list-group-flush ">
        {messages
          .filter((msg) => msg.room === room.id)
          .map((msg) => (
            <Message key={msg.id} message={msg} username={username} />
          ))}{" "}
        {typer && typer.user !== "" && typer.room === room.id ? (
          <p>{typer.user} typing</p>
        ) : null}
        <p ref={endOfChat}></p>
      </ul>
    </div>
  );
}

export default MessageField;
