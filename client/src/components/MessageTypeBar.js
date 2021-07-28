import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import Picker from "emoji-picker-react";
import "./MessageTypeBar.css";

function TypeBar({ sendMessage, onType }) {
  const [msg, setMsg] = useState("");
  const [openPicker, setOpenPicker] = useState(0);
  const inputRef = useRef();

  const onClick = (e) => {
    if (msg !== "") sendMessage(msg);
    setMsg("");
    inputRef.current.focus();
  };

  const onEmojiClick = (event, emojiObject) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
  };

  const onOpenPicker = () => {
    setOpenPicker((prevValue) => {
      if (prevValue === 1) return 0;
      return 1;
    });
  };

  return (
    <>
      <div className=" message-typebar-wrapper ">
        <div className="message-typebar-btn" onClick={onOpenPicker}>
          <FontAwesomeIcon icon={faSmile} />
        </div>

        <input
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
            onType(e.target.value);
          }}
          type="text"
          className="message-typebar-field"
          autoFocus
          ref={inputRef}
        />
        <button
          className="message-typebar-btn message-typebar-send-btn"
          onClick={onClick}
        >
          Send
        </button>
      </div>
      {openPicker ? (
        <div className="message-typebar-picker">
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default TypeBar;
