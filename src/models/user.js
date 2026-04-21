const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: "String",
  },
  lastName: {
    type: "String",
  },
  emailId: {
    type: "String",
  },
  password: {
    type: "String",
  },
  age: {
    type: "Number",
    required: true,
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
