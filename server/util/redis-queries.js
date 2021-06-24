const redis = require("redis");
const redisClient = redis.createClient(process.env.redis_uri);

redisClient.on("error", function (error) {
  console.error(error);
});
redisClient.on("connect", () => console.log("Connect Redis"));

// Queries

function getOnlineUsers() {
  return new Promise((resolve, reject) => {
    try {
      redisClient.keys("*", (err, usernameReply) => {
        if (!Array.isArray(usernameReply)) usernameReply = [usernameReply];
        redisClient.mget(usernameReply, (err, socketIdReply) => {
          if (!Array.isArray(socketIdReply)) socketIdReply = [socketIdReply];
          let onlineUsers = socketIdReply.map((socketId, index) => {
            return { username: usernameReply[index], socketId };
          });
          resolve(onlineUsers);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

function setOnlineUser(username, socketId) {
  return new Promise((resolve, reject) => {
    redisClient.get(username, (err, reply) => {
      if (!reply) {
        redisClient.set(username, socketId);
        resolve(username);
      } else {
        reject("User already online");
      }
    });
  });
}

function delOnlineUser(username) {
  return new Promise((resolve, reject) => {
    redisClient.del(username, (err, reply) => {
      redisClient.get(username, (err, reply) => {
        if (reply) reject("User can't be deleted");
        else resolve(username);
      });
    });
  });
}

module.exports = {
  ...redisClient,
  getOnlineUsers,
  setOnlineUser,
  delOnlineUser,
};
