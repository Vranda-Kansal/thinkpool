const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user.js");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket.js");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTED_URL, // specific origin do
    credentials: true, // ye bhi do
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(7777, () => {
      console.log("Server connected");
    });
  })
  .catch((err) => console.log(err));
