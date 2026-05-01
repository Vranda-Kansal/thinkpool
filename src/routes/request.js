const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userModel = require("../models/user");
const { Connection } = require("../models/connectionRequest");
const requestRouter = express.Router();

//i have to create a request api
// user can send the intersted connection request to other user
// user can pass the conenction requests received from other user
requestRouter.post(
  "/request/send/:status/:ToUserId",
  userAuth,
  async (req, res) => {
    try {
      const ToUserId = req.params.ToUserId;
      const status = req.params.status;
      const fromUserId = req.user._id;

      if (!ToUserId) {
        throw new Error(
          "not able to find the userId of person to whom you want to send request",
        );
      }

      const ALLOWED_STATUS = ["pass", "like"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.json({ message: "status invalid" });
      }

      const data = await userModel.findById(ToUserId);
      if (!data) {
        return res.status(400).json("no user found in our DB");
      }
      const alreadysentConnection = await Connection.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: ToUserId },
          { fromUserId: ToUserId, toUserId: fromUserId },
        ],
      });
      if (alreadysentConnection) {
        return res.status(404).json({
          message: "Connection already exists",
          data: alreadysentConnection,
        });
      }
      const Connectionreq = new Connection({
        fromUserId: fromUserId,
        status: status,
        toUserId: ToUserId,
      });
      const genreatedReq = await Connectionreq.save();
      res.json({
        message: `Successfully a connection request has been sent by ${req.user.firstName} to ${data.firstName}`,
        data: genreatedReq,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
);

//i have to write a api where user can either accept the request or reject the request
//like he is clicking on single request and review it now he can either accept it or reject it
//anyone can either accept o reject a single request
//status - accepted, rejected

requestRouter.post(
  "/request/review/:status/:connectionId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, connectionId } = req.params;

      const ALLOWED_STATUS = ["accepted", "rejected"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ message: "Status is not valid" });
      }
      const connectionReq = await Connection.findOne({
        _id: connectionId,
        toUserId: loggedInUser._id,
        status: "like",
      });
      if (!connectionReq) {
        return res
          .status(400)
          .json({ message: "No such connection request has been found" });
      }
      connectionReq.status = status;
      await connectionReq.save();
      res.json({
        message: "connection request has been " + status,
        data: connectionReq,
      });
    } catch (err) {
      res.status(400).json(err.message);
    }
  },
);

module.exports = requestRouter;
