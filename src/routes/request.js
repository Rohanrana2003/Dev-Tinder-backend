const express = require("express");
const { authUser } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendRequest", authUser, (req, res) => {
  try {
    const user = req.user;
    res.send("Request send by " + user.firstName);
  } catch (err) {
    res.status(400).send("Error in sending request: " + err.message);
  }
});

module.exports = requestRouter;
