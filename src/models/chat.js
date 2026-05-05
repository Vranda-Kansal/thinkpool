const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const chatSchema = new Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
  ],
  messages: [messageSchema],
});
const ChatModel = mongoose.model("Chat", chatSchema);
module.exports = ChatModel;
