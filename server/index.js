const config = require("config");
const express = require("express");
const path = require("path");
const redis = require("./util/redis-queries");

const chatHandler = require("./socket/chatHandler");
const userHandler = require("./socket/userHandler");
const roomHandler = require("./socket/roomHandler");
const disconnectHandler = require("./socket/disconnectHandler");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: config.get("url"),
    methods: ["GET", "POST"],
  },
});

require("./start/db")();
require("./start/prod")(app);
require("./start/routes")(app);

io.on("connection", onConnection);

async function onConnection(socket) {
  socket.join("Public 1");
  socket.join("Public 2");

  try {
    const user = JSON.parse(socket.handshake.query.user);
    user.socketId = socket.id;
    await redis.setUser(user);
    const onlineUsers = await redis.getOnlineUsers();
    console.log("online users", onlineUsers);
    io.emit("get online user", onlineUsers);
  } catch (error) {
    console.error(error);
  }

  chatHandler(io, socket);
  userHandler(io, socket);
  roomHandler(io, socket);
  disconnectHandler(io, socket);
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

http.listen(port, () => {
  console.log(`Listening ${port}`);
});
