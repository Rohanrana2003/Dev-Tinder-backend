const express = require("express");
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

// Get all the pending request
userRouter.get("/user/requests/received", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const toUserId = loggedInUser._id;

    const incomingRequests = await ConnectionRequest.find({
      toUserId,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName about skills photoUrl age gender"
    );

    if (incomingRequests.length === 0) {
      return res.status(400).json({ message: "No incoming requests" });
    }

    res.json({ message: "Requests Received", data: incomingRequests });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in fetching requests", error: err.message });
  }
});

module.exports = userRouter;
