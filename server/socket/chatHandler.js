const { v4: uuid } = require("uuid");

module.exports = function (io, socket, currentUser) {
  socket.on("chat message", (msg) => {
    const msgId = uuid();
    if (msg.data == "joined") {
      currentUser.username = msg.user;
      currentUser.room = msg.room;
    }
    if (msg.isPrivate) {
      console.log("Private Message : ", msg, msgId);
      io.to(socket.id).emit("chat message", { ...msg, id: msgId });
      const receiver = msg.room;
      msg.room = socket.id;
      io.to(receiver).emit("chat message", { ...msg, id: msgId });
    } else {
      console.log("Room Message : ", msg, msgId);
      io.to(msg.room).emit("chat message", { ...msg, id: msgId });
    }
  });

  socket.on("Typing", (user) => {
    console.log("Typing : ", user);
    if (user.isPrivate) {
      io.to(socket.id).emit("Typing", user);
      const receiver = user.room;
      user.room = socket.id;
      io.to(receiver).emit("Typing", user);
    } else {
      io.to(user.room).emit("Typing", user);
    }
  });
};
