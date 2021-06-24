const cors = require("cors");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const redis = require("./util/redis-queries");

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

  socket.on("disconnect", async () => {
    if (currentUser) {
      console.log("message : left ", currentUser, msgId);
      if (currentUser.room) {
        io.emit("chat message", {
          data: "left",
          user: currentUser.username,
          room: currentUser.room,
          id: msgId,
        });
        msgId++;
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
