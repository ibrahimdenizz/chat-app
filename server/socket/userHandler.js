const redis = require("../util/redis-queries");

module.exports = function (io, socket) {
  socket.on("online user", async (user) => {
    try {
      await redis.setOnlineUser(user.username, user.socketId);
      const onlineUsers = await redis.getOnlineUsers();
      console.log("online", onlineUsers);
      io.emit("get online user", onlineUsers);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("get online user", async (get) => {
    try {
      const onlineUsers = await redis.getOnlineUsers();
      console.log("online", onlineUsers);
      io.emit("get online user", onlineUsers);
    } catch (error) {
      console.error(error);
    }
  });
};
