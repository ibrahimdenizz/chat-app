import React from "react";

import "./Rooms.css";
import RoomsTypeBar from "./RoomsTypeBar";
import RoomsList from "./RoomsList";

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
    <div className="rooms-wrapper">
      <RoomsTypeBar
        addRoom={addRoom}
        setAddRoom={setAddRoom}
        onAddRoom={onAddRoom}
      />
      <RoomsList
        rooms={rooms}
        onChangeRoom={onChangeRoom}
        onLeaveRoom={onLeaveRoom}
        activeRoom={activeRoom}
      />
    </div>
  );
};
export default Drawer;
