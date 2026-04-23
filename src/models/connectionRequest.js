const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["pass", "like", "accepted", "rejected"],
        message: "{VALUE} is not present",
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.pre("save", function (req, res) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("you can't send the request to yourself");
  }
});

const Connection = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = { Connection };
