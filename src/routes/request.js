const express = require("express");
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

// Sending Connection API
requestRouter.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      // Allowing only "ignored", "interested" as valid status type
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status type: " + status });
      }

      // Checking if the toUser is present in our database or not
      const validToUser = await User.findById(toUserId);
      if (!validToUser) {
        return res.status(400).json({ message: "User Not Found!" });
      }

      // Checking if already a request have been made by any user and present in our db
      const requestExists = await ConnectionRequest.findOne({
        $or: [
          { toUserId, fromUserId },
          { toUserId: fromUserId, fromUserId: toUserId },
        ],
      });

      if (requestExists) {
        return res.status(400).json({ message: "Request already Exists" });
      }

      // Creating instance of connectionRequest
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({ message: "Request Done", data: data });
    } catch (err) {
      res.status(400).send("Error in sending request: " + err.message);
    }
  }
);

// Accepting or Rejecting API
requestRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // Allowing only "accepted", "rejected" as valid status type
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status type!" });
      }

      // Finding request on the basis of different Fields
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      console.log("_id: ", requestId);
      console.log("toUserId: ", loggedInUser._id);
      console.log("status: ", status);

      if (!connectionRequest) {
        return res.status(400).json({ message: "Invalid Connection Request" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({ message: "Succesfully updated", data: data });
    } catch (err) {
      res.status(400).send("Error in reviewing request: " + err.message);
    }
  }
);

module.exports = requestRouter;
