const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const validator = require("validator");
const { validateSignUp } = require("../utils/validation.js");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    validateSignUp(req);

    const hashpassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: hashpassword,
    });
    await user.save();
    const token = await user.getJwtToken();
    res.cookie("token", token);
    res.json({
      message: "Sign Up successful",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//login via email and password
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("enter a valid email");
    }
    const user = await userModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found! please Sign Up");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      const token = await user.getJwtToken();
      const {
        _id,
        firstName,
        lastName,
        role,
        linkedIn,
        photoUrl,
        emailId,
        about,
        skills,
      } = user.toObject();
      res.cookie("token", token);
      res.json({
        message: "login successful",
        data: {
          _id,
          firstName,
          lastName,
          role,
          linkedIn,
          photoUrl,
          emailId,
          about,
          skills,
        },
      });
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("first login then you can logout");
    }
    res.clearCookie("token");
    res.json({
      message: "Logout successful",
    });
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = authRouter;
