const { v4: uuid } = require("uuid");
const redis = require("../util/redis-queries");

module.exports = function (io, socket) {
  socket.on("chat message", async (msg) => {
    const msgId = uuid();
    let currentUser = redis.getUser(socket.id);
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
