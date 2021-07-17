import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Rooms from "../components/Rooms";
import MessageBox from "../components/MessageBox";
import TypeBar from "../components/TypeBar";
import UsersList from "../components/UsersList";

const URL =
  process.env.NODE_ENV === "production"
    ? "/api/users"
    : "http://localhost:5000/api/users";

let date = Date.now();

const Chat = ({ username, socket }) => {
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(1);
  const [userTyping, setUserTyping] = useState({});
  const [addRoom, setAddRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([
    {
      id: "Public 1",
      name: "Public 1",
    },
    {
      id: "Public 2",
      name: "Public 2",
    },
  ]);

  const endOfChat = useRef();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(URL);
        setUsers(data);
        setRoom({
          id: "Public 1",
          name: "Public 1",
        });
      } catch (err) {
        console.log(err?.response?.data?.message);
      }
      socket.emit("online user", { username, socketId: socket.id, room });
    })();
  }, []);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevItems) => [...prevItems, msg]);
    });
    socket.on("Typing", (user) => {
      if (user.user !== username) setUserTyping(() => user);
    });
    setInterval(() => {
      setUserTyping({});
    }, 7000);
  }, []);
  useEffect(() => {
    endOfChat.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, userTyping]);
  useEffect(() => {
    socket.emit("change room", {
      room: room.id,
      isPrivate: room.isPrivate ? true : false,
    });
  }, [room]);

  return (
    <div className="row container h-100 py-5 ">
      <div className="col-2 p-0  ">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Add Room"
            aria-label="Add Room"
            aria-describedby="button-add"
            value={addRoom}
            onChange={(e) => setAddRoom(e.target.value)}
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="button-add"
            onClick={onAddRoom}
          >
            Add
          </button>
        </div>
        <Rooms
          onChangeRoom={onChangeRoom}
          rooms={rooms}
          onLeaveRoom={onLeaveRoom}
        />
      </div>
      <div className="col-8 p-0 h-100">
        <MessageBox
          messages={messages}
          username={username}
          room={room}
          endOfChat={endOfChat}
          typer={userTyping}
        />
        <TypeBar sendMessage={sendMessage} onType={onType} />
      </div>
      <div className="col-2 p-0 ">
        <UsersList
          users={users}
          socket={socket}
          setUsers={setUsers}
          rooms={rooms}
          setRooms={setRooms}
          username={username}
        />
      </div>
    </div>
  );

  function sendMessage(data) {
    socket.emit("chat message", {
      data,
      user: username,
      room: room.id,
      isPrivate: room.isPrivate ? true : false,
    });
    console.log(messages);
  }

  function onChangeRoom(room) {
    setRoom(room);
  }

  function onType(msg) {
    if (msg !== "" && Date.now() - date > 1000) {
      date = Date.now();
      socket.emit("Typing", {
        user: username,
        room: room.id,
        isPrivate: room.isPrivate ? true : false,
      });
    }
  }

  function onAddRoom() {
    const index = users.findIndex((user) => user.username === addRoom);

    if (addRoom !== "" && index === -1) {
      socket.emit("join room", addRoom);
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
    setRoom(1);
    socket.emit("leave room", room);
  }
};

export default Chat;
