const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { Connection } = require("../models/connectionRequest");
const userModel = require("../models/user");

//get all the received connection request for the user
userRouter.get("/user/received/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allrequests = await Connection.find({
      toUserId: loggedInUser._id,
      status: "like",
    }).populate("fromUserId", [
      "_id",
      "firstName",
      "lastName",
      "role",
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
        "_id",
        "firstName",
        "lastName",
        "role",
        "photoUrl",
        "about",
        "skills",
        "linkedIn",
      ])
      .populate("toUserId", [
        "_id",
        "firstName",
        "lastName",
        "role",
        "photoUrl",
        "about",
        "skills",
        "linkedIn",
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
      message: "your friend list",
      data: data,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// feed api-> all the users whose card can user see
//1. user cannot see the card of himself
//2. user cannot see the card of the persons to whom he like or already send request
//3. user cannot see the card of the persons whom he pass or ignore
//4. can't of the users who show interest in him and send the req
//5. not of users who either reject or accept him

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 30 ? 30 : limit;
    const skip = (page - 1) * limit;

    const connectionEvrMade = await Connection.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hideFromUsers = new Set();

    hideFromUsers.add(loggedInUser?._id.toString());
    connectionEvrMade.forEach((req) => {
      hideFromUsers.add(req.fromUserId.toString());
      hideFromUsers.add(req.toUserId.toString());
    });
    const feedUsers = await userModel
      .find({
        _id: { $nin: Array.from(hideFromUsers) },
      })
      .select("firstName lastName role linkedIn photoUrl emailId about skills")
      .skip(skip)
      .limit(limit);

    res.json({ data: feedUsers });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
