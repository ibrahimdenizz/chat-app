import React from "react";
import MessageField from "./MessageField";
import TypeBar from "./TypeBar";

const MessageBox = ({
  messages,
  username,
  room,
  endOfChat,
  userTyping,
  sendMessage,
  onType,
}) => {
  return (
    <div className="col-8 p-0 h-100">
      <MessageField
        messages={messages}
        username={username}
        room={room}
        endOfChat={endOfChat}
        typer={userTyping}
      />
      <TypeBar sendMessage={sendMessage} onType={onType} />
    </div>
  );
};

export default MessageBox;
