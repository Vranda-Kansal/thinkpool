const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const defaultPhotos = [
  "https://res.cloudinary.com/dvvf3hesg/image/upload/q_auto/f_auto/v1777354762/profile2_ih6ywd.jpg",
  "https://res.cloudinary.com/dvvf3hesg/image/upload/f_auto,q_auto/profile1_nezodp",
  "https://res.cloudinary.com/dvvf3hesg/image/upload/q_auto/f_auto/v1777354531/profile3_h46stw.jpg",
];

const userSchema = new Schema(
  {
    firstName: {
      type: "String",
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: "String",
      maxLength: 20,
      trim: true,
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
          throw new Error(`Password must be at least 8 characters.
Include uppercase, lowercase, number & special character.`);
        }
      },
    },
    role: {
      type: String,
      default: "Developer",
      trim: true,
      set(value) {
        if (value === undefined || value === null) return undefined; // not passed at all → default kicks in
        if (typeof value !== "string") {
          throw new Error("role must be a string");
        }
        return value; // empty string "" is valid → user cleared it
      },
    },
    linkedIn: {
      type: String,
      validate(value) {
        if (
          value &&
          (!validator.isURL(value) || !value.includes("linkedin.com"))
        ) {
          throw new Error("enter a valid linkedIn URL");
        }
      },
    },
    photoUrl: {
      type: String,
      default: () => {
        const pick =
          defaultPhotos[Math.floor(Math.random() * defaultPhotos.length)];
        return pick;
      },
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter a valid photo URL");
        }
      },
    },
    about: {
      type: "String",
      trim: true,
      default: "I am a Developer who can think, explore and grow",
      set(value) {
        if (value === undefined || value === null) return undefined; // not passed at all → default kicks in
        if (typeof value !== "string") {
          throw new Error("about must be a string");
        }
        return value; // empty string "" is valid → user cleared it
      },
    },
    skills: {
      type: [
        {
          id: { type: String, required: true, trim: true },
          name: { type: String, required: true, trim: true },
        },
      ],
      set(value) {
        if (!Array.isArray(value)) {
          throw new Error("skills must be an array");
        }
        if (
          !value.every((item) => {
            return typeof item?.name === "string";
          })
        ) {
          throw new Error("each skill must be a string");
        }
        return value;
      },
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
// add this before module.exports
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    const {
      _id,
      firstName,
      lastName,
      role,
      linkedIn,
      photoUrl,
      emailId,
      about,
      skills,
    } = ret;
    return {
      _id,
      firstName,
      lastName,
      role,
      linkedIn,
      photoUrl,
      emailId,
      about,
      skills,
    };
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
