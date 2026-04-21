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
