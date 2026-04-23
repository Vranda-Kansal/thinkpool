const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

userSchema.methods.getJwtToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.SECRET, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );
  return isPasswordValid;
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
