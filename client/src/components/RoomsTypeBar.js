import React from "react";

const RoomsField = ({ addRoom, setAddRoom, onAddRoom }) => {
  return (
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
  );
};

export default RoomsField;
