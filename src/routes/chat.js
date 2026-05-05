const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ChatModel = require("../models/chat");
const { Connection } = require("../models/connectionRequest");
const chatRouter = express.Router();

chatRouter.get("/getchat/:toUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { toUserId } = req.params;
    if (!toUserId) {
      throw new Error("with whom you want to chat is not there");
    }
    let conversation = await ChatModel.findOne({
      members: { $all: [userId, toUserId] },
    });
    if (!conversation) {
      conversation = new ChatModel({
        members: [userId, toUserId],
        messages: [],
      });
      await conversation.save();
    }
    await conversation.populate(
      "messages.senderId",
      "firstName lastName photoUrl _id",
    );

    res.json({
      data: conversation?.messages,
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = chatRouter;
