import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Drawer = ({ onChangeRoom, rooms, onLeaveRoom }) => {
  return (
    <div className="container  w-100 h-75 overflow-auto p-0">
      <ul className="list-group d-flex">
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => onChangeRoom(room)}
            className="list-group-item list-group-item-action btn"
          >
            <div className=" container row w-100 text-break p-0 m-0">
              <div className="col-11 p-0">{room.name}</div>
              <div className="btn col-1 p-0" onClick={() => onLeaveRoom(room)}>
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Drawer;
