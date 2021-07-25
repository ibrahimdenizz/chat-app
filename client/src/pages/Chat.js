import { useEffect, useRef, useState } from "react";
import axios from "axios";
import config from "../config";
import Rooms from "../components/Rooms";
import UsersList from "../components/UsersList";
import MessageBox from "../components/MessageBox";

const USERS_ENDPOINT = config.URL + "/api/users";

var prevDate = Date.now();

const Chat = ({ username, socket }) => {
  const [messages, setMessages] = useState([]);
  const [activeRoom, setActiveRoom] = useState(1);
  const [userTyping, setUserTyping] = useState({});
  const [addRoom, setAddRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState(config.INIT_ROOM);

  const endOfChat = useRef();

  useEffect(() => {
    if (socket) {
      subscribeAll();
      socket.getOnlineUsers();
    }
  }, [socket]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(USERS_ENDPOINT);
        setUsers(data);
        setActiveRoom(config.INIT_ROOM[0]);
      } catch (err) {
        console.log(err?.response?.data?.message);
      }
    })();
  }, []);

  useEffect(() => {
    endOfChat.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, userTyping]);
  useEffect(() => {
    if (socket)
      socket.changeRoom({
        room: activeRoom.id,
        isPrivate: activeRoom.isPrivate ? true : false,
      });
  }, [activeRoom, socket]);

  return (
    <div className="row container h-100 py-5 ">
      <Rooms
        onChangeRoom={onChangeRoom}
        rooms={rooms}
        activeRoom={activeRoom}
        onLeaveRoom={onLeaveRoom}
        addRoom={addRoom}
        setAddRoom={setAddRoom}
        onAddRoom={onAddRoom}
      />
      <MessageBox
        messages={messages}
        username={username}
        activeRoom={activeRoom}
        endOfChat={endOfChat}
        userTyping={userTyping}
        sendMessage={sendMessage}
        onType={onType}
      />
      <UsersList
        users={users}
        socket={socket}
        setUsers={setUsers}
        rooms={rooms}
        setRooms={setRooms}
        username={username}
      />
    </div>
  );

  function subscribeAll() {
    socket.subscribe("chat message", (msg) => {
      setMessages((prevItems) => [...prevItems, msg]);
    });

    socket.subscribe("Typing", (user) => {
      if (user.user !== username) setUserTyping(() => user);
    });

    socket.subscribe("get online user", (onlineUsers) => {
      console.log("online", onlineUsers);
      setUsers((prevUsers) => {
        prevUsers.forEach((user) => {
          user.isOnline = false;
        });
        onlineUsers.forEach((user) => {
          prevUsers
            .filter((a) => a.username === user?.username)
            .forEach((user2) => {
              user2.isOnline = true;
              user2.socketId = user.socketId;
            });
        });

        return [...prevUsers];
      });
    });
  }

  function sendMessage(data) {
    socket.sendMessage({
      data,
      user: username,
      room: activeRoom.id,
      isPrivate: activeRoom.isPrivate ? true : false,
    });
    console.log(messages);
  }

  function onChangeRoom(room) {
    setActiveRoom(room);
  }

  function onType(msg) {
    if (msg !== "" && Date.now() - prevDate > 1000) {
      prevDate = Date.now();
      socket.onTyping({
        user: username,
        room: activeRoom.id,
        isPrivate: activeRoom.isPrivate ? true : false,
      });
    }
  }

  function onAddRoom() {
    const index = users.findIndex((user) => user.username === addRoom);

    if (addRoom !== "" && index === -1) {
      socket.joinRoom(addRoom);
      setRooms((prevRooms) => [...prevRooms, { id: addRoom, name: addRoom }]);
      setAddRoom("");
    }
  }

  function onLeaveRoom(room) {
    setRooms((prevRooms) => {
      const index = prevRooms.findIndex((prevRoom) => prevRoom.id === room.id);
      prevRooms.splice(index, 1);
      return prevRooms;
    });
    setActiveRoom(1);
    socket.leaveRoom(room);
  }
};

export default Chat;
