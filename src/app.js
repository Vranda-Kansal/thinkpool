const express = require("express");
const connectDB = require("./config/database.js");
const userModel = require("./models/user.js");

const app = express();

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
    const dummyUser = {
      firstName: "Radha",
      lastName: "kishori",
      emailId: "radha@123",
      password: "!235regd",
    };
    const user = new userModel(dummyUser);
    await user.save();
    res.send("user added sucessfully");
  } catch (err) {
    res.status(501).send(err.message);
  }
});
