const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new Schema(
  {
    firstName: {
      type: "String",
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: "String",
    },
    emailId: {
      type: "String",
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("enter a valid email");
        }
      },
    },
    password: {
      type: "String",
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("enter a strong password");
        }
      },
    },
    age: {
      type: "Number",
    },
    gender: {
      type: "String",
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("enter a valid gender");
        }
      },
    },
    photoUrl: {
      type: "String",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("enter a valid PHOTO", value);
        }
      },
    },
    about: {
      type: "String",
      default: "This is the default about section",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
