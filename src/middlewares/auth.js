const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    const decodeMessage = await jwt.verify(token, process.env.SECRET);
    const { _id } = decodeMessage;
    const user = await userModel.findById(_id);
    if (!user) {
      throw new Error("User not found in DB");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send(err.message);
  }
};
module.exports = { userAuth };
