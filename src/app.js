const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user.js");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server connected");
    });
  })
  .catch((err) => console.log(err));

//get all the users from db - get /feed

// app.get("/feed", async (req, res) => {
//   try {
//     const allUsers = await userModel.find({});
//     res.send(allUsers);
//   } catch (err) {
//     res.status(501).send("Failed to get all users");
//   }
// });

// //get user by emailId
// app.get("/user", async (req, res) => {
//   const userEmailId = req?.body?.emailId;
//   try {
//     const user = await userModel.findOne({ emailId: userEmailId });
//     if (!user) {
//       res.status(400).send("user not found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("not able to find the user");
//   }
// });

// //delete a user
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     await userModel.findByIdAndDelete(userId);
//     res.send("user has been delted successfully");
//   } catch (err) {
//     res.status(400).send("unable to delete a user");
//   }
// });

// //update a user
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;
//   try {
//     const ALLOWED_FIELDS = ["photoUrl", "about", "skills", "age", "gender"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_FIELDS.includes(k),
//     );

//     if (!isUpdateAllowed) {
//       throw new Error("update not allowed");
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("skills can't be more than 10");
//     }
//     const user = await userModel.findByIdAndUpdate(userId, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("update failed" + err.message);
//   }
// });
