const express = require("express");

const app = express();

app.get(
  "/user",
  (req, res, next) => {
    next();
    console.log("handling 1st route handler");
  },
  (req, res, next) => {
    next();
    console.log("handling 2nd route handler");
    res.send("Response 2");
  },
  (req, res, next) => {
    next();
    res.send("Response 3");
    console.log("handling 3rd route handler");
  },
  (req, res, next) => {
    console.log("handling 4th route handler");
  }
);

app.listen(3000, () => {
  console.log("App Listening");
});
