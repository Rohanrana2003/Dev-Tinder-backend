const express = require("express");
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
profileRouter.patch("/profile/edit", authUser, (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Data can not be edited");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
