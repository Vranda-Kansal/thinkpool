const express = require("express");
const connectDB = require("./config/database.js");
const userModel = require("./models/user.js");
const { validateSignUp } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const validator = require("validator");

const app = express();
app.use(express.json());

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server connected");
    });
  })
  .catch((err) => console.log(err));

app.post("/signup", async (req, res) => {
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
    res.send("user added sucessfully");
  } catch (err) {
    res.status(501).send(err.message);
  }
});

//login via email and password
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("enter a valid email");
    }
    const user = await userModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credential");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      res.send("login successful");
    }
  } catch (err) {
    res.status(501).send(err.message);
  }
});

//get all the users from db - get /feed

app.get("/feed", async (req, res) => {
  try {
    const allUsers = await userModel.find({});
    res.send(allUsers);
  } catch (err) {
    res.status(501).send("Failed to get all users");
  }
});

//get user by emailId
app.get("/user", async (req, res) => {
  const userEmailId = req?.body?.emailId;
  try {
    const user = await userModel.findOne({ emailId: userEmailId });
    if (!user) {
      res.status(400).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("not able to find the user");
  }
});

//delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await userModel.findByIdAndDelete(userId);
    res.send("user has been delted successfully");
  } catch (err) {
    res.status(400).send("unable to delete a user");
  }
});

//update a user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_FIELDS = ["photoUrl", "about", "skills", "age", "gender"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_FIELDS.includes(k),
    );

    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("skills can't be more than 10");
    }
    const user = await userModel.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    res.status(400).send("update failed" + err.message);
  }
});
