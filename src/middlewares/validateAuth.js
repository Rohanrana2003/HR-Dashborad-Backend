const validator = require("validator");
const User = require("../models/User");

const validateSignup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res
      .status(400)
      .json({ message: "Name must be at least 2 characters" });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!password || password.trim().length < 4) {
    return res
      .status(400)
      .json({ message: "Password must be at least 4 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Signup validation error", error: error });
  }
};

const validateLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!password || password.trim() === "") {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

module.exports = { validateSignup, validateLogin };
