const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const userModel = require("../models/user");
const { validateProfileEditInfo } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      message: "user profile",
      data: user,
    });
  } catch (err) {
    res.status(401).send("please login again");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isAllowed = await validateProfileEditInfo(req);
    if (!isAllowed) {
      throw new Error("updating firstName, emailId, password is not allowed");
    } else {
      const user = req.user;
      const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        {
          role: req.body?.role || user.role,
          photoUrl: req.body?.photoUrl || user.photoUrl,
          about: req.body?.about || user.about,
          skills: req.body?.skills || user?.skills,
          linkedIn: req.body?.linkedIn || user?.linkedIn,
          lastName: req.body?.lastName || user?.lastName,
        },
        { returnDocument: true },
      );
      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "User not found", data: updatedUser });
      }
      res.json({
        message: "profile updated successfully",
        data: updatedUser,
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = profileRouter;
