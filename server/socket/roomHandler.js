const redis = require("../util/redis-queries");

module.exports = function (io, socket) {
  socket.on("join room", (room) => {
    socket.join(room);
    console.log("Join Room", socket.rooms);
  });

  socket.on("leave room", async (room) => {
    try {
      let currentUser = await redis.get(socket.id);
    } catch (error) {
      console.error(error);
    }
    socket.leave(room);
    console.log("Leave Room", socket.rooms);
    if (room && room.isPrivate) {
      io.to(room.id).emit("chat message", {
        data: "left",
        user: currentUser.username,
        room: socket.id,
      });
    } else if (room) {
      io.to(room.id).emit("chat message", {
        data: "left",
        user: currentUser.username,
        room: room.id,
      });
    }
  });
};
