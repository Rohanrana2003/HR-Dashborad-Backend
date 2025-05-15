const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
      unique: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 6 characters"],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;

  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(userInputPassword, passwordHash);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
