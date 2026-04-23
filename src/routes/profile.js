const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const userModel = require("../models/user");
const { validateProfileEditInfo } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("please login again");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isAllowed = await validateProfileEditInfo(req);
    if (!isAllowed) {
      throw new Error(
        "updating firstName,lastName,emailId,password,gender of these filed is not allowed if you want to change password visit to forget password",
      );
    } else {
      const user = req.user;
      await userModel.findByIdAndUpdate(user._id, {
        age: req.body.age || user.age,
        photoUrl: req.body.photoUrl || user.photoUrl,
        about: req.body.about || user.about,
        skills: req.body.skills || user.skills,
      });
      res.send("profile updated successfully");
    }
  } catch (err) {
    res.status(501).send(err.message);
  }
});

module.exports = profileRouter;
