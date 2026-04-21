require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@thinkpool.zidboro.mongodb.net/thinkpool`,
  );
};

module.exports = connectDB;
