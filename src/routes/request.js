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
          "not able to find the userId to person to whom you want to send request",
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
        return res.status(400).json({
          message: "alrady request has been sent",
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

module.exports = requestRouter;
