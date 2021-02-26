import React, { useEffect } from "react";

const UsersList = ({ users, socket, setUsers, rooms, setRooms, username }) => {
  useEffect(() => {
    socket.on("get online user", (onlineUsers) => {
      setUsers((prevUsers) => {
        prevUsers.map((user) => {
          user.isOnline = false;
          user.socketId = 0;
        });
        onlineUsers.map((user) => {
          prevUsers
            .filter((a) => a.username === user.username)
            .map((user2) => {
              user2.isOnline = true;
              user2.socketId = user.socketId;
            });
        });

        return prevUsers;
      });
    });
  }, []);

  useEffect(() => {
    socket.emit("get online user", "get");
  }, [users]);

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
  );
};

export default UsersList;
