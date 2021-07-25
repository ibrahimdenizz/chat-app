import React from "react";

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
    <div className="col-2 p-0 ">
      <div className="container  w-100 h-75 overflow-auto p-0">
        <ul className="list-group">
          {users
            .filter((user) => user.username !== username)
            .map((user) => (
              <li
                key={user._id}
                className="list-group-item list-group-item-action btn"
                onClick={() => onClick(user)}
              >
                <strong key={user._id}>{user.username}</strong>
                <div
                  className={` text-${
                    user.isOnline === true ? "success" : "danger"
                  }`}
                >
                  {user.isOnline === true ? "online" : "offline"}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default UsersList;
