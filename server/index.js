const config = require("config");
const express = require("express");
const path = require("path");
const { v4: uuid } = require("uuid");
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

function onConnection(socket) {
  let currentUser = {
    username: "",
    room: "",
  };

  socket.join("Public 1");
  socket.join("Public 2");

  chatHandler(io, socket, currentUser);
  userHandler(io, socket, currentUser);
  roomHandler(io, socket, currentUser);
  disconnectHandler(io, socket, currentUser);
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
