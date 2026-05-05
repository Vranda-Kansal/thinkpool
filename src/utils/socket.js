const socket = require("socket.io");
const { userAuth } = require("../middlewares/auth");
const { Connection } = require("../models/connectionRequest");
const ChatModel = require("../models/chat");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.FRONTED_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookie = socket.handshake.headers.cookie;
      const token = cookie?.split("token=")[1];
      if (!token) throw new Error("you are not logged in. please login");

      const decoded = jwt.verify(token, process.env.SECRET);

      const user = await userModel.findById(decoded._id);
      if (!user) throw new Error("User not found");

      socket.user = user;

      next();
    } catch (err) {
      // Error pass karo — connection reject ho jaayega
      next(new Error(err.message));
    }
  });

  io.on("connection", (socket) => {
    //handle the events
    socket.on("joinChat", ({ userId, toUserId }) => {
      const roomId = [userId, toUserId].sort().join("_");
      socket.join(roomId);
      const room = io.sockets.adapter.rooms.get(roomId);
      const bothOnline = room && room.size === 2;

      // tell everyone in room the current status
      io.to(roomId).emit("roomStatus", { bothOnline });
    });

    socket.on("sendMessage", async ({ userId, toUserId, newMessage }) => {
      try {
        if (!userId) {
          throw new Error("please login again");
        }
        if (userId !== socket?.user?._id.toString()) {
          throw new Error("unauthorzied user. login again");
        }

        if (!toUserId || !newMessage?.trim()) {
          throw new Error("toUserId or new Message is empty");
        }
        if (toUserId.toString() === userId.toString()) {
          throw new Error("cannot send message to yourself");
        }

        const isFriends = await Connection.findOne({
          $and: [
            {
              $or: [
                { fromUserId: userId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: userId },
              ],
            },
            {
              status: "accepted",
            },
          ],
        });

        if (!isFriends) {
          throw new Error("you are not friends please send them request");
        }
        const roomId = [userId, toUserId].sort().join("_");

        let conversation = await ChatModel.findOne({
          members: { $all: [userId, toUserId] },
        });

        if (!conversation) {
          conversation = new ChatModel({
            members: [userId, toUserId],
            messages: [],
          });
        }

        conversation.messages.push({
          senderId: userId,
          text: newMessage,
        });

        await conversation.save();
        await conversation.populate(
          "messages.senderId",
          "photoUrl firstName lastName",
        );

        const last = conversation.messages[conversation?.messages?.length - 1];
        const { firstName, photoUrl, lastName, _id } = last?.senderId;

        io.to(roomId).emit("messageReceived", {
          firstName: firstName,
          lastName: lastName || "",
          profilePhoto: photoUrl,
          text: last?.text,
          whosendIt: _id,
          timestamp: last?.createdAt,
        });
      } catch (err) {
        console.log(err);
      }
    });

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
