import React from "react";
import MessageField from "./MessageField";
import MessageTypeBar from "./MessageTypeBar";
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
      <MessageTypeBar sendMessage={sendMessage} onType={onType} />
    </div>
  );
};

export default MessageBox;
