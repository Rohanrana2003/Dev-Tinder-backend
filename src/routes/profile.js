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

    await user.save();
    res.json({
      message: user.firstName + " your profile get updated successfully!",
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
