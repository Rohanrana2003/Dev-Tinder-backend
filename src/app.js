const express = require("express");
const dbConnect = require("./config/database");
const app = express();

const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("Successfully saved User Details");
  } catch (err) {
    res.status(400).send("Error in saving User Details");
  }
});

dbConnect()
  .then(() => {
    console.log("Database connected Successfully");
    app.listen(3000, () => {
      console.log("App Listening");
    });
  })
  .catch((err) => console.error("Can't able to connect to Database"));
