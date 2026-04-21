const express = require("express");
const connectDB = require("./config/database.js");
const userModel = require("./models/user.js");

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
  try {
    const user = new userModel(req.body);
    await user.save();
    res.send("user added sucessfully");
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
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await userModel.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
    });
    res.send(user);
    res;
  } catch (err) {
    res.status(400).send("not able to find the user");
  }
});
