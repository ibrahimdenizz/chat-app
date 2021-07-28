import React from "react";
import MessageField from "./MessageField";
import TypeBar from "./TypeBar";
import "./MessageBox.css";

const MessageBox = ({
  messages,
  username,
  activeRoom,
  endOfChat,
  userTyping,
  sendMessage,
  onType,
}) => {
  return (
    <div className="message-box-wrapper">
      <MessageField
        messages={messages}
        username={username}
        activeRoom={activeRoom}
        endOfChat={endOfChat}
        typer={userTyping}
      />
      <TypeBar sendMessage={sendMessage} onType={onType} />
    </div>
  );
};

export default MessageBox;
