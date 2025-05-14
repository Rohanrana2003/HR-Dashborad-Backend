const express = require("express");
const bcrypt = require("bcrypt");
const {
  validateLogin,
  validateSignup,
} = require("../middlewares/validateAuth");
const User = require("../models/User");
const { userAuth } = require("../middlewares/userAuth");
const authRouter = express.Router();

// Signup API
authRouter.post("/signup", validateSignup, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); //Hasing The user provided Password

    // Creating an instance of a user
    const user = new User({
      name,
      email,
      password: passwordHash,
    });

    const newUser = await user.save();
    const token = newUser.getJWT(); //Creating JWT token by userschema function

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // Adding token in cookie and sending response back
    });

    res.json({ message: "Created user Successfully", data: newUser });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Login API
authRouter.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }); //Finding user in database
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.validatePassword(password); // Comparing Password

    if (isPasswordValid) {
      const token = user.getJWT(); //Creating JWT token by userschema function
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // Adding token in cookie and sending response back
      });
      res.json({ message: "LoggedIn Successfully", data: user });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// checking Auth API
authRouter.get("/check-auth", userAuth, async (req, res) => {
  try {
    res.json({ message: "User Authenticated", data: "good" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Logout API
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) }); // Clearing the cookies
  res.send("Logged Out Successfully");
});

module.exports = authRouter;
