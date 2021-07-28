import React from "react";

import "./Rooms.css";
import RoomsField from "./RoomsField";
import RoomsTypeBar from "./RoomsTypeBar";

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
      <RoomsField
        addRoom={addRoom}
        setAddRoom={setAddRoom}
        onAddRoom={onAddRoom}
      />
      <RoomsTypeBar
        rooms={rooms}
        onChangeRoom={onChangeRoom}
        onLeaveRoom={onLeaveRoom}
        activeRoom={activeRoom}
      />
    </div>
  );
};
export default Drawer;
