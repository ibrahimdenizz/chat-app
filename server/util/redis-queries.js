const { json } = require("express");
const redis = require("redis");
const redisClient = redis.createClient(process.env.redis_uri);

redisClient.on("error", function (error) {
  console.error(error);
});
redisClient.on("connect", () => {
  redisClient.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
  });
  console.log("Connect Redis");
});

// Queries

function getOnlineUsers() {
  return new Promise((resolve, reject) => {
    try {
      redisClient.keys("*", (err, socketIdReply) => {
        if (!Array.isArray(socketIdReply)) socketIdReply = [socketIdReply];
        redisClient.mget(socketIdReply, (err, userReply) => {
          if (!Array.isArray(userReply)) {
            if (!userReply) reject("Not found any users");
            else
              resolve({ socketId: socketIdReply[index], ...JSON.parse(user) });
          } else {
            let onlineUsers = userReply.map((user, index) => {
              return { socketId: socketIdReply[index], ...JSON.parse(user) };
            });
            resolve(onlineUsers);
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getUser(socketId) {
  return new Promise((resolve, reject) => {
    redisClient.get(socketId, (err, reply) => {
      if (reply) resolve({ socketId, ...JSON.parse(reply) });
      else reject("User not found");
    });
  });
}

function setUser(user) {
  return new Promise((resolve, reject) => {
    redisClient.get(user.socketId, (err, reply) => {
      if (!reply) {
        redisClient.set(
          user.socketId,
          JSON.stringify({
            username: user.username,
            room: user.room,
          })
        );
        resolve(user.username);
      } else {
        reject("User already online");
      }
    });
  });
}

function delUser(socketId) {
  return new Promise((resolve, reject) => {
    redisClient.del(socketId, (err, reply) => {
      redisClient.get(socketId, (err, reply) => {
        if (reply) reject("User can't be deleted");
        else resolve(socketId);
      });
    });
  });
}

module.exports = {
  ...redisClient,
  getOnlineUsers,
  getUser,
  setUser,
  delUser,
};
