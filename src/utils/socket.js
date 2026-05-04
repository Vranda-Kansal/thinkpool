const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.FRONTED_URL,
    },
  });

  io.on("connection", (socket) => {
    //handle the events
    socket.on("joinChat", ({ userId, toUserId }) => {
      console.log(userId, toUserId);
      const roomId = [userId, toUserId].sort().join("_");
      console.log(roomId);
      socket.join(roomId);
      const room = io.sockets.adapter.rooms.get(roomId);
      const bothOnline = room && room.size === 2;

      // tell everyone in room the current status
      io.to(roomId).emit("roomStatus", { bothOnline });
    });

    socket.on(
      "sendMessage",
      ({ senderName, profilePhoto, userId, toUserId, text, timestamp }) => {
        const roomId = [userId, toUserId].sort().join("_");
        console.log("sendMessage", roomId);
        io.to(roomId).emit("messageReceived", {
          senderName,
          profilePhoto,
          text,
          whosendIt: userId,
          timestamp,
        });
      },
    );

    socket.on("disconnecting", () => {
      socket.rooms.forEach((roomId) => {
        socket.to(roomId).emit("roomStatus", { bothOnline: false });
      });
    });

    socket.on("disconnect", () => {
      console.log("disconnected:", socket.id);
    });
  });
};
module.exports = initializeSocket;
