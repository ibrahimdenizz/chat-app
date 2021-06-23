const cors = require("cors");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const redis = require("redis");

const users = require("./routers/users");
const auth = require("./routers/auth");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: config.get("url"),
    methods: ["GET", "POST"],
  },
});

const redisClient = redis.createClient(process.env.redis_uri);
redisClient.on("error", function (error) {
  console.error(error);
});
redisClient.set("test", "Connect Redis");
redisClient.get("test", (err, rep) => console.log(rep));

mongoose
  .connect(config.get("db_uri"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect Db");
  });

const corsOptions = {
  origin: config.get("url"),
  optionSuccessStatus: 200,
};
app.use(helmet());
app.use(morgan("common"));
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/users", users);
app.use("/api/auth", auth);

let msgId = 0;
const onlineUsers = [];

io.on("connection", (socket) => {
  console.log("connect");
  let currentUser;

  socket.join("Public 1");
  socket.join("Public 2");

  socket.on("chat message", (msg) => {
    if (msg.data == "joined")
      currentUser = {
        username: msg.user,
        room: msg.room,
      };
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
    msgId++;
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

  socket.on("online user", (user) => {
    const index = onlineUsers.findIndex((a) => a.username === user.username);
    if (index === -1) {
      onlineUsers.push(user);
      console.log("Online", user, onlineUsers);
    }
  });

  socket.on("get online user", (get) => {
    console.log("Online", onlineUsers);
    io.emit("get online user", onlineUsers);
  });

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

  socket.on("disconnect", () => {
    if (currentUser) {
      console.log("message : left ", currentUser, msgId);
      io.emit("chat message", {
        data: "left",
        user: currentUser.username,
        room: currentUser.room,
        id: msgId,
      });
      msgId++;
      const index = onlineUsers.findIndex(
        (a) => a.username === currentUser.username
      );
      onlineUsers.splice(index, 1);
      io.emit("get online user", onlineUsers);
    }
  });
});

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
