const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();

// Signup API
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req); // Validation of data

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10); //Hasing The user provided Password

    // Creating an instance of a user
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();

    res.send("Successfully Saved User details");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Please enter a vaild Email"); // Email Validation
    }

    const user = await User.findOne({ email: email }); //Finding user in database
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password); // Comparing Password

    if (isPasswordValid) {
      const token = user.getJWT(); //Creating JWT token
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // Adding token in cookie and sending response back
      });
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;
