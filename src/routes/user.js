const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { Connection } = require("../models/connectionRequest");

userRouter.get("/user/received/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allrequests = await Connection.find({
      toUserId: loggedInUser._id,
      status: "like",
    });
    if (!allrequests) {
      return res.json({ message: "no any pending requests" });
    }
    res.json({ data: allrequests });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
