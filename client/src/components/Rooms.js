import React from "react";

import "./Rooms.css";
import RoomsField from "./RoomsField";
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
      <RoomsField
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
