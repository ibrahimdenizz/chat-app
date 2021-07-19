import { io } from "socket.io-client";

class Socket {
  constructor(url, user) {
    this.socket = io(url, {
      query: {
        user: JSON.stringify(user),
      },
    });
  }

  subscribe(type, listener) {
    this.socket.on(type, listener);
  }

  sendMessage(msg) {
    this.socket.emit("chat message", msg);
  }

  getOnlineUsers() {
    this.socket.emit("get online user");
  }

  changeRoom(room) {
    this.socket.emit("change room", room);
  }

  onTyping(user) {
    this.socket.emit("Typing", user);
  }

  joinRoom(room) {
    this.socket.emit("join room", room);
  }

  leaveRoom(room) {
    this.socket.emit("leave room", room);
  }
}

export default Socket;
