const express = require("express");
const bcrypt = require("bcrypt");
const {
  validateLogin,
  validateSignup,
} = require("../middlewares/validateAuth");
const User = require("../models/User");
const authRouter = express();

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
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password); // Comparing Password

    if (isPasswordValid) {
      const token = user.getJWT(); //Creating JWT token by userschema function
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // Adding token in cookie and sending response back
      });
      res.json({ message: "LoggedIn Successfully", data: user });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = authRouter;
