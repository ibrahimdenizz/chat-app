const redis = require("../util/redis-queries");
const { v4: uuid } = require("uuid");

module.exports = function (io, socket) {
  socket.on("disconnect", async () => {
    try {
      let currentUser = await redis.getUser(socket.id);
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
        await redis.delUser(socket.id);
        const onlineUsers = await redis.getOnlineUsers();
        console.log("online", onlineUsers);
        io.emit("get online user", onlineUsers);
      }
    } catch (error) {
      console.error(error);
    }
  });
};
