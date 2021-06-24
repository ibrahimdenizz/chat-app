module.exports = function (io, socket, currentUser) {
  socket.on("join room", (room) => {
    socket.join(room);
    console.log("Join Room", socket.rooms);
  });

  socket.on("leave room", (room) => {
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
