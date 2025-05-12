const express = require("express");
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName about skills photoUrl age gender";

// Get all the pending request
userRouter.get("/user/requests/received", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const toUserId = loggedInUser._id;

    const incomingRequests = await ConnectionRequest.find({
      toUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

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

// Get all the connections API
userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("toUserId", USER_SAFE_DATA)
      .populate("fromUserId", USER_SAFE_DATA);

    if (connections.length === 0) {
      return res.status(400).json({ message: "No incoming requests" });
    }

    const data = connections.map((x) => {
      // Dont show the loggedIn user as connection itself
      if (x.toUserId._id.toString() === loggedInUser._id.toString()) {
        return x.fromUserId;
      }
      return x.toUserId;
    });

    res.json({
      message: "Fetched connections successfully",
      data: data,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in fetching Connections", error: err.message });
  }
});

// Get Feed API
userRouter.get("/feed", authUser, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsers = new Set();

    connections.forEach((user) => {
      hideUsers.add(user.fromUserId._id.toString());
      hideUsers.add(user.toUserId._id.toString());
    });

    const feedData = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ message: "Success", data: feedData });
  } catch (err) {
    res.status(400).json({ message: "Error", error: err.message });
  }
});

module.exports = userRouter;
