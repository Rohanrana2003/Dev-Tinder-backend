const express = require("express");

const app = express();

app.get(
  "/user",
  (req, res, next) => {
    next();
  },
  (req, res, next) => {
    next();
  },
  (req, res, next) => {
    next();
  },
  (req, res, next) => {
    res.send("Response 2");
  }
);

app.listen(3000, () => {
  console.log("App Listening");
});
