const express = require("express");
const { authUser } = require("../middlewares/auth");

const app = express();

// Checking the authorization of a user is present or not
app.use("/admin", authUser);

app.get("/admin/getAllData", (req, res) => {
  res.send("Getting All Data");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("User Deleted");
});

app.listen(3000, () => {
  console.log("App Listening");
});
