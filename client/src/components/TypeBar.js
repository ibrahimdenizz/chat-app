import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faSmileBeam,
  faSmileWink,
} from "@fortawesome/free-solid-svg-icons";
import Picker from "emoji-picker-react";

function TypeBar({ sendMessage, onType }) {
  const [msg, setMsg] = useState("");
  const [openPicker, setOpenPicker] = useState(0);
  const inputRef = useRef();

  const onSumbit = (e) => {
    e.preventDefault();
    if (msg !== "") sendMessage(msg);
    setMsg("");
    inputRef.current.focus();
  };

  const onEmojiClick = (event, emojiObject) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
  };

  const onOpenPicker = () => {
    setOpenPicker((prevValue) => {
      if (prevValue == 1) return 0;
      return 1;
    });
  };

  return (
    <div className="position-relative">
      <form onSubmit={onSumbit} className="form-group p-0   ">
        <div className="row w-100 input-group mb-3 d-flex m-0 p-0 ">
          <div className="btn btn-outline-primary col-1" onClick={onOpenPicker}>
            <FontAwesomeIcon icon={faSmile} />
          </div>

          <input
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
              onType(e.target.value);
            }}
            type="text"
            className="form-control col-8"
            autoFocus
            ref={inputRef}
          />
          <button type="submit" className="btn btn-outline-primary col-3">
            Send
          </button>
        </div>
      </form>
      {openPicker ? <Picker onEmojiClick={onEmojiClick} /> : ""}
    </div>
  );
}

export default TypeBar;
