import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Drawer = ({
  onChangeRoom,
  rooms,
  onLeaveRoom,
  addRoom,
  setAddRoom,
  onAddRoom,
  activeRoom,
}) => {
  return (
    <div className="col-2 p-0  ">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Add Room"
          aria-label="Add Room"
          aria-describedby="button-add"
          value={addRoom}
          onChange={(e) => setAddRoom(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          id="button-add"
          onClick={onAddRoom}
        >
          Add
        </button>
      </div>
      <div className="container  w-100 h-75 overflow-auto p-0">
        <ul className="list-group d-flex">
          {rooms.map((room) => (
            <li
              key={room.id}
              onClick={() => onChangeRoom(room)}
              className={`list-group-item ${
                room.id === activeRoom.id ? "active" : ""
              } list-group-item-action btn`}
            >
              <div className=" container row w-100 text-break p-0 m-0">
                <div className="col-11 p-0">{room.name}</div>
                <div
                  className="btn col-1 p-0"
                  onClick={() => onLeaveRoom(room)}
                >
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
    </div>
  );
};
export default Drawer;
