const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { authUser } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validation");
const profileRouter = express.Router();

// Get profile Data API
profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Update Profile Data API
profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Data can not be edited");
    }

    const user = req.user; // LoggedIn User
    const dataToBeUpdated = req.body;

    Object.keys(dataToBeUpdated).forEach(
      (field) => (user[field] = dataToBeUpdated[field]) //Assigning the updated value to existing user
    );

    await user.save(); // Saving the user in database

    res.json({
      message: user.firstName + " your profile get updated successfully!",
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Forgot password API
profileRouter.patch("/profile/changePassword", authUser, async (req, res) => {
  try {
    const user = req.user; // from authUser Middleware
    const { password } = req.body;
    if (!validator.isStrongPassword(password)) {
      throw new Error("Please enter a strong password");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;

    await user.save();

    res.json({ message: "Password Updated", data: user.password });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
