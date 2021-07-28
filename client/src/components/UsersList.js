import React from "react";
import "./UsersList.css";

const UsersList = ({ users, socket, setUsers, rooms, setRooms, username }) => {
  const onClick = (user) => {
    if (user.isOnline === true) {
      const index = rooms.findIndex((a) => a.name === user.username);
      if (index === -1) {
        console.log(user);
        setRooms((prevRooms) => [
          ...prevRooms,
          { name: user.username, id: user.socketId, isPrivate: true },
        ]);
      }
    }
  };

  return (
    <div className="user-list-wrapper">
      <ul className="user-list">
        {users
          .filter((user) => user.username !== username)
          .map((user) => (
            <li
              key={user._id}
              className="user-list-item"
              onClick={() => onClick(user)}
            >
              <strong key={user._id}>{user.username}</strong>
              <div
                className={`${
                  user.isOnline === true ? "online-user" : "offline-user"
                }`}
              >
                {user.isOnline === true ? "online" : "offline"}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UsersList;
