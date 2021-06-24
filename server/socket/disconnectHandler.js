const redis = require("../util/redis-queries");

module.exports = function (io, socket, currentUser) {
  socket.on("disconnect", async () => {
    if (currentUser) {
      console.log("message : left ", currentUser);
      if (currentUser.room) {
        io.emit("chat message", {
          data: "left",
          user: currentUser.username,
          room: currentUser.room,
          id: uuid(),
        });
      }
      try {
        await redis.delOnlineUser(currentUser.username);
        const onlineUsers = await redis.getOnlineUsers();
        console.log("online", onlineUsers);
        io.emit("get online user", onlineUsers);
      } catch (error) {
        console.error(error);
      }
    }
  });
};
