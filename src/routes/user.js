const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { Connection } = require("../models/connectionRequest");

//get all the received connection request for the user
userRouter.get("/user/received/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allrequests = await Connection.find({
      toUserId: loggedInUser._id,
      status: "like",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ]);
    if (!allrequests) {
      return res.json({ message: "no any pending requests" });
    }
    res.json({ data: allrequests });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//now this api is to get to know all the user which accepted my request
//basically list of my friends or connections (who accepted my request for whom i accepted)
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const friendsList = await Connection.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills",
      ]);
    if (!friendsList) {
      return res.json({
        message: "No developer connects till now, please explore feed",
      });
    }

    const data = friendsList?.map((friend) => {
      if (friend.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return friend.toUserId;
      }
      return friend.fromUserId;
    });
    res.json({
      message: "here is your friend list",
      data: data,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
