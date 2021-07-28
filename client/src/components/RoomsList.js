import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./RoomsList.css";

const RoomsList = ({ rooms, onChangeRoom, onLeaveRoom, activeRoom }) => {
  return (
    <div className="rooms-list-wrapper">
      <ul className="rooms-list">
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => onChangeRoom(room)}
            className={`rooms-list-item ${
              room.id === activeRoom.id ? "active" : ""
            }`}
          >
            <div className="content">
              <div className="name">{room.name}</div>
              <div className="icon" onClick={() => onLeaveRoom(room)}>
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{
                    color: room.id === activeRoom.id ? "white" : "black",
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomsList;
