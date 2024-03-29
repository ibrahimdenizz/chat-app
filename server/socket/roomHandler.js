const redis = require("../util/redis-queries");

module.exports = function (io, socket) {
  socket.on("join room", (room) => {
    socket.join(room);
    console.log("Join Room", socket.rooms);
  });

  socket.on("change room", async ({ room, isPrivate }) => {
    try {
      const user = await redis.updateUser(socket.id, room);
      io.to(room).emit("chat message", {
        data: "joined",
        user: user.username,
        room: room,
        isPrivate,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("leave room", async (room) => {
    let currentUser;
    try {
      currentUser = await redis.get(socket.id);
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
